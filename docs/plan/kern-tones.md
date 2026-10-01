# Plan — Tone + functional color layer in `kern-tokens`

Status: done (2026-09-29) · log kept for revision

The classification-tone system in `@xoroh/kern-tokens`: spectrum hues, status /
user / avatar tones, 9-domain functional map, tone CSS utilities. Pure TS +
JSON — works on web and React Native with zero new dependencies.

## Why (the system model)

Industry-proven 3-layer token architecture (M3 / Carbon / LEX / Tailwind+shadcn):

1. **Primitives** — raw ramps on one ladder, in `tokens.json`.
2. **Semantics** — role bindings per theme, in `themes/*.json`.
3. **Functional** — meaning → tone (`priority.urgent`, `channel.chat`).

Growth rules: one ladder everywhere · aliases never copies · data over code ·
registry growth (zero code changes to expand) · derived artifacts + regen-diff
CI · OKLCH canonical + srgb compiled.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Step ladder | `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` |
| Ramp families | Two namespaced families on the same ladder: `palettes` (role ramps → themes) + `spectrum` (classification hues → tone layer) |
| Openness | Presets ship as data; any hue via `makeHueRamp(seed)` + `registerHue`; injectable hash rotations; open functional map with theme overrides |
| Location | All of it in `kern-tokens` (`kern`/`kern-native` unchanged) |
| Functional values | Aliases first (`tone | hueRef + steps`); raw hex only as documented exemptions |

## Data model (`tokens.json`)

```
TONAL_STEPS = 50 | 100 | … | 900 | 950          (single ladder, gaps allowed)

palettes.*   role ramps → themes/*.json bindings
spectrum.*   11 hues: gray, red, orange, amber, yellow, lime, green, teal,
             blue, purple, magenta × TONAL_STEPS, { oklch, srgb } per step
```

`spectrumTone` step-flip contract: light `bg 100 / fg 900 / dot 700`, dark
`bg 800 / fg 100 / dot 300`.

## Openness (users are never bound to our colors)

| Tier | Mechanism |
| --- | --- |
| Presets | The 11 spectrum hues ship as JSON data, not hardcode |
| Any hue | `makeHueRamp(seed)` — 50–950 ramp from hue angle / OKLCH / hex; `registerHue(name, ramp)` / `getHue` / `listHues` |
| Open rotations | `userToneFor` / `avatarToneFor` accept injectable hue/tone lists (defaults = presets; gray excluded from user rotation). Hash algorithm frozen |
| Open functional map | 9-domain map = default data; `registerFunctionalDomain(domain, table)`; `setFunctionalOverrides` (tenant/theme remapping) |

## Functional value model (aliases over copies)

```ts
type FunctionalValue =
  | StatusTone                    // → TONE_ROLES (mode-aware)
  | { hue: string; bg: ToneStep; fg: ToneStep }
  | { static: { bg: string; fg: string } }   // documented exemptions only
```

Default map: 9 domains / 46 keys (priority, ticketStatus, conversationStatus,
category, channel, planTier, fileType, taskStatus, presence).

## Files (shipped)

```
packages/kern-tokens/
  src/tokens.json            + spectrum block (11 hues × 11 steps)
  src/color.ts               OKLCH ↔ sRGB math (dep-free)
  src/tones.ts               SPECTRUM_HUES · TONE_ROLES · statusTone ·
                             avatarToneFor · userToneFor · spectrumTone ·
                             hue registry · makeHueRamp
  src/functional.ts          9-domain map · functionalTone · resolveFunctionalTone ·
                             toneClass · registerFunctionalDomain · setFunctionalOverrides
  src/variants.ts            variant registry · assertCompleteScheme ·
                             resolveThemeLayers · schemeToCssVars
  src/tones.css              GENERATED `.tone-<domain-<key>` utilities
  scripts/gen-tones-css.mjs  deterministic generator
  src/tones.test.ts          golden hash vectors, registry, functional, engine
```

`tokens.css` generation emits `--spectrum-<hue>-<step>` vars + `@theme inline`
entries so ramps are utility-CSS addressable.

## Rigor

- Tests: hash golden vectors, step-flip, registry openness, `makeHueRamp`,
  engine semantics.
- CI: generators regen-diff alongside `tokens.css`.

## Stability contract (frozen)

Hash algorithm, `TONE_ROLES` table, `spectrumTone` step-flip, and the 50–950
ladder never change post-ship. Growth is additive only.

## Deferred

NativeWind/CSS copies for RN · site tone docs page · MCP knowledge ·
unifying `palettes` and `spectrum` into one family · contrast-level aware tones.
