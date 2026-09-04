import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";
import type { VerificationTarget } from "./targets.ts";

const ISSUE_TITLE_PREFIXES = {
  "evergreen-knowledge": "[evergreen Knowledge] ",
  "maintained-agent-content": "[maintained Agent content] ",
  "time-sensitive-knowledge": "[time-sensitive Knowledge] ",
} as const satisfies Record<VerificationScope, string>;

type JsonObject = Record<string, unknown>;

export type InconclusiveDecisionReason =
  "matching_open_issue" | "trusted_collaborator_disposition";

type InconclusiveDecisionBase = {
  evidenceChecked: string;
  finding: string;
  summary: string;
  targetId: string;
  type: "resolve_verification_inconclusive";
};

export type VerificationInconclusiveDecision =
  | (InconclusiveDecisionBase & {
      action: "create_issue";
      relatedIssueNumbers: string[];
    })
  | (InconclusiveDecisionBase & {
      action: "do_not_create_issue";
      commentId?: string;
      issueNumber: string;
      reason: InconclusiveDecisionReason;
    });

export type AgenticVerificationOutput = {
  inconclusiveDecisions: VerificationInconclusiveDecision[];
  issueTargets: string[];
  noop: boolean;
};

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
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${description} must be a non-empty string.`);
  }
  return value;
}

function boundedString(
  value: unknown,
  description: string,
  maximumLength: number,
): string {
  const parsed = string(value, description);
  if (parsed.length > maximumLength) {
    fail(`${description} must not exceed ${String(maximumLength)} characters.`);
  }
  return parsed;
}

function optionalString(
  value: unknown,
  description: string,
  maximumLength: number,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return boundedString(value, description, maximumLength);
}

function positiveIntegerString(value: unknown, description: string): string {
  const parsed = boundedString(value, description, 20);
  if (!/^[1-9]\d*$/u.test(parsed)) {
    fail(`${description} must be a positive integer string.`);
  }
  return parsed;
}

function issueNumberList(value: unknown): string[] {
  if (value === undefined) {
    return [];
  }
  const parsed = boundedString(value, "related issue numbers", 1000)
    .split(",")
    .map((number) => number.trim());
  if (parsed.some((number) => !/^[1-9]\d*$/u.test(number))) {
    fail("related issue numbers must be comma-separated positive integers.");
  }
  if (new Set(parsed).size !== parsed.length) {
    fail("related issue numbers must not contain duplicates.");
  }
  return parsed;
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
  const targets = manifest.targetCatalog.map((targetValue) => {
    const target = object(targetValue, "manifest target");
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
      fail(
        `manifest target '${id}' has Knowledge Type without Knowledge kind.`,
      );
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
  const expectedReviewTargetIds = targets
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
    targetCatalog: targets,
  };
}

export function parseAgenticVerificationOutput(
  manifest: VerificationManifest,
  outputValue: unknown,
): AgenticVerificationOutput {
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

  const targetIds = new Set(manifest.reviewTargetIds);
  const issueTitlePrefix = ISSUE_TITLE_PREFIXES[manifest.scope];
  const requestedTargets = new Set<string>();
  const inconclusiveDecisionIdentities = new Set<string>();
  const inconclusiveDecisions: VerificationInconclusiveDecision[] = [];
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
    if (type === "resolve_verification_inconclusive") {
      requireExactKeys(
        item,
        [
          "type",
          "action",
          "target_id",
          "summary",
          "finding",
          "evidence_checked",
          "no_issue_reason",
          "issue_number",
          "comment_id",
          "related_issue_numbers",
        ],
        "resolve_verification_inconclusive",
      );
      const targetId = boundedString(
        item.target_id,
        "inconclusive target id",
        1000,
      );
      if (!targetIds.has(targetId)) {
        fail(`Inconclusive decision names unknown target '${targetId}'.`);
      }
      const summary = boundedString(
        item.summary,
        "inconclusive finding summary",
        200,
      );
      if (/\r|\n/u.test(summary)) {
        fail("inconclusive finding summary must be one line.");
      }
      const finding = boundedString(
        item.finding,
        "inconclusive finding",
        12000,
      );
      const evidenceChecked = boundedString(
        item.evidence_checked,
        "inconclusive evidence checked",
        12000,
      );
      const identity = JSON.stringify([
        targetId,
        summary,
        finding,
        evidenceChecked,
      ]);
      if (inconclusiveDecisionIdentities.has(identity)) {
        fail(
          "An inconclusive finding called its decision tool more than once.",
        );
      }
      inconclusiveDecisionIdentities.add(identity);

      if (item.action === "create_issue") {
        if (
          item.no_issue_reason !== undefined ||
          item.issue_number !== undefined ||
          item.comment_id !== undefined
        ) {
          fail("create_issue inconclusive decisions cannot claim suppression.");
        }
        inconclusiveDecisions.push({
          action: "create_issue",
          evidenceChecked,
          finding,
          relatedIssueNumbers: issueNumberList(item.related_issue_numbers),
          summary,
          targetId,
          type,
        });
        continue;
      }

      if (item.action !== "do_not_create_issue") {
        fail(
          "inconclusive action must be create_issue or do_not_create_issue.",
        );
      }
      if (item.related_issue_numbers !== undefined) {
        fail("do_not_create_issue cannot include related issue numbers.");
      }
      if (
        item.no_issue_reason !== "matching_open_issue" &&
        item.no_issue_reason !== "trusted_collaborator_disposition"
      ) {
        fail("do_not_create_issue requires an accepted no-issue reason.");
      }
      const issueNumber = positiveIntegerString(
        item.issue_number,
        "referenced issue number",
      );
      const commentId = optionalString(
        item.comment_id,
        "referenced comment id",
        30,
      );
      if (commentId !== undefined && !/^[1-9]\d*$/u.test(commentId)) {
        fail("referenced comment id must be a positive integer string.");
      }
      if (
        item.no_issue_reason === "matching_open_issue" &&
        commentId !== undefined
      ) {
        fail("matching_open_issue must not include a comment id.");
      }
      if (
        item.no_issue_reason === "trusted_collaborator_disposition" &&
        commentId === undefined
      ) {
        fail("trusted_collaborator_disposition requires a comment id.");
      }
      inconclusiveDecisions.push({
        action: "do_not_create_issue",
        ...(commentId === undefined ? {} : { commentId }),
        evidenceChecked,
        finding,
        issueNumber,
        reason: item.no_issue_reason,
        summary,
        targetId,
        type,
      });
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
  const effectCount = requestedTargets.size + inconclusiveDecisions.length;
  if (noopCount === 1 && effectCount > 0) {
    fail(
      "noop and verification effects are mutually exclusive terminal outcomes.",
    );
  }
  if (noopCount === 0 && effectCount === 0) {
    fail("Agent produced no accepted terminal safe output.");
  }
  return {
    inconclusiveDecisions,
    issueTargets: [...requestedTargets],
    noop: noopCount === 1,
  };
}

export function validateAgenticVerificationOutput(
  manifest: VerificationManifest,
  outputValue: unknown,
): void {
  parseAgenticVerificationOutput(manifest, outputValue);
}
