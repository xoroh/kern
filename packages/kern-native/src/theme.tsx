import {
  type ColorRole,
  type Contrast,
  type Mode,
  type ResolvedTheme,
  resolveThemeDetails,
  type ShapeRole,
  type ThemeSelection,
} from "@xoroh/kern-theme";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

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
  variant = "m3",
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

/** Static light default for components rendered outside any provider. */
const defaultScheme: ResolvedTheme = resolveThemeDetails("light");

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
  return context?.scheme ?? defaultScheme;
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
      variant: "m3",
      scheme,
      setMode,
      useSystem,
      toggle,
    }
  );
}
