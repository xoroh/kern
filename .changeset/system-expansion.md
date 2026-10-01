---
"@xoroh/kern": minor
"@xoroh/kern-tokens": minor
"@xoroh/kern-native": minor
"@xoroh/kern-icons": minor
"@xoroh/kern/start": minor
"@xoroh/kern-mcp": minor
---

System expansion for the 0.1.0 alpha:

- **`@xoroh/kern-icons`** (new): multi-set icon system — Material Rounded
  registry (1,340 committed glyphs), `Icon` + `useIcon` on web and native,
  41 semantic aliases, `registerIconSet` openness (drop-in and synced sets),
  `icons:sync|generate|check` pipeline.
- **`@xoroh/kern-tokens`**: spectrum ramps (11 hues × 50–950, OKLCH + sRGB),
  tone layer (`statusTone`/`avatarToneFor`/`userToneFor`/`spectrumTone`, hue
  registry, `makeHueRamp`), 9-domain functional map with
  `registerFunctionalDomain`/`setFunctionalOverrides`, theme engine
  (`registerVariant`/`getVariant`/`assertCompleteScheme`/`resolveThemeLayers`),
  feedback spec (loader styles, `BRAND_TRIO`, `feedbackTiming`, tenant
  registry), generated `tones.css` + `motion.css`.
- **`@xoroh/kern`**: feedback kit — `CircularProgress`, `LinearProgress`,
  `LoadingButton`, `BootIndicator`, `PageLoader`, critical-loader constants +
  `useAppReady`/`markAppReady`.
- **`@xoroh/kern-native`**: feedback mirror + `Shape`, `MilestoneTrio`,
  `SuccessTransform`, `ShapeArt`.
- **`@xoroh/kern/start`** (new): web composition — `AppShell` region slots,
  `TopAppBar` family, sidebar/rail/section-drawer, `Pane`/`Page`/`Split` +
  `ListDetail`/`Inspector`, `SearchBar`/`SettingsRow`/`StatusBar`, router
  seam (`LinkProvider`/`useLinkComponent`).
