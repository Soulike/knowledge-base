export const reasoningEfforts = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

export type ReasoningEffort = (typeof reasoningEfforts)[number];

export function requireReasoningEffort(
  value: string | undefined,
): ReasoningEffort {
  const normalized = value?.trim();
  if (!reasoningEfforts.includes(normalized as ReasoningEffort)) {
    throw new Error(
      `Reasoning effort must be configured to one of: ${reasoningEfforts.join(", ")}.`,
    );
  }
  return normalized as ReasoningEffort;
}
