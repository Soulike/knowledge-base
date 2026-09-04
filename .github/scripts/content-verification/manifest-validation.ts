import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";
import type { VerificationTarget } from "./targets.ts";

type JsonObject = Record<string, unknown>;

function fail(message: string): never {
  throw new Error(`Content verification manifest: ${message}`);
}

function object(value: unknown, description: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${description} must be an object.`);
  }
  return value as JsonObject;
}

function string(value: unknown, description: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
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

function parseTarget(
  value: unknown,
  targetIds: Set<string>,
  ownedFiles: Set<string>,
): VerificationTarget {
  const target = object(value, "manifest target");
  requireExactKeys(
    target,
    ["files", "id", "kind", "knowledgeType"],
    "manifest target",
  );
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
  if (target.kind === "knowledge") {
    if (
      files.length !== 1 ||
      files[0] !== id ||
      (target.knowledgeType !== "time-sensitive" &&
        target.knowledgeType !== "evergreen")
    ) {
      fail(`manifest target '${id}' must own exactly its Knowledge leaf.`);
    }
    parsed = {
      files: [id],
      id,
      kind: "knowledge",
      knowledgeType: target.knowledgeType,
    };
  } else if (target.knowledgeType !== undefined) {
    fail(`manifest target '${id}' has Knowledge Type without Knowledge kind.`);
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
}

export function parseVerificationManifest(
  value: unknown,
  expectedRevision: string,
  expectedScope: VerificationScope,
): VerificationManifest {
  const manifest = object(value, "target manifest");
  requireExactKeys(
    manifest,
    ["revision", "reviewTargetIds", "scope", "targetCatalog"],
    "target manifest",
  );
  const revision = string(manifest.revision, "manifest revision");
  if (revision !== expectedRevision) {
    fail("manifest revision does not match the workflow subject.");
  }
  if (manifest.scope !== expectedScope) {
    fail(`manifest scope must be ${expectedScope}.`);
  }
  if (
    !Array.isArray(manifest.targetCatalog) ||
    manifest.targetCatalog.length === 0
  ) {
    fail("manifest target catalog must be a non-empty array.");
  }

  const targetIds = new Set<string>();
  const ownedFiles = new Set<string>();
  const targetCatalog = manifest.targetCatalog.map((target) =>
    parseTarget(target, targetIds, ownedFiles),
  );

  if (
    !Array.isArray(manifest.reviewTargetIds) ||
    manifest.reviewTargetIds.length === 0
  ) {
    fail("manifest review target ids must be a non-empty array.");
  }
  const reviewTargetIds = manifest.reviewTargetIds.map((targetId) =>
    string(targetId, "manifest review target id"),
  );
  if (new Set(reviewTargetIds).size !== reviewTargetIds.length) {
    fail("manifest review target ids must not contain duplicates.");
  }
  const expectedReviewTargetIds = targetCatalog
    .filter((target) =>
      expectedScope === "maintained-agent-content"
        ? target.kind !== "knowledge"
        : target.kind === "knowledge" &&
          target.knowledgeType ===
            (expectedScope === "time-sensitive-knowledge"
              ? "time-sensitive"
              : "evergreen"),
    )
    .map((target) => target.id);
  if (
    reviewTargetIds.length !== expectedReviewTargetIds.length ||
    reviewTargetIds.some(
      (targetId, index) => targetId !== expectedReviewTargetIds[index],
    )
  ) {
    fail("manifest review target ids do not match the complete scope subset.");
  }

  return {
    revision,
    reviewTargetIds,
    scope: expectedScope,
    targetCatalog,
  };
}
