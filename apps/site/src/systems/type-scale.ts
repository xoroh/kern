/**
 * The site's typography, resolved from the kern type scale.
 *
 * Every role resolves to `--md-sys-typescale-<role>-*`, so type is GENERATED
 * rather than typed. `scripts/check-typescale.mjs` rejects any ad-hoc
 * `text-*` / `font-*` / `tracking-*` / `leading-*` utility in rendered source
 * — the page that teaches the type scale must use it.
 *
 * `font-mono` is deliberately NOT banned: a code face is a semantic choice,
 * not a scale escape. What must be on-scale is its SIZE, which comes from the
 * label/body roles below.
 *
 * Import these rather than repeating the property list — one place to change
 * if the token names ever move.
 */

const ts = (role: string) =>
  [
    `[font-family:var(--md-sys-typescale-${role}-font-family)]`,
    `[font-size:var(--md-sys-typescale-${role}-font-size)]`,
    `[font-weight:var(--md-sys-typescale-${role}-font-weight)]`,
    `[line-height:var(--md-sys-typescale-${role}-line-height)]`,
    `[letter-spacing:var(--md-sys-typescale-${role}-letter-spacing)]`,
  ].join(" ");

/** Page title — the one h1. */
export const T_PAGE = ts("headline-medium");
/** Section heading. */
export const T_SECTION = ts("headline-small");
/** Sub-heading inside a section. */
export const T_SUB = ts("title-large");
/** Prominent label or a lede. */
export const T_LEAD = ts("title-medium");
/** Small heading over a group. */
export const T_SMALL_TITLE = ts("title-small");
/** Running text. */
export const T_BODY = ts("body-large");
/** Body copy at 14px — body-medium. The role the ad-hoc `text-sm` was reaching
 * for: same size, but generated from the token, not typed. */
export const T_BODY_MD = ts("body-medium");
/** Secondary / dense text, table cells, captions. */
export const T_BODY_SM = ts("body-small");
/** Micro-labels, inline literals, required markers. */
export const T_LABEL = ts("label-small");
/** Field names and definition terms. */
export const T_LABEL_MD = ts("label-medium");
/** Chip values and key caps. */
export const T_LABEL_LG = ts("label-large");
/** Eyebrow kicker — label-large voice with the wide eyebrow spacing the old
 * hand-typed kickers carried. The spacing lives here, once, so call sites
 * never re-type a `tracking-[...]` utility (the typescale gate bans those in
 * chrome and routes). Always rendered uppercase by the Kicker component. */
export const T_KICKER = `${ts("label-large")} [letter-spacing:0.18em]`;
/** Code and token ids — mono is kept, the SIZE is on-scale. */
export const T_CODE = `font-mono ${ts("body-small")}`;
/** Keyboard key caps. */
export const T_KEY = `font-mono ${ts("label-large")}`;
/** Display accent (hero numerals, big stats). */
export const T_DISPLAY = ts("display-small");

export { ts as typescaleRole };
