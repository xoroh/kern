import { useControllableState } from "@xoroh/kern-primitives";
import {
  type ResolvedTheme,
  resolveThemeDetails,
  tokens,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

/**
 * M3 icon button — the canonical square, icon-only action.
 *
 * ## Why this is not `Button` with no children
 *
 * The container is square and icon-only, but the behaviour that matters is the
 * TOGGLE form, and a toggle button is a different contract from a button:
 *
 *   Button     "do this"            -> activation performs an action
 *   IconButton "this is on/off"     -> activation changes state
 *
 * A toggle icon button that does not report its state is "a plain button
 * wearing a selected colour" — precisely the state a screen reader cannot see.
 * That is why `selected` is carried in `accessibilityState` even when the
 * button is used as a plain action, and why the state is controllable.
 *
 * ## The accessible name is mandatory, not optional
 *
 * There is no visible text, so nothing names the button but what we are told. An
 * unnamed icon button is announced as an unlabelled control, which is not an
 * action anyone can take. `label` is therefore required by the type, and it
 * drives BOTH the announced name and any tooltip the host renders from it —
 * one prop, so a sighted hover and an announced name cannot drift apart.
 *
 * `accessibilityState.selected` (not `checked`) mirrors `Toggle`: on a
 * `role="button"`, `selected` is the axis RN exposes for pressed state. This is
 * the same axis `CheckboxGroupItem` deliberately does NOT use — a checkbox
 * reports `checked`, a button reports `selected`.
 *
 * ## Touch target
 *
 * The visual box is 40dp; the hit area is pushed out to 48dp via `hitSlop`,
 * matching the `Toggle` precedent, because an icon-only control has no text
 * giving it incidental size.
 */

export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

export function iconButtonStyles(
  variant: IconButtonVariant,
  pressed: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  const base: ViewStyle = {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Number.parseFloat(scheme.shape.full),
    opacity: disabled ? 0.38 : 1,
  };

  // A pressed toggle changes appearance only in the toggling variants. For
  // `standard`/`outlined` the pressed colour would fight the container, and the
  // state is already carried by `accessibilityState.selected`.
  if (pressed) {
    return {
      ...base,
      backgroundColor: scheme.color.secondaryContainer,
    };
  }

  switch (variant) {
    case "filled":
      return {
        ...base,
        backgroundColor: scheme.color.surfaceContainerHighest,
      };
    case "tonal":
      return {
        ...base,
        backgroundColor: scheme.color.secondaryContainer,
      };
    case "outlined":
      return {
        ...base,
        borderWidth: 1,
        borderColor: scheme.color.outlineVariant,
      };
    case "standard":
    default:
      return base;
  }
}

/**
 * Whether a host cancelled this press.
 *
 * Extracted as a named predicate so it can be tested honestly. React Native's
 * Testing Library synthesises a press event that exposes both
 * `preventDefault()` and `isDefaultPrevented()`, but the latter is a no-op stub
 * that returns `false` even after `preventDefault()` — so `fireEvent.press`
 * cannot exercise an `isDefaultPrevented()` guard at all. Testing the predicate
 * directly is the only way this contract is actually covered.
 *
 * Unknown/absent events are treated as NOT cancelled: a press with no event
 * object is a press we have no reason to suppress.
 */
export function pressIsCancelled(event?: {
  isDefaultPrevented?: () => boolean;
}): boolean {
  return typeof event?.isDefaultPrevented === "function"
    ? event.isDefaultPrevented()
    : false;
}

export type NativeIconButtonProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState" | "accessibilityRole"
> & {
  /** REQUIRED. The accessible name — there is no visible text to supply one. */
  label: string;
  /** Container variant. */
  variant?: IconButtonVariant;
  /** The icon element. */
  children?: ReactNode;
  /** Toggle form: controlled pressed state. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  testID?: string;
};

export function IconButton({
  label,
  variant = "standard",
  children,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  onPress,
  hitSlop,
  style,
  testID,
  ...props
}: NativeIconButtonProps) {
  const scheme = useKernScheme();
  const [isPressedRaw, setPressed] = useControllableState<boolean>(
    pressedProp,
    defaultPressed,
    onPressedChange,
  );
  // `useControllableState` is typed `boolean | undefined` because it also serves
  // string/number state; with a defaultValue this is never undefined in
  // practice, but the type says it can be, and `selected: undefined` would ship
  // an indeterminate state to assistive tech.
  const isPressed = isPressedRaw ?? false;
  const styles = iconButtonStyles(variant, isPressed, disabled, scheme);

  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-icon-button"}
      accessibilityRole="button"
      // Mandatory: without this the control is announced with no name at all.
      accessibilityLabel={label}
      accessibilityState={{ selected: isPressed, disabled }}
      disabled={disabled}
      // 40dp visual box, 48dp hit area.
      hitSlop={hitSlop ?? { top: 4, bottom: 4, left: 4, right: 4 }}
      onPress={(event) => {
        onPress?.(event);
        // Honour the preventDefault contract the rest of kern uses: a host that
        // cancels the press must not change state.
        if (!disabled && !pressIsCancelled(event)) setPressed(!isPressed);
      }}
      style={({ pressed }) => [
        styles,
        pressed && !disabled ? { opacity: 0.62 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {children}
    </Pressable>
  );
}

/**
 * A wrapper that guarantees the 48dp minimum around a 40dp control.
 *
 * Exported because a host composing icon buttons into a toolbar needs the
 * spacing guarantee to hold without re-deriving it.
 */
export function IconButtonTarget({
  children,
  style,
  testID,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  return (
    <View
      testID={testID ?? "kern-icon-button-target"}
      style={[
        // 48dp is the minimum touch target; the icon button's own box is 40dp,
        // so a toolbar needs this to guarantee the rest of the target.
        {
          minWidth: 48,
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
