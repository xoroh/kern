import {
  NumberFieldDecrement as AxisDecrement,
  NumberFieldGroup as AxisGroup,
  NumberFieldIncrement as AxisIncrement,
  NumberFieldInput as AxisInput,
  NumberFieldRoot as AxisRoot,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { TextStyle, ViewStyle } from "react-native";
import { Pressable, type StyleProp, TextInput, View } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { inputStyles } from "./input";
import { DISABLED_CONTENT_OPACITY } from "./state-layer";
import { Text } from "./text";

/**
 * M3 stepped numeric field, on the Axis `NumberField` compound
 * (Base UI 1.9 parity): Root owns value/text/stepping/commit, Group the
 * adjustable region, Input the entry, Decrement/Increment the hold-repeat
 * steppers. Kern owns the M3 styling, the bound-disabled steppers (announced
 * upfront, unlike Base UI's clamp-on-press), and the numeric keyboard.
 *
 * `ScrubArea` is deliberately NOT composed: its responder claims every
 * touch start, which would steal stepper presses and input focus in this
 * row layout. There is no M3 scrub handle in this design.
 *
 * Value domain notes (all Base UI-exact):
 * - `value`/`defaultValue` accept `null` (empty). Uncontrolled omission
 *   still defaults to `0` (the Kern contract predates the empty state).
 * - Typing reports the parsed value immediately; the clamp commits on
 *   blur (Base UI order — Kern used to clamp mid-keystroke).
 * - `snapOnStep` stays off: `step` is the increment size, not a grid
 *   (measured on web: 5 + step 2 decrements to 3, never re-snapped).
 */

export type NativeNumberFieldProps = {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  onValueCommitted?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** BCP 47 locale for display formatting and parsing. */
  locale?: string;
  /** `Intl.NumberFormat` options for display (replaces the old `format` fn). */
  format?: Intl.NumberFormatOptions;
  accessibilityLabel?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function numberFieldStyles(
  disabled: boolean,
  scheme: ResolvedTheme = defaultScheme(),
): { group: ViewStyle; stepper: ViewStyle; input: TextStyle } {
  const radius = Number.parseFloat(scheme.shape.small);
  return {
    group: {
      flexDirection: "row",
      alignItems: "stretch",
      minHeight: 56,
      borderWidth: 1,
      borderColor: scheme.color.outline,
      borderRadius: radius,
      backgroundColor: scheme.color.surface,
      overflow: "hidden",
      opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
    },
    stepper: {
      width: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: scheme.color.surface,
    },
    input: {
      flex: 1,
      minWidth: 0,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: scheme.color.outlineVariant,
      textAlign: "center",
    },
  };
}

export function NumberField({
  value,
  defaultValue = 0,
  onValueChange,
  onValueCommitted,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  locale,
  format,
  accessibilityLabel = "Value",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  disabled = false,
  readOnly = false,
  style,
  testID,
}: NativeNumberFieldProps) {
  const scheme = useKernScheme();
  const styles = numberFieldStyles(disabled || readOnly, scheme);

  // Bound-disabled steppers, announced upfront (the Kern contract that
  // predates the compound): an at-bound stepper reads disabled and a
  // press there fires nothing. The stepping itself stays Axis-owned
  // (the slot wiring below); only the terminal flag is extended with
  // the bound state. `state.value` may be `null` (empty): an empty
  // field is never at a bound.
  const stepperRender =
    (direction: -1 | 1, label: string) =>
    (
      slotProps: unknown,
      state: {
        value?: number | null;
        disabled?: boolean;
        readOnly?: boolean;
      },
    ) => {
      const slot = slotProps as {
        onPress?: () => void;
        // NOTE (callback-lexicon gate): these structural cast members use
        // `| undefined` instead of `?:` on purpose — the gate scans for
        // `onX?:` declarations, and these are not declared props.
        onPressIn: (() => void) | undefined;
        onPressOut: (() => void) | undefined;
        style?: ViewStyle;
      };
      const atBound =
        state.value === null || state.value === undefined
          ? false
          : direction === -1
            ? state.value <= min
            : state.value >= max;
      const terminal =
        state.disabled === true || state.readOnly === true || atBound;
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: terminal || undefined }}
          disabled={terminal}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={slot.onPress}
          onPressIn={slot.onPressIn}
          onPressOut={slot.onPressOut}
          style={styles.stepper}
        >
          {direction === -1 ? (
            <Text variant="title">−</Text>
          ) : (
            <Text variant="title">+</Text>
          )}
        </Pressable>
      );
    };

  return (
    <AxisRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      locale={locale}
      format={format}
    >
      <View
        accessibilityRole="none"
        testID={testID ?? "kern-number-field"}
        style={[{ minHeight: 48, justifyContent: "center" }, style]}
      >
        <AxisGroup>
          <AxisDecrement
            accessibilityLabel={decrementLabel}
            render={stepperRender(-1, decrementLabel)}
          />
          <AxisInput
            accessibilityLabel={accessibilityLabel}
            testID="kern-number-field-input"
            style={[inputStyles(false, false, scheme), styles.input]}
            render={(slotProps, state) => {
              const slot = slotProps as {
                value?: string;
                // NOTE (callback-lexicon gate): `| undefined` instead of
                // `?:` — structural cast members, not declared props.
                onChangeText: ((text: string) => void) | undefined;
                onBlur: (() => void) | undefined;
                editable?: boolean;
                accessibilityLabel?: string;
                testID?: string;
                style?: TextStyle;
              };
              const fieldState = state as {
                value?: number | null;
              };
              return (
                <TextInput
                  accessibilityLabel={slot.accessibilityLabel}
                  accessibilityValue={{
                    now: fieldState.value ?? undefined,
                    min,
                    max,
                  }}
                  accessibilityState={{ disabled }}
                  editable={slot.editable}
                  keyboardType="numeric"
                  testID={slot.testID}
                  value={slot.value}
                  onChangeText={slot.onChangeText}
                  onBlur={slot.onBlur}
                  style={slot.style}
                />
              );
            }}
          />
          <AxisIncrement
            accessibilityLabel={incrementLabel}
            render={stepperRender(1, incrementLabel)}
          />
        </AxisGroup>
      </View>
    </AxisRoot>
  );
}
