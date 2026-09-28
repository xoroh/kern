> **Kern note:** MD3 component structure and anatomy. Apply Kern values on top: MD3 roles ([`kern-tokens.md`](kern-tokens.md)), `full` pills for buttons/chips/nav, `small` cards, `medium` dropdowns, one whisper shadow, Inter type. The canonical Kern values (buttons, nav items, cards, dropdowns, pills) are in [`kern-tokens.md`](kern-tokens.md).

# MD3 Component Catalog

Complete reference for Material Design 3 components. **Primary mappings:** Jetpack Compose (`androidx.compose.material3`); **web** uses `@material/web` element names and imports — [Material Web is maintenance-only](https://m3.material.io/develop/web).

## Actions

### Buttons

MD3 has 5 button types ordered by emphasis: Filled > Filled Tonal > Elevated > Outlined > Text.

> **Kern mapping:** Filled = black primary button (`bg-black text-white`), Filled Tonal = chip-gray button (`bg-[#efefef]`), Text = ghost. All buttons are `rounded-full`, height `h-9` (36px). See kern-tokens.md for role values.

**General attributes** (shared by all button types):

| Attribute | Type | Description |
|-----------|------|-------------|
| `disabled` | boolean | Disables the button |
| `href` | string | Turns button into a link |
| `trailing-icon` | boolean | Moves icon to trailing position |
| `type` | string | Form type: `button`, `submit`, `reset` |

#### Filled Button
**Element**: `md-filled-button` — primary action, highest emphasis.

```html
<md-filled-button>Get started</md-filled-button>
```

#### Filled Tonal Button
**Element**: `md-filled-tonal-button` — medium emphasis, softer than filled.

#### Elevated / Outlined / Text Buttons
`md-elevated-button`, `md-outlined-button`, `md-text-button` — descending emphasis. In Kern, prefer Filled, Filled Tonal, and Text; avoid Elevated/Outlined chrome color.

**A11y**: Use `aria-label` for icon-only buttons. Minimum touch target 48x48dp.

### FAB (Floating Action Button)
**Element**: `md-fab` — the single most important action on a screen. M3 sizes: regular 56dp / medium / large (small is deprecated); container + 24dp icon; **boxier shape, not circular**; hover 8% + elev 4, focus/press 10%; **persists on scroll**; exactly one primary action; clear icon; 16dp screen margins. Kern renders FABs as neutral pills with M3 color accents (pill shape is a Kern override — record it). Always provide `aria-label`.

Extended FAB is **not a pill** in M3: 3 sizes (small 56dp / medium 80dp / large 96dp), container + label + 24dp icon, **16dp corners**, 16dp screen margins, 6 container/on pairings, never paired with a FAB menu.

### Icon Button
**Element**: `md-icon-button` (+ `filled`, `filled-tonal`, `outlined` variants). Kern toolbar buttons: `h-9 w-9 rounded-full bg-[#efefef]`. Always provide `aria-label`.

### Segmented Buttons
Implement with standard HTML + tokens; selected segment uses `secondary-container` (Kern: `#efefef`).

## Communication

### Badge
Small dot (6dp) or large count (16dp high, max 16×34dp, ≤4 chars incl. "+"). Anchored **inside the icon bounding box at the upper-trailing edge** (offsets 6×6 small, 14×12 large) — not the screen or list right edge. Specced per nav-bar/nav-rail, active/inactive, labeled/unlabeled. Uses `error` fill + `on-error` text. Kern colorful badges keep M3 anchor and size rules; only the hue assignment is Kern expression.

### Progress Indicator
**Elements**: `md-linear-progress`, `md-circular-progress`. Attributes: `value` (0–1), `indeterminate`. Add `aria-label`.

### Snackbar
Uses `inverse-surface` + `inverse-on-surface` (Kern: black bg, white text), shape `extra-small`, `role="status" aria-live="polite"`.

### Tooltip
Plain (short label) or Rich (multi-line + actions).

## Containment

### Card
Three variants: Filled (`surface-container-highest`), Outlined (`surface` + `outline-variant` border), Elevated (`surface-container-low` + shadow).

> **Kern:** cards are `bg-white rounded-lg` (`small`, 8px) with the whisper shadow `rgba(0,0,0,0.12) 0px 4px 16px` and **no border** — the shadow defines the edge.

```html
<div class="kern-card">
  <div class="kern-card__content">
    <h3 style="font: var(--md-sys-typescale-title-medium)">Title</h3>
    <p style="font: var(--md-sys-typescale-body-medium); color: var(--md-sys-color-on-surface-variant)">
      Supporting text
    </p>
  </div>
</div>
```

```css
.kern-card {
  background: var(--md-sys-color-surface);
  border-radius: var(--md-sys-shape-corner-small); /* 8px */
  box-shadow: rgba(0,0,0,0.12) 0px 4px 16px;
  overflow: hidden;
}
.kern-card__content { padding: 20px; }
```

### Dialog / Bottom Sheet / Side Sheet
`md-dialog` with `slot="headline"`, `slot="content"`, `slot="actions"`. Sheets: Standard (persistent) or Modal (scrim). Kern overlays use the heavy whisper shadow `rgba(0,0,0,0.16) 0px 4px 16px`.

### Divider
**Element**: `md-divider` — uses `outline-variant` (Kern: `border-black/10` for chrome, `#d4d4d4` elsewhere). Attributes: `inset`, `inset-start`, `inset-end`.

### Menu / Dropdown
**Elements**: `md-menu`, `md-menu-item`.

> **Kern dropdown:** two-layer — outer `#f5f5f5` shell (`rounded-xl` = `medium`, `p-2`, whisper shadow, `border-black/10`) wrapping inner white cards with rows `h-11 px-3 hover:bg-[#efefef]`, dividers `h-px bg-[#f5f5f5]`.

## Input

### Checkbox / Radio / Switch
`md-checkbox`, `md-radio`, `md-switch`. Wrap in `<label>` or provide `aria-label`. Group radios with `role="radiogroup"`.

### Chips
**Elements**: `md-assist-chip`, `md-filter-chip`, `md-input-chip`, `md-suggestion-chip` in `md-chip-set`. M3 canon: 4 variants (assist = icon+action; filter = selectable with leading+trailing; input = avatar 24dp/12dp corners, removable, close target min 48dp; suggestion = label-only), all 32dp high with **8dp corners (rounded rect, not pill)**, 18dp icons, 16dp side padding (8dp with icon), 8dp gaps, elev 0 default.
Kern chips/type-pills: `rounded-full bg-[#efefef] px-2 py-0.5 text-xs font-medium` — the pill shape is a deliberate Kern override of M3's 8dp rect; keep M3 heights, variant semantics, and selected/dragged states.

### Slider
**Element**: `md-slider`. Attributes: `value`, `min`, `max`, `step`, `labeled`, `range`. Track/handle shape `full`.

### Text Field
**Elements**: `md-filled-text-field`, `md-outlined-text-field`. Key attributes: `label`, `type`, `required`, `error`, `error-text`, `supporting-text`, `max-length`, `rows`.

```html
<md-outlined-text-field
  label="Email"
  type="email"
  required
  supporting-text="We'll never share your email">
</md-outlined-text-field>
```

Kern: outlined preferred; container shape `small` (8px); focus outline uses `outline`/`primary` (black). Error state uses `error` (`#dc2626`).

### Date / Time Picker
Docked, Modal, or Range configurations. No `@material/web` element yet.

## Navigation

See [`navigation-patterns.md`](navigation-patterns.md) for full detail. Summary:

- **App Bar (Top)**: Center-aligned / Small (64dp), Medium (112dp), Large (152dp). Kern topbar = 56px `h-14`, `bg-white`, `border-b border-black/10`.
- **Navigation Bar**: 3–5 destinations, compact screens, bottom.
- **Navigation Rail**: 3–7 destinations, medium screens, side.
- **Navigation Drawer**: many destinations / expanded screens. Kern sidebar = `w-[220px]`, `bg-white`, `border-r border-black/10`; active item `bg-black text-white rounded-full`.
- **Tabs**: `md-primary-tab` (top-level), `md-secondary-tab` (sub-sections).

## Data Display

### List
**Elements**: `md-list`, `md-list-item`. Item slots: `start` (leading), `end` (trailing), `headline`, `supporting-text`, `trailing-supporting-text`, `overline`. `type`: `text` / `button` / `link`.

```html
<md-list>
  <md-list-item type="button">
    <md-icon slot="start">settings</md-icon>
    <div slot="headline">Settings</div>
    <md-icon slot="end">chevron_right</md-icon>
  </md-list-item>
</md-list>
```

M3 lists: **expressive (recommended)** — standard or **segmented** style with highlighted selection and shape morph — vs baseline (square, legacy). Item heights **56/72/88dp** by tallest element; ≥88dp or 3+ lines = top-align, else middle-align. Modes: single-action, multi-action, single-select, multi-select (**one selection control per item**). Interactions: expand/collapse, swipe-to-reveal (Android Views only). Custom slots carry screen-reader risk — keep the content slot widest, 48dp targets.

### Buttons — sizes, toggle, state layers
M3: default + **toggle** variants; 5 styles; **5 sizes XS–XL (S default, 40dp high)**; round or square; pressed-corner morph table; toggle swaps round↔square when selected; small padding **16dp**; optional 20dp leading/**trailing** icon; sentence-case labels; elevated = elev 1 (0 when disabled); state layers hover 8%, focus/press 10%; 48dp targets for XS/S. Kern pins filled/tonal/text at `h-9` (36px) with `rounded-full` — record the 4dp-under-default height and the no-morph stance as deliberate overrides.

### Icon Buttons — toggle, sizes, tooltips
M3: default + **toggle** (outlined-icon unselected → filled-icon selected); styles filled/tonal/outlined/**standard**; **5 sizes XS–XL (S default), 3 widths** (narrow/default/wide); round/square + press/select morph; **tooltip on hover (web)**; XS/S need 48dp targets. Kern single `h-9` tonal pill is an override — add toggle + tooltip rules when adopting.

### Dialogs — behavior law
M3: **basic** (280–560dp wide, **28dp corners**, 24dp padding, 16dp title–body and icon–title, 24dp body–actions, 8dp between buttons, 24dp icon, scrim) vs **full-screen** (0dp radius, ≤560dp wide, **56dp header + 56dp bottom bar**). Modal-blocking; **max 2 actions**, confirm closest to trailing edge (disabled until a choice is made), dismissive never disabled and never trailing of confirm; stacked = confirm above dismiss; no third "Learn more"; succinct question-headlines.

### Bottom Sheets — behavior law
M3: **standard** (persistent, no scrim, co-exists; collapse icon at full height) vs **modal** (scrim, blocks input, initial height **capped at 50%**, dismiss via item tap, scrim tap, swipe-down, or close affordance). Container only required + optional **drag handle (48dp hit target)**. **28dp top corners**, max-width **640dp** (56dp margins above that). Compact/medium only.

### Date Pickers — navigation law
M3: **docked** (desktop/forms: live text-field + dropdown calendar, keyboard and calendar both available; day/month/year menus) / **modal** (mobile fullscreen: swipe months horizontally, tap year then scroll vertically; range = tap start/end, vertical month scroll) / **modal input** (keyboard entry; swap via edit/calendar icon; required for distant dates like DOB). Docked ≥ medium screens; fullscreen modal on compact. Picker↔input swap always available.

### Text Fields — error law
M3: filled vs outlined (identical function); 56dp height; 16dp sides (12dp with icons). Supporting ↔ error text **swap, never both** (prevents layout jump), plus a mandatory error icon (non-color cue); asterisk + required-field legend; counter for limits; prefix/suffix support; max 2 trailing icons; single-line scrolls internally (long input → multi-line; web = fixed-height scrolling text area); read-only styled identically + labeled.

### Tabs — indicator law
M3: primary (icon optional, top-level, under app bar) vs secondary (label-only, sub-sections, always below primary). Indicator 3dp primary / 2dp secondary, top-rounded, inset 2dp/side, min 24dp. Heights 48dp (label) / 64dp (icon+label). Max ~4 fixed tabs (more → scrollable, first tab offset 52dp); short single-row labels. Connect tabs to panels with `aria-controls` / `role="tabpanel"`.

### Snackbar — behavior law
M3: supporting text + max 1 action + optional close icon; 1–2-line configs (48→64dp); exactly one at a time, never stacked; bottom, nudged above bottom chrome, never covering touch targets or web focus; action-less → auto-dismiss 4–10s (avoid auto-dismiss on web without inline feedback); with action → persists until acted on; pair with inline feedback near the trigger.

### Progress Indicators — behavior law
M3: linear/circular × determinate/indeterminate; switch indeterminate → determinate once progress is known, and determinate must be accurate. Active indicator + track + 4dp stop-indicator dot (required if track contrast < 3:1). Linear spans its element's width, 4dp screen inset; circular for short (<5s) indeterminate; one indicator per group (page-top for whole-group progress); never overlapping content.

### Switch, Checkbox, Radio — metrics law
Track 52×32dp switch (2dp outline when off), handle 16dp → 24dp on select (28dp pressed), fully round; optional 16dp handle icon that must communicate selection; mandatory inline label describing the on-state; 40dp state layer, 48dp target. Checkbox: **18dp box, 2dp corners**, 40dp state layer, **48dp target**; states incl. **indeterminate + error**; adjacent label keeps on-surface color regardless of selection; checkbox = multi-select (vs switch/radio). Radio: single-select; icon 20dp, state layer 40dp, target 48dp; always paired with an inline label (tapping either selects); group in a radiogroup.

### Divider — usage law
1dp, outline-variant; full-bleed 100%, **inset 16/0, middle-inset 16/16**; vertical variant exists. Usage: **visible-not-bold; prefer space first; group, don't separate individuals**. Kern's 2px-gap card-group rule already complies.

## Missing Components (adopt or explicitly reject)

### Button Groups (M3 Expressive, replaces segmented buttons)
Standard (inter-button padding XS18/S12/M8/L8/XL8; selection morphs selected and adjacent widths) vs **connected** (2dp padding all sizes; only selected morphs; outer full-round, inner-square XS4/S8/M8/L16/XL20). Single/multi/required-select; round or square; XS–XL. Never contains text or standard-icon buttons.

### Segmented Buttons → Connected Button Group
M3 Expressive deprecates segmented buttons → connected button group. 2–5 segments, 40dp high, min 12dp side padding, 1dp outline, fully rounded, 48dp target; single-select (exactly one) vs multi-select (zero to all); selecting swaps the leading icon for a checkmark; never full-width on large screens.

### Carousel
6 layouts: multi-browse, uncontained, uncontained multi-aspect, hero, center-aligned hero, full-screen (vertical, edge-to-edge). **28dp item corners**; small items 40–56dp; 16/8/8 padding; **parallax** content with **snap**; hero advances one large item, multi-browse many. If unused, record "not adopted".

### FAB Menu (M3 Expressive, replaces speed dial)
One menu size for any FAB; **2–6 actions**; **56dp close button anchored to the FAB's top-trailing corner**; items use medium-button metrics; primary/secondary/tertiary sets with contrasting close; never with extended FAB; web = menu-anchored, 4dp gap.

### Loading Indicator (M3 Expressive)
**Replaces indeterminate circular** for waits **<5s**; default + **contained**; active-indicator + container; **48dp footprint / 38dp container**; drives pull-to-refresh; never decorative; no indeterminate→determinate transitions.

### Search
**Contained** (expressive, persistent filled rounded container) vs divided/baseline (deprecated). Layouts: docked (results list below bar + scrim) vs full-screen (default on compact). Bar 56dp, 360–720dp; expands on focus (margins 24→12dp) without changing shape; leading search icon + hinted text; max 2 trailing icon buttons; optional 30dp avatar. Results use the list component (empty by default); docked height 240dp–⅔ screen.

### Split Button
Leading button (icon/label/both) + trailing button (always the expand/collapse icon, rotates on select). Same schemes/states as buttons; 2dp gap between halves, fully-rounded outer corners, inner corners 4dp (XS–M) / 8dp (L) / 12dp (XL) that morph on hover/focus/press; sizes XS–XL; menu aligns to the trailing button with a 4dp gap.

### Time Pickers
Dial vs keyboard-input variants with an always-available keyboard/clock toggle on mobile; vertical default on mobile, horizontal otherwise; 12h/24h. Dial: 256dp clock, 48dp selector handle, 96×80dp time boxes (114dp wide for 24h). Modal above a scrim, retains focus until OK/Cancel or outside-tap; never scrolls (swap orientation to stay fully visible).

### Side Sheets
**Standard** (coplanar, no scrim; tablet/desktop) vs **modal** (scrim, blocks all background interaction; mobile; may become standard at larger sizes). Headline + optional divider + optional close + bottom actions (72dp block, left-aligned). Max-width 400dp, 24dp side padding, detached margins 16dp.

### Toolbars (docked / floating)
Baseline bottom app bar deprecated → **docked** (100% width) + **floating** (fully rounded) toolbars; standard vs vibrant; vertical floating allowed opposite the rail with ≥24dp margin. Slotted container (icon buttons, buttons, text fields, overflow menu); 64dp high, ≥16dp outside margins, 8dp inter-item; trailing actions collapse into overflow at small breakpoints; FAB may dock alongside. Never shown with a nav bar on the same view.

### Tooltips — behavior law
**Plain** (label only, 24dp, 8dp padding, default above parent) vs **rich** (subhead + text + max 2 buttons/links; default bottom-right). Never cover the parent; reposition in 8dp steps to stay on-screen; auto-dismiss 1.5s after leaving the target; no persistent rich tooltips on icon buttons.

## Expressive Migration Notes (record deprecations)

Drawer (standard) → expanded rail; baseline nav bar → flexible bar; baseline rail → collapsed rail; segmented buttons → connected button group; bottom app bar → docked toolbar; baseline menu → vertical menu; indeterminate circular → loading indicator (short waits). Kern need not adopt each successor, but new work must not target dead variants.
