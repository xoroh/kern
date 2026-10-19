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

## Job 3 — roadmap item 5 / decision 009 `--system` (CLI add/list + MCP)

- Outcome: done. The one generated registry carries `system` on every row; CLI `add`/`list` and the MCP component tools select on `--system` (default `kern-m3`).
- PR: https://github.com/xoroh/kern/pull/81 (merge after green)
- Fail-before (stash sources, keep new tests, run against true before-state):
  - CLI `vitest run src/system.test.ts` → 5 failed / 1 passed (unknown system silently planned/listed M3 rows).
  - MCP `bun test src/discovery.test.ts src/manifest.test.ts` → import error + assertion failures (no system dimension).
- What changed:
  - Generator (`packages/mcp/scripts/generate-manifest.mjs`): `SYSTEM = "kern-m3"` const; every row carries `system` in `manifest.ts` + `registry.json` (+ `ComponentEntry` type); release-set hash covers `system/...` on both sides (generator + CLI `releaseSetFor` agree — pinned by a new test).
  - CLI: `ManifestRow.system`, `ROW_RE` carries the field, bundled-payload staleness guard, `DEFAULT_SYSTEM`/`knownSystems`/`resolveSystem` in `manifest.ts` (exported via index); `AddOptions.system` + system-first filtering in `planComponent`/`planBlock`; `ListOptions.system` + filter + line shows system; `kern.ts` `--system` flag (format-guard; existence resolved against registry) wired into add/list + usage.
  - MCP: `DEFAULT_SYSTEM`/`knownSystems`/`resolveSystem` in `tools.ts` (registry-derived; literal mirrors CLI without a static CLI import that would drag the TS compiler into the packed server); `listComponents`/`getComponent`/`installPlan` take system, return it, error loudly on unknown; `index.ts` schemas gain `system` (default kern-m3) on the three component tools.
  - Maturity derives the system forward (`MaturityRow.system`).
  - Four hand-rolled row regexes updated to the new shape: CLI `ROW_RE`, `check-parity`, `check-registry-paths`, `audit-elevation`, `generate-maturity` (5 sites; all had zero-row loud failures — none silently passed).
  - Test fixes from the new shapes: blocks-add fixture manifest carries system (no-old-shape per ADR-020); 4 pre-existing MCP tests now narrow the (new) error union; my new CLI test takes `{ timeout: 120_000 }` (flaked once at the 5s default under parallel load — plain worker starvation, never a logic failure; stable 52/52 since).
  - Roadmap item-5 line marked DONE (item 7 left for the bundling PR).
- Commands + real output:
  - CLI `vitest run` → 52/52 (7 files, incl. new `system.test.ts` 6/6).
  - MCP `bun test src/` → 34/34 (4 files).
  - `bun run build` → 9 packages ok (also fixes the stale-dist trap: workspace `@xoroh/kern-cli` resolves to dist; without rebuild the MCP closure tests go metadata-only).
  - `bun run lint` → 1323 files clean; typecheck cli + mcp + all 6 packages + site → exit 0.
  - `check:generated` fresh; census, parity, registry-paths (422 rows), elevation, stale-refs green; site `check:docs` 0 fail.
  - Binary: `kern list --system kern-m3` rows; `--system nope` → `unknown system "nope" — registry knows: kern-m3.` exit 1; `add --system nope` exit 1.
  - `gh pr checks 81` → 14/14 pass.
- Acceptance: pass — CLI add/list and MCP tools take `--system` (default kern-m3), driven by the one generated registry, tests for both.
- Still weak: `DEFAULT_SYSTEM` literal lives in both CLI and MCP (static CLI import would poison the packed server; noted in code); `docs/components.md` intentionally carries no system column (human inventory, platform-sectioned; CLI/MCP never read it).
- Next item: Job 4 (roadmap item 7 — MCP bundles its data).
