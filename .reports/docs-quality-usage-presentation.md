# Docs quality: usage-presentation review — completion report

Date: 2026-10-16. Branch: `docs/usage-presentation-quality` (worktree
`/tmp/opencode/kern-docs-quality`, from `main` @ `fbc0b879`). Closes the
P0/P1 items of `.reports/review-usage-presentation.md` under the owner ADRs
(011 install honesty, 013 depth bar, 018 one page per component, 020 no
backward compat). One PR, no merges, no publishes.

## What landed

- **Preview banner** — already on every page via `SiteLayout`
  (`preview-banner.tsx`, PR #42); verified rendered on the new family pages
  too. No change needed.
- **Install honesty, source path first (011)** — `InstallPicker` now leads
  with the checkout-runner vendor command (with `--platform native` on
  native tabs) and marks the manager tabs "Registry — available at release".
  Getting-started Steps 1/6, the homepage band, `use-cases`, and all three
  READMEs (`README.md`, `packages/kern`, `packages/kern-native`) lead with
  the source path and mark registry commands at-release. Theme import
  unified on `@xoroh/kern/theme` (the superset with `@source` enrollment);
  root + `kern` READMEs agree on `bun add @xoroh/kern`. CLI README stale
  refusal corrected: component `add` supports `--platform native` (only
  blocks are web-only) — implementation wins over prose.
- **Mobile Dialog `open` (was P0)** — already fixed (#43); same-class bugs
  fixed here: mobile `sheet` features/aria claimed a `visible` prop the
  implementation never had (takes `open`), and `drawer`/`popover`/
  `snackbar`/`tooltip`/`fab-menu` prose still described Dialog+Sheet as
  `visible`-based. Only `Snackbar` remains on `visible`/`onDismiss`, stated.
- **`rich-tooltip`** — web token table replaced with real sys token ids
  (`sys.color.*`, `sys.shape.corner-extra-small`, `sys.elevation.level2`);
  mobile page already native-dialect.
- **`design_audit` advisory-only** — MCP tool description + `use-cases`
  card + `designAudit()` payload (`advisoryOnly: true`); "Eleven tools" →
  twelve; use-cases commands checkout-prefixed.
- **Top 20 full pages + `/components/<system>/<name>` tabs (013/018)** —
  new route `routes/components/$system/$component.tsx` (validates `m3`,
  `?tab=` view state, part-slug 301s, per-platform `Undocumented`
  fallback, prev/next over the generated `FAMILIES` union). Old
  `$platform/$component` route deleted — no redirects per 020. All
  link sites + gates + generators moved to the system scheme; per-renderer
  `.md` (`/md/web|mobile/<slug>.md`) kept as the fetchable form of each
  tab. All 20 families × web+native now carry usage, token table, keyboard
  contract, screen-reader notes, FAQ, and API table (single-part families
  legitimately have no anatomy). Depth bar recorded in
  `docs/conventions/component-docs.md` and enforced by a new `check:docs`
  gate over `scripts/lib/top-families.mjs`.
- **Token-dialect legend** added to `guides.tsx` Step 1.

## Verification (this worktree)

`bun run build` ok; site `typecheck` ok; mobile `typecheck` ok;
`check:docs` chain fully green (incl. new gates, `usage 41→64`,
`faq 38→61`); `check:snippets`, `check:gallery`, MCP `test` (29 pass) +
`typecheck` + `check:publish` ok; root `lint`, `check:generated`(+census),
`check:elevation-parity` (against monorepo `.team`), `check:pack`,
`check:registry-paths`, `check:primitives`, `check:coverage`,
`check:publint`, `preflight:publish`, `icons:check`, `check:parity`,
`check:currency`, `check:consumption`, `check:dist(:types)`,
`check:contrast/kern/theme-matrix/layers/native-theme/xoroh-leaks/
workflow/ts-policy/stale-refs`, generated-files-in-sync — all green.
e2e: 26/26 pass on preview (new `/components/m3/*` URLs; old platform
URLs 404, part slugs 301). Live spot-check: family pages 200,
`?tab=native` renders native doc, galleries/hub intact.

## Deliberately out of scope (recorded, not started)

- D-BUTTON-NAMES (014) variant rename, per-component playgrounds,
  naming/IA writ, device proof — separate roadmap items.
- 16 orphan inventory exports stay reported-not-failing (thin-page
  follow-up needs per-part API attribution first; button page comment
  already rules LinkButton/FocusRing out of parts).
- Roadmap D-URLS prescribes redirects + platform-column props tables;
  ADRs 018/020 (later, owner-decided) say no redirects — followed the
  ADRs; unified props table deferred (tabs satisfy the task).
- Freshness `unrecorded (197)` and coverage-debt lines are reported, not
  failing — untouched by design (no invented review dates).
