/**
 * HCT tonal engine (ADR-016, ADR-021, roadmap D-HCT).
 *
 * Spec-correct M3 dynamic color via `@material/material-color-utilities`
 * (Apache-2.0): HCT color space, 0–100 tonal ramps, key-color palettes, and
 * full-scheme role mapping through `SchemeTonalSpot` (the M3 baseline
 * dynamic-scheme variant).
 *
 * Per ADR-021, HCT is the primary tonal engine for Kern M3, superseding the
 * ADR-016 spike. The OKLCH path for M3 is removed with no backward
 * compatibility or fallbacks (ADR-020). Tonal engine choice is per system;
 * other design systems in Kern select their own canonical engine.
 */

import {
  argbFromHex,
  Hct,
  hexFromArgb,
  SchemeTonalSpot,
  TonalPalette,
} from "@material/material-color-utilities";

/** M3 tonal steps: the 0–100 ramp (cf. OKLCH `TONAL_STEPS` 50–950). */
export const HCT_TONES = [
  0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100,
] as const;

export type HctTone = (typeof HCT_TONES)[number];

export type HctKeyColor = { hue: number; chroma: number; tone: number };

const HEX = /^#[\da-f]{6}$/i;

function assertHex(seedHex: string): void {
  if (!HEX.test(seedHex)) {
    throw new Error(`Seed must be a six-digit sRGB hex, received ${seedHex}`);
  }
}

/** The HCT key color for a seed hex — M3's hue/chroma anchor. */
export function hctKeyColor(seedHex: string): HctKeyColor {
  assertHex(seedHex);
  const hct = Hct.fromInt(argbFromHex(seedHex));
  return { hue: hct.hue, chroma: hct.chroma, tone: hct.tone };
}

/** One HCT tonal ramp: every M3 tone mapped to sRGB hex. */
export function hctTonalRamp(seedHex: string): Record<HctTone, string> {
  assertHex(seedHex);
  const palette = TonalPalette.fromInt(argbFromHex(seedHex));
  const ramp = {} as Record<HctTone, string>;
  for (const tone of HCT_TONES) {
    ramp[tone] = hexFromArgb(palette.tone(tone));
  }
  return ramp;
}

export type HctMode = "light" | "dark";

/**
 * Scheme getters on `SchemeTonalSpot`, keyed by kern camelCase role name.
 * The 45 M3 roles kern ships, plus the two MCU roles kern does NOT ship
 * (`surfaceTint`, `surfaceVariant`) — included so the delta is observable,
 * never silently dropped. `background`/`onBackground` are legacy aliases of
 * `surface`/`onSurface` and are intentionally absent.
 */
const SCHEME_GETTERS = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "surfaceDim",
  "surface",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "onSurface",
  "onSurfaceVariant",
  "surfaceTint",
  "surfaceVariant",
  "outline",
  "outlineVariant",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",
  "scrim",
  "shadow",
  "primaryFixed",
  "primaryFixedDim",
  "onPrimaryFixed",
  "onPrimaryFixedVariant",
  "secondaryFixed",
  "secondaryFixedDim",
  "onSecondaryFixed",
  "onSecondaryFixedVariant",
  "tertiaryFixed",
  "tertiaryFixedDim",
  "onTertiaryFixed",
  "onTertiaryFixedVariant",
] as const;

export type HctSchemeRole = (typeof SCHEME_GETTERS)[number];

export type HctSchemeOptions = {
  secondarySeed?: string;
  tertiarySeed?: string;
};

/**
 * Full M3 scheme for a seed hex in one mode — every role resolved by the
 * dynamic scheme. Unlike the legacy 12-role accent repaint, error, surface,
 * outline, inverse, and fixed roles all move with the seed, as M3 dynamic
 * color requires. `contrastLevel` follows MCU (`0` standard; `0.5` medium,
 * `1` high).
 */
export function hctSchemeRoles(
  seedHex: string,
  mode: HctMode,
  contrastLevel = 0,
  opts?: HctSchemeOptions,
): Record<HctSchemeRole, string> {
  assertHex(seedHex);
  const scheme = new SchemeTonalSpot(
    Hct.fromInt(argbFromHex(seedHex)),
    mode === "dark",
    contrastLevel,
  );
  if (opts?.secondarySeed) {
    assertHex(opts.secondarySeed);
    (scheme as unknown as { secondaryPalette: TonalPalette }).secondaryPalette =
      TonalPalette.fromInt(argbFromHex(opts.secondarySeed));
  }
  if (opts?.tertiarySeed) {
    assertHex(opts.tertiarySeed);
    (scheme as unknown as { tertiaryPalette: TonalPalette }).tertiaryPalette =
      TonalPalette.fromInt(argbFromHex(opts.tertiarySeed));
  }
  const roles = {} as Record<HctSchemeRole, string>;
  for (const role of SCHEME_GETTERS) {
    roles[role] = hexFromArgb(scheme[role as keyof SchemeTonalSpot] as number);
  }
  return roles;
}
