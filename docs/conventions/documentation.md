# Documentation rules

Status: draft

## Principles

1. One canonical source per fact. Docs explain and link — never compete.
2. Code/config is canonical for values; docs are canonical for meaning,
   ownership, boundaries, decisions.
3. Update docs in the same change as the code. Never defer.
4. Link, don't duplicate. Small clarifying examples are fine; mirrors aren't.
5. Smallest valid owner: package truth lives with the package, repo truth
   in `docs/`, product truth in `apps/docs/`, agent truth in skills.

## Status labels

Every doc declares one, right after the title:

- `placeholder` — structure only, needs real content
- `draft` — written, not yet reviewed against implementation
- `current` — verified accurate
- `stale` — suspected out of date (fix or re-verify)
- `deprecated` — phased out, kept as reference

## Merge gate

Before merge: behavior docs updated, changeset added for `packages/`
changes, skill refs updated if guidance changed, `Status:` lines correct,
`bun run lint` clean, README indexes list new files. No empty placeholders,
no unrelated edits, no pasted source values.
