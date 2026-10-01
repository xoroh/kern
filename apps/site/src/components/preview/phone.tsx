/**
 * Mobile preview frame.
 *
 * S2.3 decision: **react-native-web**, not generated Expo screenshots. The
 * rationale is recorded in the Stage 2 report; the short version is that RNW
 * renders the real `@xoroh/kern-native` sources, so a preview cannot drift
 * from the shipped component the way a committed screenshot can.
 *
 * The frame renders each native component inside a phone-sized viewport with
 * the Kern theme provider mounted, which is what a device provides.
 */
import { KernThemeProvider } from "@xoroh/kern-native";
import { StyleSheet, View } from "react-native";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  frame: {
    width: 320,
    minHeight: 200,
    alignSelf: "center",
    borderRadius: 28,
    borderWidth: 8,
    borderColor: "#1c1b1f",
    backgroundColor: "#fef7ff",
    overflow: "hidden",
  },
  screen: {
    padding: 16,
    gap: 12,
  },
});

export function PhonePreview({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex min-w-0 flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) p-4 md:col-span-1">
      <div className="flex justify-center py-2">
        <div className="flex flex-col gap-2">
          <div className={styles.frame}>
            <KernThemeProvider>
              <View style={styles.screen}>{children}</View>
            </KernThemeProvider>
          </div>
        </div>
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
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}
    >
      {children}
    </View>
  );
}
