/**
 * Seed -> primary-family roles for the theme configurator.
 *
 * WHAT THIS IS: a stated approximation, not the M3 scheme algorithm. Material
 * 3 derives full schemes from a seed with HCT; this package does not expose
 * that algorithm, so the configurator does the honest subset:
 *
 *  1. `makeHueRamp({ hex: seed })` (root-exported from `@xoroh/kern-tokens`)
 *     builds the 50-950 tonal ramp in the seed's hue. The ramp is the
 *     package's own color science — nothing here invents a color.
 *  2. Each primary-family role takes the ramp step nearest its M3 baseline
 *     tone (spec: material.io baseline scheme — light primary T40,
 *     onPrimary T100, container T90, onContainer T10; dark 80/20/30/90).
 *     Ramp steps run light→dark as 50..950 while M3 tones run dark→light as
 *     0..100, so step = nearest valid step to (100 - tone) * 10, with tone
 *     100 snapping to 50 (lightest) and tone 0 to 950 (darkest).
 *
 * BOUNDARIES (stated on the page, enforced here by omission):
 *  - Primary family only (4 roles x 2 modes). Secondary, tertiary, error,
 *    surface and everything else stay on the selected preset. A seed that
 *    silently repaints error red would be a claim about M3's scheme rules
 *    this module does not implement.
 *  - No numeric contrast claim: `contrastRatio` is not root-exported, so the
 *    page argues from the mapping (M3's canonical pairs are designed to
 *    pass) rather than printing ratios it cannot compute.
 */
import { makeHueRamp } from "@xoroh/kern-tokens";

export type Mode = "light" | "dark";

type FamilyRole =
  | "primary"
  | "onPrimary"
  | "primaryContainer"
  | "onPrimaryContainer";

/** M3 baseline tones per role per mode (material.io baseline scheme). */
const BASELINE_TONES: Record<Mode, Record<FamilyRole, number>> = {
  light: {
    primary: 40,
    onPrimary: 100,
    primaryContainer: 90,
    onPrimaryContainer: 10,
  },
  dark: {
    primary: 80,
    onPrimary: 20,
    primaryContainer: 30,
    onPrimaryContainer: 90,
  },
};

const STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

/** Nearest ramp step to an M3 tone (inverse scales, see module doc). */
export function stepForTone(tone: number): string {
  const target = (100 - tone) * 10;
  let best = STEPS[0];
  for (const s of STEPS) {
    if (Math.abs(Number(s) - target) < Math.abs(Number(best) - target))
      best = s;
  }
  return best;
}

/** The four primary-family srgb values for one mode, from a seed hex. */
export function seedFamily(
  seedHex: string,
  mode: Mode,
): Record<FamilyRole, string> {
  const ramp = makeHueRamp({ hex: seedHex });
  const tones = BASELINE_TONES[mode];
  return {
    primary: ramp[stepForTone(tones.primary) as keyof typeof ramp].srgb,
    onPrimary: ramp[stepForTone(tones.onPrimary) as keyof typeof ramp].srgb,
    primaryContainer:
      ramp[stepForTone(tones.primaryContainer) as keyof typeof ramp].srgb,
    onPrimaryContainer:
      ramp[stepForTone(tones.onPrimaryContainer) as keyof typeof ramp].srgb,
  };
}

/** Both modes, shaped as `defineThemePreset` overrides. */
export function seedOverrides(seedHex: string): {
  color: Record<Mode, Record<FamilyRole, string>>;
} {
  return {
    color: {
      light: seedFamily(seedHex, "light"),
      dark: seedFamily(seedHex, "dark"),
    },
  };
}
