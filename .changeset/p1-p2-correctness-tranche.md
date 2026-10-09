---
"@xoroh/kern": patch
---

M3 correctness, P1s and P2s (token- and anatomy-only, no API breaks).

- `SegmentedButtonItem` gains the M3 selection check on labelled segments
  and the five density sizes (`xs`–`xl`, `sm` default, current rendering kept).
- `Switch` thumb carries the M3 icons (check in on-primary-container
  selected, close in surface-container-highest unselected).
- `Slider` inactive track paints surface-container-highest, and discrete
  sliders can render stop indicators via `showTicks` with an explicit `step`.
- `Fab` resolves icon-only content to the square icon geometry; labelled
  content stays a pill and an explicit `size` always wins.
- `Search` grows `leading`/`trailing` slots (search icon by default) and the
  clear action is a real icon, not a × glyph.
- `Badge` truncates numeric counts past `max` (M3 99+) while the accessible
  name keeps the full count.
- `Checkbox` paints hover/focus as a 40dp state layer instead of nothing.
- `TimePicker` declares the dial presentation unsupported at the type level
  (`dial?: never`).
- `NavigationBar` warns in dev below the M3 three-destination floor.
