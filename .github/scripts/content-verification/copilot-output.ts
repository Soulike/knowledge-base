type IndexedEvent = {
  index: number;
  value: Record<string, unknown>;
};

const TERMINAL_BOOKKEEPING_EVENTS = new Set([
  "assistant.idle",
  "assistant.turn_end",
  "session.usage_checkpoint",
]);

export type CopilotRunDiagnostics = {
  copilotVersion: string | null;
  model: string | null;
  observedEventTypes: string[];
  reasoningEffort: string | null;
  skillsVersion: string | null;
};

function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function parseEvent(line: string, lineNumber: number): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line) as unknown;
  } catch (error) {
    throw new Error(
      `Copilot output line ${lineNumber} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
  const event = record(parsed, `Copilot output line ${lineNumber}`);
  if (typeof event.type !== "string" || event.type.length === 0) {
    throw new Error(`Copilot output line ${lineNumber}.type must be a string.`);
  }
  return event;
}

function exactlyOne<T>(values: T[], message: string): T {
  if (values.length !== 1) {
    throw new Error(message);
  }
  const value = values[0];
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

function eventTypeSummary(line: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line) as unknown;
  } catch {
    return "<invalid-json>";
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return "<non-object>";
  }
  const event = parsed as Record<string, unknown>;
  if (
    typeof event.type !== "string" ||
    event.type.length === 0 ||
    event.type.length > 100
  ) {
    return "<invalid-type>";
  }
  if (event.type !== "assistant.message") {
    return event.type;
  }
  if (
    typeof event.data !== "object" ||
    event.data === null ||
    Array.isArray(event.data)
  ) {
    return "assistant.message:<invalid-data>";
  }
  const phase = (event.data as Record<string, unknown>).phase;
  return typeof phase === "string" && phase.length > 0 && phase.length <= 100
    ? `assistant.message:${phase}`
    : "assistant.message:<invalid-phase>";
}

export function summarizeCopilotEventTypes(
  source: string,
  maximumTypes = 32,
): string[] {
  if (!Number.isSafeInteger(maximumTypes) || maximumTypes < 1) {
    throw new Error("maximumTypes must be a positive integer.");
  }
  const summaries: string[] = [];
  const seen = new Set<string>();
  for (const line of source.split(/\r?\n/u)) {
    if (line.trim().length === 0) {
      continue;
    }
    const summary = eventTypeSummary(line);
    if (seen.has(summary)) {
      continue;
    }
    if (summaries.length === maximumTypes) {
      summaries.push("<truncated>");
      break;
    }
    seen.add(summary);
    summaries.push(summary);
  }
  return summaries;
}

export function formatCopilotDiagnostics(
  diagnostics: CopilotRunDiagnostics,
): string {
  const singleLine = (value: string | null): string =>
    value === null
      ? "unavailable"
      : value.replace(/\s+/gu, " ").trim().slice(0, 500) || "unavailable";
  const eventTypes = diagnostics.observedEventTypes
    .slice(0, 33)
    .map((value) => singleLine(value))
    .join(", ");
  return [
    `Copilot CLI: ${singleLine(diagnostics.copilotVersion)}`,
    `Skills CLI: ${singleLine(diagnostics.skillsVersion)}`,
    `Model: ${singleLine(diagnostics.model)}`,
    `Reasoning effort: ${singleLine(diagnostics.reasoningEffort)}`,
    `Event types: ${eventTypes || "unavailable"}`,
  ].join("\n");
}

export function extractCopilotFinalAnswer(source: string): string {
  const events: IndexedEvent[] = [];
  const finalAnswers: Array<IndexedEvent & { content: string }> = [];
  const results: IndexedEvent[] = [];

  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (line.trim().length === 0) {
      continue;
    }
    const event = parseEvent(line, index + 1);
    events.push({ index, value: event });
    if (event.type === "assistant.message") {
      const data = record(event.data, `Copilot output line ${index + 1}.data`);
      if (data.phase !== "final_answer") {
        continue;
      }
      if (
        typeof data.content !== "string" ||
        data.content.trim().length === 0
      ) {
        throw new Error("Copilot final answer content must be a string.");
      }
      if (
        data.toolRequests !== undefined &&
        (!Array.isArray(data.toolRequests) || data.toolRequests.length > 0)
      ) {
        throw new Error("Copilot final answer must not request tools.");
      }
      finalAnswers.push({ content: data.content, index, value: event });
    } else if (event.type === "result") {
      results.push({ index, value: event });
    }
  }

  const finalAnswer = exactlyOne(
    finalAnswers,
    "Copilot output must contain exactly one final answer.",
  );
  const result = exactlyOne(
    results,
    "Copilot output must contain exactly one result event.",
  );
  if (result.value.exitCode !== 0) {
    throw new Error("Copilot output must contain a successful result event.");
  }
  if (result.index <= finalAnswer.index) {
    throw new Error("Copilot result event must appear after the final answer.");
  }
  const terminalEvent = events.at(-1);
  if (terminalEvent === undefined || result.index !== terminalEvent.index) {
    throw new Error("Copilot result event must be terminal.");
  }
  for (const event of events) {
    if (event.index <= finalAnswer.index || event.index >= result.index) {
      continue;
    }
    if (!TERMINAL_BOOKKEEPING_EVENTS.has(String(event.value.type))) {
      throw new Error(
        `Copilot output contains unsupported activity after the final answer: ${String(event.value.type)}.`,
      );
    }
  }
  return finalAnswer.content;
}
