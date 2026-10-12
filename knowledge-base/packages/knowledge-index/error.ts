export class KnowledgeIndexError extends Error {
  readonly diagnostics: readonly string[];

  constructor(diagnostics: readonly string[]) {
    const copiedDiagnostics = [...diagnostics];
    super(`Knowledge index is invalid:\n${copiedDiagnostics.join("\n")}`);
    this.name = "KnowledgeIndexError";
    this.diagnostics = copiedDiagnostics;
  }
}
