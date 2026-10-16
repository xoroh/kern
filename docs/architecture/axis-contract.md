# Axis public contract (Phase 1 design — DRAFT, owner approval required)

Status: proposed. Transcribed 2026-10-16 from the Phase 1 AX0 report into
`docs/architecture/`. Implements Phase 1 of
`kern-axis-migration-and-roadmap.md`; does not authorize extraction.
Package creation additionally requires D-NAME confirmation; runtime
extraction additionally requires the D-NOGO gate.

## 1. Package identity and structure

- Single package `@xoroh/axis` (D-SPLIT: no split evidence). Placeholder
  `@xoroh/axis-core` retired at extraction.
- One public entry (`.`), ESM + CommonJS + `.d.ts`, `react-native` export
  condition (mirroring `@xoroh/kern-native`).
- Peers: `react ^19`, `react-native >=0.86 <0.89`. Proven pins:
  host RN 0.86.3 / React 19.2.3 (`apps/mobile`), devDep RN 0.87.1;
  Phase 3 additionally verifies 0.88 inside the peer range.
- Expo SDK 57 is the proof host, not an architectural owner; Axis ships
  no Expo dependency.
- No runtime dependencies beyond justification; never `react-dom`,
  DOM/CSS/browser APIs, `@xoroh/kern-*`, or token reads.

## 2. Module organization

One submodule family per behavior (barrel re-exports the public surface):

| Family | Public API | Notes |
|---|---|---|
| `controllable-state` | `useControllableState`, `StateAction` | as-is |
| `press` | `usePress`, `isPressActivationKey`, `PressPhase` (+`PressModel` type) | `createPressModel` internal until an imperative driver proves external need |
| `presence` | `usePresence`, `nextPresenceState`, `PresenceModel`, `PresenceState` | `createPresenceModel` internal (serves the hook) |
| `dismiss` | `createDismissPolicy`, `dismissTriggersFor`, `dismissBranchesFor`, `shouldDismissOn` + `Dismiss*` types | policy/trigger constructor pair transfers together |
| `overlay-modality` | `createOverlayModality`, `useOverlayModality`, `useOverlayRegistration` + types | pure stack; RN binds `Modal` |
| `portal-registry` | `createPortalRegistry`, `resolvePortalTarget` + types | registry owned by Axis; host per renderer; DUAL-PATH (see §4) |
| `focus` | `resolveAutofocus`, `nextTrapIndex`, `AutofocusEvent`, `TrapMove` | `createFocusTrapModel` internal; promote only with a Phase 3 RN trap-integration test, else prune |
| `roving` | `useRovingModel` + `Roving*` types | `createRovingModel` public-as-composition (collection + hook need it) |
| `selection` | `useSelection`, `isSelected`, `normalizeSelection`, `toggleSelection` + types | pure helpers complete the contract |
| `slot` | `mergeSlotProps`, `composeEventHandlers`, `SlotProps` | drop/guard web-only `className` key for native |
| `time` | all six fns + two types | pure |
| `a11y-helpers` | `createIdScope`, `resolveDir`, `A11yDir`, `IdScope` | `VISUALLY_HIDDEN_STYLE` excluded (no native meaning) |
| `positioning` | `resolveFloatingRect`, `Placement`, `PositioningOptions`, `Rect` | clamp/origin excluded unless AX0-proven caller appears |
| `collection`, `mergeRefs` | gated (native menu/tree audit; duplication measurement) | transfer only through the gate |

## 3. Native behavior contracts

- **Press**: `begin`/`end`/`cancel` + `pressed` bit; native binds
  `onPressIn`/`onPressOut`; Enter/Space predicate stays Kern-web.
  Mount-time options caveat (`press.ts:88-92`) is contract text.
- **Focus**: index-arithmetic core over renderer-supplied stop lists;
  autofocus returns event descriptors, never calls `focus()`;
  containment via RN modal semantics + explicit first-focus management.
- **Presence**: `mounted → exiting → unmounted`; renderer reports `open`
  and calls `finishExit()` from its own animation-done signal
  (`animationend` vs Animated callback).
- **Dismissal**: policy (`canDismiss`, `showClose`, `shouldDismiss`) is
  shared; triggers per renderer (hardware back, scrim press, swipe —
  never bare Escape semantics); `focus-out` has no RN meaning.
- **Portal/overlay lifecycle**: mount/unmount registry with deterministic
  order; unmounting removes exactly one registration; unknown ids are
  no-ops. DUAL-PATH: borrowed hosts (Base UI Portal, RN Modal) stay until
  the owned registry proves itself per surface.
- **Accessibility**: RN `accessibility*` roles/states/actions,
  accessibility-focus traversal, no tab-order assumptions.
- **Errors**: no-op on unknown ids/closed surfaces; no throws for
  renderer-absence. No device/SR claims (D-DEVICE phase).

## 4. DTCG / native-value boundary

Axis takes caller-provided plain values (dp numbers, color strings) and
documents their shapes structurally. It never imports token modules or
types. Kern Native resolves `ResolvedTheme` (`{ color, shape, comp? }`)
via `resolveThemeDetails` and passes values down. DTCG interchange stays
Kern-owned; a zero-`--*` scan gates Axis source and pack output.

## 5. Consumer migration (Kern side, Phase 4)

kern-native presentation/sheet/carousel/time-picker and web
presentation/sheet/menu adopt module-by-module over green gates;
`check:consumption`/`check:parity` retargeted at `@xoroh/axis`;
packed-tarball consumer proofs; `libs/kern-primitives` deleted only after
zero importers + green gates (hard cut, no permanent shim).

## 6. Open decisions / gates

D-NAME (pre-creation), D-DEVICE (Phase 3 proof), D-NOGO (pre-extraction),
D-RELEASE (publication). `changeset status` invalid-tree family
(kern/native→primitives, mcp→cli) must resolve by Phase 5 exit; mcp→cli
recommends optional-peer conversion (dynamic import with fallback already
exists). Orphaned "D12" reference: DUAL-PATH adopted as evidenced
behavior; decision record missing (P2 docs debt).
