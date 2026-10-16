# Axis extraction inventory (Phase 0)

Date: 2026-10-16. Method: `import{…}from` regex over `packages/*/src`,
`libs`, `apps/*/src` (excluding `node_modules`, `dist`, `*.test.*`,
`*.rntest.*`), plus manifest/lockfile/script/CI/docs scans and full reads
of all 16 modules. No runtime source moved. Counts below are exact
specifier matches; type-only consumption uses inline `type` qualifiers
inside runtime imports (zero standalone `import type` statements).

## Counts and reconciliation

- Barrel: 16 modules, 81 public exports (per `check:consumption` against
  built `.d.ts`; 70 adopted, 11 not-yet-adopted across 2 `adoption.json`
  units). Prior "40 raw / ~30 real" figures reconcile exactly: **30
  runtime importer files (3 web + 27 native)** + site docs mirror, snippet
  fixtures, generated rows, and symbol-name-only matches.
- Dynamic `import()`/`require()` of the package: **none** (verified).
- History: 1 commit under `libs/` (`65eadac1` move from `packages/`);
  per-file history before the move lives under the old path.
- Manifests: `packages/kern` + `packages/kern-native` depend on
  `"@xoroh/kern-primitives": "^0.0.0"`; `apps/site` uses `workspace:*`;
  root `package.json` references are script filters only. `dist/` is
  gitignored and uncommitted (4 local files). `bun.lock` carries the
  `workspace:libs/kern-primitives` entry plus `^0.0.0` edges.
- Non-source references: `scripts/check-{consumption,primitives,layers,
  parity,coverage,pack}.mjs`, `preflight-publish.mjs`,
  `generate-inventory-freeze.mjs`, `verify-consumer.mjs`,
  `apps/site/scripts/{check-snippets,check-primitives-docs}.mjs`
  (note: `check-snippets.mjs:160-170` still points at stale
  `packages/kern-primitives/dist` — fix in Phase 4);
  `ci.yml:241,247,276` (parity/consumption read built dist), `deploy.yml:30`
  (comment); `parity/contract.ts`: zero hits; e2e: zero hits;
  `packages/mcp/src`: zero hits (no MCP dependency);
  CLI scaffold `file:` override at `packages/kern-cli/src/init.ts:135,144`
  (+ `init.test.ts:72` asserts `file:` prefix) — **zero symbol imports**;
  site primitives docs mirror (`domains/primitives/`, routes, llms
  module index) are string/snippet references, not runtime deps.

## Per-module verdicts

| Module | Importers (runtime src) | Tests | Verdict + rationale + required proof |
|---|---|---|---|
| `useControllableState` (`useControllableState`, `StateAction`∅) | 18 files: `kern/.../menu-family.tsx:1`, 17 native (`autocomplete, checkbox, chip, collapsible, combobox, extended-fab, layouts, pagination, radio-group, search, select, slider, switch, tabs, toggle, tooltip, web-parity, overlay-surfaces, time-picker, icon-button` — 17 native + 1 web; `StateAction` zero-consumer) | 15 | **MOVE as-is.** Pure React. Proof: existing suite + RN render test per top consumer. |
| `selection` (`useSelection` + 6 helpers∅) | `useSelection`: 4 native (`accordion, checkbox-group, toggle-group, web-parity`); pure helpers (`isSelected…toggleSelection`, all 4 types): zero | 27 | **MOVE as-is.** Pure model. Helpers move with the module (dead-code review in AX0; `adoption.json` does not list them — decide adopt-with-consumer vs prune). Proof: RNTL multi-select flows. |
| `time` (6 fns + 2 types) | `native/.../time-picker.tsx:2-9` only (web time-picker defines own locals) | 14 | **MOVE as-is.** Pure arithmetic. Proof: existing suite. |
| `slot` (`mergeSlotProps` + `SlotProps`; `composeEventHandlers`∅) | `mergeSlotProps`: `kern/.../presentation.tsx:26`, `native/.../button.tsx:6, icon-button.tsx:2, presentation.tsx:29`. Note `:85` `className` concat is web-only (inert on RN) | 7 | **MOVE as-is** (drop or guard the `className` key for native). Proof: prop-merge tests on both renderers. |
| `overlayModality` (5 symbols) | `native/.../overlay-surfaces.tsx:2-7` only; **no web consumer** (web uses Base UI) | 9 | **MOVE as-is.** Pure stack registry. Proof: modality-order tests + RN Modal integration test in Axis. |
| `a11y` (helpers + style) | `createIdScope`/`resolveDir`: both `presentation.tsx`; `VISUALLY_HIDDEN_STYLE`: web `presentation.tsx:36,78` only (native forked its own: absolute/1×1/`opacity:0`, "RN has no `clip`") | 4 | **SPLIT.** Helpers MOVE; `VISUALLY_HIDDEN_STYLE` EXCLUDED (CSS `clip`, no native meaning). Proof: dir/id unit tests. |
| `roving` (`useRovingModel` + 5∅) | `useRovingModel`: `native/.../carousel.tsx:132`, `time-picker.tsx:121,263` | 20 | **MOVE model + REWRITE bindings.** Arrow-key/one-tab-stop model documented web-scoped; native maps to accessibility focus. Proof: carousel/time-picker RNTL traversal tests. |
| `focusTrap` (`resolveAutofocus`, `nextTrapIndex`(web only) + model∅) | `resolveAutofocus`: both presentations; `nextTrapIndex`: web only | 10 | **MOVE model + REWRITE bindings.** Event-descriptor design (no `focus()` calls) transfers; Tab-loop → modal containment. `createFocusTrapModel` prune-or-adopt (zero consumers). Proof: containment tests on RN Modal. |
| `press` (`usePress`, `isPressActivationKey`(web only) + model∅) | `usePress`: both presentations (RN via `onPressIn/Out`; web via `onKeyDown`); `isPressActivationKey`: web only (`sheet-family`, `presentation`) | 6 | **MOVE core + REWRITE activation.** Enter/Space predicate is web-only. `createPressModel` prune-or-adopt. Proof: Pressable gesture-state tests; keyboard path stays Kern-web. |
| `presence` (`usePresence`(web) / `createPresenceModel`(native) + 3∅) | split by renderer (native hand-rolls subscribe, not the hook) | 13 | **MOVE model + REWRITE animation wiring** (`animationend` vs Animated). Proof: mount/unmount lifecycle tests per renderer. |
| `dismissPolicy` / `dismissWiring` | `createDismissPolicy`: `kern/.../sheet-family.tsx:4`, `native/.../sheet-surface.tsx:2`; wiring fns: both presentations + sheet surfaces. `dismissTriggersFor`, most types: zero | 12 + 7 | **MOVE policy + REWRITE trigger sources.** `escape` documented as hardware-back; `focus-out` branch has no RN meaning; `system-back` unbound on web. Proof: back-button/scrim/swipe dismissal tests. |
| `portal` (`createPortalRegistry`, `resolvePortalTarget` + 2 types∅) | both presentations | 7 | **MOVE + REWRITE host binding.** Registry is pure Map+sequence; default `"kern-portal-root"` target is DOM-id vocabulary; hosts already per-renderer. Proof: registry unit + per-host render tests. |
| `positioning` (per-symbol split) | `resolveFloatingRect`: both presentations (native via `resolvePopoverOrigin`); `Placement`: both presentations; `clampRectToViewport`, `resolveFloatingOrigin`, `PositioningOptions`, `Rect`: **zero** | 7 | **SPLIT.** `resolveFloatingRect` (+`Placement`) MOVES (unit-agnostic math, proven RN consumer). Viewport-clamp + origin EXCLUDED unless AX0 proves a native caller (safe-area semantics differ). Proof: dp-space rect tests; native measurement (`onLayout`/`measure`) stays per-consumer. |
| `collection` (7 symbols) | zero (docs strings only; `adoption.json` not-yet-adopted: "no audit that any native menu/tree holds real collection state") | 30 | **GATED — audit executed 2026-10-16, gate NOT satisfied, stays gated.** Native menu/tree audit: `menu.tsx`/`menubar.tsx` track only open state (`useState`); `combobox.tsx` tracks value/open/query with no focus model; `autocomplete.tsx` holds a local highlight `activeIndex` (`useState`), not keyed focus/selection/typeahead; web has no collection usage (Base UI owns it). No native component holds real collection state, so there is no adopt-with-consumer candidate; transferring would grow the module count without a consumer. Next: adopt alongside a native menu/combobox collection rewrite (Phase 4), not before. |
| `mergeRefs` (4 symbols) | zero src (only site `examples.ts:89`); `adoption.json` not-yet-adopted ("duplication small, behavior not wrong") | 10 | **GATED — duplication measured 2026-10-16, gate NOT satisfied, stays gated.** Measurement: exactly one `forwardRef` in all of `packages/kern` (`extended-fab.tsx`), zero innerRef/outerRef forwarding, zero callback-ref merges of two refs into one (the single array-fill in native `input-otp.tsx:197-199` is index assignment, not ref composition and not replaceable by `mergeRefs`); `slot`/render-prop parts merge no refs. There is no replaceable duplication and no consumer, so transfer is refused. Next: move only with a `render`-interop consumer that demonstrably merges an internal ref with a caller ref. |
| `useControllableState` | see row 1 | — | — |

∅ = zero runtime importers (excluding tests/docs strings). Full zero-consumer
list (~40 symbols): `IdScope`; all 7 `collection/*`;
`dismissTriggersFor`, `DismissPolicy`, `DismissPolicyOptions`,
`DismissTriggers`; `createFocusTrapModel`, `FocusTrapModel`, `TrapMove`;
all 4 `mergeRefs/*`; `PortalEntry`, `PortalRegistry`;
`clampRectToViewport`, `resolveFloatingOrigin`, `PositioningOptions`,
`Rect`; `nextPresenceState`, `PresenceModel`, `PresenceState`;
`createPressModel`, `PressModel`, `PressPhase`; `createRovingModel`,
`RovingItem`, `RovingModel`, `RovingOptions`, `RovingOrientation`;
`isSelected`, `normalizeSelection`, `Selection`, `SelectionKey`,
`SelectionMode`, `toggleSelection`; `composeEventHandlers`; `StateAction`.
Only 11 are covered by `adoption.json`; the rest need an AX0
adopt-with-consumer or prune decision each — unlisted-but-unconsumed must
not transfer silently.

## AX0 dispositions (resolved Phase 1, 2026-10-16 — see `axis-contract.md`)

Rule: types of adopted APIs transfer at zero cost; factories serving only
their own hook transfer as *internal* unless external need is proven.

- ADOPT public: `dismissTriggersFor` (paired constructor the policy
  requires), `nextPresenceState`, selection pure helpers,
  `composeEventHandlers`, `resolveFloatingRect` + positioning types, all
  hook-contract types.
- TRANSFER AS INTERNAL: `createPressModel` (serves `usePress`),
  `createPresenceModel` (serves `usePresence`), `createRovingModel`
  (serves hook + collection composition), `createFocusTrapModel`
  (serves nothing — promote only with a Phase 3 RN trap-integration
  test, else prune).
- GATE (audits executed 2026-10-16, both still gated — see rows above):
  `collection` (no native collection-state holder found),
  `mergeRefs` (zero replaceable duplication found).
- EXCLUDE (reaffirmed): `VISUALLY_HIDDEN_STYLE`, `clampRectToViewport`,
  `resolveFloatingOrigin`.
- Portal: registry + target-resolution owned by Axis, host per renderer,
  DUAL-PATH retained; cited "D12" has no surviving record (P2 docs debt).
- DTCG: Axis takes caller-provided plain values; `ResolvedTheme`
  (`{ color, shape, comp? }`) resolved consumer-side; no token imports.
- `changeset status`: kern/native lines self-resolve at extraction
  (depend on published `@xoroh/axis`); mcp→cli recommends optional-peer
  conversion (dynamic import + fallback already exist) — Phase 5 gate.

Former open items below are superseded by the above; kept for history:

1. Per-symbol adopt/prune for all ~40 zero-consumer symbols.
2. `portal` native host-binding design; `press` activation model;
   `focusTrap` containment model; DTCG native-value input shape.
3. `positioning` clamp/origin: prove a native caller or confirm exclusion.
4. `collection`/`mergeRefs` gates per above.
5. `check-snippets.mjs:160-170` stale dist path (fix with Phase 4 retarget).
6. `slot` `className` key disposition for native.
