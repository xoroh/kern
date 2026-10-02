import { useSelection } from "@xoroh/kern-primitives";
import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  Pressable,
  type PressableProps,
  Text as RNText,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { Text } from "./text";

/**
 * CheckboxGroup — several independent checkboxes sharing one value.
 *
 * ## The one behavioural difference from RadioGroup
 *
 * `RadioGroup` is exclusive: one selection, activating another replaces it, and
 * activating the selected one does nothing. `CheckboxGroup` is additive: any
 * number may be checked, and activating a checked item UNCHECKS it. Both are the
 * same selection model in two modes, so the model is the shared primitive and
 * only the mode differs — which is the point of extracting it.
 *
 * ## Why the group carries the value rather than each item
 *
 * The value lives on the group because that is what makes a group a group: the
 * host has one piece of state to bind, and a partially-updated group (item A
 * controlled here, item B there) is not expressible. Items read the group's
 * value and report through its `toggle`, so no item holds selection state of its
 * own and they cannot disagree.
 *
 * ## Accessibility
 *
 * Each item is `accessibilityRole="checkbox"` with `accessibilityState.checked`
 * — NOT `selected`. RadioGroup uses `selected` because that is the ARIA
 * `radio` mapping RN exposes; a checkbox reports `checked`, and using `selected`
 * here would be the same class of bug the drawer row documents (a prop value
 * that does not exist in the union is silently ignored).
 */

type CheckboxGroupContextValue = {
  /** Selected values. */
  values: readonly string[];
  toggle: (value: string) => void;
  disabled: boolean;
  scheme: ResolvedTheme;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

export function checkboxGroupStyles(
  checked: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { box: ViewStyle; tick: TextStyle } {
  return {
    box: {
      width: 18,
      height: 18,
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
      borderWidth: 2,
      borderColor: checked ? scheme.color.primary : scheme.color.outline,
      backgroundColor: checked ? scheme.color.primary : scheme.color.surface,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
    },
    tick: {
      fontSize: 13,
      fontWeight: "700",
      lineHeight: 16,
      color: scheme.color.onPrimary,
    },
  };
}

export type CheckboxGroupProps = {
  /** Controlled selected values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  /** Disables every item unless an item overrides it. */
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function CheckboxGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  children,
  style,
  testID,
}: CheckboxGroupProps) {
  const { scheme } = useKernTheme();
  // `multiple` mode: any number may be checked, and activating a checked item
  // removes it. This is the whole difference from RadioGroup.
  const [values, toggle] = useSelection({
    value,
    defaultValue,
    onChange: onValueChange as (next: readonly string[]) => void,
    mode: "multiple",
  });

  const context = useMemo<CheckboxGroupContextValue>(
    () => ({ values, toggle, disabled, scheme }),
    [values, toggle, disabled, scheme],
  );

  return (
    <CheckboxGroupContext.Provider value={context}>
      <View
        testID={testID ?? "kern-checkbox-group"}
        accessibilityRole="group"
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            flexDirection: "column",
            gap: Number.parseFloat(tokens.spacing["space-50"]),
          },
          style,
        ]}
      >
        {children}
      </View>
    </CheckboxGroupContext.Provider>
  );
}

export type CheckboxGroupItemProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState" | "accessibilityRole"
> & {
  value: string;
  children?: ReactNode;
  accessibilityState?: PressableProps["accessibilityState"];
  /** Overrides the name derived from string `children`. */
  accessibilityLabel?: string;
  onPress?: PressableProps["onPress"];
  hitSlop?: PressableProps["hitSlop"];
  style?: PressableProps["style"];
  testID?: string;
};

export function CheckboxGroupItem({
  value,
  children,
  accessibilityState,
  accessibilityLabel,
  onPress,
  disabled,
  hitSlop,
  style,
  testID,
  ...props
}: CheckboxGroupItemProps) {
  const group = useContext(CheckboxGroupContext);
  if (!group) {
    throw new Error("CheckboxGroupItem must be rendered inside CheckboxGroup.");
  }
  const isDisabled = group.disabled || Boolean(disabled);
  const checked = group.values.includes(value);
  const styles = checkboxGroupStyles(checked, isDisabled, group.scheme);
  // Derive the accessible name from string children. RadioGroup leaves this to
  // the nested Text, which a screen reader reaches but a query cannot — and an
  // unlabelled control is also harder to target for a consumer who needs to
  // describe it. Mirrors what `Select` already does with `option.label`.
  const derivedLabel =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined;

  return (
    <Pressable
      {...props}
      testID={testID ?? `kern-checkbox-group-${value}`}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? derivedLabel}
      accessibilityState={{
        ...accessibilityState,
        checked,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      hitSlop={hitSlop ?? { top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={(event) => {
        onPress?.(event);
        // Honour the preventDefault contract RadioGroup uses: a host that
        // cancels the press must not change selection.
        if (!isDisabled && !event.isDefaultPrevented()) group.toggle(value);
      }}
      style={({ pressed }) => [
        {
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          gap: Number.parseFloat(tokens.spacing["space-100"]),
        },
        pressed && !isDisabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <View style={styles.box}>
        {checked ? <RNText style={styles.tick}>✓</RNText> : null}
      </View>
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={{ fontSize: 14, color: group.scheme.color.onSurface }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
