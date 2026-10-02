---
"@xoroh/kern-tokens": patch
---

P1-5a — wire the component-token generator into `generate:tokens`, and add a freshness gate.

**The bug this fixes:** `packages/kern-tokens/scripts/gen-comp-css.mjs` produced
`comp-tokens.css` and `tailwind.css`, but `bun run generate:tokens` ran only `gen-css.mjs`.
A fresh clone or a CI run therefore got `tokens.css` and **silently missed both derived
files** — they only appeared if someone knew to invoke a generator by path. Meanwhile both
files are committed and consumed, so the tree was never broken, just quietly incomplete.

- `generate:tokens` now runs **both** generators.
- `generate:tokens:only` and `generate:comp-tokens` remain for running one in isolation.

**New gate `bun run check:generated`** (`scripts/check-generated-freshness.mjs`): re-runs both
generators and compares their output byte-for-byte (whitespace-normalized) against what is
committed. It **restores every file it touches**, including when it is about to fail, so it is
safe on a dirty worktree and never "fixes" a hand-edit for you — it reports the drift.

This is the fourth instance of the same class in this program (D-026.5's26-pair allow-list,
`FullscreenButton.test.tsx` unwired, the ungated elevation rows): **a derived artifact that no
gate re-derives**. A gate that passes because it did not look is worse than one that fails.

**Four mutations proven to fail, each reverted:**
- hand-edit `tailwind.css` → `STALE: does not match a fresh run` (exit 1), file left untouched
- hand-edit `comp-tokens.css` → same
- delete a generated file → `generated output missing from the tree`
- **the real scenario** — edit `tokens.json` (`space-150` → 99px) without re-running the
  generator → `tokens.css` reported STALE (exit 1)

Verified green: `check:generated` passes on a clean tree; worktree unchanged after every run.
