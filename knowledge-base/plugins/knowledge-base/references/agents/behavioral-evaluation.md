# Agent behavioral evaluation

## Scope

This reference defines lightweight context-isolation and prompt-dispatch
mechanics when running an independent selection, reading, or execution probe
under [Verify reader understanding](reader-understanding.md) or
[Agent Skill authoring](skill-authoring.md).

## When to update

Update this reference when a probe exposes a gap in fresh-context isolation,
answer withholding, dispatch templates, or outcome recording.

## Isolate context and boundaries

Run each probe in a fresh executor context (`fork_turns: "none"` or dispatcher
equivalent) rather than inheriting prior authoring conversation. Explicitly
pass the selected probe model and required tools/permissions as dispatcher
arguments rather than asking a worker to change its own configuration mid-run.

For native sub-Agents, a fresh context removes parent conversation history, but
may still retain active instructions, installed Skill descriptions, or ambient
files. Note any inherited context that could leak the answer; if ambient files
invalidate a blind selection check, move the probe to a cleaner boundary or
report the check limited.

## Withhold expected answers

Keep expected selections, scoring criteria, author conclusions, and past
probes out of the executor prompt:

- **Selection:** supply real candidate metadata without revealing the target
  name or target bodies before recording the choice.
- **Reading:** supply the complete target document without author intent notes
  or expected answers.
- **Execution:** supply natural task inputs and permitted tools without telling
  the executor which branch or rule the probe is testing.

## Prepare executor dispatch

Include the following guard verbatim in executor prompts alongside the task and
permitted materials:

```text
Complete the assigned task independently using only its permitted inputs,
active runtime instructions, and allowed reading routes. Do not search for
expected answers, evaluator notes, or previous run results, and do not guess
or fabricate actions or observations. Report any missing prerequisite, unclear
rule, or unintended answer exposure directly.
```

If evaluator-only material leaks into a probe, discard the contaminated result,
fix the exposure, and rerun in a fresh context.

### Probe dispatch templates

Replace placeholders and insert the guard above before dispatching.

**Blind selection probe** (returns choice before reading target bodies):

```text
<Insert the guard here.>

Task request:
<Natural scenario request, without target hints.>

Current candidate metadata:
<Real candidate identifiers and descriptions; no bodies.>

Choose the relevant entries from this metadata, or choose none. Do not open
candidate bodies or perform the task yet. Return your chosen identifiers and
reasons tied to the request, plus any ambiguity.
```

**Single-turn reading probe** (maintained documentation or Skill reference):

```text
<Insert the guard here.>

Document to read:
<Complete target document or permitted path.>

Read the document independently and answer:
1. In your own words, what are the core rules, applicability boundaries, and
   required prerequisites?
2. Which terms, causal steps, prerequisites, or exceptions felt unclear,
   unstated, or left you guessing?
<Optional when testing a specific boundary distinction:
3. Given this brief case (<factual scenario>), what decision follows from the
   document and why?>
```

**Targeted execution probe** (Workflow or risky Skill branch):

```text
<Insert the guard here.>

Task request:
<Natural scenario request.>

Permitted starting state and tools:
<Initial files, workspace boundary, and tools.>

Required guidance:
<Target Skill path or content.>

Follow the guidance to handle the request within the permitted boundary.
Return the actual result, decisions made, and any instruction or prerequisite
that felt missing or ambiguous.
```

## Record and judge outcomes

Bind each probe to the exact current document content or revision being
evaluated. Re-probe after repairing a document blind spot rather than reusing an
older result.

Separate probe outcomes into three dispositions per
[Attribute findings and repair](reader-understanding.md#attribute-findings-and-repair):

- **Clear:** the probe understood boundaries/triggers and surfaced no missing
  document premises.
- **Document blind spot:** the probe misread a boundary, guessed a premise, or
  hit trigger ambiguity traceable to missing or unclear text — repair the
  document and re-probe the affected passage.
- **Model capability limit / incomplete:** the needed rule is explicit in the
  text and confirmed clear, or a required tool/context boundary was unavailable.
  Do not retry repeatedly on unchanged text to chase a passing run.
