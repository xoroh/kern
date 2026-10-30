---
"@xoroh/kern": minor
---

Table density + header pinning (U5): `Table.Root` accepts `density="comfortable" | "compact"` (default comfortable, byte-identical) and `stickyHeader` to pin the head row. Header/cell padding follows density via context; `data-density` and `data-sticky-header` are exposed for styling hooks.
