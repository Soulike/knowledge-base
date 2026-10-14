# Natural-language prompt format

Use this reference when a Skill renders a copyable natural-language prompt for
a generative visual model.

Follow the user's language unless the user requests another language. Place the
copyable prompt inside one plain-text fenced block as continuous multi-paragraph
prose. Use complete sentences and paragraph breaks rather than Markdown
headings, labeled fields, numbered or bulleted lists, tables, JSON, YAML, XML,
or comma-separated keyword and tag strings.

Give each paragraph one coherent responsibility. Let the consuming workflow
determine the useful information order, and merge, split, reorder, extend, or
omit paragraphs when that makes the requested result clearer. This is a prose
contract, not a fixed paragraph count or required content schema.

Keep requirement analysis, diagnoses, assumptions, and usage explanations
outside the copyable prompt. Make the prompt self-contained with only the model
inputs declared by the consuming workflow; do not rely on earlier conversation
or undeclared artifacts.
