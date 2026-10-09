# Binding contract

**Status: draft — `mgr-oss` (P1-G7 deputy), 2026-10-09 · for review by `review-m3`.**
Task: `docs/planning/01-primitives.md` → **G7**. Publish explicitly excluded (founder HOLD) — this file is the document half of G7.

This manifest is the **contract for the kernel presentation bindings**. It says which
bindings exist, what each one binds, and how surfaces import them. It does **not**
change any barrel: both presentation modules stay out of their package barrels by
design (see §2), so this file adds zero exports.

---

## 1. Placement

This is a **doc**, at `docs/binding-contract.md`, next to `docs/parity-contract.md`.
It imports nothing and changes no code, so it cannot violate ADR 002's boundary and
cannot collide with G3/G4's per-module pages (those document kernel modules; this
file documents the renderer-side bindings).

## 2. The rule, stated once

Both presentation modules carry the same rule in their headers
(`packages/kern-native/src/components/presentation.tsx:1-17`,
`packages/kern/src/components/presentation.tsx:1-17`):

- Every host binds a `@xoroh/kern-primitives` model to platform mechanics
  (React Native / DOM). None replaces a platform owner.
- The modules are **deliberately NOT barrel-exported**: the generated registry
  treats every barrel export as a component, and these are bindings, not components.
- Surfaces import them **directly from the module path** (see §4). Any future
  proposal to barrel-export a binding must first change the registry's
  component-assumption or split the registry — until then, this rule holds.

## 3. Native bindings (`@xoroh/kern-native`)

Module: `packages/kern-native/src/components/presentation.tsx`.
Import root: `@xoroh/kern-native/src/components/presentation` (direct import only —
never from the package barrel).

| Binding | Role |
|---|---|
| `VisuallyHidden` (+ `NativeVisuallyHiddenProps`) | Accessibility hiding host |
| `getKernPortalRegistry` / `nextKernPortalId` / `resolveKernPortalTarget` / `useKernPortalRegistration` | Portal registry family (binds the kernel portal model) |
| `PresenceGate` (+ `NativePresenceGateProps`) | Presence-gated render host (binds the kernel presence model) |
| `describeAutofocus` | Autofocus resolution helper |
| `useKernPress` (+ `KernPressNativeBindings`) | Press reporting host (events, not visuals — see G8) |
| `useDismissBranches` | Dismiss-branch wiring host |
| `resolvePopoverOrigin` | Popover origin geometry helper |
| `useKernDir` | Directionality host |

## 4. Web bindings (`@xoroh/kern`)

Module: `packages/kern/src/components/presentation.tsx`.
Import root: `@xoroh/kern/src/components/presentation` (direct import only —
never from the package barrel).

| Binding | Role |
|---|---|
| `VisuallyHidden` (+ `VisuallyHiddenProps`) | Accessibility hiding host |
| `Slotted` (+ `SlottedProps`) | Slot host (web-side `asChild` mechanics live here) |
| `getKernPortalRegistry` / `KernPortal` (+ `KernPortalProps`) | Portal registry + portal component (binds the kernel portal model) |
| `PresenceGate` (+ `PresenceGateProps`) | Presence-gated render host (binds the kernel presence model) |
| `KernFocusTrap` (+ `KernFocusTrapProps`) | Focus-trap host (binds the kernel focus-trap model) |
| `useKernPress` (+ `KernPressBindings`) | Press reporting host (events, not visuals) |
| `useDismissBranches` | Dismiss-branch wiring host |
| `resolvePopoverOrigin` | Popover origin geometry helper |
| `useKernDir` | Directionality host |

## 5. Import convention

```ts
// ✅ Direct module import (the contract):
import { PresenceGate } from "@xoroh/kern-native/src/components/presentation";
import { Slotted } from "@xoroh/kern/src/components/presentation";

// ❌ Never via barrel — bindings are not components:
// import { PresenceGate } from "@xoroh/kern-native"; // NOT exported, by design
```

## 6. Open items (not this file)

- **Publish half of G7** (barrel/registry treatment of bindings) is founder-gated
  and explicitly out of scope here.
- **Adapter live-verify** (`Slot`/`Portal`/`asChild` exports) is gated on G7+G8;
  this file records the web `Slotted` host as the verify target.
- Per-host signature drift is caught by the existing scoped gates, not by this doc;
  if a binding is renamed, this manifest must move with it (D-053: same turn).
