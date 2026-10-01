/**
 * Font wiring for the showcase host.
 *
 * Per `docs/plan/native-composition.md` § 8: the *host* loads fonts,
 * components only set weights. `@xoroh/kern-native` ships the face names
 * (`kernFontFaces`) plus an injected-loader hook; the host owns `expo-font`
 * and the asset modules. Swapping the loader is the only seam.
 *
 * Imports are per-weight rather than from the package barrel: the barrel
 * re-exports all 18 Inter faces (~6MB of TTFs) into the bundle, and the Kern
 * type scale only ever uses three.
 */

import type { KernFontAssets } from "@xoroh/kern-native";
import * as ExpoFont from "expo-font";

const inter400 = require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf");
const inter500 = require("@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf");
const inter600 = require("@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf");

/** The three Inter faces Kern's type scale uses, keyed by token face name. */
export const interAssets: KernFontAssets = {
  Inter_400Regular: inter400,
  Inter_500Medium: inter500,
  Inter_600SemiBold: inter600,
};

/**
 * Registers Inter with the native font manager. `KernFontGate` in the app
 * holds the first frame until this resolves, so text never paints in the
 * system fallback.
 */
export function useInterLoaded(): boolean {
  const [loaded, error] = ExpoFont.useFonts(interAssets);
  if (error) {
    // A font failure must not brick the app: fall through to the platform
    // default rather than hanging on the gate forever.
    console.warn("Kern: Inter failed to load, using the system font.", error);
    return true;
  }
  return loaded;
}
