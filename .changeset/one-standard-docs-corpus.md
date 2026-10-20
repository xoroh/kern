---
"@xoroh/kern-mcp": patch
---

The docs corpus is one standard, and the machine surface carries it.

Every component page now has ONE shape (demo, coded example, props,
accessibility, limitations, spec, customization), and the teaching half —
the pitch, the do/don't pair, the token table, the anatomy, the deviations,
the FAQ — moved verbatim into `docs/m3-guidance/<family>.md`. The move is
checkable: the moved values live in a manifest, the guidance files are
rendered from it, and a gate compares them byte-for-byte and asserts nothing
was lost in the move.

The page markdown that feeds the MCP index and `llms.txt` now carries the
guidance inline, so an agent reads the reference AND the teaching without
following a link. 87 families gained a coded example (99 registered, 115
fences compiling) and 107 gained a keyboard contract written from the
component source.
