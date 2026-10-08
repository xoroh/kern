/**
 * Foundation colour usage — which role for which surface, and the rules
 * that govern the choice.
 *
 * The Color page's matrix answers "what roles exist"; this module answers
 * "where each role goes". Both halves read the same source: every role name
 * below must exist in `COLOR_ROLES` (`color.ts`, derived from the theme
 * package), and `check-tokens` fails the build if one does not — a usage
 * entry naming a role kern does not ship is a gate failure, not a stale
 * sentence. Coverage runs the other way too: every token role appears as a
 * fill or an ink somewhere below, so a new role renders unguided-noise (a
 * gate failure) rather than quietly undocumented.
 *
 * Per M3 usage, with kern's 13 extras folded in: the four status families
 * (K2 — info/success/warning + error) each get fill and container slots, and
 * surfaceTonal (K3) gets a tonal-surface slot pairing with on-surface, per
 * the theme package's own `$comment`.
 */
import { COLOR_ROLES } from "./color";

/**
 * One surface job: the fills that may paint it and the ink that letters it.
 *
 * `ink` is the on-companion the pairing law promises; `inkAlt` is the
 * quieter second ink where one exists (onSurfaceVariant beside onSurface,
 * onXFixedVariant beside onXFixed). Slots with no `ink` are not lettered
 * surfaces at all — boundaries are lines, scrims dim, shadows cast — and
 * say so in `body` rather than borrowing an ink.
 */
export type SurfaceSlot = {
  /** Stable id, used as the section anchor suffix. */
  slot: string;
  /** Display title. */
  title: string;
  /** What goes here, and what must not. */
  body: string;
  /** Fill roles valid for this slot. */
  fills: string[];
  /** The ink that letters these fills. Absent where no ink pairs. */
  ink?: string;
  /** The quieter second ink, where the grammar defines one. */
  inkAlt?: string;
  /** True when the slot's fills are kern additions, not Material 3's. */
  kernExtra: boolean;
};

export const SURFACE_SLOTS: SurfaceSlot[] = [
  {
    slot: "page",
    title: "Page background",
    body: "The page itself. One role only — never a container, never an accent. Everything else nests inside it.",
    fills: ["surface"],
    ink: "onSurface",
    inkAlt: "onSurfaceVariant",
    kernExtra: false,
  },
  {
    slot: "containers-low",
    title: "Low-emphasis containers",
    body: "The first nesting step above the page: cards, sheets and wells at rest. Climb one step per nesting level — a low container sits on the page, not on another container.",
    fills: ["surfaceContainerLowest", "surfaceContainerLow"],
    ink: "onSurface",
    inkAlt: "onSurfaceVariant",
    kernExtra: false,
  },
  {
    slot: "containers",
    title: "Default containers",
    body: "The working container: cards, dialogs and panels. The middle of the ladder — low below it, high above it.",
    fills: ["surfaceContainer"],
    ink: "onSurface",
    inkAlt: "onSurfaceVariant",
    kernExtra: false,
  },
  {
    slot: "containers-high",
    title: "High-emphasis containers",
    body: "The top of the resting ladder: elevated cards, open menus, surfaces that must read above their siblings. Never directly on the page — a jump that far up the ladder is a hierarchy skipped, not emphasis.",
    fills: ["surfaceContainerHigh", "surfaceContainerHighest"],
    ink: "onSurface",
    inkAlt: "onSurfaceVariant",
    kernExtra: false,
  },
  {
    slot: "scheme-extremes",
    title: "Scheme extremes",
    body: "The darkest and lightest surfaces of the scheme. Structural anchors for scrims and edges, not everyday fills — reach for the container ladder first.",
    fills: ["surfaceDim", "surfaceBright"],
    ink: "onSurface",
    kernExtra: false,
  },
  {
    slot: "tonal",
    title: "Tonal surfaces",
    body: "kern's tonal emphasis fill (K3): a band or section that must read apart from the page without spending the brand accent. Pairs with on-surface — it is a surface with emphasis, not a container with its own ink.",
    fills: ["surfaceTonal"],
    ink: "onSurface",
    inkAlt: "onSurfaceVariant",
    kernExtra: true,
  },
  {
    slot: "brand-fill",
    title: "Brand fills",
    body: "The brand accent at full saturation: filled buttons, FABs, selected states, progress. Lettered only with its on-companion.",
    fills: ["primary"],
    ink: "onPrimary",
    kernExtra: false,
  },
  {
    slot: "brand-container",
    title: "Brand containers",
    body: "Tonal brand surfaces: tonal buttons, selected chips, highlight bands. Lettered with the on-container, never with the fill family's base ink — the tonal contract is fill and ink from the same pair.",
    fills: ["primaryContainer"],
    ink: "onPrimaryContainer",
    kernExtra: false,
  },
  {
    slot: "secondary-fill",
    title: "Supporting fills",
    body: "The secondary accent: less prominent actions and accents that must not compete with primary. Same pairing law as the brand family.",
    fills: ["secondary"],
    ink: "onSecondary",
    kernExtra: false,
  },
  {
    slot: "secondary-container",
    title: "Supporting containers",
    body: "Tonal secondary surfaces, lettered with their own on-container.",
    fills: ["secondaryContainer"],
    ink: "onSecondaryContainer",
    kernExtra: false,
  },
  {
    slot: "tertiary-fill",
    title: "Balancing fills",
    body: "The tertiary accent: balancing highlights against primary and secondary. Same pairing law.",
    fills: ["tertiary"],
    ink: "onTertiary",
    kernExtra: false,
  },
  {
    slot: "tertiary-container",
    title: "Balancing containers",
    body: "Tonal tertiary surfaces, lettered with their own on-container.",
    fills: ["tertiaryContainer"],
    ink: "onTertiaryContainer",
    kernExtra: false,
  },
  {
    slot: "error-fill",
    title: "Error fills",
    body: "Destructive actions and failure emphasis only. A caution is not a failure — the status families below exist so error stays meaningful.",
    fills: ["error"],
    ink: "onError",
    kernExtra: false,
  },
  {
    slot: "error-container",
    title: "Error containers",
    body: "Error banners and invalid-field wells, lettered with the on-container.",
    fills: ["errorContainer"],
    ink: "onErrorContainer",
    kernExtra: false,
  },
  {
    slot: "success-fill",
    title: "Success fills",
    body: "kern's success accent (K2): confirmations and passing states that must say “right” without borrowing error's vocabulary.",
    fills: ["success"],
    ink: "onSuccess",
    kernExtra: true,
  },
  {
    slot: "success-container",
    title: "Success containers",
    body: "Success banners and valid-state wells, lettered with the on-container.",
    fills: ["successContainer"],
    ink: "onSuccessContainer",
    kernExtra: true,
  },
  {
    slot: "warning-fill",
    title: "Warning fills",
    body: "kern's warning accent (K2): cautions and degraded states. A warning is not an error — spending error here teaches readers that error means “notice”.",
    fills: ["warning"],
    ink: "onWarning",
    kernExtra: true,
  },
  {
    slot: "warning-container",
    title: "Warning containers",
    body: "Caution banners and at-risk wells, lettered with the on-container.",
    fills: ["warningContainer"],
    ink: "onWarningContainer",
    kernExtra: true,
  },
  {
    slot: "info-fill",
    title: "Info fills",
    body: "kern's info accent (K2): neutral notices and informational emphasis. The quietest of the status families by intent.",
    fills: ["info"],
    ink: "onInfo",
    kernExtra: true,
  },
  {
    slot: "info-container",
    title: "Info containers",
    body: "Notice banners and tip wells, lettered with the on-container.",
    fills: ["infoContainer"],
    ink: "onInfoContainer",
    kernExtra: true,
  },
  {
    slot: "fixed-primary",
    title: "Scheme-locked brand accents",
    body: "Fixed roles stay constant across light and dark: elements that must keep their colour whatever the scheme. The dim variant is the contrast-gated alternative (K9); the variant ink is the weaker emphasis within the pair.",
    fills: ["primaryFixed", "primaryFixedDim"],
    ink: "onPrimaryFixed",
    inkAlt: "onPrimaryFixedVariant",
    kernExtra: false,
  },
  {
    slot: "fixed-secondary",
    title: "Scheme-locked supporting accents",
    body: "The secondary fixed pair, same contract as the brand fixed pair.",
    fills: ["secondaryFixed", "secondaryFixedDim"],
    ink: "onSecondaryFixed",
    inkAlt: "onSecondaryFixedVariant",
    kernExtra: false,
  },
  {
    slot: "fixed-tertiary",
    title: "Scheme-locked balancing accents",
    body: "The tertiary fixed pair, same contract as the brand fixed pair.",
    fills: ["tertiaryFixed", "tertiaryFixedDim"],
    ink: "onTertiaryFixed",
    inkAlt: "onTertiaryFixedVariant",
    kernExtra: false,
  },
  {
    slot: "boundaries",
    title: "Boundaries",
    body: "Dividers, outlines and field borders. Lines, not fills — no ink pairs with them, and filling a surface with a boundary role is a category error, not a quiet choice.",
    fills: ["outline", "outlineVariant"],
    kernExtra: false,
  },
  {
    slot: "inverse",
    title: "Inverse surfaces",
    body: "Dark-on-light / light-on-dark flips: snackbars, tooltips, elements that must read against the scheme. Lettered with the inverse ink; inversePrimary is the accent that survives the flip.",
    fills: ["inverseSurface", "inversePrimary"],
    ink: "inverseOnSurface",
    kernExtra: false,
  },
  {
    slot: "behind",
    title: "Behind the page",
    body: "Scrim dims everything beneath a modal; shadow casts beneath an elevated surface. Neither is a surface and neither takes ink — they act on what is behind or below.",
    fills: ["scrim", "shadow"],
    kernExtra: false,
  },
];

/**
 * One usage rule: a law with a live demonstration.
 *
 * `do` and `dont` are fill/ink pairs painted with the theme's own values on
 * the Color page, so a rule that stops holding is visible rather than merely
 * wrong. Contrast pairs and tonal pairing are rules here, not prose — each
 * names the exact roles the law binds.
 */
export type UsageRule = {
  /** Stable id, used as the rule anchor suffix. */
  id: string;
  title: string;
  body: string;
  do: { fill: string; ink: string; label: string };
  dont: { fill: string; ink: string; label: string };
};

export const USAGE_RULES: UsageRule[] = [
  {
    id: "pairing-law",
    title: "Ink a fill with its on-companion",
    body: "Every fill role ships the ink it was contrast-gated against: its on-companion. That pair is the only text pairing the system promises — any other ink is an untested opinion about two values that move independently.",
    do: {
      fill: "primary",
      ink: "onPrimary",
      label: "primary behind, onPrimary in front — the promised pair",
    },
    dont: {
      fill: "primary",
      ink: "primary",
      label: "the same role both sides — nothing keeps these apart",
    },
  },
  {
    id: "tonal-pairing",
    title: "Tonal fills pair inside their own family",
    body: "A container role and its on-container are tuned as one tonal step. Crossing families — one family's fill with another's ink — breaks the tonal contract the shade was built to keep.",
    do: {
      fill: "primaryContainer",
      ink: "onPrimaryContainer",
      label: "both from the primary tonal pair",
    },
    dont: {
      fill: "primaryContainer",
      ink: "onSecondaryContainer",
      label: "fill and ink from different families",
    },
  },
  {
    id: "status-not-error",
    title: "Cautions are warnings, not errors",
    body: "The status families exist so error keeps its meaning: failure and destruction. Spending error on a caution teaches readers that error means “notice”, and the real failure inherits the discount.",
    do: {
      fill: "warningContainer",
      ink: "onWarningContainer",
      label: "a caution in the warning pair",
    },
    dont: {
      fill: "errorContainer",
      ink: "onErrorContainer",
      label: "the same caution in error — meaning spent",
    },
  },
  {
    id: "one-step",
    title: "Climb the container ladder one step at a time",
    body: "Nesting is one ladder step per level: page to low, low to default, default to high. Skipping steps collapses the hierarchy the ladder exists to show.",
    do: {
      fill: "surfaceContainerLow",
      ink: "onSurface",
      label: "low on the page — one step up",
    },
    dont: {
      fill: "surfaceContainerHighest",
      ink: "onSurface",
      label: "highest straight on the page — three steps skipped",
    },
  },
  {
    id: "ink-is-ink",
    title: "On-roles are inks, never fills",
    body: "An on-role is tuned as a foreground: contrast against its fill, not presence as a surface. Filling with an ink inverts the contrast budget the pair was gated on.",
    do: {
      fill: "surfaceContainer",
      ink: "onSurfaceVariant",
      label: "the quiet ink lettering a container",
    },
    dont: {
      fill: "onSurfaceVariant",
      ink: "surfaceContainer",
      label: "the pair inverted — ink as fill",
    },
  },
  {
    id: "lines-are-lines",
    title: "Boundaries stay boundaries",
    body: "Outline roles draw lines. Filling a surface with a boundary role borrows a line's value for an area's job — the contrast budget of a 1px stroke does not scale to a fill.",
    do: {
      fill: "surfaceContainerHigh",
      ink: "onSurface",
      label: "a high container for an emphasized area",
    },
    dont: {
      fill: "outlineVariant",
      ink: "onSurface",
      label: "a boundary value stretched into a fill",
    },
  },
];

/**
 * One composed scene: several roles doing one job together, painted with
 * the theme's own values.
 *
 * Rules show pairs; scenes show assemblies — the backdrop a page gives, the
 * panel a container gives, and the accent that acts on it. Every role named
 * here is covered by the same existence gate as the map and the rules.
 */
export type UsageScene = {
  /** Stable id, used as the scene anchor suffix. */
  id: string;
  title: string;
  body: string;
  backdrop: string;
  panel: string;
  panelInk: string;
  accent: string;
  accentInk: string;
};

export const USAGE_SCENES: UsageScene[] = [
  {
    id: "settings-card",
    title: "A settings card",
    body: "The everyday assembly: the page behind, a default container holding, body ink lettering, the brand accent acting.",
    backdrop: "surface",
    panel: "surfaceContainer",
    panelInk: "onSurface",
    accent: "primary",
    accentInk: "onPrimary",
  },
  {
    id: "warning-banner",
    title: "A caution banner",
    body: "A warning container lettered with its on-container, the warning accent marking the severity rail. Error is nowhere in this picture — that absence is the K2 decision, visible.",
    backdrop: "surface",
    panel: "warningContainer",
    panelInk: "onWarningContainer",
    accent: "warning",
    accentInk: "onWarning",
  },
  {
    id: "tonal-section",
    title: "A tonal section",
    body: "kern's tonal surface (K3) banding a section apart from the page without spending the brand accent — lettered with on-surface, balanced with the secondary accent.",
    backdrop: "surface",
    panel: "surfaceTonal",
    panelInk: "onSurface",
    accent: "secondary",
    accentInk: "onSecondary",
  },
  {
    id: "inverse-bar",
    title: "An inverse bar",
    body: "The scheme flipped: an inverse surface lettered with the inverse ink, inversePrimary the accent that survives the flip.",
    backdrop: "surface",
    panel: "inverseSurface",
    panelInk: "inverseOnSurface",
    accent: "inversePrimary",
    accentInk: "inverseSurface",
  },
];

/**
 * Every role the map, the rules and the scenes name — sorted, deduplicated.
 * `check-tokens` asserts each exists in the theme and that the set covers
 * every token role, so usage can neither name a phantom nor orphan a role.
 */
export const COLOR_USAGE_ROLES: string[] = [
  ...new Set([
    ...SURFACE_SLOTS.flatMap((s) => [
      ...s.fills,
      ...(s.ink ? [s.ink] : []),
      ...(s.inkAlt ? [s.inkAlt] : []),
    ]),
    ...USAGE_RULES.flatMap((r) => [r.do.fill, r.do.ink, r.dont.fill, r.dont.ink]),
    ...USAGE_SCENES.flatMap((s) => [
      s.backdrop,
      s.panel,
      s.panelInk,
      s.accent,
      s.accentInk,
    ]),
  ]),
].sort();

/** Slot count, measured — the Color page reads this, never a literal. */
export const SURFACE_SLOT_COUNT = SURFACE_SLOTS.length;
export const USAGE_RULE_COUNT = USAGE_RULES.length;
export const USAGE_SCENE_COUNT = USAGE_SCENES.length;

/** Names the theme ships, for the coverage half of the gate. */
const TOKEN_ROLE_NAMES: ReadonlySet<string> = new Set(
  COLOR_ROLES.map((r) => r.name),
);

/**
 * Roles the usage guidance never names — exported so the gate can fail on
 * orphans by name rather than by count. Empty by construction; a non-empty
 * array is the gate input, not page copy.
 */
export const COLOR_USAGE_ORPHANS: string[] = [...TOKEN_ROLE_NAMES].filter(
  (name) => !COLOR_USAGE_ROLES.includes(name),
);
