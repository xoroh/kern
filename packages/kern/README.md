# `@xoroh/kern`

Status: current

M3-based UI core: web (React) + native (React Native) + shared theme,
one package, subpath exports.

## Install

```bash
bun add @xoroh/kern
```

## Exports

| Import | What |
|---|---|
| `@xoroh/kern` | Web components (React, Base-UI-based) |
| `@xoroh/kern/native` | Native components (React Native, planned) |
| `@xoroh/kern/next` | Next.js App Router entry (added on first RSC need) |
| `@xoroh/kern/theme` | Theme CSS variables |
| `@xoroh/kern/tokens` | Tokens as TypeScript (`tokens.json` is the source) |
| `@xoroh/kern/utils` | `cn` and other pure helpers |

```tsx
import { Button } from "@xoroh/kern";
import "@xoroh/kern/theme";
```

## Themes

Presets in `src/theme/themes/`: `m3` (default), `sharp` (premium),
`brand` (customer template). Same components, swapped tokens —
see ADR-004 (`docs/decisions/004-themes-not-systems.md`).

## Blocks

Use-case packs in `src/blocks/<usecase>/` (mobility first): composed
components + preset themes on core primitives. Blocks depend on core,
never the reverse — see `docs/conventions/file-ownership.md`.

## Pre-release note

Only `Button` (web) is implemented; every other file is a status stub
(see its header). Stubs join the exports only when they land with docs
page + changeset.
