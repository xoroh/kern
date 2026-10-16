# Status report — 2026-10-16, evening (Kern 0.1.0 Preview readiness track)

Baseline: Kern `main` at `6c47d95a` (PR #55 testID merged). Open: none.
Tree: this branch fix/state-layer-contradictions, unpushed.

## Done (this track)
- Elevation gaps to zero (this branch, unmerged): 7 spec rows + 3 unassigned entries +
  shared alias map; 6 mobile sheet pages claim 0, dock-sheet corrected to
  surface, rich-tooltip token row fixed; gaps now fail in check:docs;
  audit ASSERTED 15→22, GAP 0. Open owner question (not trimmed): native
  modal sheets are flat (no token) — deliberate or missing elevation?
- PR #37 merged: Kern consumes `@xoroh/axis` via vendored tarball
  (`vendor/axis/axis-bed35547.tgz`, `file:` spec in kern/kern-native/site,
  lockfile-pinned). No manifest declares `@xoroh/kern-primitives`; no
  runtime source imports it (residual refs: `libs/` frozen dir, generated
  changelog, `check-layers.mjs` legacy-name handling — deletion is the other
  thread's PR).
- Preview readiness audit landed: `.reports/preview-readiness.md` — all 10
  Preview requirement families marked done/partial/missing with evidence +
  ordered PR plan (PR-1..PR-8). Verdict: 6 done, 4 partial
  (provider-registry runtime, M3 advanced gaps, blocks content thin,
  changesets invalid-tree line).
- Archive reconciliation (owner addendum, same PR): full read-only pass over
  `docs/archive/2026-10-axis-transition/planning/*` + both README stubs +
  live-roadmap open items. ~30 archived items re-evidenced done on `main`
  (kern.json read path, renderer-first lookup, SearchBar /start, block
  closure install, receipt v2, elevation GAP 0, account-balance glyph, all
  12 MCP tools, mobile bundle, contracts package, DTCG import/export/
  validate, 19-GHSA reconciled to 0 open); superseded-by-Axis items marked
  (D19 naming, CLI-publish proposal, KERN-007/016); owner-gated items listed
  (NO-GO unsigned, HOLD, P7/product); axis-side items marked other-thread.
  Still-valid items folded into PR-2..PR-6. Archive untouched — live roadmap
  stays single source of truth.
- New findings for PR-3: `docs/releases.md` omits `@xoroh/kern-contracts`
  (7th public package, in `check:publish` fan-out) and the CI `pkg` matrix
  has no contracts leg.
- Quality sweep (owner mandate): QF-1 dangling `plan/README.md` law/tracker
  pointers in three live docs; QF-2 stale pre-cutover
  `docs/conventions/primitives.md` in the reading order; QF-3 duplicate
  `./native` export on `@xoroh/kern-native` (zero consumers); QF-4
  `packages/mcp` dir/name mismatch (67 referencing files — own PR);
  QF-5 contracts CI-matrix hole (folded into PR-3); QF-6 `designAudit`
  still static (folded into PR-6); QF-7 parity surface unverified since
  cutover (84/87 files, 66 same-named — folded into PR-6). Full section in
  the readiness report; fixes ride in PR-2/PR-3/PR-6/PR-8.
- Token/Axis split recorded: Kern tokens (canonical JSON + DTCG 2025.10)
  style Axis-consuming parts consumer-side (e.g. native `switch.tsx`:
  behavior from `@xoroh/axis`, all values from `ResolvedTheme`); shipped
  Axis dist contains zero `--*` strings (read-only scan, tarball untouched).
- `changeset status`: exactly ONE invalid-tree line left (mcp→cli);
  kern/kern-native→primitives lines resolved by the cutover.

## Done (this turn)
- PR #39 merged: SnapSheet uncontrolled detent via `useControllableState`
  (critic fix 1). Test note: React 19 does not flush inlined-Axis-dist state
  updates synchronously under native `.click()` outside `act()` — DOM
  assertions on uncontrolled updates need `fireEvent` (act-wrapped).
- PR #40 merged: Button toggle+href keeps `aria-pressed` (critic fix 2).

## In progress
- Merged: #39–#56.
- Open: #57 (this branch, P2 shape/spacing sweep).
- Next: structure sequence PRs (1) kern-m3 rename → (2) no-global-registration
  → (3) unified registry + --system → (4) split widget packages; all large,
  review-gated, unmerged.
- Queued after: usage P1/P2 correctness items; m3 tertiary/chrome +
  playground fidelity; structure/URL/Button-names/HCT phases
  (review-gated).

## Blockers / standing gates
- **Release hold**: no publish, no version bumps, no tags (all `0.0.0`).
  `RELEASE_CHANGESSETS` unset, `NPM_TOKEN` absent — correctly so.
- **Deletion PR**: `libs/kern-primitives` removal owned by the other thread;
  this track does not touch `libs/`, `vendor/axis/*`, or the axis repo.
- **Device validation**: no emulator/simulator/physical-device or
  screen-reader runs anywhere (RNTL + Expo-host export only).
- **Decisions needed from owner (PR-5)**: M3 advanced-part positions
  (grid/charts/tree/scheduler/RTE rent/build/never for Preview) and the
  Preview block list (3 shipped vs named additions).

## Owner decisions (standing, unchanged)
- Axis initial native foundation; extensible platform, no second
  implementation now (D-FOUNDATION-CHOICE). Cutover/deletion gated on Axis
  release-ready, NOT on publish.
