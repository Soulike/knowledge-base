import type { VerificationScope, VerificationTarget } from "./targets.ts";

export const verificationStatuses = [
  "current",
  "modification-required",
  "verification-failed",
] as const;

export type VerificationStatus = (typeof verificationStatuses)[number];

export type VerificationEvidence = {
  description: string;
  source: string;
};

export type VerificationUnitResult = {
  acceptanceCriteria: string[];
  evidence: VerificationEvidence[];
  failure: string | null;
  id: string;
  matchingIssueNumber: number | null;
  requiredChanges: string[];
  status: VerificationStatus;
  summary: string;
};

export type VerificationOutput = {
  revision: string;
  scope: VerificationScope;
  summary: string;
  units: VerificationUnitResult[];
};

function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function exactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  path: string,
): void {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  if (
    actual.length !== sortedExpected.length ||
    actual.some((key, index) => key !== sortedExpected[index])
  ) {
    throw new Error(`${path} must contain exactly: ${expected.join(", ")}.`);
  }
}

function text(value: unknown, path: string, maximumLength: number): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  if (value.length > maximumLength) {
    throw new Error(`${path} exceeds ${maximumLength} characters.`);
  }
  return value;
}

function textArray(
  value: unknown,
  path: string,
  maximumItems: number,
): string[] {
  if (!Array.isArray(value) || value.length > maximumItems) {
    throw new Error(
      `${path} must be an array with at most ${maximumItems} items.`,
    );
  }
  return value.map((item, index) => text(item, `${path}[${index}]`, 10_000));
}

function nullableText(value: unknown, path: string): string | null {
  return value === null ? null : text(value, path, 20_000);
}

function issueNumber(value: unknown, path: string): number | null {
  if (value === null) {
    return null;
  }
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    throw new Error(`${path} must be null or a positive integer.`);
  }
  return value as number;
}

function parseEvidence(value: unknown, path: string): VerificationEvidence[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
    throw new Error(`${path} must contain between 1 and 50 evidence items.`);
  }
  return value.map((entry, index) => {
    const entryPath = `${path}[${index}]`;
    const item = record(entry, entryPath);
    exactKeys(item, ["source", "description"], entryPath);
    return {
      description: text(item.description, `${entryPath}.description`, 10_000),
      source: text(item.source, `${entryPath}.source`, 4096),
    };
  });
}

function parseUnit(value: unknown, index: number): VerificationUnitResult {
  const path = `units[${index}]`;
  const item = record(value, path);
  exactKeys(
    item,
    [
      "acceptanceCriteria",
      "evidence",
      "failure",
      "id",
      "matchingIssueNumber",
      "requiredChanges",
      "status",
      "summary",
    ],
    path,
  );
  if (!verificationStatuses.includes(item.status as VerificationStatus)) {
    throw new Error(`${path}.status is invalid.`);
  }

  const status = item.status as VerificationStatus;
  const requiredChanges = textArray(
    item.requiredChanges,
    `${path}.requiredChanges`,
    50,
  );
  const acceptanceCriteria = textArray(
    item.acceptanceCriteria,
    `${path}.acceptanceCriteria`,
    50,
  );
  const failure = nullableText(item.failure, `${path}.failure`);
  const matchingIssueNumber = issueNumber(
    item.matchingIssueNumber,
    `${path}.matchingIssueNumber`,
  );

  if (status === "current") {
    if (
      requiredChanges.length > 0 ||
      acceptanceCriteria.length > 0 ||
      failure !== null ||
      matchingIssueNumber !== null
    ) {
      throw new Error(
        `${path} has fields that are incompatible with status current.`,
      );
    }
  } else if (status === "modification-required") {
    if (
      requiredChanges.length === 0 ||
      acceptanceCriteria.length === 0 ||
      failure !== null
    ) {
      throw new Error(
        `${path} must describe required changes and acceptance criteria without a failure.`,
      );
    }
  } else if (
    failure === null ||
    requiredChanges.length > 0 ||
    acceptanceCriteria.length > 0
  ) {
    throw new Error(
      `${path} must describe its verification failure without proposed changes.`,
    );
  }

  return {
    acceptanceCriteria,
    evidence: parseEvidence(item.evidence, `${path}.evidence`),
    failure,
    id: text(item.id, `${path}.id`, 4096),
    matchingIssueNumber,
    requiredChanges,
    status,
    summary: text(item.summary, `${path}.summary`, 20_000),
  };
}

export function parseVerificationOutput(
  source: string,
  expectedRevision: string,
  expectedScope: VerificationScope,
  targets: VerificationTarget[],
): VerificationOutput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    throw new Error(
      `Copilot output is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }

  const output = record(parsed, "verification output");
  exactKeys(
    output,
    ["revision", "scope", "summary", "units"],
    "verification output",
  );
  if (output.revision !== expectedRevision) {
    throw new Error("Copilot output does not identify the expected revision.");
  }
  if (output.scope !== expectedScope) {
    throw new Error("Copilot output does not identify the expected scope.");
  }
  if (!Array.isArray(output.units)) {
    throw new Error("units must be an array.");
  }

  const units = output.units.map(parseUnit);
  const expectedIds = targets.map((target) => target.id).sort();
  const actualIds = units.map((unit) => unit.id).sort();
  if (
    actualIds.length !== expectedIds.length ||
    actualIds.some((id, index) => id !== expectedIds[index])
  ) {
    throw new Error(
      "Copilot output must account for every expected target exactly once.",
    );
  }

  const issueNumbers = units
    .map((unit) => unit.matchingIssueNumber)
    .filter((number): number is number => number !== null);
  if (new Set(issueNumbers).size !== issueNumbers.length) {
    throw new Error(
      "A matching open issue may be assigned to only one review unit.",
    );
  }

  return {
    revision: output.revision,
    scope: expectedScope,
    summary: text(output.summary, "summary", 60_000),
    units,
  };
}
