/**
 * The Xoroh compatibility preset — the PRIVATE theme as an explicit artifact.
 *
 * Why this file exists (KERN-011): the OSS default theme is the Material 3
 * BASELINE scheme (muted violet secondary `#625b71`), per the owner's ruling.
 * Xoroh's private product theme is DIFFERENT — black/white primary, Kern blue
 * secondary (`#2563eb`), no tertiary family — and migrating Xoroh onto the OSS
 * theme without this preset would be a silent rebrand of every product
 * surface. That is the failure this preset makes impossible: the private
 * values live here, versioned and contrast-gated, instead of hiding in a
 * hoped-for resemblance.
 *
 * Source: `../xoroh-platform/libs/kern/react/src/theme/schemes.ts` (light +
 * dark `semanticBaseColors`) and `tokens/colors.ts` (Kern blue + neutral
 * ramps), read 2026-10-13. Tertiary has NO private value — the parent scheme
 * predates the tertiary family — so tertiary stays on the M3 baseline and the
 * gap is stated, not filled by invention.
 *
 * A `CustomTheme`, not a preset id: `ThemeId` stays closed (`kern`, `sharp`,
 * `brand`, `compact`, `demo`) so no consumer's exhaustive switch breaks, and
 * `defineThemePreset` validates this at module load — an invalid private value
 * fails the import, not a product screen.
 */

import { type CustomTheme, defineThemePreset } from "./resolve";

export const XOROH_PRESET: CustomTheme = defineThemePreset({
  id: "xoroh",
  extends: "material-3",
  overrides: {
    color: {
      light: {
        primary: "#000000",
        onPrimary: "#ffffff",
        primaryContainer: "#e5e5e5",
        onPrimaryContainer: "#000000",
        secondary: "#2563eb",
        onSecondary: "#ffffff",
        secondaryContainer: "#dbeafe",
        onSecondaryContainer: "#1e3a8a",
      },
      dark: {
        primary: "#ffffff",
        onPrimary: "#000000",
        primaryContainer: "#262626",
        onPrimaryContainer: "#ffffff",
        secondary: "#60a5fa",
        onSecondary: "#172554",
        secondaryContainer: "#1e3a8a",
        onSecondaryContainer: "#dbeafe",
      },
    },
  },
});
