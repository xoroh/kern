# m3-material-web (Google) — part-by-part vs kern

**Identity:** Google's own M3 web implementation (web components). **Maintenance mode** (roadmap, discussion #5642 — no new features planned). Tokens: ref→sys→comp SCSS (`_md-ref-*` → `_md-sys-{color,typescale,elevation,motion,shape,state}` → `_md-comp-*`), versioned sets (`versions/v0_192/`).
**Sources:** OSS-DEEP-WEB-material-web.md; m3.material.io/styles; github.com/material-components/material-web.

## Parts: they-have / we-will-have (kern codes: B both · W web · N native · G gap · R rent)
- Buttons (elevated/filled/tonal/outlined/text as separate modules): Y / **B** (button, variants differ — kern deviation space).
- FAB (+extended, branded): Y / **B**.
- Icon buttons (filled/tonal/outlined/standard): Y / **B** (icon-button).
- Chips (assist/filter/input/suggestion): Y / **B** (chip; variants mapped).
- Dialog (+full-screen) / Alert: Y / **B** (dialog, alert-dialog).
- Snackbar: Y / **B** (snackbar + sonner).
- Progress (linear/circular): Y / **B**.
- Switch / Checkbox / Radio: Y / **B**.
- Slider: Y / **B**.
- Tabs (primary/secondary): Y / **B** (tabs, secondary-tabs).
- Navigation bar / Navigation drawer: Y / **B**.
- Segmented button: Y / **B**.
- Menu (+menu-item): Y / **B**.
- Select / Text field (+filled/outlined): Y / **B** (select, input, textarea, field).
- List (+list-item): Y / **B**.
- Card (elevated/filled/outlined): Y / **B**.
- Divider: Y / **B** (separator).
- Icon: Y / **B** (kern-icons, 1340 catalog).
- Ripple / Focus-ring: Y / **P** (states/focus covered via tokens + focus-visible work; no standalone ripple module — kern decision).
- Elevation / Typography / Shape / Motion / Color / State tokens: Y / **B** (kern-theme; md.sys.* + md.comp.*).
- Date pickers / Time pickers: P (calendar + clock in material-web scope) / **B** (calendar, time-picker; range = G).
- Data table: P (basic) / **W** (basic table; advanced grid = R/G per R10).
- Bottom sheet / Side sheet: P / **N** (kern-native sheets exceed material-web here — kern leads).
- Search bar: P / **B** (search).
- Carousel: – (in labs) / **B** (kern has carousel; M3-expressesive alignment TBD).

## Patterns to carry
Ref→sys→comp token layering + versioned sets; per-variant modules; dual-target docs; freshness metadata. MWC maintenance mode = the M3-reference slot is kern's to take.
