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

/** Text/semantic fill pairs that must meet WCAG AA. */
export const TEXT_ROLE_PAIRS: ReadonlyArray<ContrastPair> = [
  ["onPrimary", "primary"],
  ["onPrimaryContainer", "primaryContainer"],
  ["onSecondary", "secondary"],
  ["onSecondaryContainer", "secondaryContainer"],
  ["onTertiary", "tertiary"],
  ["onTertiaryContainer", "tertiaryContainer"],
  ["onError", "error"],
  ["onErrorContainer", "errorContainer"],
  ["onSuccess", "success"],
  ["onSuccessContainer", "successContainer"],
  ["onWarning", "warning"],
  ["onWarningContainer", "warningContainer"],
  ["onInfo", "info"],
  ["onInfoContainer", "infoContainer"],
  ["onSurface", "surface"],
  ["onSurface", "surfaceTonal"],
  ["onSurface", "surfaceContainerLowest"],
  ["onSurface", "surfaceContainerLow"],
  ["onSurface", "surfaceContainer"],
  ["onSurface", "surfaceContainerHigh"],
  ["onSurface", "surfaceContainerHighest"],
  ["onSurfaceVariant", "surface"],
  ["inverseOnSurface", "inverseSurface"],
];

/** Minimum non-text contrast for control boundaries/indicator roles. */
export const UI_ROLE_PAIRS: ReadonlyArray<ContrastPair> = [
  ["outline", "surface"],
  ["outline", "surfaceContainer"],
  ["secondary", "surface"],
];

export function contrastIssues(
  roles: Record<string, string>,
  textMinimum = 4.5,
  uiMinimum = 3,
): string[] {
  const issues: string[] = [];
  for (const [foreground, background] of TEXT_ROLE_PAIRS) {
    const fg = roles[foreground];
    const bg = roles[background];
    if (!fg || !bg) {
      issues.push(`missing ${foreground}/${background}`);
    } else if (contrastRatio(fg, bg) < textMinimum) {
      issues.push(
        `${foreground}/${background} is ${contrastRatio(fg, bg).toFixed(2)}:1; needs ${textMinimum}:1`,
      );
    }
  }
  for (const [foreground, background] of UI_ROLE_PAIRS) {
    const fg = roles[foreground];
    const bg = roles[background];
    if (!fg || !bg) {
      issues.push(`missing ${foreground}/${background}`);
    } else if (contrastRatio(fg, bg) < uiMinimum) {
      issues.push(
        `${foreground}/${background} is ${contrastRatio(fg, bg).toFixed(2)}:1; needs ${uiMinimum}:1`,
      );
    }
  }
  return issues;
}
