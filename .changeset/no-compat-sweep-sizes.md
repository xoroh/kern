---
"@xoroh/kern": minor
"@xoroh/kern-native": minor
---

No-compat sweep: spec defaults and one-size-one-name (ADR-007).

- `LoadingIndicator` default is the 48dp M3 spec default on both renderers
  (was 24px kept for back-compat); the `xl`-as-spec-default alias is gone.
  The lightweight `Loader` keeps its 24px default — a different component
  with a different role, not an alias.
- Web `Fab` loses the pre-expressive `medium` size (96px under the old
  name); use `md` (80dp) or `large` (128dp). Native FAB already matches M3
  and is unchanged.
- Demos, content pages, and size tests updated in the same change.
