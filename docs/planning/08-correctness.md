# 08 — Design correctness vs M3 (lane R7-B verdict)

**Goal:** pixels match the spec. Wrong beats missing — fix P0s before P3 demos.

**Research verdict (all with file:line evidence, M3 canonical pages from content `specUrl`s):**

P0 (wrong vs spec — implement first):
- IconButton `filled` = `surface-container-highest` (`icon-button.tsx:42-43`); M3 = primary-container +
  on-primary icon; selected+filled jumps to `primary` (`:69-72`) — resting/selected disagree on "filled".
- Chip filter-selected = `primary/on-primary` (`chip.tsx:14-15`); M3 = secondary-container/
  on-secondary-container (indistinguishable from tonal button today).
- Chip assist = `surface-tonal` fill, no outline (`chip.tsx:12-13`); M3 = flat surface + outline-variant border
  (duplicates filter chip; cf `suggestion` `:20-21` correct).
- Card `filled` = `bg-surface` (`card.tsx:10`); M3 = surface-container-highest. Radius `corner-small` (`:6`);
  M3 = medium (12dp). Two token errors, one `cva`.
- Button state layers: `primary` hover dims whole button incl label (`button.tsx:25`); M3 = 8% on-primary
  overlay, text full-strength. `tonal`/`outlined` have NO hover (`:26-29`); `ghost` fills `surface-tonal` (`:31`)
  instead of primary state layer.

P1 (missing spec-mandated piece): Tabs secondary variant absent (`tabs.tsx:28-38`; `SecondaryTabs` exported yet
undemoed — pattern unreachable); SearchBar anatomy (no icon/avatar/trailing slots, `×` glyph not icon button —
`search.tsx:38-70`); SegmentedButton checkmark + sizes (`segmented-button.tsx:32-46`); Switch thumb icons
(`switch.tsx:18-21`); Slider inactive track uses removed token name `surface-tonal` + no ticks (`slider.tsx:21-34`);
Fab geometry (icon-only without `size="icon"` renders pill, `fab.tsx:15-22`); mobile parity gaps (12-list).
P2: Badge `max` truncation, Checkbox hover/focus layer, TimePicker dial "not supported" explicitness,
NavigationBar min-destination guard. Verified-correct: Button web↔native sizes (`button.tsx:46-49` vs native
`HEIGHTS`, `NATIVE_BUTTON_SIZE_TO_KERN_SIZE` documented).

**Design:** corrections are token-only (no API change); each fix carries before/after screenshots both themes.

## Work items (ordered)

- [ ] P0 token fixes (one lane: icon-button, chip ×2, card, button layers) + regression tests per fix.
- [ ] P1s in listed order (tabs → search → segmented → switch → slider → fab → mobile parity).
- [ ] P2s as filler between batches.

**Gates:** per-fix visual proof (both themes), typecheck, `check:docs` chain (token tables re-derive).
**Out of scope:** token VALUE redesign (D6) — these fixes use existing correct tokens, no new values.
