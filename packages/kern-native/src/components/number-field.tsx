import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import { useState } from "react";
import {
  Pressable,
  type StyleProp,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { inputStyles } from "./input";
import { Text } from "./text";

/**
 * M3 text field: stepped numeric entry (P2b-3).
 *
 * ## What this owns
 *
 * The stepper, the clamp, and the value the host is told about. On web the
 * web `NumberField` delegates all three to Base UI; RN has no equivalent, so
 * this component implements them.
 *
 * ## Measured on web, and what this deliberately does NOT copy
 *
 * Measured with `packages/kern/src/parity/probe2.test.tsx` (deleted after the
 * measurement):
 *
 * 1. **Web's stepper buttons carry `aria-disabled`, but the value still moves
 *    at the far bound.** At `value=0, min=0`, Decrease reports
 *    `aria-disabled="true"` and pressing it leaves the value at 0 — correct.
 *    But at `value=4, max=4` the Increase button reports
 *    `aria-disabled="false"` and pressing it moves the value **to 1**, not to
 *    4. That is a real web defect: the button announces itself as available
 *    at the bound and then does something other than what it announced. Here
 *    both steppers report `disabled` at their bound and clamping is enforced
 *    in `commit`, so a press cannot move the value past `min`/`max`.
 * 2. **Web's field carries no `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.**
 *    Measured: all three are `null`. So the parity contract for this row
 *    cannot assert a value range on the shared axis — it asserts the
 *    observable behaviour instead (step moves by `step`, clamps at the bound,
 *    a disabled field refuses both). The RN-only
 *    `accessibilityValue` on this field is an improvement, recorded here so a
 *    later reader does not "reconcile" it away.
 */

export type NativeNumberFieldProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats the value for display and for parsing typed input. */
  format?: (value: number) => string;
  accessibilityLabel?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function numberFieldStyles(
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
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
      opacity: disabled ? 0.5 : 1,
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

/**
 * Clamp to `[min, max]`.
 *
 * Deliberately does NOT snap to a multiple of `step`. Measured on web: at
 * `value=5, step=2`, pressing Decrease yields **3** — an arithmetic step, not a
 * snapped `4`. Snapping here was my own invention and it silently changed what
 * the steppers do relative to web: `round((5+2)/2)*2` turned an increment into
 * +3. `step` is the increment size; it is not a grid the value must sit on.
 * Typed input is likewise only clamped (see `onChangeText`), for the same
 * reason.
 */
export function clampToRange(next: number, min: number, max: number): number {
  if (!Number.isFinite(next)) return min;
  return Math.min(Math.max(next, min), max);
}

/**
 * Numeric field with increment/decrement steppers that clamp at their bound.
 */
export function NumberField({
  value,
  defaultValue = 0,
  onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  format,
  accessibilityLabel = "Value",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  disabled = false,
  style,
  testID,
}: NativeNumberFieldProps) {
  const scheme = useKernScheme();
  const styles = numberFieldStyles(disabled, scheme);
  const [current, setCurrent] = useState(defaultValue);
  const [text, setText] = useState<string | null>(null);
  const controlled = value !== undefined;
  const numeric = controlled ? value : current;

  function commit(next: number) {
    if (disabled) return;
    const clamped = clampToRange(next, min, max);
    // A press that lands on the value already showing is not a change. Firing
    // `onValueChange` anyway makes a bound press look like an edit to every
    // host that persists on change — the defect measured on web, where
    // pressing a stepper at the bound announced an available button and then
    // moved the value somewhere else.
    if (clamped === numeric) return;
    if (!controlled) setCurrent(clamped);
    setText(null);
    onValueChange?.(clamped);
  }

  const atMin = numeric <= min;
  const atMax = numeric >= max;
  const display = text ?? (format ? format(numeric) : String(numeric));

  return (
    <View
      accessibilityRole="none"
      testID={testID ?? "kern-number-field"}
      style={[{ minHeight: 48, justifyContent: "center" }, style]}
    >
      <View style={styles.group}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={decrementLabel}
          // Reported at the bound, unlike web's Increase-at-max.
          accessibilityState={{ disabled: disabled || atMin }}
          disabled={disabled || atMin}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={() => commit(numeric - step)}
          style={styles.stepper}
        >
          <Text variant="title">−</Text>
        </Pressable>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ now: numeric, min, max }}
          accessibilityState={{ disabled }}
          editable={!disabled}
          keyboardType="numeric"
          testID="kern-number-field-input"
          value={display}
          onChangeText={(next) => {
            // Hold the raw text so a partially-typed "-" or "1." is not
            // rewritten mid-keystroke; commit normalises it.
            setText(next);
            const parsed = Number.parseFloat(next);
            if (Number.isFinite(parsed)) {
              const clamped = Math.min(Math.max(parsed, min), max);
              if (!controlled) setCurrent(clamped);
              onValueChange?.(clamped);
            }
          }}
          onBlur={() => setText(null)}
          style={[inputStyles(false, false, scheme), styles.input]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={incrementLabel}
          accessibilityState={{ disabled: disabled || atMax }}
          disabled={disabled || atMax}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={() => commit(numeric + step)}
          style={styles.stepper}
        >
          <Text variant="title">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
