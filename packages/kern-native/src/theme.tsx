import {
  type ColorRole,
  type Contrast,
  type Mode,
  type MotionAlgorithmId,
  type ResolvedMotionScheme,
  type ResolvedTheme,
  resolveMotionScheme,
  resolveThemeDetails,
  type ShapeRole,
  type ThemeSelection,
} from "@xoroh/kern-tokens";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type {
  MotionAlgorithmId,
  ResolvedMotionScheme,
  SpringConfig,
  SpringKind,
} from "@xoroh/kern-tokens";
export {
  prefersReducedMotion,
  resolveMotionScheme,
  springConfig,
} from "@xoroh/kern-tokens";
export type { ColorRole, Contrast, Mode, ShapeRole, ThemeSelection };

export type NativeThemeContextValue = {
  mode: Mode;
  contrast: Contrast;
  variant: ThemeSelection;
  scheme: ReturnType<typeof resolveThemeDetails>;
  setMode: (mode: Mode) => void;
  useSystem: () => void;
  toggle: () => void;
};

const ThemeContext = createContext<NativeThemeContextValue | null>(null);

export type KernThemeProviderProps = PropsWithChildren<{
  mode?: Mode;
  defaultMode?: Mode;
  contrast?: Contrast;
  variant?: ThemeSelection;
}>;

/** Supplies a shared, live color/shape scheme to native components. */
export function KernThemeProvider({
  mode: controlledMode,
  defaultMode,
  contrast = "standard",
  variant = "material-3",
  children,
}: KernThemeProviderProps) {
  const osMode = useColorScheme();
  const [manualMode, setManualMode] = useState<Mode | undefined>(defaultMode);
  const mode =
    controlledMode ?? manualMode ?? (osMode === "dark" ? "dark" : "light");
  const scheme = useMemo(
    () => resolveThemeDetails(mode, contrast, variant),
    [mode, contrast, variant],
  );
  const setMode = useCallback(
    (next: Mode) => {
      if (controlledMode === undefined) setManualMode(next);
    },
    [controlledMode],
  );
  const toggle = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode],
  );
  const useSystem = useCallback(() => {
    if (controlledMode === undefined) setManualMode(undefined);
  }, [controlledMode]);
  const value = useMemo(
    () => ({ mode, contrast, variant, scheme, setMode, useSystem, toggle }),
    [mode, contrast, variant, scheme, setMode, useSystem, toggle],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

let cachedDefaultScheme: ResolvedTheme | undefined;

/**
 * Static light default for components rendered outside any provider, and the
 * N8 style-function fallback: component-layer defaults reference this
 * function instead of resolving presets themselves, so `theme.tsx` is the
 * only native component-layer importer of `resolveThemeDetails`.
 *
 * Resolved lazily and memoized since decision 010 (no global registration):
 * `@xoroh/kern-native` must be importable BEFORE the app calls
 * `registerM3()` — ESM imports evaluate before the importing module's body
 * runs, so a module-scope resolution would throw "Unknown preset" before
 * registration could ever happen. First call comes after registration (a
 * default parameter value evaluates at call time, when the app entry has
 * already run) and is then cached, keeping the old static-value semantics.
 */
export function defaultScheme(): ResolvedTheme {
  if (cachedDefaultScheme === undefined) {
    cachedDefaultScheme = resolveThemeDetails("light");
  }
  return cachedDefaultScheme;
}

/**
 * Scheme from the nearest provider without subscribing to OS appearance.
 * Components must use this: under a provider it reads context only, so one
 * screen of components costs one `useColorScheme` subscription (the
 * provider's) instead of one per component. Outside a provider it returns
 * the static light default — mount `KernThemeProvider` for OS-following
 * themes.
 */
export function useKernScheme(): ResolvedTheme {
  const context = useContext(ThemeContext);
  return context?.scheme ?? defaultScheme();
}

/** Read the active scheme; outside a provider, follow the OS appearance. */
export function useKernTheme(): NativeThemeContextValue {
  const context = useContext(ThemeContext);
  const osMode = useColorScheme();
  const mode = osMode === "dark" ? "dark" : "light";
  const scheme = useMemo(() => resolveThemeDetails(mode), [mode]);
  const setMode = useCallback((_next: Mode) => {}, []);
  const useSystem = useCallback(() => {}, []);
  const toggle = useCallback(() => {}, []);
  return (
    context ?? {
      mode,
      contrast: "standard",
      variant: "material-3",
      scheme,
      setMode,
      useSystem,
      toggle,
    }
  );
}

/**
 * Motion scheme for animated components. Foundations only: resolves the
 * `standard` / `expressive` / `reduced` algorithm to easing, durations and
 * `Animated.spring` stiffness/damping pairs from `tokens.motion`. Components
 * migrate to these values incrementally — no component is rewritten in the
 * same change that introduces the hook.
 */
export function useKernMotion(
  id: MotionAlgorithmId = "standard",
): ResolvedMotionScheme {
  return useMemo(() => resolveMotionScheme(id), [id]);
}
