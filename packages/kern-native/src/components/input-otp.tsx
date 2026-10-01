import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import { useRef, useState } from "react";
import { type StyleProp, TextInput, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

/**
 * M3 text field: one-time-code entry, one box per character (P2b-3).
 *
 * ## What this owns
 *
 * The segmented value, the advance-on-fill rule, the retreat-on-empty rule, and
 * paste distribution. Web delegates all of it to Base UI's `OTPField`; there is
 * no RN equivalent, so this owns it.
 *
 * ## Measured on web, and what this does NOT copy
 *
 * Measured with `packages/kern/src/parity/probe2.test.tsx`:
 *
 * - `role="group"` on the root, one `<input pattern="\d{1}" inputmode="numeric">`
 *   per position, `autocomplete="one-time-code"` on the first, and a hidden
 *   input holding the assembled value.
 * - Typing `"1234"` into position 1 distributes one character per box and
 *   advances; `{Backspace}` at the end clears position 4 only; pasting `"9876"`
 *   fills all four from a single paste.
 *
 * **One web divergence is deliberately not encoded.** Base UI *ignores*
 * `aria-label` on the FIRST OTP input and logs a warning telling you to label
 * the group instead (measured). So "every position carries its own accessible
 * name" is true of positions 2..n on web and false for position 1 — it cannot
 * be a shared contract row. Here every position DOES carry
 * `Digit n of N`, because a screen-reader user tabbing the first box with no
 * name has no way to know which position they are in. Recorded as a web fix
 * owed by P2b-4 rather than copied as a divergence.
 */

export type NativeInputOTPProps = {
  /** Number of character positions. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires once every position is filled. */
  onComplete?: (value: string) => void;
  /** Restricts the per-position keyboard. `numeric` matches `inputmode=numeric`. */
  keyboardType?: "numeric" | "default";
  accessibilityLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function inputOTPStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  box: ViewStyle;
  boxFilled: ViewStyle;
  boxFocused: ViewStyle;
} {
  return {
    box: {
      width: 48,
      height: 56,
      borderRadius: Number.parseFloat(scheme.shape.small),
      borderWidth: 1,
      borderColor: scheme.color.outline,
      backgroundColor: scheme.color.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    boxFilled: { borderColor: scheme.color.primary },
    boxFocused: { borderColor: scheme.color.primary },
  };
}

/** Split an assembled value into `length` single-character positions. */
export function toOTPPositions(value: string, length: number): string[] {
  const chars = [...value].slice(0, length);
  return Array.from({ length }, (_, index) => chars[index] ?? "");
}

/**
 * One-time-code input: a boxed character per position, advancing as it fills.
 */
export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  keyboardType = "numeric",
  accessibilityLabel = "One-time code",
  disabled = false,
  style,
  testID,
}: NativeInputOTPProps) {
  const scheme = useKernScheme();
  const styles = inputOTPStyles(scheme);
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  // RN's imperative handle type does not model `focus()`; the runtime
  // instance does. Typed as the instance so the calls typecheck, and every
  // call is optional-chained because a position that has not mounted yet
  // legitimately has no handle.
  const refs = useRef<Array<{ focus?: () => void } | null>>([]);
  /** Move keyboard focus to a position that has mounted. */
  function focusPosition(index: number) {
    refs.current[index]?.focus?.();
  }
  const assembled = controlled ? value : internal;
  const positions = toOTPPositions(assembled, length);

  const publish = (reported: string, focusIndex: number) => {
    const nextPositions = toOTPPositions(reported, length);
    if (!controlled) setInternal(reported);
    onValueChange?.(reported);
    setFocusedIndex(focusIndex);
    focusPosition(focusIndex);
    if (nextPositions.every((char) => char !== "")) onComplete?.(reported);
  };

  function commit(next: string, index: number) {
    // Advance only when the box being typed into actually gained a
    // character — re-focusing on a deletion would fight the user's backspace.
    publish(next, next[index] && index < length - 1 ? index + 1 : index);
  }

  function onChangeAt(index: number, next: string) {
    // A paste lands here as several characters in one box; distribute them
    // across the positions FROM THIS ONE FORWARD, overwriting what follows.
    // An earlier draft sliced the tail at `index + typed.length`, which APPENDED
    // a mid-field paste instead of overwriting it: with "12" in place, pasting
    // "9876" at position 3 produced the 6-digit "129876" — a one-time code the
    // user never entered, reported to the host as if they had.
    const typed = [...next];
    if (typed.length > 1) {
      // Overwrite from THIS position forward, then TRUNCATE to `length`. The
      // truncation is not cosmetic: without it the boxes render correctly (each
      // position holds one character) while the string handed to the host keeps
      // the overflow — a 4-digit field reporting "129876", a code the user never
      // entered, straight into whatever verifies it.
      const merged = [
        ...positions.slice(0, index),
        ...typed,
        ...positions.slice(index + typed.length),
      ]
        .join("")
        .slice(0, length);
      publish(merged, Math.min(index + typed.length, length - 1));
      return;
    }
    const merged = [
      ...positions.slice(0, index),
      typed[0] ?? "",
      ...positions.slice(index + 1),
    ].join("");
    commit(merged, index);
  }

  function onBackspaceAt(index: number) {
    // Empty box: step back one position rather than clearing the one before.
    if (positions[index] === "" && index > 0) {
      const target = index - 1;
      const merged = [
        ...positions.slice(0, target),
        "",
        ...positions.slice(target + 1),
      ].join("");
      if (!controlled) setInternal(merged);
      onValueChange?.(merged);
      setFocusedIndex(target);
      focusPosition(target);
    }
  }

  return (
    <View
      accessibilityRole="group"
      accessibilityLabel={accessibilityLabel}
      testID={testID ?? "kern-input-otp"}
      style={[{ flexDirection: "row", gap: 8 }, style]}
    >
      {positions.map((char, index) => (
        <View
          // Position index as the key, not a character: the OTP field's length
          // is FIXED for the life of the component, so identity never shifts
          // and no stable per-position id exists to key on. Suppressed with
          // the reason rather than silenced globally.
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length field, position order is identity
          key={index}
          style={[
            styles.box,
            char ? styles.boxFilled : null,
            focusedIndex === index ? styles.boxFocused : null,
          ]}
        >
          <TextInput
            ref={(node) => {
              refs.current[index] = node;
            }}
            // Every position names itself, INCLUDING the first — the web side
            // cannot do this (see the file header).
            accessibilityLabel={`Digit ${index + 1} of ${length}`}
            accessibilityState={{ disabled }}
            editable={!disabled}
            keyboardType={keyboardType}
            maxLength={length}
            testID={`kern-input-otp-${index}`}
            value={char}
            onChangeText={(next) => onChangeAt(index, next)}
            // Backspace on an EMPTY box fires no change event (the text did not
            // change), so the retreat rule has to hang off the key press
            // itself. Without this wiring `onBackspaceAt` would be dead code and
            // a user who taps past the last digit would be stuck.
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace") onBackspaceAt(index);
            }}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() =>
              setFocusedIndex((current) => (current === index ? null : current))
            }
            // `selectTextOnFocus` is what makes "tap the box to replace its
            // digit" work: without it a second tap appends and the one-time
            // code silently becomes 10 digits.
            selectTextOnFocus
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              fontSize: 20,
              color: scheme.color.onSurface,
            }}
          />
        </View>
      ))}
    </View>
  );
}

/**
 * Pressable wrapper for hosts that want a boxed digit without the input.
 * Exported because the OTP box IS the M3 shape, and a host composing its own
 * positions should not have to re-derive the 48x56 box.
 */
export function OTPBox({
  char,
  filled = false,
  focused = false,
  style,
  testID,
}: {
  char?: string;
  filled?: boolean;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scheme = useKernScheme();
  const styles = inputOTPStyles(scheme);
  return (
    <View
      testID={testID}
      style={[styles.box, filled || focused ? styles.boxFilled : null, style]}
    >
      <Text variant="title">{char ?? ""}</Text>
    </View>
  );
}
