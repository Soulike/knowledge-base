# Glossary map

## Contexts

- [Repository maintenance](GLOSSARY.md): Agentic automation, content
  verification, and review integration. Its decisions live in
  [docs/adr/](docs/adr/).
- [Knowledge-base product](knowledge-base/GLOSSARY.md): Knowledge,
  installed Skills, and their supporting references. Plugin-specific domain
  documents belong inside [the product source module](knowledge-base/).

## Relationships

Repository maintenance validates and distributes plugin content. Each product
source owns its installed behavior and domain documentation; shared development
facilities do not create dependencies between installed plugins.
