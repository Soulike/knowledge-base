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
    const manifest = names.indexOf("Generate time-sensitive target manifest");
    const gateway = names.indexOf("Start MCP Gateway");
    const inference = names.indexOf("Execute GitHub Copilot CLI");
    assert.ok(preflight >= 0 && preflight < manifest);
    assert.ok(manifest < gateway && gateway < inference);

    assert.match(
      String(
        stepByName(agentSteps, "Generate time-sensitive target manifest").run,
      ),
      /prepare-agentic\.ts/u,
    );
    assert.equal(
      object(
        stepByName(agentSteps, "Generate time-sensitive target manifest").env,
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
