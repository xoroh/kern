import {
  type Contrast,
  type Mode,
  type ResolvedTheme,
  resolveThemeDetails,
  shapeVarName,
  type ThemeSelection,
  varName,
} from "@xoroh/kern-tokens";
import { useCallback, useEffect, useMemo, useState } from "react";

export type {
  ColorRole,
  Contrast,
  CustomTheme,
  Mode,
  ResolvedTheme,
  RoleTable,
  ShapeRole,
  ShapeTable,
  ThemeId,
  ThemeOverrides,
  ThemeSelection,
} from "@xoroh/kern-tokens";
export {
  defineThemePreset,
  resolveTheme,
  resolveThemeDetails,
  shapeVarName,
  themeIds,
  varName,
} from "@xoroh/kern-tokens";

type ColorPreference = Mode | "system";

/** Apply a resolved role + shape table to an element as CSS variables. */
export function applyKernTheme(
  target: HTMLElement,
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeSelection = "m3",
): ResolvedTheme {
  const resolved = resolveThemeDetails(mode, contrast, variant);
  for (const [role, value] of Object.entries(resolved.color)) {
    target.style.setProperty(varName(role), value);
  }
  for (const [shape, value] of Object.entries(resolved.shape)) {
    target.style.setProperty(shapeVarName(shape), value);
  }
  target.classList.toggle("dark", mode === "dark");
  target.dataset.kernTheme = typeof variant === "string" ? variant : variant.id;
  target.dataset.kernContrast = contrast;
  return resolved;
}

/** Remove inline theme variables and return the target to the stylesheet default. */
export function clearKernTheme(target: HTMLElement): void {
  const m3 = resolveThemeDetails("light");
  for (const role of Object.keys(m3.color))
    target.style.removeProperty(varName(role));
  for (const shape of Object.keys(m3.shape)) {
    target.style.removeProperty(shapeVarName(shape));
  }
  target.classList.remove("dark");
  delete target.dataset.kernTheme;
  delete target.dataset.kernContrast;
}

const STORAGE_KEY = "kern-tokens-mode";

export type WebThemeOptions = {
  contrast?: Contrast;
  variant?: ThemeSelection;
};

/** Theme state: persisted preference → OS default → resolved CSS variables. */
export function useKernTheme(options: WebThemeOptions = {}) {
  const contrast = options.contrast ?? "standard";
  const variant = options.variant ?? "m3";
  const [preference, setPreference] = useState<ColorPreference>("system");
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);
  const [system, setSystem] = useState<Mode>("light");
  const mode = preference === "system" ? system : preference;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") setPreference(stored);
    } catch {
      // Storage may be unavailable (private browsing).
    }
    setPreferenceLoaded(true);
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = (event: MediaQueryListEvent) => {
      setSystem(event.matches ? "dark" : "light");
    };
    setSystem(media.matches ? "dark" : "light");
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    // Pre-Safari-14 fallback: addListener has no removal handle here, so the
    // listener lives with the page. OS tracking still works.
    media.addListener(update);
    return undefined;
  }, []);

  const scheme = useMemo(
    () => resolveThemeDetails(mode, contrast, variant),
    [mode, contrast, variant],
  );

  useEffect(() => {
    if (!preferenceLoaded || typeof document === "undefined") return;
    applyKernTheme(document.documentElement, mode, contrast, variant);
    try {
      if (preference === "system") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore persistence failures
    }
  }, [mode, preference, preferenceLoaded, contrast, variant]);

  const setMode = useCallback((next: Mode) => setPreference(next), []);
  const useSystem = useCallback(() => setPreference("system"), []);
  const toggle = useCallback(
    () => setPreference(mode === "dark" ? "light" : "dark"),
    [mode],
  );

  return {
    mode,
    preference,
    contrast,
    variant,
    scheme,
    setMode,
    useSystem,
    toggle,
  };
}
