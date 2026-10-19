import {
  type CustomTheme,
  defineThemePreset,
  hctSchemeRoles,
} from "@xoroh/kern-tokens";
import { M3_ROLES } from "./kern-roles";

export type SeedThemeOptions = {
  /** Human label for docs/manifests. Defaults to `Seed <hex>`. */
  label?: string;
  /**
   * Secondary seed. Defaults to the primary hue at muted chroma
   * (M3 dynamic scheme derivation) so one hex still yields a full scheme.
   */
  secondarySeed?: string;
  /**
   * Tertiary seed. Defaults to complementary tertiary hue
   * (M3 dynamic scheme derivation) so one hex still yields a full scheme.
   */
  tertiarySeed?: string;
};

const HEX = /^#[\da-f]{6}$/i;

function filterM3Roles(roles: Record<string, string>): Record<string, string> {
  const filtered: Record<string, string> = {};
  for (const role of M3_ROLES) {
    if (role in roles) {
      filtered[role] = roles[role];
    }
  }
  return filtered;
}

/**
 * M3 dynamic color as a seed configurator (ADR-021, superseding ADR-016):
 * one hex (plus optional secondary/tertiary seeds) becomes a validated
 * `CustomTheme` extending `material-3`.
 *
 * M3 dynamic color uses the HCT color space with 0–100 tonal ramps, key-color
 * palettes, and full-scheme role mapping via `@material/material-color-utilities`
 * (`SchemeTonalSpot`). The legacy OKLCH path for M3 is removed with no backward
 * compatibility or fallbacks (ADR-020, ADR-021). All 45 M3 roles (accents,
 * error, surface, outline, inverse, fixed) move with the seed as M3 dynamic
 * color specifies.
 *
 * The result passes straight to `applyKernTheme` (web) or
 * `KernThemeProvider variant` (native) — both accept `ThemeSelection`, which
 * includes `CustomTheme`. Validation is fail-loud: a seed whose ramps cannot
 * reach contrast thresholds throws from `defineThemePreset` instead of shipping.
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

  const schemeOpts = {
    secondarySeed: opts.secondarySeed,
    tertiarySeed: opts.tertiarySeed,
  };

  const lightRoles = filterM3Roles(
    hctSchemeRoles(seed, "light", 0, schemeOpts),
  );
  const darkRoles = filterM3Roles(hctSchemeRoles(seed, "dark", 0, schemeOpts));

  return defineThemePreset({
    id,
    extends: "material-3",
    overrides: {
      color: {
        light: lightRoles,
        dark: darkRoles,
      },
    },
  });
}
