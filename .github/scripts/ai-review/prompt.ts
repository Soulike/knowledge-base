import type { ReviewConfig } from "./config.ts";

export function renderReviewPrompt(
  template: string,
  guidance: string,
  config: ReviewConfig,
): string {
  const replacements: Record<string, string> = {
    "{{BASE_SHA}}": config.baseSha,
    "{{EXPECTED_HEAD_SHA}}": config.expectedHeadSha,
    "{{PR_NUMBER}}": String(config.prNumber),
    "{{PR_URL}}": config.prUrl,
    "{{REPOSITORY}}": config.repository,
    "{{RUN_ATTEMPT}}": String(config.runAttempt),
    "{{RUN_ID}}": String(config.runId),
    "{{TOOLING_SHA}}": config.toolingSha,
    "{{TRUSTED_GUIDANCE}}": guidance.trim(),
  };
  let prompt = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (!prompt.includes(placeholder)) {
      throw new Error(`Prompt template is missing ${placeholder}.`);
    }
    prompt = prompt.replaceAll(placeholder, value);
  }
  if (/\{\{[A-Z0-9_]+\}\}/u.test(prompt)) {
    throw new Error("Prompt template contains an unresolved placeholder.");
  }
  return prompt;
}
