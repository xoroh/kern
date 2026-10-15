# `@xoroh/kern-material-3`

Status: current

Material Design 3 as a Kern design system: role tables and presets, the M3
contrast policy and pair builders, seed-theme generation, the feedback spec
and expressive shapes.

The universal theme engine lives in `@xoroh/kern-tokens` and knows none of
this. Importing this package registers the M3 preset tables, policy and
overrides with that engine (side effect) — default consumers resolve M3
without further setup; custom systems register their own preset instead.

## Install

```bash
bun add @xoroh/kern-material-3
```

Depends on `@xoroh/kern-tokens` for the engine. No React, no DOM, no peers.

## What is in it

| Export | Purpose |
|---|---|
| `.` | Preset manifest, contrast policy, seed themes, role inventories, feedback and expressive shapes; theme tables in `src/themes/` |
| `./themes/*` | `material-3.json` (default), `sharp.json`, `brand.json`, `compact.json`, `demo.json`, `index.json`, `matrix.json` |

Themes ship as JSON under `src/themes/`, so a consumer can read or generate
from them without evaluating any code.
