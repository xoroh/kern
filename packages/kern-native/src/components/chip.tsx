import { useControllableState } from "@xoroh/kern-primitives";
import {
  cssLengthToDp,
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";

// M3 lists FOUR chip variants (m3.material.io/components/chips/overview):
// assist, filter, input, suggestion. `input` was missing here too.
export type ChipVariant = "assist" | "filter" | "input" | "suggestion";

export function chipStyles(
  variant: ChipVariant,
  selected: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
  elevated = false,
): { container: ViewStyle; label: TextStyle } {
  const isFilter = variant === "filter";
  const canElevate = elevated && (variant === "assist" || isFilter);
  const container: ViewStyle = {
    minHeight: 32,
    borderRadius: cssLengthToDp(
      scheme.comp?.["chip-container-shape"],
      Number.parseFloat(scheme.shape.small),
    ),
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor:
      isFilter && selected
        ? scheme.color.secondaryContainer
        : canElevate
          ? scheme.color.surfaceContainerLow
          : "transparent",
    borderWidth: canElevate ? 0 : 1,
    borderColor: scheme.color.outline,
    ...(canElevate ? { elevation: tokens.elevation.level1.dp } : null),
  };
  return {
    container,
    label: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
      fontWeight: "500",
      color:
        isFilter && selected
          ? scheme.color.onSecondaryContainer
          : scheme.color.onSurface,
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
  /**
   * M3 elevated treatment (assist + filter): level1 shadow on the
   * surface-container-low fill. Ignored elsewhere.
   */
  elevated?: boolean;
};

export type FilterChipProps = CommonChipProps & {
  variant: "filter";
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /**
   * R2 lexicon canonical names (`value` wins when both are passed; both
   * callbacks fire). `selected`/`defaultSelected`/`onSelectedChange` are
   * deprecated aliases onto the same state. `onPress` (the RN press event)
   * is the platform action and stays untouched.
   */
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (selected: boolean) => void;
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
    elevated = false,
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
  // R2 lexicon canonical names, narrowed to the filter branch (Pressable
  // carries no conflicting `value`, so no DOM-collision guard is needed).
  const filterLexicon =
    variant === "filter" ? (props as FilterChipProps) : null;
  const { scheme } = useKernTheme();
  const [selectedValue, setSelected] = useControllableState(
    variant === "filter"
      ? (filterLexicon?.value ?? controlledSelected)
      : undefined,
    variant === "filter"
      ? (filterLexicon?.defaultValue ?? defaultSelected ?? false)
      : false,
    (next) => {
      filterLexicon?.onValueChange?.(next);
      onSelectedChange?.(next);
    },
  );
  const selected = variant === "filter" && Boolean(selectedValue);
  const styles = chipStyles(variant, selected, scheme, elevated);

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
