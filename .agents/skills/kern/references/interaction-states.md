> **Kern note:** MD3 interaction canon — state layers, selection, gestures, and inputs. Kern keeps all of it; expression stays neutral with utility-only motion. Colors frozen — this file adds behavior only.

# MD3 Interaction: States, Selection, Gestures, Inputs

## State Layers

6 states: enabled / disabled / hover / focus / press / drag. The state layer is an `on-color` overlay at a fixed opacity:

| State | Opacity | Notes |
|-------|---------|-------|
| Hover | 8% | Cursor pause, fade in, one at a time |
| Focus | 10% | Tab/voice, visible ring indicator, one at a time |
| Press | 10% | Ripple + optional elevation lift |
| Drag | 16% | Low-emphasis overlay + elevation; cards/chips/lists/sliders only |

Layer is 40dp, target is 48dp. One layer at a time; combinable with selected/activated.

### Inheritance Matrix

Hover/press inherit to buttons, cards, chips, lists, inputs — not to app bars, badges, dialogs, menus, nav shells, tabs, or sheets (only their inner actionables get layers). When auditing, check the inner control, not the container.

### Disabled

Color + elevation change, exempt from contrast requirements, not focusable/draggable/hoverable. FABs should disappear, never show disabled.

## Selection

Selection is separate from state. Indicators: check, checkbox, or surface change. Nav bar/drawer/rail/tabs use the active indicator with single-select. Touch: long-press or avatar to enter selection, tap for more, long-press + drag for batch (unless the gesture moves content). Desktop: hover-reveals checkbox when selection is secondary.

## Gestures and Inputs

Design for touch + mouse + keyboard + stylus simultaneously. Primary click = touch feedback; secondary click = context menu; hover reveals + tooltips; cursors pointer/hand/resize/I-beam; mouse wheel scrolls the pane under the cursor. Gestures: tap, double-tap, long-press, scroll, swipe, predictive-back, drag, pick-up-move, pinch, compound — all real-time. Predictive-back must scale the surface with the gesture, never jump-cut.

## Kern Audit Additions

Nav states are `enabled/disabled/hover/focus/press/selected` (not just default/hover/active). Focus-visible ring + Tab order + skip/ARIA wiring are mandatory. No decorative press animation beyond ripple + one-level lift.
