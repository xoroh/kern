# Platform parity (web ↔ native)

Status: current

Same meanings, same tokens, same spec — different renderer. Naming follows
the naming law (unprefixed, M3-canonical); where the web and native names
differ, this table is the truth.

## Naming

| Concept | Web (`@xoroh/kern`) | Native (`@xoroh/kern-native`) | Notes |
| --- | --- | --- | --- |
| Button | `Button` | `Button` | `variants` = emphasis (primary/tonal/ghost/destructive) |
| Card | `Card` | `Card` | `variants` = elevation |
| Text | `Text` | `Text` | `variants` = type scale |
| Field message | `FieldMessage` | `FieldMessage` | `variants` = intent |
| Badge | `Badge` | `Badge` | `variants` = shape |
| Chip | `Chip` | `Chip` | `variants` = kind |
| Separator | `Separator` | `Separator` | canonical name |
| Radio item | `RadioGroupItem` | `RadioGroupItem` | canonical name |
| Dialog | `Dialog` | `Dialog` | web uses Base UI primitives; native Modal |
| Progress | `Progress` / `LinearProgress` / `CircularProgress` | same | M3 progress-indicator canon |
| Props suffix | `*Props` | `*Props` / `Native*Props` | `Native*Props` only where RN event types force it |

`variants` meanings are frozen per component (Button=emphasis, Card=elevation,
Text=type scale, FieldMessage=intent, Badge=shape, Chip=kind) — never give one
prop name two meanings.

## Behavioral parity

- Sizes, touch targets (48dp), and state opacities come from `kern-theme`.
- Icons arrive as nodes (slots) on both platforms; `@xoroh/kern-icons`
  renders identical glyphs where a shared kit is wanted.
- Color resolves through `useKernScheme` (native) and `--md-sys-*` vars (web)
  from the same scheme.
