# Kern Theme Variants — Authoring Guide

Variants let teams re-skin Kern without touching components. A variant is **data**: a named set of per-mode role overrides resolved through the shared registry.

## Concepts

- **Scheme** — the complete M3 role table (`Role → hex`). Every platform resolves the same table.
- **Mode** — `light` | `dark`. Provides the base table.
- **Contrast** — `standard` | `medium` | `high`. Deltas layered over the base.
- **Variant** — named `light`/`dark` override maps, layered last. Resolution: `base(mode) → contrast → variant`. Output always covers every role.

## Authoring

```ts
import { defineVariant, registerVariant } from '@xoroh/kern'

registerVariant(defineVariant({
  id: 'acme',
  label: 'Acme',
  overrides: {
    light: { primary: '#1d4ed8' },   // excess-checked: typos fail compile
    dark: { primary: '#93c5fd' },
  },
}))
```

Rules: reassign **roles only** — never invent keys (no such API), never reference raw hex outside the token ramps (enforced by review). A variant may cover one mode or both. `registerVariant` throws on duplicate ids; `getVariant` throws on unknown ids — fail loud, never half-themed.

## Consumers / white-labels

A consumer record carries `{ variantId }` (or an inline map validated by `assertCompleteScheme()`). At session start:

- **Web**: `applyKernTheme({ mode, contrast, variantId })` writes the deltas as inline CSS vars (optionally scoped to a subtree `target` for previews). `clearKernTheme()` restores the stylesheet scheme.
- **Native**: `<KernThemeProvider variantId="acme">` — `useKernTheme().scheme` and native classes all follow.

No component or CSS changes needed — components read roles, roles resolve per consumer.

## What variants cannot do

- Add/remove roles (type-level impossible)
- Dynamic/seed-generated color (rejected: unauditable contrast, breaks design parity — see `theming-and-dynamic-color.md`)
- Per-component overrides (that's the `comp` token level, not theming)

## Contrast UI

`ContrastToggle` (next to `ThemeToggle` in the header) layers the `high` deltas; the registry also carries `medium`. Both axes compose with any variant.
