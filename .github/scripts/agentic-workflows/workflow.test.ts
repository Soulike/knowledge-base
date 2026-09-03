import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { parse } from "yaml";

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
  it("gates every issue-writing job on the authenticated Agent result", () => {
    for (const file of contentVerificationFiles) {
      const { agentSteps, jobs } = loadCompiledWorkflow(file);
      const gate = object(
        jobs.content_verification_gate,
        `${file} content verification gate`,
      );
      const gateSteps = array(gate.steps, `${file} gate steps`);
      const safeOutputs = object(jobs.safe_outputs, `${file} safe outputs`);

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
      assert.ok(
        String(downloadInputs.pattern).includes(String(uploadInputs.name)),
      );
      assert.equal(
        object(
          stepByName(gateSteps, "Enforce content verification result").env,
          `${file} gate environment`,
        ).CONTENT_VERIFICATION_ARTIFACT_DIRECTORY,
        downloadInputs.path,
      );
      assert.match(
        String(
          stepByName(gateSteps, "Enforce content verification result").run,
        ),
        /agentic-gate-cli\.ts/u,
      );

      assert.deepEqual(safeOutputs.permissions, { issues: "write" });
      assert.ok(
        array(safeOutputs.needs, `${file} safe-output dependencies`).includes(
          "content_verification_gate",
        ),
      );
      assert.match(
        String(safeOutputs.if),
        /needs\.content_verification_gate\.result == 'success'/u,
      );
    }
  });

  it("publishes inconclusive decisions through one authenticated custom job", () => {
    for (const file of contentVerificationFiles) {
      const { agentSteps, jobs, source } = loadCompiledWorkflow(file);
      const publisher = object(
        jobs.resolve_verification_inconclusive,
        `${file} inconclusive publisher`,
      );
      const steps = array(publisher.steps, `${file} inconclusive steps`);
      const permissions = object(
        publisher.permissions,
        `${file} inconclusive permissions`,
      );

      assert.deepEqual(permissions, { contents: "read", issues: "write" });
      assert.ok(
        array(publisher.needs, `${file} inconclusive dependencies`).includes(
          "agent",
        ),
      );
      assert.match(String(publisher.if), /resolve_verification_inconclusive/u);
      assert.match(
        String(publisher.if),
        /needs\.detection\.result == 'success'/u,
      );
      assert.match(
        String(
          stepByName(steps, "Apply inconclusive verification decisions").run,
        ),
        /inconclusive-resolution-cli\.ts/u,
      );
      const publisherEnvironment = object(
        stepByName(steps, "Apply inconclusive verification decisions").env,
        `${file} inconclusive environment`,
      );
      assert.equal(
        publisherEnvironment.CONTENT_VERIFICATION_AGENT_RESULT,
        "${{ needs.agent.result }}",
      );
      assert.equal(
        publisherEnvironment.CONTENT_VERIFICATION_EXPECTED_REVISION,
        "${{ github.sha }}",
      );
      assert.match(
        String(publisherEnvironment.CONTENT_VERIFICATION_TARGET_MANIFEST),
        /content-verification-targets\.json/u,
      );

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
      const tool = object(
        safeConfig["resolve-verification-inconclusive"],
        `${file} inconclusive tool`,
      );
      assert.equal(tool.max, 100);
      assert.match(String(tool.description), /exactly once/u);
      assert.match(source, /verification-inconclusive/u);
      assert.match(source, /matching_open_issue/u);
      assert.match(source, /trusted_collaborator_disposition/u);
      assert.match(source, /uncertain/u);
    }
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
