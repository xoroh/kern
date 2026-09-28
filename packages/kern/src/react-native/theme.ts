import { useColorScheme } from "react-native";
import {
  type Contrast,
  type Mode,
  resolveTheme,
  type ThemeVariant,
} from "../theme/theme";

export type { Contrast, Mode, ThemeVariant };

export type NativeThemeOptions = {
  mode?: Mode;
  contrast?: Contrast;
  variant?: ThemeVariant;
};

/** Native theme: OS scheme by default, manual override wins. */
export function useKernTheme(options: NativeThemeOptions = {}) {
  const system = useColorScheme();
  const mode = options.mode ?? (system === "dark" ? "dark" : "light");
  const contrast = options.contrast ?? "standard";
  const variant = options.variant ?? "m3";
  return {
    mode,
    contrast,
    variant,
    scheme: resolveTheme(mode, contrast, variant),
  };
}
