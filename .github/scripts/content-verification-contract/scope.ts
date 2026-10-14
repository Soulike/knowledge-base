export const verificationScopes = [
  "time-sensitive-knowledge",
  "evergreen-knowledge",
  "maintained-agent-content",
] as const;

export type VerificationScope = (typeof verificationScopes)[number];

export function parseVerificationScope(value: string): VerificationScope {
  if (!verificationScopes.includes(value as VerificationScope)) {
    throw new Error(
      `Verification scope must be one of: ${verificationScopes.join(", ")}.`,
    );
  }
  return value as VerificationScope;
}
