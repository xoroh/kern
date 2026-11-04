# WP7 visual review + docs checklist sign-off (WP7a, D951)

Date: 2026-11-04. Lane: WP7a (docs + site only). Components covered: every
D951 target — WP1a (List / DataTable / SearchView / FilterBar /
ListWithSearchAndFilters / EmptySearch / CsvExportButton), WP1b (KernTabs /
StatusPill + tone registry / EmptyState / KernLoading), WP2a (KernOverlay /
KernNavigation / KernPicker + ReasonPicker), WP2b (KernSettings /
Contact trio + directory / KernComposer + InviteAccept + ShareLinkRow),
WP4 (MapMarker / MapPanel / DashboardPage / OnboardingWizard / BillingPage /
MarketingSections).

## 1. Stories-infra decision (binding §4 "stories light+dark")

**Decision: no Storybook; the showcase Example tier IS the stories layer.**
Deferred with reason, not omitted:

- Repo has zero `.stories.*`, no `.storybook`, no storybook dependency.
  Adding the full Storybook harness inside a docs+site lane would duplicate
  the Example tier (`example.tsx`: "Deliberately NOT a screenshot… the
  `render` callback returns the real component from the package"), which
  already gives one live, copyable, permalinked story per example with
  Preview/Code tabs, often multiple stories per component (this lane: 13
  new stories across 7 exports; total 136 after this lane).
- Dark-mode coverage (the substance of "stories light+dark") is provided by
  the themed stage: every example renders only package components with
  `--sys-*` token roles, the site chrome flips the `dark` class, and this
  review captures each new story in light AND dark (§3). No example adds
  color of its own — verified: `grep -E '#[0-9a-f]{3,8}|rgba?\('` over the
  6 new example files + registry diff returns zero hits (new examples carry
  no `sys-` classes either; the components own the tokens).
- Unit tests + axe-level assertions already live beside each component
  (`*.test.tsx` / `*-a11y` suites, committed by the design lanes — not
  re-verified here per instructions).
- Follow-up (coordinator): if Faroeq wants isolated per-story URLs or
  interaction tests, add Storybook or per-example routes then; do not bolt
  it on inside this lane.

## 2. Method

- Temporary route `/wp7-preview` (deleted after review — not in this
  change) rendering all 24 D951 example groups via `ExampleList`.
- Dev server on :3117 (started/stopped by this lane; §5 proof).
- Headless Chromium (Playwright 1.64.1, repo-local browsers) — the desktop
  browser was disconnected, so no interactive pass. Two contexts: default
  (light) and `colorScheme: dark` (needed: the theme provider resolves
  `dark` from the OS preference at load; setting the class post-load alone
  does not stick).
- Element screenshots per new story (13), open-proofs for modal /
  tabbed-dialog / picker (trigger click → dialog screenshot → Escape),
  spot screenshots for 16 pre-existing stories, full-page light capture.
- Fences: all 13 new fences compile under the `check-example-code` tsconfig
  (scoped run — the full gate cannot run in this env, §5).

## 3. Results

**New stories (this lane) — all render light+dark, no anomalies:**

| Story | Light | Dark | Notes |
|---|---|---|---|
| kern-tabs-primary | ok | ok | 3px primary indicator, primary active text, panel mounts |
| kern-tabs-secondary-vertical | ok | — | 2px indicator + on-surface active; vertical pill fill |
| status-pill-tones (7) | ok | ok | container roles flip correctly in dark |
| status-pill-density-emphasis | ok | — | compact 24px + solid counts |
| kern-loading-kinds (4) | ok | ok | skeletons/spinner/loop/shimmer adapt |
| kern-loading-progress-value | ok | — | determinate 0.6 bar |
| kern-overlay-modal (+alert) | ok, opens, Esc closes | — | title/desc/×/footer; 2-action alert |
| kern-overlay-tabbed-dialog | ok, opens | — | strip under title, panel resolves |
| kern-navigation-bar | ok | ok | active pill, 3 destinations |
| kern-navigation-sidebar-pane | ok | — | header/section/active/footer slots |
| kern-picker-option-list | ok, opens, Esc closes | ok (triggers) | default styled trigger, placeholder ▾ |
| kern-picker-plan | ok | — | catalog → options |
| reason-picker-cancel | ok | — | adapter-only rows |

**Pre-existing stories (other lanes) — spot-checked, all render:**
list-variants, data-table-bookings, search-view-palette, kern-settings-rows
(all four row controls), kern-contact-trio, map-marker-kinds (5 kinds +
label chip), billing-page, dashboard-page, filter-bar-facets, kern-composer
(full slot composition), marketing-sections, onboarding-wizard, map-panel,
empty-search, csv-export-button, list-with-search-and-filters. Full-page
capture shows every group present; zero client console errors attributable
to examples (one React hydration-mismatch warning on first load — the
theme init script vs SSR, pre-existing site behavior, not example-caused).

**Fixed in this lane (trivial docs/site):** overlay example triggers were
bare `<button>`s rendering unstyled in the stage — now `Button
variant="tonal"` like the dialog convention (fences re-verified compiling).

## 4. Component issues REPORTED (not fixed — lane boundary)

1. **[Picker hover unreadable — WP2a-owned, with evidence.]**
   `packages/kern/src/components/kern-picker.tsx:215` (`OptionList` rows):
   `hover:opacity-[var(--sys-state-hover)]` sets ELEMENT opacity to 8%
   (`--sys-state-hover: 8%`, `styles.css:440`), so a hovered option fades
   to near-invisible white-on-white (screenshot `picker-option-hover.png`:
   "Ada Lovelace" unreadable; resting state fine). The repo's own button
   law already bans this exact pattern (`button.test.tsx:83-90`,
   `button-family-m3.test.tsx:119,326`, `checkbox.test.tsx:45`:
   "Whole-button hover:opacity dims the label too — that was the bug").
   `KernTabs` shows the correct pattern (opacity on a `::before` state
   layer, text untouched). Same suspect pattern on text-free × buttons
   (`kern-overlay.tsx:177`, `kern-maps.tsx:309`) and `menu-family.tsx:64`
   — icon-only × dimming is cosmetic, the picker text rows are the real
   defect. Recommended: state-layer treatment per the tabs precedent.
2. **[DataTable status cells still neutral — WP1a/WP1b seam.]** `column.kind
   === "status"` renders neutral assist `Chip`s (`data-table.tsx:363-364`),
   not registry tones. Recorded in `docs/tabs-status-loading-reference.md`
   §5 as a component-side follow-up (converge onto `tone` / `StatusPill
   compact`); confirmed visually in `spot-data-table-bookings.png`.
3. **[InviteAccept showcase opens on page load.]** Pre-existing WP2b
   showcase choice (`kern-composer` example, `defaultOpen`) — a modal
   covering the page on load, trapping focus until Escape. Usable for
   review, hostile as docs; suggest trigger-closed like the overlay
   stories. Not changed (other lane's example).
4. **[apps/mobile has no sections for the new unified components.]** The
   native gallery (`components-screen.tsx`) still shows `SecondaryTabs`,
   `Tabs`, `BottomSheetPicker` — no `KernTabs`/`KernPicker`/`KernOverlay`/
   `KernNavigation`/`KernLoading`/`StatusPill` sections. Twins are covered
   by `*.rntest`; wiring gallery sections without emulator verification
   would be unverified code — left as a tracked gap for the coordinator.

## 5. Verification (quoted, scoped only)

- `bunx biome check` on all touched files: clean (3 auto-fixes applied to
  import formatting, re-checked clean).
- `bun apps/site/scripts/check-examples.mjs` → `check-examples: ok —
  136 example(s), ids unique, code non-blank` (was 123 before this lane).
- Scoped fence compile (same tsconfig as `check-example-code`, 13 new
  fences only) → `scoped fence check: ok — 13 new fence(s) compile`.
  Full `check-example-code.mjs` cannot run in this env: it imports the
  native registry, and bun fails parsing `react-native@0.87.1`
  (`index.js` Flow `typeof` syntax) — pre-existing, unrelated to this
  lane (no native files touched).
- `@xoroh/kern` scoped rebuild (site resolves the workspace `dist`, which
  predated D951): `bun run --filter @xoroh/kern build` → exit 0. Full
  package suite NOT run (per instructions).
- Site typecheck: `bunx tsc --noEmit` (apps/site) → exit 0, no output;
  `check:dist:types` → `ok — 6 consumed package(s)`. One transient
  `testimonial-list.ts not found` failure mid-lane was a sibling lane
  mid-write (file appeared at 06:45, same minute); clean on re-run.
- Server: started `bun run dev --port 3117`, reviewed, stopped; port freed
  (proof in handoff: `curl` → `000` after stop). No dev servers left
  running. No commits, no publish/tag/release, no `generate:*`.

## 6. i18n audit (report only — no refactors, per instructions)

Every user-facing default below is EN-hardcoded but overridable via props
(same convention on both renderers; N uses `accessibilityLabel` /
`label` strings). No ICU/pluralization anywhere; locale-driven catalogs
do not exist in Kern — host-owned. Full list:

- KernTabs: `label = "Sections"`.
- KernLoading: `label = "Loading"`.
- KernOverlay: fallback surface name `"Overlay"` (node titles), ×
  `aria-label="Close"`, tab strip `${surfaceLabel} sections`.
- KernNavigation: `label = "Primary"`.
- KernPicker: `placeholder = "Select"` (+ date/time/country per-mode
  labels from sub-components).
- KernSettings: `label = "Settings"`, `selectPlaceholder = "Select"`.
- KernContact: `fallbackTitle "Contacts"`, `searchLabel`,
  `searchPlaceholder "Search"`, `emptyTitle/emptyDescription`.
- KernComposer: mode bar / canned / knowledge / message / send /
  schedule / draft / OOO labels, InviteAccept + ShareLinkRow labels
  (full list in §6 source grep — ~20 strings, all prop-overridable).
- WP1a: List `"No items"`, DataTable select/page labels, FilterBar
  `"All filters"`/`"Filters"`, SearchView `"Search"` +
  `"Search or jump to…"`, EmptySearch `clearLabel`, CsvExportButton
  `"Export CSV"`.
- WP4: DashboardPage section labels + empty copy, OnboardingWizard
  step/back/continue/finish/cancel labels, BillingPage `"Billing"` +
  section labels, MapPanel/MapMarker close labels.
- EmptyState `title` accepts nodes but only strings satisfy the type
  today (recorded in both reference docs) — i18n-relevant: rich-text
  titles must stay strings until the `Omit<"title">` widening lands.

Pattern recommendation (not implemented): centralize the ~60 default
strings behind one catalog module so hosts can swap locale in one place;
today each default is a prop default, which composes but does not scale
to locale switching.
