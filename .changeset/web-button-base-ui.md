---
"@xoroh/kern": patch
---

Web Button renders on Base UI Button/Toggle primitives instead of hand-rolled elements; axis prop types derive from `VariantProps<typeof buttonVariants>`. No prop changes, no class changes. Two known micro-deltas: uncontrolled toggles expose state via the primitive's `data-pressed`/`aria-pressed` (`data-selected` mirrors only controlled `pressed`), and toggle `value` no longer reaches the DOM (it collides with the Toggle group-identity value).
