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

/** Roles that are NOT contrast-bearing and are exempt by name, with a reason. */
export type ContrastWaiver = readonly [role: string, reason: string];

/**
 * A design system's contrast policy: explicit pair lists plus named waivers.
 * There are no built-in pairs here — a caller supplies the policy that belongs
 * to the scheme under test (M3's lives in `material-3.ts`). An engine that
 * invented pairs for an unknown role set would be guessing at semantics.
 */
export type ContrastPolicy = {
  textPairs: ReadonlyArray<ContrastPair>;
  uiPairs: ReadonlyArray<ContrastPair>;
  waivers: ReadonlyArray<ContrastWaiver>;
};



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
  pairs: ReadonlyArray<ContrastPair>,
  waivers: ReadonlyArray<ContrastWaiver> = [],
): string[] {
  const covered = new Set<string>();
  for (const [fg, bg] of pairs) {
    if (roles[fg]) covered.add(fg);
    if (roles[bg]) covered.add(bg);
  }
  const waived = new Map(waivers.map(([role, reason]) => [role, reason]));
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
  policy: ContrastPolicy,
): string[] {
  const issues: string[] = [];
  const textPairs = policy.textPairs;
  const uiPairs = policy.uiPairs;

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
  waivers: ReadonlyArray<ContrastWaiver> = [],
): ReadonlyArray<ContrastWaiver> {
  return waivers.filter(([role]) => typeof roles[role] === "string");
}
