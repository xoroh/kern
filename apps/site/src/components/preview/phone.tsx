/**
 * Mobile preview frame.
 *
 * S2.3 decision: **react-native-web**, not generated Expo screenshots. The
 * rationale is recorded in the Stage 2 report; the short version is that RNW
 * renders the real `@xoroh/kern-native` sources, so a preview cannot drift
 * from the shipped component the way a committed screenshot can.
 *
 * The frame renders each native component inside a phone-sized viewport with
 * the Kern theme provider mounted, which is what a device provides. The
 * provider follows the SITE theme (not the OS scheme): a reader who toggles
 * the site to dark sees dark phones. A page that needs to pin a scheme —
 * the theme page showing light and dark side by side — passes `scheme`
 * explicitly. The bezel and screen are the neutral chrome roles
 * (outline-variant, surface) per scheme, so the frame stays visible on both
 * page themes without borrowing a hue.
 */
import { useKernTheme } from "@xoroh/kern";
import { KernThemeProvider } from "@xoroh/kern-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const FRAME = {
  width: 320,
  minHeight: 200,
  alignSelf: "center",
  borderRadius: 28,
  borderWidth: 8,
  overflow: "hidden",
} as const;

const styles = StyleSheet.create({
  frameLight: {
    ...FRAME,
    borderColor: "#e5e5e5",
    backgroundColor: "#ffffff",
  },
  frameDark: {
    ...FRAME,
    borderColor: "#262626",
    backgroundColor: "#000000",
  },
  screen: {
    padding: 16,
    gap: 12,
  },
});

export function PhonePreview({
  label,
  scheme,
  children,
}: {
  label: string;
  /** Pin a scheme; defaults to whatever the site theme is. */
  scheme?: "light" | "dark";
  children: ReactNode;
}) {
  const { mode } = useKernTheme();
  const resolved: "light" | "dark" = scheme ?? (mode === "dark" ? "dark" : "light");
  return (
    <figure className="flex min-w-0 flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) p-4 md:col-span-1">
      <div className="flex justify-center py-2">
        <View
          style={resolved === "dark" ? styles.frameDark : styles.frameLight}
        >
          <KernThemeProvider mode={resolved}>
            <View style={styles.screen}>{children}</View>
          </KernThemeProvider>
        </View>
      </div>
      <figcaption className="text-center font-mono text-xs text-(--md-sys-color-on-surface-variant)">
        {label}
      </figcaption>
    </figure>
  );
}

export function PhoneGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
  );
}

export function PhoneStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

/** A row inside the phone screen. */
export function PhoneRow({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
