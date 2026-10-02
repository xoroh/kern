---
"@xoroh/kern-tokens": minor
---

P1-8 — mirror the `md.comp.*` component tables into the Tailwind adapter.

Measured before building: the adapter emitted **204** vars across colour, radius, spacing,
typescale, elevation, easing and duration — and **0 of the 142 `md.comp.*` vars**. The component
tables were reachable only by writing `var(--md-comp-…)` by hand, so every Tailwind consumer had to
know the raw naming scheme. `dad7db1` grew the tables to 42 families; this makes them addressable
through Tailwind's own namespaces.

**142 vars added, 204 → 346, with 142/142 covered and 0 unmirrored.**

The mirror derives from `compLines`, the same array the CSS emitter builds, copying each *already
resolved* expression rather than recomputing it:

```js
for (const line of compLines) {
  const m = line.match(/^\s*--md-comp-([\w-]+):\s*(.+);$/);
  if (!m) continue;
  tailwindLines.push(`  --comp-md-${m[1]}: ${m[2]};`);
}
```

That is what keeps it a map rather than a second source of truth: no value is parsed, converted or
re-derived, so the adapter cannot disagree with `comp-tokens.css`. Verified — **0 of the 142
mirrored entries is a literal**, all are `var()` (or an `ICON_SIZE` dimension that the source table
itself resolved).

**Codegen is byte-identical.** `bun run generate:tokens` leaves both files unchanged
(`tailwind.css` md5 `efff855c…`, `comp-tokens.css` `2287f5e8…`), so the `b21832d` freshness
contract holds: `check:generated` re-runs both generators and compares against what is committed.

Verified: `check:generated` fresh (2 generators, 3 derived files byte-match) · `check:kern` 45/45 +
19/19 resting elevation · `check:contrast` 1242 checks / 0 orphans · kern-tokens typecheck + 39
tests · biome clean.
