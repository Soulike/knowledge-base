import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { runInNewContext } from "node:vm";

import { fromMarkdown } from "mdast-util-from-markdown";
import { parse } from "yaml";

import type { Nodes } from "mdast";

type JsonObject = Record<string, unknown>;

type CompiledWorkflow = {
  activation: JsonObject;
  agent: JsonObject;
  agentSteps: unknown[];
  jobs: JsonObject;
  source: string;
};

function object(value: unknown, description: string): JsonObject {
  assert.ok(
    typeof value === "object" && value !== null && !Array.isArray(value),
    `${description} must be an object`,
  );
  return value as JsonObject;
}

function array(value: unknown, description: string): unknown[] {
  assert.ok(Array.isArray(value), `${description} must be an array`);
  return value;
}

function stepByName(steps: unknown[], name: string): JsonObject {
  const step = steps.find(
    (candidate) => object(candidate, "workflow step").name === name,
  );
  assert.ok(step, `Expected generated step '${name}'.`);
  return object(step, `workflow step '${name}'`);
}

function stepIndex(steps: unknown[], name: string): number {
  const index = steps.findIndex(
    (candidate) => object(candidate, "workflow step").name === name,
  );
  assert.notEqual(index, -1, `Expected generated step '${name}'.`);
  return index;
}

function metadata(source: string, key: string): JsonObject {
  const prefix = `# ${key}: `;
  const line = source
    .split("\n")
    .find((candidate) => candidate.startsWith(prefix));
  assert.ok(line, `Expected generated ${key} metadata.`);
  return object(JSON.parse(line.slice(prefix.length)), key);
}

function loadCompiledWorkflow(file: string): CompiledWorkflow {
  const source = readFileSync(
    new URL(`../../workflows/${file}.lock.yml`, import.meta.url),
    "utf8",
  );
  const workflow = object(parse(source), file);
  const jobs = object(workflow.jobs, `${file} jobs`);
  const activation = object(jobs.activation, `${file} activation job`);
  const agent = object(jobs.agent, `${file} agent job`);

  return {
    activation,
    agent,
    agentSteps: array(agent.steps, `${file} agent steps`),
    jobs,
    source,
  };
}

function loadWorkflowPrompt(file: string): string {
  return readFileSync(
    new URL(`../../workflows/${file}.md`, import.meta.url),
    "utf8",
  );
}

function inlineCodeValues(markdown: string): string[] {
  const values: string[] = [];

  function visit(node: Nodes): void {
    if (node.type === "inlineCode") {
      values.push(node.value);
    }
    if ("children" in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }

  visit(fromMarkdown(markdown));
  return values;
}

function assertAgentPermissionBoundary(agent: JsonObject): void {
  const permissions = object(agent.permissions, "agent permissions");
  assert.equal(permissions["copilot-requests"], "write");
  for (const [scope, access] of Object.entries(permissions)) {
    if (scope !== "copilot-requests") {
      assert.equal(access, "read", `Unexpected Agent access for ${scope}`);
    }
  }

  for (const requiredRead of [
    "actions",
    "checks",
    "contents",
    "issues",
    "pull-requests",
    "security-events",
    "vulnerability-alerts",
  ]) {
    assert.equal(permissions[requiredRead], "read");
  }
}

function assertPluginComesFromCheckout(agentSteps: unknown[]): void {
  const pluginSteps = agentSteps.filter(
    (step) =>
      object(step, "agent step").name ===
      "Install the trusted checked-out knowledge-base plugin",
  );
  assert.equal(pluginSteps.length, 1);

  const run = String(object(pluginSteps[0], "plugin step").run);
  const register = run.indexOf(
    'copilot plugin marketplace add "$GITHUB_WORKSPACE"',
  );
  const install = run.indexOf(
    "copilot plugin install knowledge-base@knowledge-base",
  );
  assert.ok(register >= 0 && register < install);
}

function assertCredentialsAreGoneBeforeInference(agentSteps: unknown[]): void {
  const configure = stepIndex(agentSteps, "Configure Git credentials");
  const verifiedCleanup = stepIndex(
    agentSteps,
    "Remove and verify Git credentials before Agent",
  );
  const frameworkCleanup = stepIndex(agentSteps, "Clean credentials");
  const execute = stepIndex(agentSteps, "Execute GitHub Copilot CLI");
  assert.ok(
    configure < verifiedCleanup &&
      verifiedCleanup < frameworkCleanup &&
      frameworkCleanup < execute,
  );

  const cleanup = stepByName(
    agentSteps,
    "Remove and verify Git credentials before Agent",
  );
  assert.equal("continue-on-error" in cleanup, false);
  const cleanupCommand = String(cleanup.run);
  assert.match(cleanupCommand, /clean_git_credentials\.sh/u);
  assert.match(cleanupCommand, /verify-git-credentials-removed\.sh/u);

  const execution = stepByName(agentSteps, "Execute GitHub Copilot CLI");
  const environment = object(execution.env, "Agent execution environment");
  assert.equal("GH_TOKEN" in environment, false);
  assert.equal("GITHUB_TOKEN" in environment, false);

  const command = String(execution.run);
  for (const secret of [
    "COPILOT_GITHUB_TOKEN",
    "GITHUB_MCP_SERVER_TOKEN",
    "TAVILY_API_KEY",
  ]) {
    assert.match(command, new RegExp(`--exclude-env ${secret}`, "u"));
  }
}

function assertDependenciesPrecedeInference(
  agentSteps: unknown[],
  installStepName: string,
): void {
  const setup = stepIndex(agentSteps, "Set up pnpm");
  const install = stepIndex(agentSteps, installStepName);
  const execute = stepIndex(agentSteps, "Execute GitHub Copilot CLI");
  assert.ok(setup < install && install < execute);
}

function assertReadOnlyGitHubMcp(source: string, agentSteps: unknown[]): void {
  const githubServer = array(
    metadata(source, "gh-aw-manifest").mcp_servers,
    "MCP servers",
  ).find((server) => object(server, "MCP server").name === "github");
  assert.ok(githubServer, "Expected the local GitHub MCP server.");

  const tools = array(
    object(githubServer, "GitHub MCP server").tools,
    "GitHub MCP tools",
  );
  for (const requiredTool of [
    "pull_request_read",
    "get_job_logs",
    "list_dependabot_alerts",
  ]) {
    assert.ok(tools.includes(requiredTool));
  }

  const gateway = String(stepByName(agentSteps, "Start MCP Gateway").run);
  assert.match(gateway, /github-mcp-server:/u);
  assert.match(gateway, /"GITHUB_READ_ONLY": "1"/u);
}

function assertCreditsGuardrailsAreOmitted(
  source: string,
  activation: JsonObject,
): void {
  assert.doesNotMatch(source, /"maxAiCredits"|enableTokenSteering/u);
  assert.equal(
    "GH_AW_MAX_DAILY_AI_CREDITS" in
      object(activation.env, "activation environment"),
    false,
  );
}

function assertCommonAgentRuntime(
  workflow: CompiledWorkflow,
  installStepName: string,
): void {
  assertAgentPermissionBoundary(workflow.agent);
  assertPluginComesFromCheckout(workflow.agentSteps);
  assertCredentialsAreGoneBeforeInference(workflow.agentSteps);
  assertDependenciesPrecedeInference(workflow.agentSteps, installStepName);
  assertReadOnlyGitHubMcp(workflow.source, workflow.agentSteps);
  assertCreditsGuardrailsAreOmitted(workflow.source, workflow.activation);
}

const contentVerificationFiles = [
  "verify-time-sensitive-knowledge",
  "verify-evergreen-knowledge",
  "verify-maintained-agent-content",
] as const;
const targetManifestSandboxPath = "/content-verification-targets.json";

describe("Copilot release selection", () => {
  const versionExpression =
    "${{ needs.resolve_copilot_version.outputs.version }}";

  it("binds both installers to the resolved release and checks the Agent before inference", () => {
    for (const file of [...contentVerificationFiles, "ai-review"]) {
      const { jobs, agentSteps } = loadCompiledWorkflow(file);
      const resolver = object(jobs.resolve_copilot_version, "release resolver");
      assert.deepEqual(resolver.permissions, { contents: "read" });
      assert.equal(
        object(resolver.outputs, "release outputs").version,
        "${{ steps.release.outputs.version }}",
      );

      assert.equal("needs" in resolver, false);
      assert.equal("pre_activation" in jobs, file === "ai-review");
      for (const [name, value] of Object.entries(jobs)) {
        const job = object(value, name);
        if (JSON.stringify(job).includes(versionExpression)) {
          const dependencies = Array.isArray(job.needs)
            ? job.needs
            : [job.needs];
          assert.ok(
            dependencies.includes("resolve_copilot_version"),
            `${file}: ${name} must receive the version output it consumes`,
          );
        }
      }

      for (const jobName of ["agent", "detection"]) {
        const job = object(jobs[jobName], jobName);
        assert.ok(
          array(job.needs, "installer dependencies").includes(
            "resolve_copilot_version",
          ),
        );
        const install = stepByName(
          array(job.steps, "job steps"),
          "Install GitHub Copilot CLI",
        );
        assert.equal(
          object(install.env, "installer environment").ENGINE_VERSION,
          versionExpression,
        );
        assert.match(
          String(install.run),
          /install_copilot_cli\.sh" "\$\{ENGINE_VERSION\}"/u,
        );
      }

      const verify = stepByName(
        agentSteps,
        "Verify selected Copilot CLI version",
      );
      assert.equal(
        object(verify.env, "verification environment").EXPECTED_COPILOT_VERSION,
        versionExpression,
      );
      assert.equal("continue-on-error" in verify, false);
      assert.ok(
        stepIndex(agentSteps, "Install GitHub Copilot CLI") <
          stepIndex(agentSteps, "Verify selected Copilot CLI version"),
      );
      assert.ok(
        stepIndex(agentSteps, "Verify selected Copilot CLI version") <
          stepIndex(agentSteps, "Execute GitHub Copilot CLI"),
      );
    }
  });

  async function resolveRelease(
    release: unknown,
  ): Promise<Map<string, string>> {
    const { jobs } = loadCompiledWorkflow("ai-review");
    const resolver = object(jobs.resolve_copilot_version, "release resolver");
    const step = stepByName(
      array(resolver.steps, "resolver steps"),
      "Resolve latest stable Copilot CLI",
    );
    const script = String(object(step.with, "resolver inputs").script);
    const outputs = new Map<string, string>();
    await new Promise<void>((resolve, reject) => {
      runInNewContext(
        `(async () => {\n${script}\n})().then(onSuccess, onFailure)`,
        {
          github: {
            rest: {
              repos: {
                getLatestRelease: async (request: {
                  owner: string;
                  repo: string;
                }) => {
                  assert.equal(request.owner, "github");
                  assert.equal(request.repo, "copilot-cli");
                  if (release instanceof Error) throw release;
                  return { data: release };
                },
              },
            },
          },
          core: {
            setOutput: (key: string, value: string) => outputs.set(key, value),
            info: () => {},
          },
          onSuccess: resolve,
          onFailure: reject,
        },
      );
    });
    return outputs;
  }

  it("resolves the publisher's stable release to one explicit installer version", async () => {
    assert.deepEqual(
      await resolveRelease({
        tag_name: "v1.2.3",
        draft: false,
        prerelease: false,
      }),
      new Map([["version", "1.2.3"]]),
    );
  });

  it("fails closed when the publisher query fails or cannot identify a stable release", async () => {
    await assert.rejects(
      resolveRelease(new Error("release query failed")),
      /release query failed/u,
    );
    for (const release of [
      { tag_name: "v1.2.3", draft: true, prerelease: false },
      { tag_name: "v1.2.3", draft: false, prerelease: true },
      ...[
        "",
        "latest",
        "v1.2.3-1",
        "v01.2.3",
        "v1.2.3\n",
        "v1.2.3\nversion=1.0.0",
        null,
      ].map((tag_name) => ({ tag_name, draft: false, prerelease: false })),
    ]) {
      await assert.rejects(
        resolveRelease(release),
        /Cannot resolve a concrete stable/u,
      );
    }
  });

  function verifyInstalled(expected: string, reported: string, exitCode = 0) {
    const root = mkdtempSync(join(tmpdir(), "copilot-version-test-"));
    try {
      const executable = join(root, "copilot");
      const argumentsFile = join(root, "arguments");
      writeFileSync(
        executable,
        '#!/bin/sh\nprintf "%s" "$*" > "$PROBE_ARGUMENTS"\nprintf "%s" "$PROBE_REPORTED"\nexit "$PROBE_EXIT"\n',
        { mode: 0o755 },
      );
      const { agentSteps } = loadCompiledWorkflow("ai-review");
      const script = String(
        stepByName(agentSteps, "Verify selected Copilot CLI version").run,
      );
      const result = spawnSync("bash", ["-c", script], {
        encoding: "utf8",
        env: {
          PATH: `${root}:${process.env.PATH}`,
          EXPECTED_COPILOT_VERSION: expected,
          PROBE_ARGUMENTS: argumentsFile,
          PROBE_REPORTED: reported,
          PROBE_EXIT: String(exitCode),
        },
      });
      return {
        ...result,
        arguments: existsSync(argumentsFile)
          ? readFileSync(argumentsFile, "utf8")
          : undefined,
      };
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  it("accepts the selected executable version without permitting an auto-update", () => {
    const result = verifyInstalled(
      "1.2.3",
      "GitHub Copilot CLI 1.2.3.\nRun 'copilot update' to check for updates.\n",
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.arguments, "--no-auto-update --version");
  });

  it("rejects stale or unreadable installed versions", () => {
    for (const result of [
      verifyInstalled("1.2.3", "GitHub Copilot CLI 1.2.2.\n"),
      verifyInstalled("1.2.3", "GitHub Copilot CLI 1.2.3-1.\n"),
      verifyInstalled("1.2.3", ""),
      verifyInstalled("1.2.3", "GitHub Copilot CLI 1.2.3.\n", 17),
    ])
      assert.notEqual(result.status, 0);
  });

  it("never invokes a CLI when release resolution is missing or invalid", () => {
    for (const expected of ["", "latest", "1.2.3\n"]) {
      const result = verifyInstalled(expected, "GitHub Copilot CLI 1.2.3.\n");
      assert.notEqual(result.status, 0);
      assert.equal(result.arguments, undefined);
    }
  });
});

describe("compiled Agent runtime boundaries", () => {
  it("preserves the shared runtime contract in every Agent workflow", () => {
    for (const file of contentVerificationFiles) {
      assertCommonAgentRuntime(
        loadCompiledWorkflow(file),
        "Install repository dependencies",
      );
    }
    assertCommonAgentRuntime(
      loadCompiledWorkflow("ai-review"),
      "Install trusted base dependencies",
    );
  });
});

describe("compiled content-verification publication boundary", () => {
  it("mounts the trusted manifest at the fixed path named in every prompt", () => {
    for (const file of contentVerificationFiles) {
      const { agentSteps } = loadCompiledWorkflow(file);
      const promptPaths = inlineCodeValues(loadWorkflowPrompt(file));
      const manifestStep = stepByName(
        agentSteps,
        "Generate content verification target manifest",
      );
      const manifestPath = String(
        object(manifestStep.env, `${file} manifest environment`)
          .CONTENT_VERIFICATION_TARGET_MANIFEST,
      );
      const execution = stepByName(agentSteps, "Execute GitHub Copilot CLI");

      assert.equal(
        promptPaths.filter((path) => path === targetManifestSandboxPath).length,
        1,
      );
      assert.ok(
        String(execution.run).includes(
          `${manifestPath}:${targetManifestSandboxPath}:ro`,
        ),
      );
      assert.ok(
        !promptPaths.includes(
          "$RUNNER_TEMP/gh-aw/content-verification-targets.json",
        ),
      );
    }
  });

  it("publishes findings only after canonical validation and threat detection", () => {
    for (const file of contentVerificationFiles) {
      const { agentSteps, jobs, source } = loadCompiledWorkflow(file);
      const gate = object(
        jobs.content_verification_gate,
        `${file} findings gate`,
      );
      const gateSteps = array(gate.steps, `${file} findings gate steps`);
      const publisher = object(
        jobs.content_verification_publish,
        `${file} findings publisher`,
      );
      const publisherSteps = array(
        publisher.steps,
        `${file} findings publisher steps`,
      );

      const manifestStep = stepByName(
        agentSteps,
        "Generate content verification target manifest",
      );
      const manifestPath = String(
        object(manifestStep.env, `${file} manifest environment`)
          .CONTENT_VERIFICATION_TARGET_MANIFEST,
      );
      const uploadStep = stepByName(
        agentSteps,
        "Upload trusted target manifest",
      );
      const uploadInputs = object(uploadStep.with, `${file} upload inputs`);
      assert.equal(uploadInputs.path, manifestPath);
      assert.ok(
        stepIndex(agentSteps, "Generate content verification target manifest") <
          stepIndex(agentSteps, "Execute GitHub Copilot CLI"),
      );
      assert.ok(
        stepIndex(agentSteps, "Execute GitHub Copilot CLI") <
          stepIndex(agentSteps, "Upload trusted target manifest"),
      );

      assert.equal(gate.if, "always()");
      assert.equal(gate.needs, "agent");
      assert.deepEqual(gate.permissions, { contents: "read" });
      const downloadInputs = object(
        stepByName(gateSteps, "Download Agent output and target manifest").with,
        `${file} download inputs`,
      );
      assert.equal("merge-multiple" in downloadInputs, false);
      assert.ok(
        String(downloadInputs.pattern).includes(String(uploadInputs.name)),
      );
      assert.equal(
        object(
          stepByName(gateSteps, "Enforce content verification findings").env,
          `${file} gate environment`,
        ).CONTENT_VERIFICATION_ARTIFACT_DIRECTORY,
        downloadInputs.path,
      );
      assert.match(
        String(
          stepByName(gateSteps, "Enforce content verification findings").run,
        ),
        /findings-gate-cli\.ts/u,
      );

      assert.deepEqual(publisher.permissions, {
        contents: "read",
        issues: "write",
      });
      for (const dependency of [
        "agent",
        "content_verification_gate",
        "detection",
      ]) {
        assert.ok(
          array(
            publisher.needs,
            `${file} findings publisher dependencies`,
          ).includes(dependency),
        );
      }
      assert.match(String(publisher.if), /needs\.agent\.result == 'success'/u);
      assert.match(
        String(publisher.if),
        /needs\.content_verification_gate\.result == 'success'/u,
      );
      assert.match(
        String(publisher.if),
        /needs\.detection\.result == 'success'/u,
      );
      assert.match(
        String(
          stepByName(publisherSteps, "Publish content verification findings")
            .run,
        ),
        /findings-publication-cli\.ts/u,
      );
      const publisherDownloadInputs = object(
        stepByName(publisherSteps, "Download Agent output and target manifest")
          .with,
        `${file} publisher download inputs`,
      );
      assert.equal("merge-multiple" in publisherDownloadInputs, false);

      const safeConfig = object(
        JSON.parse(
          String(
            object(
              stepByName(agentSteps, "Generate Safe Outputs Config").env,
              `${file} safe-output environment`,
            ).GH_AW_SAFE_OUTPUTS_CONFIG,
          ),
        ),
        `${file} safe-output config`,
      );
      assert.equal("create_issue" in safeConfig, false);
      assert.equal("resolve-verification-inconclusive" in safeConfig, false);
      const addFinding = object(
        safeConfig["add-finding"],
        `${file} add-finding tool`,
      );
      const updateFinding = object(
        safeConfig["update-finding"],
        `${file} update-finding tool`,
      );
      const deleteFinding = object(
        safeConfig.delete_finding,
        `${file} delete-finding tool`,
      );
      const addInputs = object(addFinding.inputs, `${file} add-finding inputs`);
      assert.match(
        String(object(addInputs.finding_id, `${file} finding id`).description),
        /Reuse exactly this ID/u,
      );
      assert.deepEqual(
        object(addInputs.classification, `${file} finding classification`)
          .options,
        ["modification-required", "verification-inconclusive"],
      );
      assert.ok(object(addInputs.finding, `${file} finding prose`).required);
      assert.deepEqual(
        Object.keys(
          object(updateFinding.inputs, `${file} update-finding inputs`),
        ).sort(),
        Object.keys(addInputs).sort(),
      );
      assert.deepEqual(
        Object.keys(
          object(deleteFinding.inputs, `${file} delete-finding inputs`),
        ),
        ["finding_id"],
      );
      assert.match(source, /Review phase/u);
      assert.match(source, /History phase/u);
      assert.match(source, /empty event stream/u);
      assert.match(source, /finish without[\s\S]+`noop`/u);
      const validationConfig = object(
        JSON.parse(
          String(
            object(
              stepByName(agentSteps, "Generate Safe Outputs Tools").env,
              `${file} safe-output tools environment`,
            ).GH_AW_VALIDATION_JSON,
          ),
        ),
        `${file} safe-output validation config`,
      );
      const reportIncomplete = object(
        validationConfig.report_incomplete,
        `${file} report-incomplete validation`,
      );
      assert.equal(reportIncomplete.defaultMax, 5);
      assert.equal(
        object(
          object(reportIncomplete.fields, `${file} report-incomplete fields`)
            .reason,
          `${file} report-incomplete reason`,
        ).required,
        true,
      );
    }
  });

  it("reports incomplete execution and failed repository jobs as workflow failures", () => {
    for (const file of contentVerificationFiles) {
      const { jobs } = loadCompiledWorkflow(file);
      const conclusion = object(jobs.conclusion, `${file} conclusion`);
      const steps = array(conclusion.steps, `${file} conclusion steps`);
      const permissions = object(
        conclusion.permissions,
        `${file} conclusion permissions`,
      );
      const dependencies = array(
        conclusion.needs,
        `${file} conclusion dependencies`,
      );

      assert.deepEqual(permissions, { actions: "write", issues: "write" });
      for (const dependency of [
        "content_verification_gate",
        "content_verification_publish",
        "safe_outputs",
      ]) {
        assert.ok(dependencies.includes(dependency));
      }
      assert.match(String(conclusion.if), /^always\(\)/u);

      assert.equal(
        object(
          stepByName(steps, "Handle agent failure").env,
          `${file} agent-failure environment`,
        ).GH_AW_FAILURE_REPORT_AS_ISSUE,
        "true",
      );
      assert.equal(
        object(
          stepByName(steps, "Report failed jobs").env,
          `${file} failed-jobs environment`,
        ).GH_AW_REPORT_FAILED_JOBS,
        "true",
      );
      assert.equal(
        object(
          stepByName(steps, "Record incomplete").env,
          `${file} incomplete environment`,
        ).GH_AW_REPORT_INCOMPLETE_CREATE_ISSUE,
        "false",
      );
    }

    const aiReviewConclusion = object(
      loadCompiledWorkflow("ai-review").jobs.conclusion,
      "AI review conclusion",
    );
    const aiReviewSteps = array(
      aiReviewConclusion.steps,
      "AI review conclusion steps",
    );
    assert.equal(
      object(
        stepByName(aiReviewSteps, "Handle agent failure").env,
        "AI review failure environment",
      ).GH_AW_FAILURE_REPORT_AS_ISSUE,
      "false",
    );
    assert.equal(
      aiReviewSteps.some(
        (step) =>
          object(step, "AI review conclusion step").name ===
          "Report failed jobs",
      ),
      false,
    );
  });
});

describe("compiled pull-request review trust boundary", () => {
  it("keeps the base checkout separate and binds publication to the PR head", () => {
    const { agent, agentSteps, jobs } = loadCompiledWorkflow("ai-review");
    const safeOutputs = object(jobs.safe_outputs, "AI review safe outputs");
    const gate = object(jobs.ai_review_gate, "AI review gate");
    const gateSteps = array(gate.steps, "AI review gate steps");

    assert.match(String(agent.if), /\["OWNER","MEMBER","COLLABORATOR"\]/u);
    assert.match(String(agent.if), /!github\.event\.pull_request\.draft/u);
    assert.deepEqual(
      object(
        stepByName(agentSteps, "Checkout ${{ github.repository }}").with,
        "trusted base checkout",
      ),
      {
        "fetch-depth": 0,
        "persist-credentials": false,
        ref: "${{ github.event.pull_request.base.sha }}",
        repository: "${{ github.repository }}",
      },
    );

    const fetchHead = stepByName(
      agentSteps,
      "Fetch the expected head without checking it out",
    );
    assert.equal(
      object(fetchHead.env, "head-fetch environment").PR_HEAD_SHA,
      "${{ github.event.pull_request.head.sha }}",
    );
    const fetchCommand = String(fetchHead.run);
    assert.match(fetchCommand, /git -c "http\.extraheader=/u);
    assert.match(fetchCommand, /refs\/pull\/\$\{PR_NUMBER\}\/head/u);
    assert.match(
      fetchCommand,
      /test "\$\(git rev-parse FETCH_HEAD\)" = "\$PR_HEAD_SHA"/u,
    );
    assert.doesNotMatch(fetchCommand, /\bgit (checkout|merge|switch|reset)\b/u);
    assert.ok(
      stepIndex(agentSteps, "Fetch the expected head without checking it out") <
        stepIndex(agentSteps, "Install trusted base dependencies"),
    );

    assert.deepEqual(safeOutputs.permissions, { "pull-requests": "write" });
    const safeConfig = object(
      JSON.parse(
        String(
          object(
            stepByName(agentSteps, "Generate Safe Outputs Config").env,
            "safe-output config environment",
          ).GH_AW_SAFE_OUTPUTS_CONFIG,
        ),
      ),
      "safe-output config",
    );
    const reviewCommentOutput = object(
      safeConfig.create_pull_request_review_comment,
      "review comment output",
    );
    assert.equal(
      reviewCommentOutput.commit_id,
      "${{ github.event.pull_request.head.sha }}",
    );
    const reviewOutput = object(
      safeConfig.submit_pull_request_review,
      "review output",
    );
    assert.equal(
      reviewOutput.commit_id,
      "${{ github.event.pull_request.head.sha }}",
    );
    assert.deepEqual(reviewOutput.allowed_events, ["COMMENT"]);

    assert.equal(gate.if, "always()");
    assert.deepEqual(gate.needs, ["agent", "safe_outputs"]);
    assert.deepEqual(gate.permissions, {
      actions: "read",
      contents: "read",
      "pull-requests": "read",
    });
    const gateEnvironment = object(
      stepByName(gateSteps, "Verify review and enforce verdict").env,
      "gate environment",
    );
    assert.equal(
      gateEnvironment.AI_REVIEW_SAFE_OUTPUTS_RESULT,
      "${{ needs.safe_outputs.result }}",
    );
    assert.equal(gateEnvironment.AI_REVIEW_HEAD_SHA, reviewOutput.commit_id);
    assert.equal(reviewCommentOutput.commit_id, reviewOutput.commit_id);
  });
});
