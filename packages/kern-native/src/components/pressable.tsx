import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

/**
 * Minimum touch target on the native side: Material and the iOS HIG (44pt).
 *
 * Deliberately NOT the web's number. The web is governed by WCAG 2.2 Target
 * Size (Minimum), 24x24 CSS px; this is Material's 48dp. Two platforms, two
 * governing standards, one obligation ("large enough to hit reliably") and two
 * different numbers. Pinning one across both would assert a value the other
 * platform's standard does not state.
 */
export const MIN_TOUCH_TARGET = 48;

export type KernPressableProps = Omit<
  PressableProps,
  "style" | "accessibilityRole"
> & {
  /** Rendered inside. */
  children?: ReactNode;
  /** Override the default `button` role. A menu item is not a button. */
  accessibilityRole?: PressableProps["accessibilityRole"];
  /** Override the default `button` role (web `role` half of the pair). */
  role?: PressableProps["role"];
  style?: PressableProps["style"];
};

/**
 * The narrow accessibility-defaults wrap — deliberately NOT a new primitive
 * family, and deliberately NOT a Button.
 *
 * 53 native files reach for React Native's `Pressable` directly, and each one
 * decides for itself what a pressable means. This wrapper owns only the
 * ACCESSIBILITY DEFAULTS kern has already decided elsewhere:
 *
 *   - the 48dp minimum touch target (the `IconButton` precedent)
 *   - `role="button"` as a DEFAULT, never an override
 *   - `disabled` always reported, even when the caller only supplied `selected`
 *
 * Everything else passes through untouched. That restraint is the whole design:
 * a wrapper that grew a `variant` prop, or styled children, or became the house
 * Button, would be a new primitive family wearing a thin name — and it would
 * duplicate `Button` and `IconButton` rather than replace the decision they
 * already made.
 *
 * It lives in kern-native, not kern-primitives: the target size is a platform
 * convention, and a primitive that read it would have made a visual decision,
 * which is exactly what the primitives boundary forbids.
 */
export function KernPressable({
  children,
  role,
  accessibilityRole = "button",
  disabled = false,
  style,
  ...rest
}: KernPressableProps) {
  // One default, two props: an explicit `role` wins, otherwise the
  // `accessibilityRole` (itself defaulting to `button`) carries both.
  const resolvedRole: PressableProps["role"] =
    role ?? (accessibilityRole as PressableProps["role"]);
  return (
    <Pressable
      role={resolvedRole}
      accessibilityRole={accessibilityRole}
      // Always reported, even when the caller only supplied another state:
      // a control that refuses the press but does not report `disabled`
      // looks available and is not.
      aria-disabled={disabled}
      disabled={disabled}
      style={(state) => [
        { minHeight: MIN_TOUCH_TARGET, minWidth: MIN_TOUCH_TARGET },
        // Pressable's `style` may be a function of the pressed state, so it
        // cannot just be spread into an array. Resolving it keeps BOTH forms
        // working: the minimum is always applied first, and a caller style --
        // object or function -- still wins, and can still react to press.
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
