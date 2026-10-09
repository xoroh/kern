---
"@xoroh/kern": patch
---

M3 design-correctness fixes (token-only, no API change).

- Filled `IconButton` now uses the primary container with the on-primary
  icon; an unselected filled toggle keeps the surface-container-highest
  container with the primary icon, so resting and selected agree on "filled".
- Selected filter `Chip` paints secondary-container with
  on-secondary-container instead of primary; assist `Chip` is a flat surface
  with an outline-variant border instead of a tonal fill.
- Filled `Card` paints surface-container-highest, and all cards use medium
  corners instead of small.
- Button hover is a state layer (the on-color at hover opacity over the
  container, label full-strength) on every variant including danger
  treatments — the primary variant no longer dims the whole button, and
  tonal, outlined, elevated, and ghost all gain the hover they were missing.
