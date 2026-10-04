import {
  KernFontGate,
  KernThemeProvider,
  NavigationBar,
  type NavigationDestination,
  Text,
  useAnyModalOpen,
  useKernScheme,
} from "@xoroh/kern-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";

import { ComponentsScreen } from "./src/components-screen";
import { useInterLoaded } from "./src/fonts";
import { ShellScreen, ThemeScreen } from "./src/shell-screen";
import { ShowcaseThemeProvider } from "./src/showcase-theme";

/**
 * The kern-native showcase host.
 *
 * Font policy (`docs/plan/native-composition.md` § 8): the *host* loads
 * Inter via `expo-font` and hands off; components only ever set a weight.
 * `KernFontGate` holds the first frame until the faces are registered, so
 * nothing paints in the system fallback.
 */

const TABS: NavigationDestination[] = [
  { key: "components", label: "Components" },
  { key: "shell", label: "Shell" },
  { key: "theme", label: "Theme" },
];

function Screens() {
  const [tab, setTab] = useState("components");
  const scheme = useKernScheme();
  // D3b — background-inerting contract (see `useAnyModalOpen` doc in
  // overlay-surfaces.tsx): derived from the shared overlay stack, never
  // hand-rolled from local open-state. RN Modals render in a separate native
  // window, so hiding this background root's descendants does not hide the
  // open sheet itself.
  const modalOpen = useAnyModalOpen();

  return (
    <View
      style={{ flex: 1, backgroundColor: scheme.color.surface }}
      testID="kern-showcase"
      importantForAccessibility={modalOpen ? "no-hide-descendants" : "auto"}
    >
      <View style={{ flex: 1 }}>
        {tab === "components" ? <ComponentsScreen /> : null}
        {tab === "shell" ? <ShellScreen /> : null}
        {tab === "theme" ? <ThemeScreen /> : null}
      </View>
      <NavigationBar destinations={TABS} value={tab} onValueChange={setTab} />
    </View>
  );
}

function StatusBarForScheme() {
  const scheme = useKernScheme();
  return (
    <StatusBar style={scheme.color.surface === "#000000" ? "light" : "dark"} />
  );
}

export default function App() {
  const fontsLoaded = useInterLoaded();

  return (
    <ShowcaseThemeProvider>
      <StatusBarForScheme />
      <KernFontGate
        state={{ loaded: fontsLoaded, error: null }}
        fallback={
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text variant="label">Loading Inter…</Text>
          </View>
        }
      >
        <Screens />
      </KernFontGate>
    </ShowcaseThemeProvider>
  );
}

// Re-exported so `index.ts` keeps its single entry point.
export { KernThemeProvider };
