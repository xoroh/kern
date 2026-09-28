> **Kern note:** MD3 theming architecture. Kern does **not** generate schemes from a seed or use dynamic color — it ships fixed schemes resolved through a shared registry (`packages/kern/src/theme/`): base light/dark tables + contrast overlays + named variants. See [`theme-variants.md`](theme-variants.md) for authoring, [`kern-tokens.md`](kern-tokens.md) for values.
>
> **Color pipeline law:** canonical values are OKLCH on familiar 50–950 steps (`tokens.json`, each entry `{oklch, srgb}`). Web consumes `oklch()` verbatim; React Native consumes the compiled `srgb` hex (native cannot parse oklch). Steps fill in only with validated values — gaps are intentional. Roles bind steps per M3 rules, never raw values. Preset themes are catalogued in `src/theme/themes/index.json` — the same file the visual builder, MCP `list_themes`, and copy-paste flows read.

# MD3 Theming and Dynamic Color

Guide to creating, applying, and managing Material Design 3 themes.

## Theme Architecture

The same **semantic roles** (primary, onSurface, surface containers, etc.) appear on every platform:

| Platform | Theme surface |
|----------|----------------|
| **Jetpack Compose** | `MaterialTheme(colorScheme, typography, shapes, …)` |
| **Web** | CSS custom properties `--md-sys-*` on `:root`, `.dark` redefines them; `applyKernTheme()` layers variant/contrast deltas inline |
| **Native** | Theme provider + `useKernTheme().scheme` hook (`@xoroh/kern/native`) |

All three resolve the same registry (`resolveTheme({ mode, contrast, variantId })`) — one role table, three projections. Web CSS and the TS role tables are generated from the same `tokens.json` source so they cannot drift; native derives values from the same tables.

### Token Chain: ref → sys → comp

`ref` (all raw values) → `sys` (roles/decisions, the theming point) → `comp` (element + state, e.g. `md.comp.fab.primary.container.color`). Token name = `system.class.purpose`. Spec tabs read state-first, then element, then token ID. Single source of truth + DSP export; tokens replace hardcodes so a value can change without a rename. Kern vendors a fixed `ref` (neutral base + M3 functional color) — document the chain even though `ref` never regenerates.

### Contexts

Contexts are conditions overriding values: dark mode, dense, form-factor, RTL, TV-scale type. Kern documents dark + scoped themes today; treat dense, RTL, and form-factor as contexts too (structure, no value change).

## Web: CSS Custom Properties (Kern's approach)

Kern defines its fixed scheme directly as CSS custom properties — no runtime generation. Author against `--md-sys-color-*` roles (or the `md-sys-*` Tailwind utilities mapped via `@theme inline`). Concrete values are generated from `tokens.json` into `tokens.ts` + `tokens.css`; see [`kern-tokens.md`](kern-tokens.md).

```css
/* Light (default) — TS ramp values; page canvas is the surface-container role */
:root {
  --md-sys-color-primary: #000000;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-secondary: #2563eb;
  --md-sys-color-surface: #ffffff;
  --md-sys-color-on-surface: #262626;
  --md-sys-color-surface-container: #f5f5f5;
  --md-sys-color-outline-variant: #e5e5e5;
  --md-sys-color-error: #dc2626;
  /* …full set in tokens.css (generated from tokens.json) */
}

/* Dark — `.dark` class only (toggled by the theme hook / ThemeToggle).
 * There is no prefers-color-scheme media query: the OS setting is read
 * once as the default, then the class is the source of truth. */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #FFFFFF;
    --md-sys-color-on-primary: #000000;
    --md-sys-color-secondary: #60a5fa;
    --md-sys-color-surface: #000000;
    --md-sys-color-on-surface: #ffffff;
    --md-sys-color-surface-container: #171717;
    --md-sys-color-outline-variant: #262626;
    --md-sys-color-error: #f87171;
  }
}
```

## Dark Theme

The role structure stays identical between light and dark — only the values swap. In Kern, `primary` flips black↔white and the `surface` / `surface-container` ladder inverts. Mode is a class toggle on web (`.dark`) and a context value on native; both default to the OS setting with a persisted manual override.

### Runtime toggle (web)

Web theme state resolves persisted preference → OS default → `.dark` class, with cross-tab sync. A `ThemeToggle` in the header flips it. Contrast and variants layer on top via `applyKernTheme()` — see [`theme-variants.md`](theme-variants.md).

```javascript
function setDark(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
}
```

### Runtime toggle (native)

`KernThemeProvider` + `useKernTheme()` (`@xoroh/kern/native`): OS appearance default (live subscription), persisted manual override, `dark:` classes synced from the same mode. Components read `scheme` — never static imports.

## Brand Color Integration

> **Kern:** the brand base is neutral (black / white / gray). There is no brand seed to map; hue enters only through M3 roles (`primary`, status, categorization). Do not introduce off-role hues into the chrome.

For reference, MD3 maps brand colors to roles like: primary brand → `primary` seed, accent → `tertiary`, alert → `error`. Kern deliberately skips this.

## Component-Level Overrides (web)

Override individual `@material/web` component appearance with component-specific tokens (pattern `--md-{component}-{element}-{property}`), always pointing at a system role — never a raw hex:

```css
md-filled-button {
  --md-filled-button-container-color: var(--md-sys-color-primary);       /* black */
  --md-filled-button-label-text-color: var(--md-sys-color-on-primary);   /* white */
  --md-filled-button-container-shape: var(--md-sys-shape-corner-full);    /* pill */
}

md-outlined-text-field {
  --md-outlined-text-field-container-shape: var(--md-sys-shape-corner-small);
  --md-outlined-text-field-focus-outline-color: var(--md-sys-color-primary);
}
```

## Scoped Themes

CSS custom properties cascade, so a subtree can override roles. Kern uses this sparingly (e.g., an always-dark panel) — never to introduce color.

```css
.kern-inverse-panel {
  --md-sys-color-surface: #000000;
  --md-sys-color-on-surface: #ffffff;
}
```

## Dynamic Color / Content-Based Theming

> **Kern:** not used. Wallpaper- and content-derived schemes contradict Kern's fixed neutral chrome. Retained here only as MD3 context: Android uses `dynamicLightColorScheme`/`dynamicDarkColorScheme` (API 31+); web can derive a seed from images via `@material/material-color-utilities`. Kern intentionally does neither.

## High Contrast

MD3 supports 3 contrast levels (standard 0.0 / medium 0.5 / high 1.0) that increase tonal distance between paired roles. Kern ships all four contrast modes (light/dark × medium/high):

* **Medium** — minimum 3:1 everywhere with less halation than full max: text roles go pure black/white, outlines step to `#545454`/`#a3a3a3`, containers converge one step (`#404040` fills light, `#e5e5e5` fills dark), secondary deepens to `#1e3a8a` light / `#dbeafe` dark.
* **High** — 7:1 content focus: chrome flattens (white surfaces light, black surfaces dark), outlines pure `#000000`/`#ffffff`, accent containers go solid black/white with matching `on-` text.
* Kern's black/white primary pairing is already at maximum tonal distance in standard; gray-on-gray combinations must still meet 4.5:1 (text) / 3:1 (UI) — check muted text (`#545454` light / `#c7c7c7` dark) first.
