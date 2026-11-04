# Maps visuals / Templates reference (WP4, D951)

The complete WP4 surface: `MapMarker` + `MapPanel` (marker/panel VISUALS +
data contracts only) and the `DashboardPage`, `OnboardingWizard`,
`BillingPage` (skeleton-only) and `MarketingSections` templates — web
(`@xoroh/kern`, marketing sections under `@xoroh/kern/start`) + native
(`@xoroh/kern-native`) twins under one contract.

M3 links: cards (https://m3.material.io/components/cards), lists
(https://m3.material.io/components/lists/overview), chips
(https://m3.material.io/components/chips/overview), tabs
(https://m3.material.io/components/tabs), dialogs
(https://m3.material.io/components/dialogs), bottom sheets
(https://m3.material.io/components/bottom-sheets), type
(https://m3.material.io/styles/typography/overview). There is no M3 map,
dashboard, onboarding, billing or marketing component — markers follow
badge/chip tone roles, panels follow cards, templates are page patterns on
M3 type/shape/color roles. Expressive deltas: none adopted (utility motion
only, per Kern).

Source attributions (OSI only, per-component): Paper Card/List/Chip/Badge
behavior (MIT,
https://github.com/callstack/react-native-paper/blob/main/LICENSE.md);
material-tailwind dashboard/section composition ONLY, never M2 visuals
(MIT,
https://github.com/creativetimofficial/material-tailwind/blob/main/LICENSE.md);
material-web elevation/token roles (Apache-2.0,
https://github.com/material-components/material-web/blob/main/LICENSE);
Flutter M3 type/shape values for marketing sections (BSD-3-Clause,
https://github.com/flutter/flutter/blob/master/LICENSE).

## 1. D925 seams (binding)

- **Maps no-duplication seam.** The map ENGINE stays the one platform
  system (`libs/maps` + `libs/explore` — canvas/layers two-slot contract,
  tile renderer, camera, clustering, gestures). Kern owns marker/panel
  VISUALS + the `MapMarkerDatum` visual-side contract only: `MapMarker` is
  positioned by the host engine (`style`/`className`), `MapPanel` is
  anchored by the host. No engine, map-SDK dependency, tile, camera or
  gesture code may enter these files — asserted in their module comments.
- **BillingPage gate (MS-012).** No Stage 2/5 verification reports exist in
  lead `reports/` (checked 2026-11-04) — see
  `docs/inventory-4-design-baseline.md` §(b). `BillingPage` renders
  plan/invoice DISPLAY SLOTS ONLY: no pay/top-up/payout action, no payment
  logic. The invoice grid uses the `ledger` preset (no selection, no row
  actions) so a payment cannot start by construction. Actions wait for the
  owning lane's verification.
- **Onboarding evidence (MS-018).** `OnboardingWizard` + the
  `OnboardingServiceStep` preset (`KernPicker` `plan` mode over the injected
  D924 service catalog) close the "no service step" gap in the inventory
  `OnboardingWizardOrchestrator` flow — as a composition, never
  Xoroh-specific logic.
- **Guest marker (A-003 / MS-023).** The `guest` marker kind paints the
  consented live position: dashed consent ring + consent line while
  sharing, neutral tone + paused dot on expiry. Consent state, expiry logic
  and streaming stay host-owned; the visual only paints given props.

## 2. Variant models

**MapMarker `kind`** — `pin` (default disc + dot) · `vehicle`/`person`
(host icon) · `guest` (A-003 consent treatment) · `stop` (label chip).
`tone`: all 7 registry tones via `statusToneClassNames` (web) /
`statusToneSolid` (native). `selected`: primary ring. `live`: static halo
ring (no decorative motion). `label`: short chip. `consentLabel` +
`consentExpired`: guest only.

**MapPanel `position`** — `floating` (default card) · `docked-top` ·
`docked-bottom` (edge-sheet shape only; the host anchors). Slots: `media`,
`meta` (host `StatusPill`), title (required, names the surface),
`description`, `actions`, `footer`, `onClose` (×; allowlisted action).

**DashboardPage** — no variants: stat-card grid (`stats`, link cards via
`href`, deltas are host `StatusPill`s) + activity (`List` two-line,
`onRowPress`) + queue (`queueTable: DataTableProps` passthrough —
host owns columns/rows/sort/page/selection) + `children` display slot.
`loading` → skeleton list; all-sections-empty → page `EmptyState`.

**OnboardingWizard `variant`** — `page` (inline, max-w-2xl) · `modal`
(same strip + panel + footer inside `KernOverlay`, no second scaffold).
Step state is the canonical `value`/`defaultValue`/`onValueChange` trio;
`onBack`/`onComplete`/`onCancel` are allowlisted actions. Step bodies ride
the tab items' `content` so every tab keeps a resolving `aria-controls`
target. `OnboardingServiceStep`: `services` catalog + canonical selection
trio → `KernPicker` `plan` mode.

**BillingPage** — no variants, no action props (gate). Slots: `plan`
(display nodes), `invoiceColumns`/`invoiceRows` (ledger grid), `children`
display slots. `loading` → skeletons; no invoices → section `EmptyState`.

**MarketingSections** — `FeatureGrid` (cards), `PricingTable` (outlined
highlight + badge pill, `onSelect` per plan), `TestimonialList` (figure
cards), `CtaBanner` (primary container), `MarketingSections` composition
with a `hero` slot for the start `Hero` (never re-implemented). Sections
render only when given data.

## 3. Props tables

| Component | Key props |
|---|---|
| `MapMarker` | `kind` pin\|vehicle\|person\|guest\|stop · `tone` (7) · `icon` (KernIcon node, default dot) · `label` · `selected` · `live` · `consentLabel` + `consentExpired` (guest) |
| `MapPanel` | `title` (required) · `description` · `media` · `meta` · `actions` · `footer` · `onClose` · `position` floating\|docked-top\|docked-bottom |
| `DashboardPage` | `title` · `description` · `actions` · `stats[]` (id/label/value/delta/tone/icon/description/href) · `statsLabel` · `activityRows` · `activityLabel` · `onRowPress` · `queueTable` (DataTableProps) · `queueLabel` · `loading` · `emptyState` · `children` |
| `OnboardingWizard` | `steps[]` (id/title/description/content) · `value`/`defaultValue`/`onValueChange` · `variant` page\|modal · `open`/`defaultOpen`/`onOpenChange` + `onClose` (modal) · `onBack`/`onComplete`/`onCancel` · `label` · `backLabel`/`continueLabel`/`finishLabel`/`cancelLabel` |
| `OnboardingServiceStep` | `services` (ServiceCatalogEntry[]) · `label` · `placeholder` · `value`/`defaultValue`/`onValueChange` · `description` |
| `BillingPage` | `title` · `description` · `plan` (slot) · `planLabel` · `invoiceColumns`/`invoiceRows` · `invoicesLabel` · `invoicesEmpty` · `loading` · `children` |
| `FeatureGrid` | `title` · `description` · `items[]` (id/title/description/icon) |
| `PricingTable` | `title` · `description` · `plans[]` (id/name/price/blurb/features/highlighted/badge) · `onSelect` · `selectLabel` |
| `TestimonialList` | `title` · `items[]` (id/quote/author/role) |
| `CtaBanner` | `title` (required) · `description` · `actions` |
| `MarketingSections` | `hero` (start Hero slot) · `features`/`featuresTitle` · `plans`/`pricingTitle`/`onSelect` · `testimonials`/`testimonialsTitle` · `cta` |

Native twins share the contracts; text props are strings on N
(`title: string`, stat `value: string`, plan `price: string`), stats
activate through `onSelect` (stat id, allowlisted) since N has no link
rows, and metrics are dp via `useKernScheme()`.

## 4. Do / don't

- DO position markers/panels from the host engine; DON'T measure a map in
  Kern (the seam).
- DO pass plan/invoice/stat/queue content as data; DON'T add payment,
  top-up or payout actions to `BillingPage` (MS-012 gate).
- DO route wizard step bodies through tab `content`; DON'T render a second
  panel beside the strip (axe `aria-controls` + D925).
- DO compose the start `Hero` into the hero slot; DON'T rebuild a hero.
- DO use registry tones (`tone="warning"`, never amber/hex).

## 5. Parity notes

- Marker glyphs: web CSS rings (outline/ring utilities) vs N dp borders
  (`statusToneSolid` fills); guest dashed ring is `outline-dashed` (W) vs
  `borderStyle: "dashed"` (N).
- Wizard keyboard nav (roving tabindex, arrows/Home/End) is W-only;
  N uses press + screen-reader tab roles (same `KernTabs` split as CL-009).
- Overlay modal: W centered dialog, N centered modal (same `KernOverlay`
  split as CL-015). Sheet snap physics stay N-side.
- `DataTable` queues: W full grid, N list-cards fallback under the same
  adapters (CL-007 split).
- Dark mode: token-driven on both renderers; per-component light+dark
  showcase examples render through the themed stage (global WP7 visual
  review owns the sign-off).
- Showcase: web examples under `apps/site/src/showcase/examples/`
  (`map-marker`, `map-panel`, `dashboard-page`, `onboarding-wizard`,
  `billing-page`, `marketing-sections`) + `registry.ts` entries. Native
  twins share export names and are covered by `*.rntest` suites (native-only
  registry entries are for native-only exports). Central regen
  (`apps/site/src/generated/`, contracts, MCP manifest, llms.txt) is
  coordinator-owned.
- R2 lexicon: WP4 introduces NO new state channel — step/overlay state
  uses the canonical trios, all actions (`onClose`, `onSelect`,
  `onRowPress`, `onBack`, `onComplete`, `onCancel`) are allowlisted. No
  `callback-lexicon.test.ts` registration was needed.
