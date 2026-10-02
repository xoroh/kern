import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";

export const APP_SHELL_HEADER_HEIGHT = 64;
export const APP_SHELL_FOOTER_HEIGHT = 48;

export type NativeAppShellProps = {
  /** Top region — a top app bar, or nothing. */
  header?: ReactNode;
  /** Side region, laid out BESIDE the body. A `NavigationRail` belongs here. */
  navigation?: ReactNode;
  /** The main content. Always rendered; this is the shell's purpose. */
  body?: ReactNode;
  /** Bottom region, or nothing. */
  footer?: ReactNode;
  style?: ViewStyle;
  testID?: string;
};

/**
 * The application frame: header, side navigation, body, footer.
 *
 * Genuinely absent before this — native `shell.tsx` exported only `BootSplash`
 * and `ErrorBoundary`, so an app had no frame to compose. This is the native
 * counterpart to the web `AppShell` in `src/start/scaffolds.tsx`.
 *
 * Each supplied region is a NAMED landmark rather than a bare view. A shell
 * that renders a header, a rail and a body but names them identically is three
 * unlabelled boxes, and the difference between "it renders" and "it can be
 * navigated with a screen reader" is exactly this.
 */
export function AppShell({
  header,
  navigation,
  body,
  footer,
  style,
  testID,
}: NativeAppShellProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? "kern-app-shell"}
      style={[
        {
          flex: 1,
          flexDirection: "column",
          backgroundColor: scheme.color.surface,
        },
        style,
      ]}
    >
      {header ? (
        <View
          accessibilityLabel="Header"
          style={{
            minHeight: APP_SHELL_HEADER_HEIGHT,
            justifyContent: "center",
          }}
        >
          {header}
        </View>
      ) : null}

      {/* The body and the navigation sit SIDE BY SIDE. A column here would
          produce a correct-looking app with the navigation stacked above the
          content -- the classic responsive failure, and invisible to every other
          assertion in the suite. */}
      <View
        testID={testID ? `${testID}-body` : "kern-app-shell-body"}
        style={{ flex: 1, flexDirection: "row" }}
      >
        {navigation ? (
          <View accessibilityLabel="Navigation">{navigation}</View>
        ) : null}
        <View style={{ flex: 1 }}>{body}</View>
      </View>

      {footer ? (
        <View
          accessibilityLabel="Footer"
          style={{
            minHeight: APP_SHELL_FOOTER_HEIGHT,
            justifyContent: "center",
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
