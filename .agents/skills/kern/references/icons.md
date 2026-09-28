> **Kern note:** MD3 icon canon. Kern pins exactly one Symbols style — **Rounded, filled** — for all chrome on all platforms; hue assignment for category icons stays Kern expression. No other icon package, no legacy sets, no fallbacks. No color values changed here.

# MD3 Icons

## Default Set

Material Symbols variable font is default — **Rounded style only**, filled by default (`FILL 1`); no other icon package, no legacy static sets, no fallbacks.

## Axes and Sizes

4 axes: weight 100–700, fill 0–1 (state transitions, e.g. selected nav), grade (granular thickness — match text grade; 0 on light backgrounds, −25 on dark to stop bleed; positive for active emphasis), optical size. Sizes 20 / 24 / 40 / 48 (20 = dense desktop; 40/48 = display and large screens).

Layout: 24dp trim, 20dp live area + 2dp padding; artwork may extend into padding, never outside trim; on-pixel placement. Metrics: 2dp corners default (outlined = interior square; rounded = both rounded; sharp = 0dp); 2dp/400 stroke; consistent weights with squared terminals; optical corrections allowed (e.g. paperclip 1.5dp); never tilt, rotate, or fake 3D.

## Principles

Simple, bold, graphic, consistent set. Pairing: outlined ↔ dense/thin type; rounded ↔ heavy/curved brand; sharp ↔ rectangular brand. Match icon size and weight to adjacent text; baseline shift ≈ 11.5% of text size.

## Accessibility and Localization

Labels for abstract and nav icons; any complex or key-action icon under 20dp needs a label. Targets: 48dp for a 24dp icon (40dp for dense 20dp mouse/keyboard). Localize: test cultures; translate metaphors (cart/bag/basket); mind color and symbol meanings.

## Kern Pin

Pin **Rounded, filled** as the single Symbols style everywhere (4,284 upstream glyphs; Rounded/Outlined/Sharp share identical names/codepoints, so only Rounded ships). Sizes 20/24/40/48; 24dp trim / 20dp live + 2dp padding; on-pixel; min weight 200 at 24dp; consistent weight per surface; grade 0 / −25 for bleed; unfilled (`FILL 0`) for unselected states only. Only weight 400 shape data ships today — requesting another weight dev-warns and substitutes the nearest available.

## Governance (two layers)

- **Full contract, committed subset:** the icon-name union type in `packages/kern/src/` holds all upstream Rounded glyph names, so any valid name typechecks. Only the committed subset (the icon registry in `packages/kern/src/`) renders — a contract name with no committed shape data dev-warns and renders `null`. To add one: list it in the icon-set config and run the repo's generate script. Never add hand-written names, never gate one-off usage.
- **Semantic map, unification only:** the semantic icon map in `packages/kern/src/` maps a recurring *meaning* to one decided symbol (same meaning = same icon on web + native). Add an alias only when a second surface needs a meaning already in use elsewhere — never inline a raw glyph name twice for the same meaning. One-off, screen-specific icons stay raw names; if the design changes a shared meaning, it is a one-line change.
