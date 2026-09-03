import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { parse } from "yaml";

type JsonObject = Record<string, unknown>;

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

function assertTrustedPluginInstallation(step: JsonObject): void {
  const run = String(step.run);
  const addMarketplace = run.indexOf(
    'copilot plugin marketplace add "$GITHUB_WORKSPACE"',
  );
  const installPlugin = run.indexOf(
    "copilot plugin install knowledge-base@knowledge-base",
  );

  assert.ok(
    addMarketplace >= 0,
    "The checked-out repository must be registered as the plugin marketplace.",
  );
  assert.ok(
    installPlugin > addMarketplace,
    "The knowledge-base plugin must be installed from the registered checkout marketplace.",
  );
}

function assertReadOnlyAgentPermissions(value: unknown): void {
  assert.deepEqual(object(value, "agent permissions"), {
    actions: "read",
    attestations: "read",
    checks: "read",
    "code-quality": "read",
    contents: "read",
    "copilot-requests": "write",
    deployments: "read",
    discussions: "read",
    drives: "read",
    issues: "read",
    models: "read",
    packages: "read",
    pages: "read",
    "pull-requests": "read",
    "repository-projects": "read",
    "security-events": "read",
    statuses: "read",
    "vulnerability-alerts": "read",
  });
}

function assertLongContext(agentSteps: unknown[]): void {
  const run = String(stepByName(agentSteps, "Execute GitHub Copilot CLI").run);
  assert.match(run, /--context long_context/u);
  assert.match(run, /--allow-tool github|--allow-all-tools/u);
}

function assertUnrestrictedBash(agentSteps: unknown[]): void {
  const execution = stepByName(agentSteps, "Execute GitHub Copilot CLI");
  const run = String(execution.run);
  assert.match(run, /--allow-all-tools/u);
  assert.match(run, /--exclude-env COPILOT_GITHUB_TOKEN/u);
  assert.match(run, /--exclude-env GITHUB_MCP_SERVER_TOKEN/u);
  assert.match(run, /--exclude-env TAVILY_API_KEY/u);

  const environment = object(execution.env, "Agent execution environment");
  assert.equal("GH_TOKEN" in environment, false);
  assert.equal("GITHUB_TOKEN" in environment, false);
}

function assertGitCredentialsRemoved(agentSteps: unknown[]): void {
  const names = agentSteps.map((step) => object(step, "agent step").name);
  const configure = names.indexOf("Configure Git credentials");
  const failClosedCleanup = names.indexOf(
    "Remove and verify Git credentials before Agent",
  );
  const frameworkCleanup = names.indexOf("Clean credentials");
  const execution = names.indexOf("Execute GitHub Copilot CLI");
  assert.ok(
    configure >= 0 &&
      configure < failClosedCleanup &&
      failClosedCleanup < frameworkCleanup &&
      frameworkCleanup < execution,
  );

  const cleanup = stepByName(
    agentSteps,
    "Remove and verify Git credentials before Agent",
  );
  assert.equal("continue-on-error" in cleanup, false);
  const run = String(cleanup.run);
  assert.match(run, /clean_git_credentials\.sh/u);
  assert.match(run, /credential\\\./u);
  assert.match(run, /extraheader/u);
  assert.match(run, />\/dev\/null 2>&1/u);
  assert.match(run, /authenticated Git remote/u);
}

function assertDependenciesInstalled(
  agentSteps: unknown[],
  installStepName: string,
): void {
  const names = agentSteps.map((step) => object(step, "agent step").name);
  const setup = names.indexOf("Set up pnpm");
  const install = names.indexOf(installStepName);
  const execution = names.indexOf("Execute GitHub Copilot CLI");
  assert.ok(setup >= 0 && setup < install && install < execution);
  assert.equal(
    stepByName(agentSteps, installStepName).run,
    "pnpm install --frozen-lockfile --ignore-scripts",
  );
}

function assertLtsNode(
  steps: unknown[],
  stepName: string,
  runtime: boolean,
): void {
  assert.deepEqual(
    object(stepByName(steps, stepName).with, `${stepName} inputs`),
    runtime
      ? { "node-version": "lts/*", "package-manager-cache": false }
      : { "node-version": "lts/*" },
  );
}

function assertGitHubMcp(source: string, agentSteps: unknown[]): void {
  const githubServer = array(
    metadata(source, "gh-aw-manifest").mcp_servers,
    "MCP servers",
  ).find((server) => object(server, "MCP server").name === "github");
  assert.ok(githubServer, "Expected the local GitHub MCP server.");

  const tools = array(
    object(githubServer, "GitHub MCP server").tools,
    "GitHub MCP tools",
  );
  assert.ok(tools.includes("pull_request_read"));
  assert.ok(tools.includes("get_job_logs"));
  assert.ok(tools.includes("list_dependabot_alerts"));

  const gateway = String(stepByName(agentSteps, "Start MCP Gateway").run);
  assert.match(gateway, /github-mcp-server:v1\.11\.0/u);
  assert.match(gateway, /"GITHUB_READ_ONLY": "1"/u);
  assert.match(gateway, /"GITHUB_TOOLSETS": "all,dependabot"/u);

  const execution = String(
    stepByName(agentSteps, "Execute GitHub Copilot CLI").run,
  );
  assert.doesNotMatch(execution, /shell\(gh(?::\*)?\)|\bgh api\b/u);
}

function assertAICreditsDisabled(source: string, activation: JsonObject): void {
  assert.doesNotMatch(source, /"maxAiCredits"|enableTokenSteering/u);
  assert.equal(
    "GH_AW_MAX_DAILY_AI_CREDITS" in
      object(activation.env, "activation environment"),
    false,
  );
}

function metadata(source: string, key: string): JsonObject {
  const prefix = `# ${key}: `;
  const line = source
    .split("\n")
    .find((candidate) => candidate.startsWith(prefix));
  assert.ok(line, `Expected generated ${key} metadata.`);
  return object(JSON.parse(line.slice(prefix.length)), key);
}

describe("generated time-sensitive Knowledge workflow", () => {
  const source = readFileSync(
    new URL(
      "../../workflows/verify-time-sensitive-knowledge.lock.yml",
      import.meta.url,
    ),
    "utf8",
  );
  const workflow = object(parse(source), "workflow");
  const jobs = object(workflow.jobs, "jobs");
  const activation = object(jobs.activation, "activation job");
  const agent = object(jobs.agent, "agent job");
  const agentSteps = array(agent.steps, "agent steps");
  const conclusion = object(jobs.conclusion, "conclusion job");
  const conclusionSteps = array(conclusion.steps, "conclusion steps");
  const gate = object(
    jobs.content_verification_gate,
    "content verification gate job",
  );
  const gateSteps = array(gate.steps, "content verification gate steps");
  const safeOutputs = object(jobs.safe_outputs, "safe outputs job");

  it("pins the compiler, runtime actions, and generated action references", () => {
    const compiler = metadata(source, "gh-aw-metadata");
    assert.equal(compiler.compiler_version, "v0.87.10");
    assert.equal(compiler.strict, true);

    const manifest = metadata(source, "gh-aw-manifest");
    for (const action of array(manifest.actions, "manifest actions")) {
      assert.match(
        String(object(action, "manifest action").sha),
        /^[0-9a-f]{40}$/u,
      );
    }

    for (const job of Object.values(jobs)) {
      const steps = object(job, "job").steps;
      if (!Array.isArray(steps)) {
        continue;
      }
      for (const step of steps) {
        const uses = object(step, "job step").uses;
        if (typeof uses === "string" && !uses.startsWith("./")) {
          assert.match(uses, /@[0-9a-f]{40}$/u);
        }
      }
    }

    const actionLock = object(
      JSON.parse(
        readFileSync(
          new URL("../../aw/actions-lock.json", import.meta.url),
          "utf8",
        ),
      ),
      "action lock",
    );
    assert.deepEqual(
      Object.keys(object(actionLock.entries, "action lock entries")),
      [
        "github/gh-aw/actions/setup@ff62cdbec36230acbae869ddb28806e8eca01ea1",
        "pnpm/action-setup@v6",
      ],
    );
    assert.deepEqual(
      object(
        object(actionLock.entries, "action lock entries")[
          "pnpm/action-setup@v6"
        ],
        "pnpm action lock",
      ),
      {
        repo: "pnpm/action-setup",
        sha: "0977fd99725f1db4007ccb2928dbb4e90d06cc86",
        version: "v6",
      },
    );
  });

  it("keeps inference read-only and prepares the exact target manifest first", () => {
    assertReadOnlyAgentPermissions(agent.permissions);
    assertLtsNode(agentSteps, "Setup Node.js", true);
    assertUnrestrictedBash(agentSteps);
    assertGitCredentialsRemoved(agentSteps);
    assertDependenciesInstalled(agentSteps, "Install repository dependencies");
    assertGitHubMcp(source, agentSteps);
    assertAICreditsDisabled(source, activation);
    assert.deepEqual(safeOutputs.permissions, { issues: "write" });

    const names = agentSteps.map((step) => object(step, "agent step").name);
    const preflight = names.indexOf("Validate required reasoning effort");
    const manifest = names.indexOf(
      "Generate content verification target manifest",
    );
    const gateway = names.indexOf("Start MCP Gateway");
    const inference = names.indexOf("Execute GitHub Copilot CLI");
    assert.ok(preflight >= 0 && preflight < manifest);
    assert.ok(manifest < gateway && gateway < inference);

    assert.match(
      String(
        stepByName(agentSteps, "Generate content verification target manifest")
          .run,
      ),
      /prepare-agentic\.ts/u,
    );
    assert.equal(
      object(
        stepByName(agentSteps, "Generate content verification target manifest")
          .env,
        "target manifest environment",
      ).CONTENT_VERIFICATION_TARGET_MANIFEST,
      "${{ runner.temp }}/gh-aw/content-verification-targets.json",
    );
    assert.match(
      String(stepByName(agentSteps, "Execute GitHub Copilot CLI").run),
      /--reasoning-effort.*CONTENT_VERIFICATION_REASONING_EFFORT/su,
    );
    assertLongContext(agentSteps);
    assert.match(
      String(stepByName(agentSteps, "Execute GitHub Copilot CLI").run),
      /\$\{RUNNER_TEMP\}\/gh-aw:\$\{RUNNER_TEMP\}\/gh-aw:ro/u,
    );
    assert.ok(
      names.indexOf("Upload trusted target manifest") > inference,
      "The trusted manifest artifact must be uploaded after inference.",
    );
  });

  it("restricts research and applies gated issue outputs", () => {
    assert.doesNotMatch(
      source,
      /CONTENT_VERIFICATION_ISSUE_PUBLICATION_ENABLED/u,
    );

    const gateway = String(stepByName(agentSteps, "Start MCP Gateway").run);
    assert.match(gateway, /https:\/\/mcp\.tavily\.com\/mcp\//u);
    assert.match(gateway, /"tavily_search"/u);
    assert.match(gateway, /"tavily_extract"/u);

    const configStep = stepByName(agentSteps, "Generate Safe Outputs Config");
    const config = object(
      JSON.parse(
        String(
          object(configStep.env, "safe outputs config environment")
            .GH_AW_SAFE_OUTPUTS_CONFIG,
        ),
      ),
      "safe outputs config",
    );
    assert.deepEqual(config.create_issue, {
      assignees: ["Soulike"],
      labels: ["automated-verification", "modification-required"],
      max: 100,
    });
    assert.deepEqual(config.missing_data, {});
    assert.deepEqual(config.missing_tool, {});
    assert.deepEqual(config.noop, { max: 1, "report-as-issue": "false" });
    assert.deepEqual(config.report_incomplete, {});

    assert.deepEqual(safeOutputs.needs, [
      "activation",
      "agent",
      "content_verification_gate",
      "detection",
    ]);
    assert.match(
      String(safeOutputs.if),
      /needs\.content_verification_gate\.result == 'success'/u,
    );

    assert.equal(gate.if, "always()");
    assert.equal(gate.needs, "agent");
    assert.deepEqual(gate.permissions, { contents: "read" });
    assertLtsNode(gateSteps, "Set up Node.js", false);
    assert.match(
      String(stepByName(gateSteps, "Enforce content verification result").run),
      /agentic-gate-cli\.ts/u,
    );

    assert.equal(
      object(
        stepByName(conclusionSteps, "Record missing tool").env,
        "missing-tool environment",
      ).GH_AW_MISSING_TOOL_CREATE_ISSUE,
      "false",
    );
    assert.equal(
      object(
        stepByName(conclusionSteps, "Handle agent failure").env,
        "agent-failure environment",
      ).GH_AW_FAILURE_REPORT_AS_ISSUE,
      "false",
    );
    assert.equal(
      conclusionSteps.some(
        (step) => object(step, "conclusion step").name === "Report failed jobs",
      ),
      false,
    );
    assert.ok("detection" in jobs);
    assert.ok("conclusion" in jobs);
  });
});

describe("generated scheduled verification workflows", () => {
  const cases = [
    {
      concurrency: "content-verification-time-sensitive-knowledge",
      cron: "17 3 1 * *",
      file: "verify-time-sensitive-knowledge",
      name: "Verify time-sensitive Knowledge",
      scope: "time-sensitive-knowledge",
    },
    {
      concurrency: "content-verification-evergreen-knowledge",
      cron: "43 3 8 1,4,7,10 *",
      file: "verify-evergreen-knowledge",
      name: "Verify evergreen Knowledge",
      scope: "evergreen-knowledge",
    },
    {
      concurrency: "content-verification-maintained-agent-content",
      cron: "11 4 15 1,4,7,10 *",
      file: "verify-maintained-agent-content",
      name: "Verify maintained Agent content",
      scope: "maintained-agent-content",
    },
  ] as const;

  it("retains distinct names, schedules, scopes, and concurrency identities", () => {
    for (const candidate of cases) {
      const path = new URL(
        `../../workflows/${candidate.file}.lock.yml`,
        import.meta.url,
      );
      const generatedSource = readFileSync(path, "utf8");
      const generated = object(parse(generatedSource), candidate.file);
      assert.equal(generated.name, candidate.name);
      assert.equal(
        object(generated.concurrency, "concurrency").group,
        candidate.concurrency,
      );
      assert.equal(
        object(
          array(
            object(generated.on, "workflow triggers").schedule,
            "schedule",
          )[0],
          "schedule entry",
        ).cron,
        candidate.cron,
      );

      const generatedJobs = object(generated.jobs, "jobs");
      const generatedActivation = object(
        generatedJobs.activation,
        "activation job",
      );
      const generatedAgent = object(generatedJobs.agent, "agent job");
      const agentSteps = array(generatedAgent.steps, "agent steps");
      const generatedGate = object(
        generatedJobs.content_verification_gate,
        "content verification gate job",
      );
      const gateSteps = array(
        generatedGate.steps,
        "content verification gate steps",
      );
      assertReadOnlyAgentPermissions(generatedAgent.permissions);
      assertLongContext(agentSteps);
      assertLtsNode(agentSteps, "Setup Node.js", true);
      assertLtsNode(gateSteps, "Set up Node.js", false);
      assertUnrestrictedBash(agentSteps);
      assertGitCredentialsRemoved(agentSteps);
      assertDependenciesInstalled(
        agentSteps,
        "Install repository dependencies",
      );
      assertGitHubMcp(generatedSource, agentSteps);
      assertAICreditsDisabled(generatedSource, generatedActivation);
      const manifestStep = stepByName(
        agentSteps,
        "Generate content verification target manifest",
      );
      assert.equal(
        object(manifestStep.env, "manifest environment")
          .CONTENT_VERIFICATION_SCOPE,
        candidate.scope,
      );
      const pluginSteps = agentSteps.filter(
        (step) =>
          object(step, "agent step").name ===
          "Install the trusted checked-out knowledge-base plugin",
      );
      assert.equal(pluginSteps.length, 1);
      assertTrustedPluginInstallation(
        object(pluginSteps[0], "plugin installation step"),
      );
      assert.ok("content_verification_gate" in generatedJobs);
      assert.ok("safe_outputs" in generatedJobs);
    }
  });
});

describe("generated pull-request AI review workflow", () => {
  const lockPath = new URL(
    "../../workflows/ai-review.lock.yml",
    import.meta.url,
  );

  it("keeps the trusted base, exact head, bounded COMMENT review, and required gate", () => {
    const source = readFileSync(lockPath, "utf8");
    const generated = object(parse(source), "AI review");
    const generatedJobs = object(generated.jobs, "jobs");
    const activationJob = object(generatedJobs.activation, "activation job");
    const agentJob = object(generatedJobs.agent, "agent job");
    const agentSteps = array(agentJob.steps, "agent steps");
    const safeOutputs = object(generatedJobs.safe_outputs, "safe outputs job");
    const gateJob = object(generatedJobs.ai_review_gate, "AI review gate");
    const gateSteps = array(gateJob.steps, "gate steps");

    assert.equal(generated.name, "AI review");
    assert.equal(
      object(generated.concurrency, "concurrency").group,
      "ai-review-${{ github.event.pull_request.number }}",
    );
    assertReadOnlyAgentPermissions(agentJob.permissions);
    assertLongContext(agentSteps);
    assertLtsNode(agentSteps, "Setup Node.js", true);
    assertUnrestrictedBash(agentSteps);
    assertGitCredentialsRemoved(agentSteps);
    assertDependenciesInstalled(
      agentSteps,
      "Install trusted base dependencies",
    );
    assertGitHubMcp(source, agentSteps);
    assertAICreditsDisabled(source, activationJob);
    assert.match(String(agentJob.if), /\["OWNER","MEMBER","COLLABORATOR"\]/u);
    assert.match(String(agentJob.if), /!github\.event\.pull_request\.draft/u);
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
    assert.deepEqual(safeOutputs.permissions, { "pull-requests": "write" });
    assert.match(
      String(
        stepByName(
          agentSteps,
          "Fetch the expected head without checking it out",
        ).run,
      ),
      /refs\/pull\/\$\{PR_NUMBER\}\/head/u,
    );
    assertTrustedPluginInstallation(
      stepByName(
        agentSteps,
        "Install the trusted checked-out knowledge-base plugin",
      ),
    );
    assert.equal(
      agentSteps.filter(
        (step) =>
          object(step, "agent step").name ===
          "Install the trusted checked-out knowledge-base plugin",
      ).length,
      1,
    );
    const safeConfig = object(
      JSON.parse(
        String(
          object(
            stepByName(agentSteps, "Generate Safe Outputs Config").env,
            "safe outputs config environment",
          ).GH_AW_SAFE_OUTPUTS_CONFIG,
        ),
      ),
      "safe outputs config",
    );
    assert.deepEqual(safeConfig.create_pull_request_review_comment, {
      commit_id: "${{ github.event.pull_request.head.sha }}",
      max: 100,
      side: "RIGHT",
    });
    assert.deepEqual(safeConfig.submit_pull_request_review, {
      allowed_events: ["COMMENT"],
      commit_id: "${{ github.event.pull_request.head.sha }}",
      footer: "always",
      max: 1,
    });
    const safeValidation = object(
      JSON.parse(
        String(
          object(
            stepByName(agentSteps, "Generate Safe Outputs Tools").env,
            "safe outputs tool environment",
          ).GH_AW_VALIDATION_JSON,
        ),
      ),
      "safe output validation",
    );
    assert.deepEqual(
      object(
        object(
          object(
            safeValidation.create_pull_request_review_comment,
            "review comment validation",
          ).fields,
          "review comment fields",
        ).side,
        "review comment side",
      ).enum,
      ["LEFT", "RIGHT"],
    );
    assert.equal(gateJob.name, "AI review gate");
    assert.equal(gateJob.if, "always()");
    assert.deepEqual(gateJob.needs, ["agent", "safe_outputs"]);
    assert.deepEqual(gateJob.permissions, {
      actions: "read",
      contents: "read",
      "pull-requests": "write",
    });
    assert.equal(
      object(
        stepByName(
          gateSteps,
          "Verify review, update verdict label, and enforce verdict",
        ).env,
        "gate environment",
      ).AI_REVIEW_SAFE_OUTPUTS_RESULT,
      "${{ needs.safe_outputs.result }}",
    );
    assertLtsNode(gateSteps, "Set up Node.js", false);
  });
});
