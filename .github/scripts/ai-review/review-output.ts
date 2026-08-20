import { posix } from "node:path";

export const severities = ["nit", "low", "medium", "high"] as const;
export type Severity = (typeof severities)[number];

export const threadStatuses = ["fixed", "still-open", "uncertain"] as const;
export type ThreadStatus = (typeof threadStatuses)[number];

export type Finding = {
  body: string;
  line: number;
  path: string;
  severity: Severity;
  side: "LEFT" | "RIGHT";
  title: string;
};

export type ThreadAssessment = {
  rationale: string;
  status: ThreadStatus;
  threadId: string;
};

export type ReviewOutput = {
  findings: Finding[];
  headSha: string;
  summary: string;
  threadAssessments: ThreadAssessment[];
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

function string(value: unknown, path: string, maximumLength: number): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  if (value.length > maximumLength) {
    throw new Error(`${path} exceeds ${maximumLength} characters.`);
  }
  return value;
}

function repositoryPath(value: unknown, path: string): string {
  const parsed = string(value, path, 4096);
  const hasControlCharacter = Array.from(parsed).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
  if (
    parsed.startsWith("/") ||
    parsed.includes("\\") ||
    hasControlCharacter ||
    posix.normalize(parsed) !== parsed ||
    parsed === "." ||
    parsed.split("/").some((segment) => segment === "..")
  ) {
    throw new Error(`${path} must be a normalized relative repository path.`);
  }
  return parsed;
}

function parseFinding(value: unknown, index: number): Finding {
  const path = `findings[${index}]`;
  const item = record(value, path);
  exactKeys(item, ["severity", "path", "line", "side", "title", "body"], path);

  if (!severities.includes(item.severity as Severity)) {
    throw new Error(`${path}.severity is invalid.`);
  }
  if (!Number.isSafeInteger(item.line) || (item.line as number) < 1) {
    throw new Error(`${path}.line must be a positive integer.`);
  }
  if (item.side !== "LEFT" && item.side !== "RIGHT") {
    throw new Error(`${path}.side must be LEFT or RIGHT.`);
  }

  return {
    body: string(item.body, `${path}.body`, 60_000),
    line: item.line as number,
    path: repositoryPath(item.path, `${path}.path`),
    severity: item.severity as Severity,
    side: item.side,
    title: string(item.title, `${path}.title`, 240),
  };
}

function parseThreadAssessment(
  value: unknown,
  index: number,
): ThreadAssessment {
  const path = `threadAssessments[${index}]`;
  const item = record(value, path);
  exactKeys(item, ["threadId", "status", "rationale"], path);

  const threadId = string(item.threadId, `${path}.threadId`, 200);
  if (!/^PRRT_[A-Za-z0-9]+$/u.test(threadId)) {
    throw new Error(
      `${path}.threadId must be a pull-request review-thread node ID.`,
    );
  }
  if (!threadStatuses.includes(item.status as ThreadStatus)) {
    throw new Error(`${path}.status is invalid.`);
  }

  return {
    rationale: string(item.rationale, `${path}.rationale`, 4000),
    status: item.status as ThreadStatus,
    threadId,
  };
}

export function parseReviewOutput(
  source: string,
  expectedHeadSha: string,
): ReviewOutput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    throw new Error(
      `Copilot output is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }

  const output = record(parsed, "review output");
  exactKeys(
    output,
    ["headSha", "summary", "findings", "threadAssessments"],
    "review output",
  );
  if (output.headSha !== expectedHeadSha) {
    throw new Error(
      "Copilot output does not identify the expected pull-request head.",
    );
  }
  if (!Array.isArray(output.findings)) {
    throw new Error("findings must be an array.");
  }
  if (!Array.isArray(output.threadAssessments)) {
    throw new Error("threadAssessments must be an array.");
  }

  const threadAssessments = output.threadAssessments.map(parseThreadAssessment);
  const threadIds = new Set<string>();
  for (const assessment of threadAssessments) {
    if (threadIds.has(assessment.threadId)) {
      throw new Error(`threadAssessments repeats ${assessment.threadId}.`);
    }
    threadIds.add(assessment.threadId);
  }

  return {
    findings: output.findings.map(parseFinding),
    headSha: output.headSha,
    summary: string(output.summary, "summary", 60_000),
    threadAssessments,
  };
}
