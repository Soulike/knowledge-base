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
    assert.deepEqual(agent.permissions, {
      contents: "read",
      "copilot-requests": "write",
      issues: "read",
    });
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
    assert.match(
      String(stepByName(agentSteps, "Execute GitHub Copilot CLI").run),
      /\$\{RUNNER_TEMP\}\/gh-aw:\$\{RUNNER_TEMP\}\/gh-aw:ro/u,
    );
    assert.ok(
      names.indexOf("Upload trusted target manifest") > inference,
      "The trusted manifest artifact must be uploaded after inference.",
    );
  });

  it("restricts research and applies fail-closed staged issue outputs", () => {
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

    assert.equal(
      object(safeOutputs.env, "safe outputs environment")
        .GH_AW_SAFE_OUTPUTS_STAGED,
      "${{ vars.CONTENT_VERIFICATION_ISSUE_PUBLICATION_ENABLED != 'true' }}",
    );
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
    assert.match(
      String(stepByName(gateSteps, "Enforce content verification result").run),
      /agentic-gate-cli\.ts/u,
    );

    assert.match(
      String(conclusion.if),
      /vars\.CONTENT_VERIFICATION_ISSUE_PUBLICATION_ENABLED == 'true'/u,
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
      const generated = object(
        parse(readFileSync(path, "utf8")),
        candidate.file,
      );
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
      const generatedAgent = object(generatedJobs.agent, "agent job");
      const manifestStep = stepByName(
        array(generatedAgent.steps, "agent steps"),
        "Generate content verification target manifest",
      );
      assert.equal(
        object(manifestStep.env, "manifest environment")
          .CONTENT_VERIFICATION_SCOPE,
        candidate.scope,
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
    const generated = object(
      parse(readFileSync(lockPath, "utf8")),
      "AI review",
    );
    const generatedJobs = object(generated.jobs, "jobs");
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
    assert.deepEqual(agentJob.permissions, {
      contents: "read",
      "copilot-requests": "write",
      issues: "read",
      "pull-requests": "read",
    });
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
    assert.match(
      String(
        stepByName(
          agentSteps,
          "Install the trusted checked-out knowledge-base plugin",
        ).run,
      ),
      /plugin install knowledge-base@knowledge-base/u,
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
  });
});
