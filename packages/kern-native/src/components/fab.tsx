import { type ResolvedTheme } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { Text } from "./text";

// M3 FAB variants are a SIZE axis — small / FAB / medium FAB / large FAB
// (m3.material.io/components/floating-action-button/overview). The previous
// `variant: primary | tonal` was an emphasis axis M3 does not define for FAB.
export type NativeFabSize = "default" | "small" | "medium" | "large" | "icon";

/**
 * M3 expressive FAB colors: the three containers, the three fills, and
 * surface (no longer recommended, kept for migration). Kern names match the
 * web `Fab` union exactly — one meaning per name across renderers.
 */
export type NativeFabColor =
  | "surface"
  | "primary"
  | "secondary"
  | "tertiary"
  | "primary-fill"
  | "secondary-fill"
  | "tertiary-fill";

export function fabColorRoles(
  color: NativeFabColor,
  scheme: ResolvedTheme = defaultScheme,
): { container: string; ink: string } {
  switch (color) {
    case "surface":
      return {
        container: scheme.color.surfaceContainerHigh,
        ink: scheme.color.primary,
      };
    case "secondary":
      return {
        container: scheme.color.secondaryContainer,
        ink: scheme.color.onSecondaryContainer,
      };
    case "tertiary":
      return {
        container: scheme.color.tertiaryContainer,
        ink: scheme.color.onTertiaryContainer,
      };
    case "primary-fill":
      return { container: scheme.color.primary, ink: scheme.color.onPrimary };
    case "secondary-fill":
      return {
        container: scheme.color.secondary,
        ink: scheme.color.onSecondary,
      };
    case "tertiary-fill":
      return {
        container: scheme.color.tertiary,
        ink: scheme.color.onTertiary,
      };
    default:
      return {
        container: scheme.color.primaryContainer,
        ink: scheme.color.onPrimaryContainer,
      };
  }
}

export function fabStyles(
  size: NativeFabSize,
  scheme: ResolvedTheme = defaultScheme,
  color: NativeFabColor = "primary",
  /**
   * M3's `lowered` attribute: a FAB that sits quieter in the layout — level 1
   * on a `surface-container-low` fill instead of level 3 on the primary
   * container. Web ships it through the same `lowered` prop, and
   * `check:elevation-parity` compares the RESTING level sets, so native without
   * it can never match web's {1, 3}.
   */
  lowered = false,
): ViewStyle {
  // M3: small 40dp (deprecated — compact only), regular 56dp, medium 80dp
  // (expressive), large 96dp.
  const dimension =
    size === "small" ? 40 : size === "medium" ? 80 : size === "large" ? 96 : 56;
  const roles = fabColorRoles(color, scheme);
  return {
    minHeight: dimension,
    minWidth: size === "icon" ? dimension : 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: Number.parseFloat(scheme.shape.large),
    paddingHorizontal: size === "icon" ? 0 : 20,
    // 6dp = M3 LEVEL 3, the level the registry declares for `fab`/
    // `extended-fab` (`variants: [3]`) and the level web binds via
    // `--sys-elevation-level3`.
    //
    // This was `3`, and `3` is dp, not a level: M3's scale is unevenly spaced
    // (0/1/3/6/8/12 dp), so `elevation: 3` is 3dp = LEVEL 2 — one step below
    // web. `check:elevation-parity` caught it only once it resolved this
    // helper instead of skipping it: `ExtendedFab` and `FabMenu` render through
    // `fabStyles`, so while the scanner ignored `*Styles` helpers both read
    // "native none" and the whole FAB family sat one level low unseen.
    ...(lowered
      ? {
          // 1dp = M3 LEVEL 1, the lowered resting height. Web binds the same
          // level through `--sys-elevation-level1` and swaps the fill to
          // `surface-container-low`.
          backgroundColor: scheme.color.surfaceContainerLow,
          elevation: 1,
          shadowColor: scheme.color.scrim,
          shadowOpacity: 0.12,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
        }
      : {
          // 6dp = M3 LEVEL 3, the default resting height.
          backgroundColor: roles.container,
          elevation: 6,
          shadowColor: scheme.color.scrim,
          shadowOpacity: 0.3,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
        }),
  };
}

export type NativeFabProps = Omit<
  PressableProps,
  "children" | "style" | "onPress"
> & {
  children: ReactNode;
  label?: string;
  size?: NativeFabSize;
  /**
   * M3 expressive color style. Defaults to the primary container — the
   * previous fixed treatment, so existing rendering cannot change.
   */
  color?: NativeFabColor;
  /** M3 `lowered`: level-1 FAB on a quiet fill instead of level 3. */
  lowered?: boolean;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function Fab({
  children,
  label,
  size = "default",
  color = "primary",
  lowered = false,
  onPress,
  disabled = false,
  hitSlop,
  style,
  testID,
  ...props
}: NativeFabProps) {
  const scheme = useKernScheme();
  if (process.env.NODE_ENV !== "production" && disabled) {
    // M3 never disables the FAB: if the action is unavailable the FAB should
    // not appear.
    console.warn(
      "Fab: M3 does not define a disabled FAB — hide the action instead of disabling it.",
    );
  }
  const roles = fabColorRoles(color, scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-fab"}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onPress}
      style={({ pressed }) => [
        fabStyles(size, scheme, color, lowered),
        { opacity: disabled ? 0.38 : pressed ? 0.9 : 1 },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text variant="label" style={{ color: roles.ink }}>
        {children}
      </Text>
    </Pressable>
  );
}
