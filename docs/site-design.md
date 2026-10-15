# Site visual system

The documentation site uses a Material 3-inspired expression of Kern. This is an
application design, not a change to the published component or token contracts.

## Sources and ownership

- Colors resolve from `@xoroh/kern-tokens/theme` and the existing `kern` theme:
  purple primary, muted violet secondary, rose tertiary, and neutral surfaces.
- `apps/site/src/styles.css` owns the site shell, responsive marketing display,
  illustrated specimens, and homepage layouts. Every color uses semantic roles;
  there is no separate hardcoded marketing palette.
- `apps/site/src/domains/shared/systems/ui.ts` owns shared rounded cards, tonal
  demo stages, navigation states, and focus treatment.
- `apps/site/src/domains/shared/systems/type-scale.ts` owns typographic roles.
  Page titles use display-small; marketing headings adapt without changing the
  library's type tokens.
  The stylesheet explicitly emits all runtime-built type utilities with
  Tailwind's `@source inline`; a rendered-size regression test verifies that
  navigation labels do not silently fall back to browser body text.

## Layout and interaction

Desktop keeps primary navigation in the pinned top header. Docs,
foundations, components, primitives, styles, and reference pages retain section
navigation. A right-hand table of contents appears on very wide screens; smaller
screens use the disclosure. Below 1024px the mobile drawer replaces the header tabs.

The main pane is the page scroll container; side navigation scrolls independently.
The rounded reading pane sits on a neutral canvas. Cards separate by tone, with
no resting shadows. Gallery specimens rotate through primary, secondary, and
tertiary container treatments while the controls themselves remain real package
exports. Library components are not globally restyled with descendant selectors.

The homepage introduces the system through an interactive component composition,
three exploration paths, token-backed palettes, and a copyable installation command.
Light/dark mode continues to use the existing persisted preference. Keyboard focus,
the skip link, the mobile drawer, search, and reduced-motion preferences remain
supported. Decorative artwork is excluded from the accessibility tree.

## Verification

Run the site TypeScript and documentation checks and verify the application in a
browser at desktop and phone widths, including dark mode, search, navigation,
gallery links, and the homepage controls. Build results and pre-existing failures
must be reported separately; the design does not change release readiness.

### Verified on this working tree

- `bun run --cwd apps/site typecheck` — passed.
- `bun x vite build` from `apps/site` — client and SSR builds passed. Existing
  malformed-selector and bundle-size warnings remain.
- `KERN_E2E_BASE_URL=http://localhost:4174 bun run test:e2e e2e/site-design.spec.ts`
  against the production preview — all nine tests passed, including top-header
  navigation, rendered typography, live controls, persisted dark mode, drawer
  dismissal/focus, search focus return, and five phone-width page checks.
- `KERN_E2E_BASE_URL=http://localhost:4174 bun run test:e2e` — the complete
  browser suite passed all 21 tests, including dialog focus trapping, sheet
  dismissal/reopening, painted-page verification, and screenshot seed captures.
- Biome on the 21 edited source/test files — passed.
- Site navigation and typography checks — passed.
- Desktop screenshots of home, docs, gallery, button reference, studio, and
  blocks, plus dark and phone home screenshots — no page errors or horizontal
  overflow in the measured desktop panes.

The complete `check:docs` command remains blocked by 12 errors in existing
component content/inventory (raw values and RichTooltip metadata). The standalone
heading check also reports pre-existing reference/archive anchor errors. Those
files were not changed for this redesign; neither gate is claimed green.
