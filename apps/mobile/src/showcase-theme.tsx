import {
  type Contrast,
  KernThemeProvider,
  type Mode,
  SegmentedButton,
  Text,
  type ThemeSelection,
  useKernScheme,
  useKernTheme,
} from "@xoroh/kern-native";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { ScrollView, View } from "react-native";

/**
 * Showcase theming.
 *
 * `KernThemeProvider` owns colour/shape resolution and the mode axis. This
 * wrapper adds the two axes the provider takes as plain props (variant,
 * contrast) into real state so the switcher can drive all three, exposed
 * through one context. A real app only needs `KernThemeProvider`.
 */

type ShowcaseThemeControls = {
  variant: ThemeSelection;
  contrast: Contrast;
  setVariant: (variant: ThemeSelection) => void;
  setContrast: (contrast: Contrast) => void;
};

const ShowcaseThemeContext = createContext<ShowcaseThemeControls | null>(null);

function ShowcaseTheme({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<ThemeSelection>("m3");
  const [contrast, setContrast] = useState<Contrast>("standard");
  // Read the mode from the provider above so the inner provider can stay
  // controlled and the switcher still talks to the same source of truth.
  const { mode } = useKernTheme();
  const controls = useMemo(
    () => ({ variant, contrast, setVariant, setContrast }),
    [variant, contrast],
  );
  return (
    <ShowcaseThemeContext.Provider value={controls}>
      <KernThemeProvider
        mode={mode === "dark" ? ("dark" as Mode) : ("light" as Mode)}
        variant={variant}
        contrast={contrast}
      >
        {children}
      </KernThemeProvider>
    </ShowcaseThemeContext.Provider>
  );
}

export function ShowcaseThemeProvider({ children }: { children: ReactNode }) {
  return (
    <KernThemeProvider>
      <ShowcaseTheme>{children}</ShowcaseTheme>
    </KernThemeProvider>
  );
}

const MODES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const VARIANTS = [
  { value: "m3", label: "M3" },
  { value: "sharp", label: "Sharp" },
  { value: "brand", label: "Brand" },
];

const CONTRASTS = [
  { value: "standard", label: "Standard" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

/** Mode (light/dark/system) + variant + contrast, all live. */
export function ThemeSwitcher() {
  const controls = useContext(ShowcaseThemeContext);
  const { mode, setMode } = useKernTheme();
  const scheme = useKernScheme();
  if (!controls) return null;
  const modeValue = mode === "dark" ? "dark" : "light";
  const variantLabel =
    typeof controls.variant === "string"
      ? controls.variant
      : controls.variant.id;

  return (
    <View testID="theme-switcher" style={{ gap: 12 }}>
      <SegmentedButton
        options={MODES}
        value={modeValue}
        onValueChange={(next) => setMode(next === "dark" ? "dark" : "light")}
      />
      <SegmentedButton
        options={VARIANTS}
        value={variantLabel}
        onValueChange={(next) => controls.setVariant(next as ThemeSelection)}
      />
      <SegmentedButton
        options={CONTRASTS}
        value={controls.contrast}
        onValueChange={(next) => controls.setContrast(next as Contrast)}
      />
      <View
        style={{
          minHeight: 48,
          justifyContent: "center",
          borderRadius: Number.parseFloat(scheme.shape.full),
          paddingHorizontal: 16,
          backgroundColor: scheme.color.surfaceTonal,
        }}
      >
        <Text variant="label">
          {`${modeValue} · ${variantLabel} · ${controls.contrast}`}
        </Text>
      </View>
    </View>
  );
}

export function ShowcaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const scheme = useKernScheme();
  return (
    <View style={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
      <Text
        variant="label"
        style={{
          letterSpacing: 0.5,
          color: scheme.color.onSurfaceVariant,
        }}
      >
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

export function ShowcaseScroll({ children }: { children: ReactNode }) {
  const scheme = useKernScheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: scheme.color.surface }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {children}
    </ScrollView>
  );
}
