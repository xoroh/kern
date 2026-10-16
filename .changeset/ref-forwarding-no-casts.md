---
"@xoroh/kern": patch
---

Consistent ref forwarding without casts: `ButtonProps` is now a
discriminated union on `href` (anchor branch takes only anchor refs,
button branch only button refs), and both render paths forward through a
small internal `assignRef` helper instead of `ref as Ref<…>`. `MenuScreen`,
`MenuSheet`, `FilterChipRow`, and `SheetSurface` accept and forward refs;
`Dialog` parts and `Switch` keep working through spread (now covered by
ref-attachment tests). No behavior change.
