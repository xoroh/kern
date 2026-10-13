import { hexToOklch } from "./color";
import { contrastRatio } from "./contrast";
import { type CustomTheme, defineThemePreset } from "./resolve";
import { type HueRamp, makeHueRamp } from "./tones";

export type SeedThemeOptions = {
  /** Human label for docs/manifests. Defaults to `Seed <hex>`. */
  label?: string;
  /**
   * Secondary seed. Defaults to the primary hue at low chroma (M3's
   * secondary is the same hue, muted) so one hex still yields a full scheme.
   */
  secondarySeed?: string;
  /**
   * Tertiary seed. Defaults to the primary hue rotated +60° (M3's
   * complementary tertiary) so one hex still yields a full scheme.
   */
  tertiarySeed?: string;
};

const HEX = /^#[\da-f]{6}$/i;

function steps(ramp: HueRamp) {
  return {
    50: ramp["50"].srgb,
    100: ramp["100"].srgb,
    400: ramp["400"].srgb,
    900: ramp["900"].srgb,
    950: ramp["950"].srgb,
  };
}

/**
 * First candidate reaching 4.5:1 on `fill`, else the strongest candidate —
 * in which case `defineThemePreset` still fails loud below, honestly, rather
 * than shipping a low-contrast pair.
 */
function pickOn(fill: string, candidates: string[]): string {
  for (const candidate of candidates) {
    if (contrastRatio(candidate, fill) >= 4.5) return candidate;
  }
  let best = candidates[candidates.length - 1];
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = contrastRatio(candidate, fill);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  return best;
}

type FamilyRoles = {
  base: string;
  onBase: string;
  container: string;
  onContainer: string;
};

/**
 * One M3 accent family from a ramp, following the checked-in brand preset
 * (light base = 900 on 100/950, dark base = 400 on 900/100). `on-*` choices are contrast-resolved, not hardcoded, so an
 * arbitrary seed degrades to the strongest pair and then fails loud in
 * `defineThemePreset` instead of shipping unreadable text.
 */
function family(ramp: HueRamp): { light: FamilyRoles; dark: FamilyRoles } {
  const s = steps(ramp);
  return {
    light: {
      base: s[900],
      onBase: pickOn(s[900], ["#ffffff", s[950], "#000000"]),
      container: s[100],
      onContainer: pickOn(s[100], [s[950], s[900], "#000000"]),
    },
    dark: {
      base: s[400],
      onBase: pickOn(s[400], [s[950], "#000000", s[900]]),
      container: s[900],
      onContainer: pickOn(s[900], [s[100], s[50], "#ffffff"]),
    },
  };
}

function familyRoles(
  prefix: "primary" | "secondary" | "tertiary",
  f: FamilyRoles,
): Record<string, string> {
  const Cap = prefix[0].toUpperCase() + prefix.slice(1);
  return {
    [prefix]: f.base,
    [`on${Cap}`]: f.onBase,
    [`${prefix}Container`]: f.container,
    [`on${Cap}Container`]: f.onContainer,
  };
}

/**
 * M3 dynamic color as a seed configurator: one hex (plus optional secondary
 * / tertiary seeds) becomes a validated `CustomTheme` extending kern.
 *
 * This is the checked-in form of the brand story — the brand preset is a
 * hand-authored primary-family repaint, and this function generates the same
 * shape (primary + secondary + tertiary families, both modes) from any seed.
 * Error/success/warning/info/surface roles stay on the kern base; the seed
 * repaints the three accent families only.
 *
 * The result passes straight to `applyKernTheme` (web) or
 * `KernThemeProvider variant` (native) — both accept `ThemeSelection`, which
 * includes `CustomTheme`. Validation is fail-loud: a seed whose ramps cannot
 * reach 4.5:1 throws from `defineThemePreset` instead of shipping.
 */
export function themeFromSeed(
  seed: string,
  id: string,
  opts: SeedThemeOptions = {},
): CustomTheme {
  if (!HEX.test(seed)) {
    throw new Error(`Seed must be a six-digit sRGB hex, received ${seed}`);
  }
  for (const [name, value] of [
    ["secondarySeed", opts.secondarySeed],
    ["tertiarySeed", opts.tertiarySeed],
  ] as const) {
    if (value !== undefined && !HEX.test(value)) {
      throw new Error(
        `${name} must be a six-digit sRGB hex, received ${value}`,
      );
    }
  }
  const base = hexToOklch(seed);
  const primary = family(makeHueRamp(seed));
  const secondary = family(
    opts.secondarySeed
      ? makeHueRamp(opts.secondarySeed)
      : makeHueRamp({ hue: base.h, chroma: Math.min(base.c, 0.04) }),
  );
  const tertiary = family(
    opts.tertiarySeed
      ? makeHueRamp(opts.tertiarySeed)
      : makeHueRamp({ hue: (base.h + 60) % 360, chroma: base.c }),
  );
  return defineThemePreset({
    id,
    extends: "kern",
    overrides: {
      color: {
        light: {
          ...familyRoles("primary", primary.light),
          ...familyRoles("secondary", secondary.light),
          ...familyRoles("tertiary", tertiary.light),
        },
        dark: {
          ...familyRoles("primary", primary.dark),
          ...familyRoles("secondary", secondary.dark),
          ...familyRoles("tertiary", tertiary.dark),
        },
      },
    },
  });
}
