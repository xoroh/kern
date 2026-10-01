> **Kern note:** MD3 breakpoints, canonical layouts, spacing, and foldable guidance — used as-is by Kern. M3 now says **breakpoints / adaptive design** (renamed from window-size-classes / responsive); values unchanged. Apply Kern surfaces (`surface` = white / black) and constrain wide content for readability. Spacing follows MD3's 4dp/8dp grid.

# MD3 Layout and Responsive Design

Reference for Material Design 3's layout system: breakpoints, scaffold, canonical layouts, and responsive implementation.

## Scaffold (M3 vocabulary → Kern shell)

M3 scaffold = `bars + rails + panes`. Panes: fixed/flexible/floating/semi-permanent, 1–3 per window (Compact/Medium 1 pane; Expanded/Large 2; XL up to 3). Rails = perimeter space holding navigation rails, toolbars, FAB, chat input, and pane control. Bars frame content (app bar, nav bar). Kern mapping: `shell = scaffold`, `chrome (topbar/sidebar) = bars + rails`, `content = panes`. Safety/bar/title/content/margin rulers govern alignment. The **safety region** (OS status bar, gesture bar) sits outside the app — M3's "status bar" means that system zone, never an in-app status line. Adaptive strategies: show/hide, levitate (layering), reflow — ask per breakpoint: reveal/divide/resize/reposition/swap. Panes gain drag handles to resize/collapse; ultra-wide = multi-pane, never a wider single column; body copy 40–60 chars/line. Grids adapt columns/width/spacing; grouping is implicit (blend) or explicit (color/outline).

## Window Size Classes

MD3 defines 5 breakpoint classes (design for breakpoints, not devices; rotation/multi-window/fold changes class; plus height breakpoints):

| Class | Width Range | Typical Devices | Columns |
|-------|-----------|----------------|---------|
| Compact | < 600dp | Phone portrait | 4 |
| Medium | 600–839dp | Tablet portrait, foldable | 8 |
| Expanded | 840–1199dp | Tablet landscape, small desktop | 12 |
| Large | 1200–1599dp | Desktop | 12 |
| Extra-large | 1600dp+ | Ultra-wide, large desktop | 12 |

### CSS Media Queries (web)

```css
/* Compact (default — mobile-first) — no media query */
@media (min-width: 600px) { }   /* Medium */
@media (min-width: 840px) { }   /* Expanded */
@media (min-width: 1200px) { }  /* Large */
@media (min-width: 1600px) { }  /* Extra-large */
```

On the web, 1dp ≈ 1px at standard density.

## Margins and Gutters

| Window Size | Margins | Gutters |
|-------------|---------|---------|
| Compact | 16dp | 8dp |
| Medium | 24dp | 16dp |
| Expanded | 24dp | 16dp |
| Large | 24dp | 24dp |
| Extra-large | 24dp | 24dp |

## Spacing System

MD3 uses a 4dp base grid (with an 8dp scale for adaptive spacing). Use tokens, not scattered literals. The scale is numeric, not a `space100`-style scale: `packages/kern-tokens/src/tokens.json` keys `spacing` as 4dp steps, generated to CSS as `--spacing-<n>` and aliased `--kern-space-<n>`:

| Step | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Value | 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64px |

There is no `space100`. Reach for the nearest step rather than inventing one.

| Use | Values |
|-----|--------|
| Component internal padding | 4, 8, 12, 16, 24dp |
| Between components | 8, 12, 16, 24dp |
| Section spacing | 24, 32, 48dp |
| Layout margins | 16dp (compact), 24dp (medium+) |
| Grid gutters | 8dp (compact), 16dp (medium), 24dp (large+) |

## Canonical Layouts

Begin from one of these three, not a raw grid.

### Feed Layout
Browsable collection (cards). Columns scale: 1 (compact) → 2 (medium) → 3 (expanded) → 4 (large).

```css
.md3-feed { display: grid; gap: 8px; padding: 16px; grid-template-columns: 1fr; }
@media (min-width: 600px) { .md3-feed { grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 24px; } }
@media (min-width: 840px) { .md3-feed { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1200px) { .md3-feed { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
```

### List-Detail Layout
List of items each with detail. Compact: one at a time. Medium+: list (≈360px) + detail side by side.

### Supporting Pane Layout
Primary content + supplementary info. Compact: stacked. Medium+: 2/3 primary + 1/3 supporting.

## Adaptive Component Behavior

| Component | Compact | Medium | Expanded+ |
|-----------|---------|--------|-----------|
| Navigation | Bottom bar | Side rail | Side drawer |
| App bar | Small (64dp) | Small | Small or Medium (112dp) |
| Dialog | Full-screen | Centered | Centered (max 560dp) |
| Bottom sheet | Full height | Partial | Side sheet |
| Cards | Full-width column | Multi-column grid | Grid (max 4 cols) |
| Content panes | Single | Optional second | Two or three panes |

## Large Screens

- **Constrain content width** — don't stretch body content across ultra-wide screens; cap at ~1040dp and center. Use extra space for multi-pane layouts, not wider single columns.

```css
@media (min-width: 1200px) {
  .kern-content { max-width: 1040px; margin-inline: auto; }
}
```

- Touch targets remain 48dp minimum; add hover states for pointer devices (`@media (hover: hover)`); keyboard shortcuts expected on desktop.

## Foldables

Handle postures — **flat** (treat as Medium/Expanded), **tabletop** (split at horizontal hinge: content top, controls bottom), **book** (split at vertical hinge: list left, detail right), **folded** (treat as Compact). Never place critical/interactive content across the hinge; the **spacer** (gap between two panes on foldables) is not a drop zone for content. Web: CSS Viewport Segments API (`@media (horizontal-viewport-segments: 2)`, `env(viewport-segment-*)`).

## Bidirectionality (RTL)

Mirror layout, use leading/trailing tokens (never left/right), nav on the leading edge, mirrored back/forward/send icons, text alignment + directionality; watch email/URL/phone pitfalls. Time: linear timelines mirror except Hebrew; circular clocks stay clockwise; media controls always LTR; charts stay LTR for fa/ur. Badges, toolbars, app bars, and text-field leading/trailing slots swap. Structure-only — no color impact.

## Audit Checklist (foldable / large screen)

- [ ] Uses window size class (not hard-coded phone layout)
- [ ] Single-pane → multi-pane at 600dp
- [ ] Navigation transforms: bottom bar → rail → drawer
- [ ] Content max-width constraint on large screens
- [ ] No critical content across a fold/hinge
- [ ] Hover states for pointer devices
- [ ] 48dp minimum touch targets
- [ ] Dialogs centered (not full-screen) on medium+
