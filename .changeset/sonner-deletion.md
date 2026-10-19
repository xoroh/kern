---
"@xoroh/kern": minor
---

Delete `Sonner` (component, compound, manager, intent axis): M3 names it
Snackbar and M3 has no tone, with no alias. The imperative pieces move to
`createSnackbarManager`, which now returns `{ toastManager, show, promise,
dismiss }` over `SnackbarMessage` (no intent); update `toastManager={manager}`
call sites to `manager.toastManager`, `manager.add` to `manager.show`, and
`manager.close` to `manager.dismiss`.
