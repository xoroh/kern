import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

// M3 FAB variants are a SIZE axis — FAB / medium FAB / large FAB
// (m3.material.io/components/floating-action-button/overview). The previous
// `variant: primary | tonal` was an emphasis axis M3 does not define for FAB.
export type NativeFabSize = "default" | "small" | "medium" | "large" | "icon";

export function fabStyles(
  size: NativeFabSize,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  // M3: small 56dp, medium 96dp, large 128dp (the 40dp `small` is kern's own
  // extra-small, kept for the compact rail treatment).
  const dimension =
    size === "small"
      ? 40
      : size === "medium"
        ? 96
        : size === "large"
          ? 128
          : 56;
  return {
    minHeight: dimension,
    minWidth: size === "icon" ? dimension : 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: Number.parseFloat(scheme.shape.large),
    paddingHorizontal: size === "icon" ? 0 : 20,
    backgroundColor: scheme.color.primaryContainer,
    // 6dp = M3 LEVEL 3, the level the registry declares for `fab`/
    // `extended-fab` (`variants: [3]`) and the level web binds via
    // `--md-sys-elevation-level3`.
    //
    // This was `3`, and `3` is dp, not a level: M3's scale is unevenly spaced
    // (0/1/3/6/8/12 dp), so `elevation: 3` is 3dp = LEVEL 2 — one step below
    // web. `check:elevation-parity` caught it only once it resolved this
    // helper instead of skipping it: `ExtendedFab` and `FabMenu` render through
    // `fabStyles`, so while the scanner ignored `*Styles` helpers both read
    // "native none" and the whole FAB family sat one level low unseen.
    elevation: 6,
    shadowColor: scheme.color.scrim,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  };
}

export type NativeFabProps = Omit<
  PressableProps,
  "children" | "style" | "onPress"
> & {
  children: ReactNode;
  label?: string;
  size?: NativeFabSize;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function Fab({
  children,
  label,
  size = "default",
  onPress,
  disabled = false,
  hitSlop,
  style,
  testID,
  ...props
}: NativeFabProps) {
  const scheme = useKernScheme();
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
        fabStyles(size, scheme),
        { opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <Text variant="label" style={{ color: scheme.color.onPrimaryContainer }}>
        {children}
      </Text>
    </Pressable>
  );
}
