# Meaningful names in code

## Scope

This document supplies language-independent reasoning for choosing and evaluating names in source code and developer-facing APIs so readers can recognize intent, distinguish roles, and predict use from the context available to them. Applicable language and framework conventions govern spelling and syntax.

## When to update

Update this document when evidence from code maintenance or API use changes the relationship between naming, reader context, semantic distinctions, searchability, or compatibility, or reveals a missing applicability condition in these principles.

## Judge a name where readers use it

A useful name makes the intended meaning apparent without requiring the reader to translate a private abbreviation or remember the author's explanation. Evaluate it in an actual expression, call, or list of available operations, together with the receiver, arguments, and visible types. A declaration can look clear while its use remains ambiguous.

Prefer the shortest name that preserves the information readers need. Brevity is useful after ambiguity has been removed; adding words is useful only when those words help readers understand or choose correctly.

| Reader's question                             | Naming choice                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| What does this value represent?               | Name its role, subject, and necessary unit or representation.               |
| How do these otherwise similar values differ? | Put the meaningful difference in the names.                                 |
| What will this operation do or produce?       | Use words that match its actual behavior and result.                        |
| Which familiar concept is this?               | Use established technical or domain vocabulary consistently.                |
| Where can I find and discuss it?              | Use recognizable, pronounceable words and enough specificity for its scope. |
| Which context is already visible?             | Keep necessary distinctions and omit repeated context.                      |

Names expose intent; they do not establish correctness or replace documentation of non-obvious constraints, failures, or rationale. A comment explaining only that `d` means an age in days suggests a naming improvement. A comment explaining why that age is measured from settlement rather than creation can still supply necessary reasoning after the rename.

## Express roles and real distinctions

Name a variable or parameter for what it means in the operation, rather than merely its storage type. `source` and `destination` explain the direction of a copy that `a1` and `a2` conceal. When primitive types leave units or representations unclear, include that distinction: `timeoutSeconds`, `amountInCents`, or `encodedPayload`.

Do not imply a property the value lacks. `accounts` is generally clearer than `accountList` when the container's specific behavior is irrelevant; a name suggesting ordering, uniqueness, or a particular representation should agree with the contract. Similarly, avoid a name suggesting a read when the operation unexpectedly changes state.

Numeric suffixes, misspellings, and words such as `data`, `info`, or `object` often make identifiers different without helping readers choose between them. Name the actual distinction instead. For example, when one customer representation contains only an identifier and display name while another contains the full record, `customerSummary` and `customerDetails` communicate the difference better than `customerData` and `customerInfo`. Such words are not forbidden: keep one when it has a defined meaning that matters in the context.

If no meaningful distinction can be stated, investigate why two concepts or operations exist before inventing another suffix. Renaming cannot resolve an unclear responsibility by itself.

Types and values usually name things or roles; actions usually name what they do, and predicates should read as a condition that can be true or false. Choose the exact grammar and accessor form according to the language. When several creation paths would otherwise be ambiguous, a named factory or constructor label can expose the distinction, such as whether a duration is constructed from seconds or milliseconds. This is a reason to clarify creation, not a requirement to replace every constructor.

## Use a shared vocabulary without hiding different behavior

A **technical term** names an implementation concept readers can recognize from their programming background, such as a queue or parser. A **domain term** names a concept in the problem being solved, such as an invoice or shipment. Use technical vocabulary for technical mechanisms and domain vocabulary for domain rules. Explain a domain term when the intended reader cannot infer it from the available context.

Prefer familiar words over private abbreviations, jokes, slang, and references that require knowing the author. Established abbreviations and mathematical notation can be clearer for their intended readers; the test is shared understanding, not an absolute ban on short names.

Use one term consistently for the same concept within the relevant API or domain. Do not alternate between `fetch`, `retrieve`, and `get` merely because different authors wrote otherwise equivalent operations. Conversely, preserve a meaningful difference in behavior rather than making unlike operations look equivalent for superficial consistency.

For example, an API that distinguishes a local cache lookup from a remote refresh can use `readCachedProfile` and `refreshProfile`. The distinction helps callers choose whether to request remote work. It does not follow that every operation called `get` in another API must be renamed: its receiver, domain, and established contract may already make its meaning clear. Consistency is contextual, not a demand that a word have only one meaning across every library.

## Make names recognizable and searchable

Use words that collaborators can say and locate without decoding a compressed spelling. Avoid visually confusable identifiers such as a lone lowercase `l` or uppercase `O` where they can be mistaken for digits.

Give concepts used across a large scope enough specificity to identify their occurrences. A short loop index can be clear when its meaning and entire lifetime are visible; an exported value usually needs more context. Scope affects how much information a name needs, not a mechanical minimum length.

Name a constant when its meaning would otherwise be hidden by a literal or when readers need to find and change the rule. Two settings may currently equal `30` while representing a request timeout and a cache lifetime. Separate names preserve those independent meanings; one shared constant would falsely imply a shared rule. Obvious literals whose meaning is already clear do not all need named constants.

Searchability complements semantic navigation and refactoring tools. Such tools can locate a symbol, but they do not decide whether two same-valued constants represent the same policy or help readers infer an unexplained name.

## Supply enough context and remove redundant encoding

Use a well-named type, function, module, or namespace to provide context that its members can share. Within `shippingAddress`, `city` has a clear subject. A detached value may need `shippingCity`; where several kinds of address coexist, `PostalAddress` distinguishes the concept more usefully than a project-wide prefix.

Context helps only when readers can see it where they use the name. A shared application prefix adds little when every available type already carries it. Conversely, removing a qualifier can create ambiguity if the receiver or visible type no longer supplies that information.

Prefer existing meaningful structure before repeating context in every identifier. Introduce a separate type or grouping only when it represents a useful relationship or responsibility; improving names alone does not justify extra classes or moving temporary local values into shared mutable state.

Avoid encoding storage types or member scope when that information is already clear and the encoding supplies no useful distinction. Such names require extra decoding and can become misleading after a type changes. Preserve semantic information such as units, roles, and representations, and follow applicable language or framework conventions. A convention that marks interface identity or public visibility can have a real purpose; the principle is to remove redundant information, not to ban every prefix or suffix.

## Improve names as understanding improves

Revisit a name when code review, explanation, or a caller's mistake exposes a missing distinction. Use representative call sites to check whether the replacement reduces guessing and makes similar choices easier to distinguish. Keep the change coherent with the vocabulary of the surrounding code.

Use semantic refactoring tools where available, and verify affected references. Before renaming an exposed identifier, establish whether it is also part of a public API, serialized field, reflection lookup, or another externally consumed contract. A better internal name does not by itself authorize breaking those consumers; coordinate the corresponding compatibility change when needed.

## Sources

- Tim Ottinger, “Meaningful Names,” chapter 2 in Robert C. Martin, _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/): evaluation at use sites, role-based naming, necessary context, and language-specific naming forms.
- [.NET Framework Design Guidelines: Names of Classes, Structs, and Interfaces](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/names-of-classes-structs-and-interfaces): an example of framework-specific naming conventions.
- [PEP 8: A Foolish Consistency is the Hobgoblin of Little Minds](https://peps.python.org/pep-0008/#a-foolish-consistency-is-the-hobgoblin-of-little-minds): contextual consistency and preservation of compatibility.
