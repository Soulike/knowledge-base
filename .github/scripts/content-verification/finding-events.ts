import type { VerificationManifest } from "./manifest.ts";

type JsonObject = Record<string, unknown>;

export type FindingClassification =
  "modification-required" | "verification-inconclusive";

export type VerificationFinding = {
  classification: FindingClassification;
  finding: string;
  findingId: string;
  relatedTargetIds: string[];
  targetId: string;
};

function fail(message: string): never {
  throw new Error(`Content verification findings: ${message}`);
}

function object(value: unknown, description: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${description} must be an object.`);
  }
  return value as JsonObject;
}

function boundedString(
  value: unknown,
  description: string,
  maximumLength: number,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${description} must be a non-empty string.`);
  }
  if (value.length > maximumLength) {
    fail(`${description} must not exceed ${String(maximumLength)} characters.`);
  }
  return value;
}

function exactKeys(
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

function findingId(value: unknown): string {
  const parsed = boundedString(value, "finding id", 120);
  if (!/^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(parsed)) {
    fail(
      "finding id must begin with a letter or number and contain only letters, numbers, dots, underscores, or hyphens.",
    );
  }
  return parsed;
}

function classification(value: unknown): FindingClassification {
  if (
    value !== "modification-required" &&
    value !== "verification-inconclusive"
  ) {
    fail(
      "finding classification must be modification-required or verification-inconclusive.",
    );
  }
  return value;
}

function relatedTargetIds(
  value: unknown,
  targetId: string,
  catalogTargetIds: ReadonlySet<string>,
): string[] {
  if (value === undefined) {
    return [];
  }
  const parsed = boundedString(value, "related target ids", 12000)
    .split(",")
    .map((id) => id.trim());
  if (parsed.some((id) => id.length === 0)) {
    fail("related target ids must be comma-separated non-empty target ids.");
  }
  if (new Set(parsed).size !== parsed.length) {
    fail("related target ids must not contain duplicates.");
  }
  for (const relatedTargetId of parsed) {
    if (relatedTargetId === targetId) {
      fail("a finding's primary target cannot also be a related target.");
    }
    if (!catalogTargetIds.has(relatedTargetId)) {
      fail(`finding names unknown related target '${relatedTargetId}'.`);
    }
  }
  return parsed;
}

function parseFinding(
  item: JsonObject,
  reviewTargetIds: ReadonlySet<string>,
  catalogTargetIds: ReadonlySet<string>,
): VerificationFinding {
  exactKeys(
    item,
    [
      "type",
      "finding_id",
      "target_id",
      "classification",
      "finding",
      "related_target_ids",
    ],
    String(item.type),
  );
  const targetId = boundedString(item.target_id, "finding target id", 1000);
  if (!reviewTargetIds.has(targetId)) {
    fail(`finding names target '${targetId}' outside the review subset.`);
  }
  return {
    classification: classification(item.classification),
    finding: boundedString(item.finding, "finding", 12000),
    findingId: findingId(item.finding_id),
    relatedTargetIds: relatedTargetIds(
      item.related_target_ids,
      targetId,
      catalogTargetIds,
    ),
    targetId,
  };
}

export function reduceFindingEvents(
  manifest: VerificationManifest,
  outputValue: unknown,
): VerificationFinding[] {
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

  const reviewTargetIds = new Set(manifest.reviewTargetIds);
  const catalogTargetIds = new Set(
    manifest.targetCatalog.map((target) => target.id),
  );
  const findings = new Map<string, VerificationFinding>();
  const addedFindingIds = new Set<string>();

  for (const itemValue of output.items) {
    const item = object(itemValue, "safe output item");
    const type = boundedString(item.type, "safe output type", 120);
    if (
      type === "report_incomplete" ||
      type === "missing_tool" ||
      type === "missing_data"
    ) {
      fail(`Agent reported incomplete work through '${type}'.`);
    }
    if (type === "delete_finding") {
      exactKeys(item, ["type", "finding_id"], "delete_finding");
      const id = findingId(item.finding_id);
      if (!findings.delete(id)) {
        fail(`delete_finding requires an earlier active add for '${id}'.`);
      }
      continue;
    }
    if (type !== "add_finding" && type !== "update_finding") {
      fail(`unexpected safe output type '${type}'.`);
    }

    const finding = parseFinding(item, reviewTargetIds, catalogTargetIds);
    if (type === "add_finding") {
      if (addedFindingIds.has(finding.findingId)) {
        fail(`finding '${finding.findingId}' was added more than once.`);
      }
      addedFindingIds.add(finding.findingId);
      findings.set(finding.findingId, finding);
      continue;
    }
    if (!findings.has(finding.findingId)) {
      fail(
        `update_finding requires an earlier active add for '${finding.findingId}'.`,
      );
    }
    findings.set(finding.findingId, finding);
  }

  return [...findings.values()];
}
