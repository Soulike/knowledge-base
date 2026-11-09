# Knowledge-base plugin

The plugin combines authoritative Knowledge with installed Skill entrypoints
that either execute user work or route the understanding required for it.

## Language

**Knowledge**:
Independently maintained understanding with a concrete reading reason arising
from the user's work, subject, or current material. A Workflow or Handbook may
route to Knowledge without owning its subject responsibility.

**Workflow Skill**:
An Agent Skill that owns a user task's decisions, actions, failure and stopping
behavior, outputs, and completion criteria.

**Handbook Skill**:
An installed reading entrypoint for one user task family, technical domain, or
stable platform context. It owns selection and required-reading obligations for
canonical Knowledge, but does not own the user's task procedure or completion.

**Skill reference**:
Supporting material selected by a step in a Skill. Its responsibility and
lifecycle follow that selecting behavior; sharing it among Skills does not
create an independent Knowledge reading responsibility.

**Knowledge Catalog**:
The complete maintenance inventory at
[knowledge/index.md](plugin/knowledge/index.md), listing every Knowledge leaf
and its Knowledge Type. The Catalog does not select runtime reading; installed
Handbook and Workflow Skills own those routes.
