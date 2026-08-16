# Source comments and docstrings

## Scope

This reference supports workflow steps that write, review, or reconcile comments and docstrings attached to an implementation.

## When to update

Update this document when evidence changes the appropriate authority of source comments or docstrings, reveals a recurring form of misleading embedded prose, or changes the verification needed to keep such prose synchronized with code and its governing contract.

## Explain what the implementation cannot say clearly

Code, schemas, and configuration normally own current executable behavior. A comment or docstring should add a non-obvious current invariant, intent, rationale, constraint, or failure mode attached to that implementation rather than narrating behavior already clear from it. When a language or project explicitly makes docstrings part of a public API contract, that contract defines their stronger authority.

Describe the current design rather than the implementation it replaced or the incident that led to it. Historical context belongs in a durable decision record only when later work still needs it. Describe proposed behavior as a tracked future action rather than as a present-tense property of the code.

Prefer claims that remain true when incidental file names, symbol names, or counts change. A name can route the reader to evidence, but a claim whose correctness silently depends on that name or count is a maintenance trap.

## Treat prose as an assertion

A factual comment is an assertion about the code even though compilers and tests rarely evaluate it. Verify each claim against the containing implementation and the artifact that owns the relevant contract. The obligation runs in both directions: new prose belongs in the evidence review for its diff, and a code change must sweep for existing prose it has made false.

Claims of precedent such as “matches another implementation” or “already handled elsewhere” are especially risky because readers use them as evidence that the current scope is complete. Such a claim should identify evidence actually inspected, not a remembered analogy. A false comment that passes type checking, tests, CI, and automated review remains a correctness defect rather than a cosmetic issue.
