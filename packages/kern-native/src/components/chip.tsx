import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";

// M3 lists FOUR chip variants (m3.material.io/components/chips/overview):
// assist, filter, input, suggestion. `input` was missing here too.
export type ChipVariant = "assist" | "filter" | "input" | "suggestion";

export function chipStyles(
  variant: ChipVariant,
  selected: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { container: ViewStyle; label: TextStyle } {
  const container: ViewStyle = {
    minHeight: 32,
    borderRadius: Number.parseFloat(scheme.shape.full),
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      variant === "suggestion"
        ? scheme.color.surface
        : selected
          ? scheme.color.primary
          : scheme.color.surfaceTonal,
    ...(variant === "suggestion"
      ? { borderWidth: 1, borderColor: scheme.color.outlineVariant }
      : null),
  };
  return {
    container,
    label: {
      fontSize: 12,
      fontWeight: "500",
      color: selected ? scheme.color.onPrimary : scheme.color.onSurface,
    },
  };
}

type CommonChipProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState" | "accessibilityRole"
> & {
  children: ReactNode;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  labelStyle?: TextStyle;
};

export type FilterChipProps = CommonChipProps & {
  variant: "filter";
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

export type ActionChipProps = CommonChipProps & {
  variant?: "assist" | "suggestion";
  selected?: never;
  defaultSelected?: never;
  onSelectedChange?: never;
};

export type ChipProps = FilterChipProps | ActionChipProps;

export function Chip(props: ChipProps) {
  const {
    variant = "assist",
    children,
    selected: controlledSelected,
    defaultSelected,
    onSelectedChange,
    onPress,
    style,
    labelStyle,
    disabled,
    testID,
    ...pressableProps
  } = props;
  const { scheme } = useKernTheme();
  const [selectedValue, setSelected] = useControllableState(
    variant === "filter" ? controlledSelected : undefined,
    variant === "filter" ? (defaultSelected ?? false) : false,
    onSelectedChange,
  );
  const selected = variant === "filter" && Boolean(selectedValue);
  const styles = chipStyles(variant, selected, scheme);

  return (
    <Pressable
      {...pressableProps}
      testID={testID ?? "kern-chip"}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={8}
      onPress={(event) => {
        onPress?.(event);
        if (variant === "filter" && !disabled && !event.isDefaultPrevented()) {
          setSelected((previous) => !previous);
        }
      }}
      style={(state) => [
        styles.container,
        state.pressed && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
