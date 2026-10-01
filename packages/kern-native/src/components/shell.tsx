import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { MilestoneTrio } from "./milestone-trio";
import { Text } from "./text";

/**
 * Boot surface + the router seam.
 *
 * `BootSplash` is a component, not a config plugin: it renders while the
 * host is loading fonts/session and hands off. `expo-splash-screen` stays a
 * host concern — Kern owns the pixels, the host owns the native module.
 */

export function bootSplashStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): {
  root: ViewStyle;
  mark: ViewStyle;
} {
  return {
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Number.parseFloat(tokens.spacing["space-200"]),
      backgroundColor: scheme.color.surface,
    },
    mark: {
      alignItems: "center",
      justifyContent: "center",
      gap: Number.parseFloat(tokens.spacing["space-150"]),
    },
  };
}

export type BootSplashProps = {
  /** Host-owned brand mark. Kern never ships one. */
  mark?: ReactNode;
  /** True while booting; false swaps to `children`. */
  ready?: boolean;
  /** Milestone steps instead of a plain spinner. */
  milestones?: string;
  currentMilestone?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function BootSplash({
  mark,
  ready = false,
  milestones,
  currentMilestone = 0,
  style,
  testID,
}: BootSplashProps) {
  const scheme = useKernScheme();
  const styles = bootSplashStyles(scheme);
  if (ready) return null;
  return (
    <View testID={testID ?? "kern-boot-splash"} style={[styles.root, style]}>
      <View style={styles.mark}>
        {mark}
        {milestones ? (
          <MilestoneTrio
            steps={milestones.split("|").map((step) => step.trim())}
            progress={currentMilestone}
          />
        ) : (
          <ActivityIndicator
            accessibilityLabel="Loading"
            size="large"
            color={scheme.color.secondary}
          />
        )}
      </View>
    </View>
  );
}

export type ErrorBoundaryProps = {
  children?: ReactNode;
  /** Rendered with the error + a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryState = { error: Error | null };

/**
 * Router seam (the native analogue of the web `ErrorBoundary`): screens
 * mount under it, so a thrown render does not blank the whole app. Keep the
 * fallback app-specific — recovery differs per route.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (error === null) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return (
      <View testID="kern-error-boundary">
        <Text variant="title">Something went wrong</Text>
        <Text variant="label">{error.message}</Text>
      </View>
    );
  }
}
