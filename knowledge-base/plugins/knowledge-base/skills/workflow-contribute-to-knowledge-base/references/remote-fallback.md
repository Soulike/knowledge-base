# Handle unavailable remote inspection

Use this fallback only when remote canonical repository or issue inspection via
`gh` is unavailable.

1. **Keep publication blocked:** Keep publication and issue deduplication
   blocked until the required remote repository and issue checks succeed. Return
   `draft-only` (rather than publishing) for any qualifying candidate.
2. **Inspect locally accessible plugins directly:** For candidate evaluation and
   draft preparation, inspect this locally installed plugin's canonical
   Knowledge, Skills, and references together with any co-installed sibling
   Knowledge plugins accessible locally. Read plausible concrete files directly
   without scanning any `knowledge/index.md` catalog or treating filenames alone
   as the conclusion.
3. **Disclose the incomplete boundary:** Explicitly disclose the
   remote-inspection blocker and the incomplete cross-plugin and issue-history
   comparison boundary in the resulting draft or `no-qualified-contribution`
   report. Name which local plugins were inspected and note that uninspected
   canonical plugins or open and closed issues could still own or duplicate the
   lesson.
