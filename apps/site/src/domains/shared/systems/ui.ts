/**
 * The site's surface & interaction kit — the visual law every page composes.
 *
 * WHY THIS EXISTS. The site redesign (v2) standardized one way to build a
 * surface so route files never re-invent them: one card treatment, one demo
 * stage, one state-layer vocabulary, one focus ring. Class STRINGS, not
 * components — call sites compose them with `cn` next to their own layout
 * classes, and the type scale stays in `type-scale.ts` (that gate lives
 * there; this file never carries type utilities).
 *
 * The reading pane is surface on a neutral surface-container-low canvas.
 * Rounded cards use the tonal container ladder; stages introduce a quiet
 * primary-container tint. Marketing panels use paired accent containers.
 *
 * LAW (from the skill's compliance table + kern-tokens.md):
 * - Cards separate by tone, with no resting shadow or perimeter stroke.
 * - Site cards use the 28px extra-large corner, stages large, pills full.
 *   These are app compositions; package component shape tokens are unchanged.
 * - Primary is the action and inline-link accent.
 * - State layers: hover = on-surface @ 8%, press = on-surface @ 10%, focus =
 *   a visible secondary ring (2px, 2px offset).
 * - Motion: standard easing, short durations, token-resolved. Never a spring.
 * - Interactive targets are ≥48dp (MIN_TARGET).
 */

/* ---------------------------------------------------------------- ink ---- */

/** Primary body ink. */
export const INK = "text-(--sys-color-on-surface)";
/** Secondary ink — descriptions, captions, table cells. */
export const INK_SOFT = "text-(--sys-color-on-surface-variant)";
/**
 * Inline link — Primary, the site's action accent. Underline appears on
 * hover; the global focus ring is
 * visible on keyboard focus.
 */
export const LINK =
  "text-(--sys-color-primary) no-underline hover:underline";

/* ------------------------------------------------------------- surfaces --- */

/**
 * CARD — rounded tonal content group. Flat, with no perimeter stroke.
 */
export const CARD =
  "site-card rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low)";

/**
 * CARD_FILLED — the next step of the tonal ladder, without a stroke.
 */
export const CARD_FILLED =
  "site-card rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container)";

/**
 * STAGE — the ONE demo chrome. Every live demo, preview, and specimen sits
 * on this tonal stage inside a CARD. The site-stage class owns the subtle
 * accent mix; it never overrides the rendered component's theme.
 */
export const STAGE =
  "site-stage rounded-(--sys-shape-corner-large) bg-(--sys-color-surface-container)";

/** A small tonal strip inside a card — code heads, table heads, callouts. */
export const STRIP =
  "rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-low)";

/* ---------------------------------------------------------- interaction --- */

/**
 * Focus ring — secondary, 2px, 2px offset. The one keyboard affordance;
 * every interactive element in chrome carries it.
 */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--sys-color-secondary)";

/** Hover state layer — on-surface @ 8% (M3 hover). */
export const HOVER_LAYER = "hover:bg-(--sys-color-on-surface)/8";
/** Press state layer — on-surface @ 10% (M3 press). */
export const PRESS_LAYER = "active:bg-(--sys-color-on-surface)/12";
/** Hover + press, the transparent-element pair. */
export const STATE_LAYERS = `${HOVER_LAYER} ${PRESS_LAYER}`;

/** Token-resolved color transition — standard easing, short duration. */
export const TRANSITION =
  "transition-colors ease-(--sys-motion-easing-standard) [transition-duration:var(--sys-motion-duration-short3)]";

/**
 * ICON_BUTTON — 48dp target (the accessibility floor), round, transparent
 * at rest with state layers. Icon glyphs render at 20–24px; the target is
 * invisible until hovered.
 */
export const ICON_BUTTON = `inline-flex size-12 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-(--sys-color-on-surface-variant) ${STATE_LAYERS} ${TRANSITION} hover:text-(--sys-color-on-surface) ${FOCUS_RING}`;

/**
 * Pill navigation — rest and active. Active uses the selected pair
 * (secondary-container / on-secondary-container); rest carries the state
 * layers. Full radius, 48dp row height.
 */
export const PILL_ACTIVE =
  "rounded-(--sys-shape-corner-full) bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)";
export const PILL_REST = `rounded-(--sys-shape-corner-full) text-(--sys-color-on-surface-variant) ${STATE_LAYERS} hover:text-(--sys-color-on-surface)`;

/** A ≥48dp interactive row (nav items, list rows, toolbar buttons). */
export const MIN_TARGET = "inline-flex min-h-12 items-center";
