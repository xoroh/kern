---
"@xoroh/kern": minor
---

Web-extras P1 (roadmap row 7) — the web set is now complete. Five new
components, all M3-conformant and built on Base UI behaviors with Kern tokens:

- **`Command`**: type-to-filter command palette (`Root`/`Input`/`Content`/
  `List`/`Item`/`Empty`/`Separator`/`GroupLabel`). Rows come from an
  `options` prop typed as `CommandOption` (`value`, `label`, `keywords`,
  `icon`, `shortcut`, `onSelect`); filtering matches label plus keywords, and
  the chosen row's `onSelect` runs after `onValueChange`.
- **`Sonner`**: transient top-right messages (`Provider`/`Viewport`/`List`/
  `Root`/`Title`/`Description`/`Action`/`Close`) driven imperatively by
  `createSonnerManager()` — `show`, `info`, `success`, `warning`, `error`,
  `promise`, `dismiss`. No new runtime dependency: it wraps the same Base UI
  toast manager that backs `Snackbar`, exposed as
  `manager.toastManager` for the provider.
- **`CountrySelect`**: single-choice country dropdown
  (`Root`/`Label`/`Trigger`/`Value`/`Content`/`Item`). Country data arrives as
  a prop — `CountryOption` (`code`, `name`, `dialCode`, `flag`) — so no
  dataset, locale, or size policy is baked into Kern.
- **`SegmentedButton`**: exclusive segmented control (`Root`/`Item`), one
  segment pressed at a time, pressed segment filled with the secondary
  container role.
- **`Banner`**: persistent inline message with `variant` = intent
  (`info`/`success`/`warning`/`error`, the same axis as `FieldMessage`),
  optional leading `icon`, `assertive` for `role="alert"`, `onDismiss`
  for the dismiss control, and a companion `BannerAction`.