export type ExecutionFailureReport = {
  diagnostics?: string;
  message: string;
};

export function parseExecutionFailureReport(
  source: string,
): ExecutionFailureReport {
  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch {
    return {
      message: "The verifier failed without a readable failure report.",
    };
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { message: "The verifier failed without a valid failure report." };
  }
  const report = value as Record<string, unknown>;
  const message =
    typeof report.message === "string" && report.message.trim().length > 0
      ? report.message.slice(0, 20_000)
      : "The verifier failed without a failure message.";
  const diagnostics =
    typeof report.diagnostics === "string" &&
    report.diagnostics.trim().length > 0
      ? report.diagnostics.slice(0, 10_000)
      : undefined;
  return diagnostics === undefined ? { message } : { diagnostics, message };
}
