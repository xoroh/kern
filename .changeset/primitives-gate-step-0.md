---
"@xoroh/kern-primitives": patch
---

Add the empty `@xoroh/kern-primitives` package and `check:primitives`, the
boundary gate for the ratified extraction (step 0 of 4).

`check:primitives` forbids the primitives layer from importing `@xoroh/kern-tokens`,
`@xoroh/kern-native`, `@xoroh/kern`, `react-native` or `react-dom`. The first two
are the ratified rule — a token read is a visual decision, so it must arrive as a
prop. The rest were added because a gate that names only the packages we happened
to think of is a gate with a hole in it, and because depending on `@xoroh/kern`
would make the extraction circular.

**It walks the transitive import closure, and that is not a preference.** During
the `SheetSurface` split a theme-coupled helper was placed in
`utils/overlay-styles.ts`, a module `SheetSurface` already imported. The candidate
file was clean; its dependency graph was not:

    sheet-surface  ->  overlay-styles  ->  kern-tokens

A per-file grep passes that. The gate reports the full chain, because
"primitives imports overlay-styles" is not actionable and the three-file chain is.

Mutation-proven with three injections, all caught, all reverted:
a direct `kern-tokens` import; a **transitive** one through a module *outside*
`src/` (the overlay-styles shape, where the entry file is verifiably clean); and
a `@xoroh/kern` renderer edge.

The package itself is intentionally empty apart from its boundary documentation.
It is not published, and it should not be until it has content — an empty
published package is a de-facto "this library exists" claim.
