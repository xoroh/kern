# `@xoroh/kern-tokens`

Status: current

The design language, with no component in it. Colour roles, type, spacing,
elevation, motion and shape, defined once in OKLCH and compiled to srgb — so the
web and native renderers resolve one identical scheme instead of two that agree
by eye.

## Install

```bash
bun add @xoroh/kern-tokens
```

No React, no DOM, no peer dependencies. This is the bottom of the package graph.

## What is in it

| Export | Purpose |
|---|---|
| `tokens` | The canonical token set — OKLCH source values with compiled srgb |
| `functional` · `tones` · `variants` | The role bindings each renderer resolves per theme |

Design-system presets (role tables, contrast policies, seed themes) live in
`@xoroh/kern-material-3`, whose `src/themes/` ships the JSON so a consumer
can read or generate from it without evaluating any code.

## Why the roles are structured

The Material 3 role structure — `primary` / `onPrimary` / `primaryContainer` /
`onPrimaryContainer` per family — is defined by `@xoroh/kern-material-3`,
which declares **58 colour roles per scheme**, identical in light and dark.

`surfaceTonal` is a Kern addition (tonal emphasis fills, pairing with
`onSurface`). Contrast overlays carry only pinned values; unlisted roles inherit
the base scheme.

> The count above is read from the file. A "45 roles" figure circulated in design
> research and was ruled on for the site hero; it does not match the current
> tables and must not be published without re-deriving it.

## The boundary

This package may not import React, the DOM, `@xoroh/kern`, `@xoroh/kern-native`
or `@xoroh/kern-primitives`. Tokens that know what a Button is have become a
component, and the two renderers can then no longer share them.

The `check:layers` gate enforces `primitives → tokens → renderers` from the
declared dependency graph, so the ordering cannot rot silently.

## Usage

Read the raw tokens, or resolve a theme per platform:

```ts
import theme from "@xoroh/kern-material-3/themes/material-3.json";

const surface = theme.color.light.surface;
```

The web renderer consumes the CSS custom properties in `src/tokens.css`; the
native renderer reads the same JSON and resolves per scheme. There is no
platform-specific variant to keep in sync.

## Licence

MIT — see [LICENSE](./LICENSE).
