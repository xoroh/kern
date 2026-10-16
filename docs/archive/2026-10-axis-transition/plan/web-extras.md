# Plan — Missing web components (was: shadcn aliases + gaps)

Status: done (2026-10-01) · planned 2026-09-29

Five components completing the web set. The planned shadcn/private alias
layer (~95 names) is **cancelled** — naming law only, hard cut.

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Names | unprefixed PascalCase, M3-canonical concepts — no prefixes, no product names, no bridge names |
| Components | `Command` (cmdk), `Sonner`, `CountrySelect` (data as prop — no country-data dep), `SegmentedButton`, `Banner` — M3-conformant structure/behavior |
| `variants` meaning | frozen per component and documented in `../platform-parity.md`: Button=emphasis, Card=elevation, Text=type scale, FieldMessage=intent, Badge=shape, Chip=kind |
| Web↔native naming | `Separator`/`RadioGroupItem`/`*Props` win (platform parity doc) |

## Steps

1. Add the five components (Base UI / cmdk / sonner where the patterns call
   for them; `CountrySelect` takes an `options` prop).
2. `../platform-parity.md` table: web name ↔ native name ↔ notes.
3. Tests: render tests per component.

## Acceptance

- Five components render and test green; M3 structure/behavior per
  `component-catalog.md`; no bridge names anywhere in the public surface.

## Log — shipped 2026-10-01

All five landed in `packages/kern/src/components/`, with
`web-extras.test.tsx` covering them:

| Component | File | Exports |
| --- | --- | --- |
| `Command` | `command.tsx` | `Command`, `CommandRoot`, `CommandList`, `CommandInput`, `CommandGroupLabel`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandContent` |
| `Sonner` | `sonner.tsx` | `Sonner`, `SonnerProvider`, `createSonnerManager`, `SonnerRoot`, `SonnerViewport`, `SonnerList`, `SonnerTitle`, `SonnerDescription`, `SonnerAction`, `SonnerClose` |
| `CountrySelect` | `country-select.tsx` | `CountrySelect`, `CountrySelectRoot`, `CountrySelectLabel`, `CountrySelectTrigger`, `CountrySelectValue`, `CountrySelectContent`, `CountrySelectItem` |
| `SegmentedButton` | `segmented-button.tsx` | `SegmentedButton`, `SegmentedButtonRoot`, `SegmentedButtonItem` |
| `Banner` | `banner.tsx` | `Banner`, `BannerAction` |

Decisions as planned: names unprefixed and M3-canonical; `CountrySelect`
takes its options as a prop with no country-data dependency; no alias layer.
The step-2 parity table was written up in `../platform-parity.md`.

No native counterpart shipped for any of the five — recorded in the parity
gap list. `Sonner` is the notable one: native `Snackbar` already covers the
toast need, so the gap is a naming/API difference rather than missing
capability.
