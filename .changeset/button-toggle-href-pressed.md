---
"@xoroh/kern": patch
---

`Button` toggle anchors keep `aria-pressed`.

The `toggle` + `href` anchor variant previously omitted `aria-pressed`,
leaving selection state invisible to assistive tech while the button
variant announced it. Both render paths now report `aria-pressed`, with
`data-selected` retained for styling.
