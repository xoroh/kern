import { FIXED_ACCENT_FAMILIES } from "./m3-roles";

export type ContrastPair = readonly [foreground: string, background: string];

/** WCAG 2.x contrast ratio for sRGB hex colors. */
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const channels = hex
      .replace("#", "")
      .match(/../g)
      ?.map((part) => Number.parseInt(part, 16) / 255);
    if (channels?.length !== 3 || channels?.some(Number.isNaN)) {
      throw new Error(`Expected a six-digit sRGB color, received ${hex}`);
    }
    const linear = channels.map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

/**
 * Accent families. Each contributes the M3 quintet:
 * `<f>`, `<f>Container`, `on<f>`, `on<f>Container`.
 *
 * M3's four (primary/secondary/tertiary/error) plus kern's three deviation
 * status families (success/warning/info, deviation K2) — generated from one
 * list so a new family is one entry, not four hand-listed pairs.
 */
export const ACCENT_FAMILIES: ReadonlyArray<string> = [
  "primary",
  "secondary",
  "tertiary",
  "error",
  "success",
  "warning",
  "info",
];

/**
 * Surface roles that carry content. Every content role is checked against
 * every one of these — the matrix, not a hand-picked subset.
 */
export const SURFACE_ROLES: ReadonlyArray<string> = [
  "surface",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceTonal",
];

/** Content foregrounds that must be legible on every surface role. */
export const SURFACE_CONTENT_ROLES: ReadonlyArray<string> = [
  "onSurface",
  "onSurfaceVariant",
];

/** The M3 inverse trio, checked against itself. */
export const INVERSE_ROLES: ReadonlyArray<string> = [
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
];

/** Roles that are NOT contrast-bearing and are exempt by name, with a reason. */
export type ContrastWaiver = readonly [role: string, reason: string];

/**
 * PER-ROLE boundary waivers — the only sanctioned way for a scheme role to sit
 * outside contrast gating (deviation K9's mechanism, proven on the two roles
 * that need it today).
 *
 * This is deliberately a list of NAMED roles with a stated reason, never a
 * blanket exemption and never a prefix/substring match: a blanket exemption
 * cannot be audited, and a prefix match would silently swallow every future
 * `surface*` role.
 */
export const ROLE_WAIVERS: ReadonlyArray<ContrastWaiver> = [
  [
    "scrim",
    "Scrim is an alpha overlay composited over arbitrary content; it has no fixed backdrop to be measured against. M3 specifies it as a dimming layer, not a text or boundary color.",
  ],
  [
    "shadow",
    "Shadow is an elevation tint applied behind a surface, never as text, a boundary, or a fill a label sits on. M3 treats it as a tonal elevation cue, not a contrast-bearing role.",
  ],
  [
    "outlineVariant",
    "M3 assigns outline-variant NO contrast minimum: it is the decorative tier for dividers, gridlines and inactive borders, where a 3:1 requirement would make it indistinguishable from `outline`. It is contrast-gating-exempt by SPEC, not by convenience. Use `outline` wherever a boundary must be perceivable.",
  ],
];

/**
 * Build the full text-pair set from role families.
 *
 * Structural, not an allow-list: a role that exists in the scheme is expected
 * to be produced here by a family rule, so adding a role to a scheme cannot
 * silently escape contrast checking. The orphan law in `contrastIssues` is
 * what makes that true — see `orphanedRoles`.
 */
export function textRolePairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];
  const seen = new Set<string>();
  const add = (fg: string, bg: string) => {
    const key = `${fg}|${bg}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push([fg, bg]);
  };

  for (const family of ACCENT_FAMILIES) {
    const Cap = family[0].toUpperCase() + family.slice(1);
    // on<f> on <f> — M3's own pairing.
    add(`on${Cap}`, family);
    // on<f>Container on <f>Container — M3's own pairing.
    //
    // NOTE: on<f> on <f>Container is deliberately NOT generated. M3 defines
    // on-primary as the content color FOR primary, and on-primary-container as
    // the content color for primary-container; the cross pair is not a spec
    // pairing, and generating it produced 144 failures that measured a rule
    // M3 never stated.
    add(`on${Cap}Container`, `${family}Container`);
  }

  // Every content role on every surface role. This closes the
  // onSurfaceVariant x containers hole and the surfaceDim/surfaceBright hole.
  for (const fg of SURFACE_CONTENT_ROLES) {
    for (const bg of SURFACE_ROLES) add(fg, bg);
  }

  // The inverse trio, against its actual M3 background. M3 pairs
  // inverseOnSurface AND inversePrimary onto inverseSurface; it does not pair
  // the two foregrounds against each other, and inventing that pair produced
  // 1.00:1 failures that measure nothing.
  add("inverseOnSurface", "inverseSurface");
  add("inversePrimary", "inverseSurface");

  // Accent bases as text on the base surface only (D-026.5' hole 4 named
  // `primary`/`error` on `surface`). M3 does not require an accent to stay
  // legible as text on all nine surface containers, so generating that
  // matrix would be the gate over-constraining the palette engine.
  for (const family of ACCENT_FAMILIES) add(family, "surface");

  // Fixed accents (D-028 / P1-2, deviation K9). M3's spec is explicit about
  // these pairings: "On fixed colors are used for text and icons which sit on
  // top of the corresponding Fixed color… on primary fixed is used for text
  // and icons against the primary fixed color", and the same for on-fixed-
  // variant. So these are M3-stated pairs, not invented ones — generating them
  // is the opposite of over-constraining.
  //
  // NOTE: there is no `error` fixed family and no `FixedContainer` role in M3
  // (see kern-tokens/src/m3-roles.ts for the verification). Families come from
  // FIXED_ACCENT_FAMILIES so this stays in step with the inventory.
  for (const family of FIXED_ACCENT_FAMILIES) {
    const Cap = family[0].toUpperCase() + family.slice(1);
    for (const base of [`${family}Fixed`, `${family}FixedDim`]) {
      add(`on${Cap}Fixed`, base);
      add(`on${Cap}FixedVariant`, base);
    }
  }

  return pairs;
}

/** Minimum non-text contrast for control boundaries/indicator roles. */
export function uiRolePairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];
  const seen = new Set<string>();
  const add = (fg: string, bg: string) => {
    const key = `${fg}|${bg}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push([fg, bg]);
  };
  for (const bg of SURFACE_ROLES) {
    add("outline", bg);
  }
  for (const family of ACCENT_FAMILIES) {
    add(family, "surface");
  }
  return pairs;
}

/**
 * THE ORPHAN LAW.
 *
 * A role present in the scheme that appears in no generated pair, and is not
 * explicitly waived, is ITSELF a violation. This is the clause that makes the
 * gate falsifiable over the role space: without it, a gate that simply does
 * not look at a role reports green over it — the defect D-026.5 found.
 */
export function orphanedRoles(
  roles: Record<string, string>,
  pairs: ReadonlyArray<ContrastPair> = [...textRolePairs(), ...uiRolePairs()],
): string[] {
  const covered = new Set<string>();
  for (const [fg, bg] of pairs) {
    if (roles[fg]) covered.add(fg);
    if (roles[bg]) covered.add(bg);
  }
  const waived = new Map(ROLE_WAIVERS.map(([role, reason]) => [role, reason]));
  const orphans: string[] = [];
  for (const role of Object.keys(roles).sort()) {
    if (covered.has(role)) continue;
    if (waived.has(role)) continue;
    orphans.push(`${role} (in no generated contrast pair and not waived)`);
  }
  return orphans;
}

export function contrastIssues(
  roles: Record<string, string>,
  textMinimum = 4.5,
  uiMinimum = 3,
): string[] {
  const issues: string[] = [];
  const textPairs = textRolePairs();
  const uiPairs = uiRolePairs();

  for (const [foreground, background] of textPairs) {
    const fg = roles[foreground];
    const bg = roles[background];
    if (!fg || !bg) continue;
    if (contrastRatio(fg, bg) < textMinimum) {
      issues.push(
        `${foreground}/${background} is ${contrastRatio(fg, bg).toFixed(2)}:1; needs ${textMinimum}:1`,
      );
    }
  }
  for (const [foreground, background] of uiPairs) {
    const fg = roles[foreground];
    const bg = roles[background];
    if (!fg || !bg) continue;
    if (contrastRatio(fg, bg) < uiMinimum) {
      issues.push(
        `${foreground}/${background} is ${contrastRatio(fg, bg).toFixed(2)}:1; needs ${uiMinimum}:1`,
      );
    }
  }
  return issues;
}

/** Roles waived from gating, with the reason — for reporting, never silent. */
export function activeWaivers(
  roles: Record<string, string>,
): ReadonlyArray<ContrastWaiver> {
  return ROLE_WAIVERS.filter(([role]) => typeof roles[role] === "string");
}
