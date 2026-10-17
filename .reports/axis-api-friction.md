# Axis API friction — Kern consumer notes for the Axis Lead

Living list. One row per place where consuming `@xoroh/axis` from Kern
fought back. Format: file · what Kern needed · what Axis offers · proposed
Axis change. Nothing here is a bug in Kern; the proposed change direction
owns the fix. Seed: Pipeline (`fusion-crab-snipe_r-07-r-010`).

| # | File (Kern) | What Kern needed | What Axis offers today | Proposed Axis change |
|---|---|---|---|---|
| 1 | `scripts/pack-vendor.mjs` invocation (Kern re-vendoring, PR 1) | Packing a fresh tarball from a clean checkout must fail with a message pointing at the missing prerequisite | `bun run --filter @xoroh/axis build` exits 127 `tsup: command not found` when the target worktree has no `node_modules`; the script surfaces raw exit code with no hint | In `pack-vendor.mjs`, pre-check `packages/axis/node_modules/.bin/tsup` (or run `bun install --frozen-lockfile` automatically with `--install` opt-out) and print "run `bun install` in <root> first" on the 127 path |

Entries appended per-PR; each carries the PR that hit it (PR 1 =
`feat/m3-adopt-axis-render`, vendor refresh @ Axis `82c3179`).
