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
import { T_CODE } from "../../domains/shared/systems/type-scale";
import { CARD, INK_SOFT } from "../../domains/shared/systems/ui";

const FRAME = {
  width: 320,
  // Shrinks rather than overflowing a column narrower than the bezel —
  // PhoneGrid's clamped tracks guarantee the 320dp phone fits, and this
  // covers the last few pixels on a very narrow viewport.
  maxWidth: "100%",
  minHeight: 200,
  alignSelf: "center",
  borderRadius: 28,
  borderWidth: 8,
  overflow: "hidden",
} as const;

const styles = StyleSheet.create({
  // ONE frame: the bezel and screen are the neutral chrome roles
  // (outline-variant, surface), so a light and a dark phone sit side by
  // side without either borrowing a hue. The scheme reaches the content
  // only through KernThemeProvider below.
  frame: {
    ...FRAME,
    borderColor: "var(--md-sys-color-outline-variant)",
    backgroundColor: "var(--md-sys-color-surface)",
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
  const resolved: "light" | "dark" =
    scheme ?? (mode === "dark" ? "dark" : "light");
  return (
    <figure className={`flex min-w-0 flex-col gap-2 p-4 ${CARD} md:col-span-1`}>
      <div className="flex justify-center py-2">
        <View style={styles.frame}>
          <KernThemeProvider mode={resolved}>
            <View style={styles.screen}>{children}</View>
          </KernThemeProvider>
        </View>
      </div>
      <figcaption className={`text-center ${T_CODE} ${INK_SOFT}`}>
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * The phone grid clamps its tracks instead of pinning three columns:
 * `md:grid-cols-3` squeezed 320dp frames into narrow columns and overflowed
 * the figure. Auto-fill with a `min(100%, …)` floor lets a phone take a
 * whole track on small screens and packs as many whole phones as fit on
 * wide ones.
 */
export function PhoneGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-4">
      {children}
    </div>
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
