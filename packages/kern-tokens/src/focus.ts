/**
 * Kern focus ring — the shared spec (framework-agnostic).
 *
 * Every renderer paints the same ring: a 2px stroke in the `secondary`
 * role with no offset, shown on keyboard focus only (`:focus-visible` on
 * web). Web binds it as `FOCUS_RING_CLASS` in `@xoroh/kern`
 * (`src/components/focus-ring.tsx`); native is touch-first and paints no
 * keyboard ring today, so the spec is recorded here rather than rendered
 * there. A renderer that paints a different ring is a deliberate
 * asymmetry — see the parity policy — not a drift.
 *
 * Pure TypeScript — no React, no DOM, no React Native — so web and native
 * resolve one identical spec from here.
 */

/** Focus-ring stroke width, in px. */
export const FOCUS_RING_WIDTH_PX = 2;

/**
 * Focus-ring color role. Always `secondary` — the treatment never varies
 * by component, so a per-component color would be a second ring.
 */
export const FOCUS_RING_COLOR_ROLE = "secondary" as const;

/** The only color role the focus ring may use. See `FOCUS_RING_COLOR_ROLE`. */
export type FocusRingColorRole = typeof FOCUS_RING_COLOR_ROLE;

/** Focus-ring offset, in px. Zero — the ring sits on the control's edge. */
export const FOCUS_RING_OFFSET_PX = 0;
