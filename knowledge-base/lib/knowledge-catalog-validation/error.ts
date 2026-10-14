export class KnowledgeCatalogValidationError extends Error {
  readonly diagnostics: readonly string[];

  constructor(diagnostics: readonly string[]) {
    const copiedDiagnostics = [...diagnostics];
    super(`Knowledge catalog is invalid:\n${copiedDiagnostics.join("\n")}`);
    this.name = "KnowledgeCatalogValidationError";
    this.diagnostics = copiedDiagnostics;
  }
}
