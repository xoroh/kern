# Report: PR 3 — Adopt Axis Toast and Portal primitives

Date: 2026-10-19
Branch: `feat/m3-adopt-axis-toast-portal`
PR: https://github.com/xoroh/kern/pull/71
Related: Part 3 of 3 for Kern adopting current Axis

## Overview
Adopted `@xoroh/axis` Toast and Portal components and shared primitives:
1. **Toast & Snackbar on Native:**
   - Extended `packages/kern-native/src/components/snackbar.tsx` with `SnackbarProvider`, `SnackbarViewport`, `useSnackbar`, and `SnackbarQueue` leveraging Axis's `ToastProvider`, `ToastViewport`, `useToast`, and `Toast`.
   - Maintained full backward compatibility with single-shot `<Snackbar visible message ... />`.
   - Exported `useSnackbar`, `SnackbarProvider`, `SnackbarViewport` in `packages/kern-native`.
2. **Portal & PortalHost on Native:**
   - Bound Axis `Portal` and `PortalHost` into `packages/kern-native/src/components/presentation.tsx` and exported them alongside `useKernPortalRegistration`.
   - Verified that portaled children mount cleanly into `PortalHost` in document order and scope correctly by name.
3. **Tests:**
   - Added unit and integration tests verifying snackbar queue order, dismiss, auto-dismiss timers, action execution, and portal mounting into PortalHost.

## Verification Gates
- `bun run typecheck`: Passed (all 6 packages clean)
- `bun run test:native`: Passed
- `bun run test:native:jest`: Passed
- `bun run check:generated`: Passed
- `bun run lint`: Passed
