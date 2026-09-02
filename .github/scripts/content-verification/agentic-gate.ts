import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";
import type { VerificationTarget } from "./targets.ts";

const ISSUE_TITLE_PREFIXES = {
  "evergreen-knowledge": "[evergreen Knowledge] ",
  "maintained-agent-content": "[maintained Agent content] ",
  "time-sensitive-knowledge": "[time-sensitive Knowledge] ",
} as const satisfies Record<VerificationScope, string>;

type JsonObject = Record<string, unknown>;

function fail(message: string): never {
  throw new Error(`Content verification gate: ${message}`);
}

function object(value: unknown, description: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${description} must be an object.`);
  }
  return value as JsonObject;
}

function string(value: unknown, description: string): string {
  if (typeof value !== "string" || value.length === 0) {
    fail(`${description} must be a non-empty string.`);
  }
  return value;
}

function requireExactKeys(
  value: JsonObject,
  allowedKeys: readonly string[],
  description: string,
): void {
  const allowed = new Set(allowedKeys);
  const unexpected = Object.keys(value).filter((key) => !allowed.has(key));
  if (unexpected.length > 0) {
    fail(
      `${description} contains unsupported fields: ${unexpected.join(", ")}.`,
    );
  }
}

export function parseVerificationManifest(
  value: unknown,
  expectedRevision: string,
  expectedScope: VerificationScope,
): VerificationManifest {
  const manifest = object(value, "target manifest");
  requireExactKeys(
    manifest,
    ["revision", "scope", "targets"],
    "target manifest",
  );
  const revision = string(manifest.revision, "manifest revision");
  if (revision !== expectedRevision) {
    fail("manifest revision does not match the workflow subject.");
  }
  if (manifest.scope !== expectedScope) {
    fail(`manifest scope must be ${expectedScope}.`);
  }
  if (!Array.isArray(manifest.targets) || manifest.targets.length === 0) {
    fail("manifest targets must be a non-empty array.");
  }

  const targetIds = new Set<string>();
  const ownedFiles = new Set<string>();
  const targets = manifest.targets.map((targetValue) => {
    const target = object(targetValue, "manifest target");
    requireExactKeys(target, ["files", "id", "kind"], "manifest target");
    const id = string(target.id, "manifest target id");
    if (targetIds.has(id)) {
      fail(`manifest target '${id}' is duplicated.`);
    }
    if (!Array.isArray(target.files) || target.files.length === 0) {
      fail(`manifest target '${id}' must own at least one file.`);
    }
    const files = target.files.map((file) =>
      string(file, `manifest target '${id}' file`),
    );
    for (const file of files) {
      if (ownedFiles.has(file)) {
        fail(`manifest file '${file}' belongs to multiple targets.`);
      }
      ownedFiles.add(file);
    }

    let parsed: VerificationTarget;
    if (expectedScope !== "maintained-agent-content") {
      if (
        target.kind !== "knowledge" ||
        files.length !== 1 ||
        files[0] !== id
      ) {
        fail(`manifest target '${id}' must own exactly its Knowledge leaf.`);
      }
      parsed = { files: [id], id, kind: "knowledge" };
    } else if (target.kind === "skill") {
      if (!id.endsWith("/SKILL.md") || files[0] !== id) {
        fail(`Skill target '${id}' must begin with its SKILL.md entrypoint.`);
      }
      parsed = { files, id, kind: "skill" };
    } else if (target.kind === "shared-reference") {
      if (files.length !== 1 || files[0] !== id) {
        fail(`Shared-reference target '${id}' must own exactly its file.`);
      }
      parsed = { files: [id], id, kind: "shared-reference" };
    } else if (target.kind === "agent-content") {
      const ownsInstruction = files.length === 1 && files[0] === id;
      const ownsPromptBundle = files.every((file) => file.startsWith(`${id}/`));
      if (!ownsInstruction && !ownsPromptBundle) {
        fail(
          `Agent-content target '${id}' must own its instruction or prompt bundle.`,
        );
      }
      parsed = { files, id, kind: "agent-content" };
    } else {
      fail(`manifest target '${id}' has an unsupported kind.`);
    }
    targetIds.add(id);
    return parsed;
  });

  return { revision, scope: expectedScope, targets };
}

export function validateAgenticVerificationOutput(
  manifest: VerificationManifest,
  outputValue: unknown,
): void {
  const output = object(outputValue, "agent output");
  if (!Array.isArray(output.errors)) {
    fail("agent output errors must be an array.");
  }
  if (output.errors.length > 0) {
    fail("gh-aw reported invalid safe output items.");
  }
  if (!Array.isArray(output.items)) {
    fail("agent output items must be an array.");
  }

  const targetIds = new Set(manifest.targets.map((target) => target.id));
  const issueTitlePrefix = ISSUE_TITLE_PREFIXES[manifest.scope];
  const requestedTargets = new Set<string>();
  let noopCount = 0;
  for (const itemValue of output.items) {
    const item = object(itemValue, "safe output item");
    const type = string(item.type, "safe output type");
    if (
      type === "report_incomplete" ||
      type === "missing_tool" ||
      type === "missing_data"
    ) {
      fail(`Agent reported incomplete work through '${type}'.`);
    }
    if (type === "noop") {
      requireExactKeys(item, ["type", "message"], "noop");
      noopCount += 1;
      continue;
    }
    if (type !== "create_issue") {
      fail(`Unexpected safe output type '${type}'.`);
    }
    requireExactKeys(item, ["type", "title", "body"], "create_issue");

    const title = string(item.title, "issue title");
    if (!title.startsWith(issueTitlePrefix)) {
      fail(`Issue title must begin with '${issueTitlePrefix}'.`);
    }
    const targetId = title.slice(issueTitlePrefix.length);
    if (!targetIds.has(targetId)) {
      fail(`Issue title names unknown target '${targetId}'.`);
    }
    if (requestedTargets.has(targetId)) {
      fail(`More than one issue was requested for '${targetId}'.`);
    }

    const body = string(item.body, "issue body");
    if (!body.includes(targetId) || !body.includes(manifest.revision)) {
      fail(`Issue for '${targetId}' is not bound to its target and revision.`);
    }
    requestedTargets.add(targetId);
  }

  if (noopCount > 1) {
    fail("More than one noop was declared.");
  }
  if (noopCount === 1 && requestedTargets.size > 0) {
    fail("noop and create_issue are mutually exclusive terminal outcomes.");
  }
  if (noopCount === 0 && requestedTargets.size === 0) {
    fail("Agent produced no accepted terminal safe output.");
  }
}
