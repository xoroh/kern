import {
  ToastProvider as AxisToastProvider,
  ToastViewport as AxisToastViewport,
  type ToastManager,
  type ToastOptions,
  useToast as useAxisToast,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";

export function snackbarStyles(
  scheme: ResolvedTheme = defaultScheme(),
): ViewStyle {
  return {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
    backgroundColor: scheme.color.inverseSurface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // K11: snackbar = level 3 = 6dp. Android reads `elevation` as dp (M3's scale
    // is 0/1/3/6/8/12, so level 3 is 6dp, NOT 3 — 3dp is level 2). This was
    // `elevation: 3`, which put native one level BELOW web's
    // `--sys-elevation-level3`: the same component at two heights on two
    // renderers, invisible until the gate mapped dp into level space.
    // The iOS quartet follows the other level-3 surfaces rather than inventing
    // a second shadow recipe.
    shadowColor: scheme.color.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  };
}

/**
 * Provider owning the Axis Toast / Snackbar queue on Native.
 */
export function SnackbarProvider({ children }: { children?: ReactNode }) {
  return <AxisToastProvider>{children}</AxisToastProvider>;
}

export type NativeSnackbarViewportProps = {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  limit?: number;
};

/**
 * Viewport rendering queued Snackbars using M3 styling.
 *
 * Axis paints each queued toast unstyled by design (visuals are
 * caller-provided), so the viewport clones every queued `Toast` with
 * the M3 Snackbar surface style. One current API: queue via
 * `useSnackbar`, paint here. No single-shot `visible`/`message`
 * component (ADR-020: pre-publish removal, not a compat alias).
 */
export function SnackbarViewport({
  testID,
  style,
  limit,
}: NativeSnackbarViewportProps) {
  const scheme = useKernScheme();
  const toastStyle = snackbarStyles(scheme);
  return (
    <AxisToastViewport
      testID={testID}
      style={[
        {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          gap: 8,
          zIndex: 9999,
        },
        style,
      ]}
      limit={limit}
      render={(props) => {
        const { children, ...rest } = props as {
          children?: ReactNode;
          testID?: string;
          style?: StyleProp<ViewStyle>;
        };
        return (
          <View testID={rest.testID} style={rest.style}>
            {Children.map(children, (child) =>
              isValidElement<{ style?: StyleProp<ViewStyle> }>(child)
                ? cloneElement(child, { style: toastStyle })
                : child,
            )}
          </View>
        );
      }}
    />
  );
}

export type SnackbarOptions = ToastOptions;
export type SnackbarManager = ToastManager;

/**
 * Hook to add, dismiss, or clear queued Snackbars.
 */
export function useSnackbar(): SnackbarManager {
  return useAxisToast();
}
