# Kern migration map (private → OSS)

Source: `../xoroh-platform/libs/kern/` (private, **copy never move** — the app
keeps importing it until the very end). Every stub header names its exact
private source file. Nothing here is wired into `index.ts` until migrated.

## Naming rule

Drop the `Kern` prefix, kebab-case files: `KernAlertDialog.tsx` →
`src/web|native/components/alert-dialog.tsx` exporting `AlertDialog`.
Exceptions: `FAB` stays `FAB`, `KernSonner` → `Toaster`, native `Button` API
stub lives in `src/native/index.ts` (no `components/button.tsx` yet).

## Phases

- **Phase 1 — tokens/theme (skeleton done):** `src/theme/*` + real `Button`.
  Migrate full role tables, typography, elevation, motion, state layers.
- **Phase 2 — pure web (34 stubs in `src/web/components/`):** Base-UI
  wrappers. Migrate freely; only `country-select` is excluded (see Phase 4).
- **Phase 3 — pure native (~54 stubs in `src/native/components/`):**
  Paper + NativeWind. Same, minus the review/tangled files below.
- **Phase 4 — quarantine (decide first):**
  - `country-select` ×2 — needs injected list prop (private dataset stays).
  - `contact-row`, `conversation-row`, `entity-sheet` (native) — domain
    (messaging) code; confirm generic before migrating.
- **Phase 5 — last, not stubbed yet:** shells, menus, blocks, scaffolds,
  feedback, navigation drawer/rail, panes, icons (migrate generator +
  subset, never raw brand assets or `brand/*`).

## Never migrate

Hardcoded mailbox/menus (`user-menu`, `help-menu`, `apps-menu` product list),
`notifications-menu` (auth store), `Document.tsx` backend domains,
`mobileAppConfig.ts` demo credentials, expo `shell/*` (auth+mocks), brand +
superapp icons. De-brand / inject props first.
