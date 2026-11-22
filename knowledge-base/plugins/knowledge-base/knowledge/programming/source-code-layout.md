# Source-code layout for reading

## Scope

This document explains how source-code layout makes scope, related concepts, and the path from main operations to implementation detail recognizable to readers while preserving language semantics and accepted project conventions.

## When to update

Update this document when evidence from source reading, code review, or formatting practice changes how visual grouping, proximity, ordering, or consistency affect understanding, or reveals a missing condition for preserving meaning during layout changes.

## Make the structure visible

Layout is part of how code communicates. Readers use blank lines, indentation,
and nearby declarations to locate the part they need and recognize where one
idea ends and another begins. Correct formatting cannot establish correct
behavior or responsibility, but inconsistent or misleading layout can make
both harder to inspect.

Use blank lines to separate meaningful groups and close placement to show a
relationship within a group. A declaration, short explanation, and the code
that uses it should read as one connected unit when their relationship matters.
Adding a separator after every statement destroys that signal, while removing
all separators hides the groups.

Indent consistently to expose lexical scope: the region of code in which a
declaration or block applies. A reader should be able to identify method and
block boundaries by scanning the layout. Make a deliberately empty body
recognizable rather than burying it in a punctuation mark that looks like the
end of another statement. Follow the language's supported syntax and accepted
formatting form.

## Reduce unnecessary searching

Arrange a source file so its main purpose and operations are easy to find, then
make their details reachable in a predictable order. A caller followed by its
private helpers can support a useful top-down reading path. Related operations
can also belong together even when they do not call one another.

Use the order that serves the actual language and reader. A language may require
a declaration before use, and a framework or established project convention
may make another ordering familiar. The useful property is predictable access
to the needed explanation, not a universal rule that every caller must precede
every callee.

Declare local values near the code that gives them meaning and uses them, within
the smallest suitable scope. Place shared state and constants where readers
expect to find their definitions under the accepted convention. Do not hide a
widely relevant rule among unrelated low-level helpers. Respect initialization
order and lifetime; moving a declaration can change when work happens or how
long a resource exists.

Keep tightly related implementation close enough that readers need not repeatedly
find and remember scattered fragments. Source navigation tools help locate
declarations but do not explain why those declarations belong together. Physical
proximity is a reading aid, not proof of one semantic responsibility: do not
merge independently owned modules merely to put their source lines nearby.

## Use horizontal space to clarify expressions

Use spacing and wrapping that help readers distinguish operands, arguments,
and subexpressions under the language's conventions. When precedence would be
unclear, make the grouping explicit rather than relying on subtle differences
in spacing. Indentation should remain recognizable when an expression spans
several lines.

Choose a practical width for the project's reading and review contexts. A line
that requires repeated horizontal scrolling can hide relationships, but one
fixed character count does not fit every construct or environment. Wrap at
meaningful boundaries rather than arbitrarily breaking the expression.

Align columns when the alignment reveals a real relationship readers need,
such as a small table of related values. Avoid decorative padding that draws
attention to spelling width instead of meaning or requires unrelated lines to
change after a rename. Many long declarations are a reason to inspect the
underlying structure, not evidence that column alignment or automatic splitting
will fix it.

## Adopt one coherent convention and automate its mechanics

Use the project's agreed conventions and supported formatter rather than
introducing a personal style into each file. A consistent convention reduces
the interpretation readers must repeat as they move through the codebase.
Maintain that convention through the normal configuration and review path when
it needs to change.

Let automation handle mechanical spacing, indentation, and wrapping where it
can do so reliably. People still decide which concepts need separation, which
declarations need proximity, and whether a layout suggests a misleading
relationship. A formatter does not establish those semantic choices merely by
producing a consistent result.

Treat formatting as a behavior-preserving change. Respect significant
whitespace, literals, initialization order, and comments or annotations that
tools interpret. Reordering members, changing a string, or moving a directive
can exceed a layout-only change even when the result looks cleaner. Review the
actual change and use applicable language/tool checks before claiming that
only presentation changed.

## Sources

- Robert C. Martin, “Formatting,” chapter 5 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Prettier: Rationale](https://prettier.io/docs/rationale): behavior-preserving formatting and the limits of automating empty lines and comment placement.
