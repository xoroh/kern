# Tooling lane report — `2026-10-19-kern-tooling-lane`

## Job 1 — deploy.yml workflow_dispatch-only

- Outcome: done. Production deploys no longer trigger on push to main; only explicit `workflow_dispatch`.
- PR: https://github.com/xoroh/kern/pull/75 (squash-merged, branch deleted)
- Commands + real output:
  - `git worktree add ../kern-tooling -b chore/deploy-manual-only origin/main` → HEAD at `b1393a38`.
  - Edit `.github/workflows/deploy.yml`: removed the 3-line `push: branches: [main]` trigger; `on:` now lists only `workflow_dispatch:`. No deploy run, cancelled, or approved.
  - `gh pr checks 75` → 14/14 pass (apps, cold-install, dist-gates, e2e, gates, 9× pkg).
  - `gh pr view 75 --json mergeable,mergeStateStatus` → `MERGEABLE` / `CLEAN` before merge.
  - `gh pr merge 75 --squash --delete-branch` (Kern Lead delegates routine merges to this lane).
- Acceptance: pass — workflow file shows only `workflow_dispatch`; CI green.
- Still weak: nothing; 3-line deletion, no behavior except trigger removal.
- Next item: Job 2 (F-02 site-manifest generator formatting).

## Job 2 — F-02 generator formatting (shared biome helper)

- Outcome: done. Generators that emit `.ts` no longer write unformatted output when the workspace biome bin is unreachable.
- PR: https://github.com/xoroh/kern/pull/77 (merge after green)
- Fail-before (this laptop, no npx, fresh worktree): `bun run scripts/generate-manifest.mjs` printed "could not run biome", exited 0, left `manifest.ts` modified; `biome check` on it failed.
- What changed:
  - New `scripts/lib/format-generated.mjs`: resolves `<root>/node_modules/.bin/biome`, else pinned `bun x @biomejs/biome@<installed|range>` (bun via `process.execPath` under bun, else PATH), else throws — never returns unformatted text. `maxBuffer` 256MB (props.ts is ~1.7MB; the default 1MB ENOBUFS'd and the old code fell back to unformatted on the biggest file).
  - Migrated 7 emitters: site `generate-manifest` (was `npx`+warn), `generate-changelog`, `generate-legal`, `generate-props` (x2), `generate-a11y` barrel (never formatted), MCP `generate-manifest` manifest.ts (never formatted) + `generate-maturity`. kern-tokens `gen-*.mjs` already used `bun x` + loud exit; left alone.
  - Found committed `a11y.ts`/`props.ts` were unformatted residue hidden by `biome.json` exemptions (proved via `git show HEAD:... | biome check --stdin-file-path` failing on both): regenerated canonical, removed the `props.ts` `includes` exclusion + the `a11y.ts` override, raised `files.maxSize` to 4MB so the 1.6MB file is really checked.
  - New `scripts/lib/format-generated.test.mjs` (5 tests: bin-wins, bunx fallback, loud throw, spec pinning, large output) registered in `test:scripts`.
- Commands + real output:
  - `bun test scripts/lib/format-generated.test.mjs` → 5 pass.
  - `bun run generate` (site, after `bun run build`) → zero biome warnings, end-to-end exit 0.
  - `bun run check:generated` → "19 generators, 24 derived files byte-match a fresh run".
  - `bun run lint` → 1322 files, no fixes (only pre-existing infos: schema-version notice, run-shots useTemplate warnings).
  - `bun run typecheck` (all 6 packages + site `tsc --noEmit`) → exit 0.
  - `bun run test` (5 web suites) → all exit 0. `bun run test:scripts` → 37 pass.
  - site `bun run check:docs` (full consumer suite incl. check-props/check-a11y/check-llms) → ok.
  - `gh pr checks 77` → 14/14 pass (round 1; this report commit re-triggers round 2).
- Acceptance: pass — fresh `check:generated` passes with no manual biome step.
- Still weak: `bun x` fallback needs network on first use (then cached); fully offline without a workspace bin still fails loudly by design.
- Next item: Job 3 (roadmap item 5, decision 009 `--system` for CLI + MCP).
