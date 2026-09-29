# Plan — Missing web components (was: shadcn aliases + gaps)

Status: planned · revised 2026-09-29

Five components completing the web set. The planned shadcn/private alias
layer (~95 names) is **cancelled** — naming law only, hard cut.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Names | unprefixed PascalCase, M3-canonical concepts — no prefixes, no product names, no bridge names |
| Components | `Command` (cmdk), `Sonner`, `CountrySelect` (data as prop — no country-data dep), `SegmentedButton`, `Banner` — M3-conformant structure/behavior |
| `variants` meaning | frozen per component and documented in `platform-parity.md`: Button=emphasis, Card=elevation, Text=type scale, FieldMessage=intent, Badge=shape, Chip=kind |
| Web↔native naming | `Separator`/`RadioGroupItem`/`*Props` win (platform parity doc) |

## Steps

1. Add the five components (Base UI / cmdk / sonner where the patterns call
   for them; `CountrySelect` takes an `options` prop).
2. `platform-parity.md` table: web name ↔ native name ↔ notes.
3. Tests: render tests per component.

## Acceptance

- Five components render and test green; M3 structure/behavior per
  `component-catalog.md`; no bridge names anywhere in the public surface.
