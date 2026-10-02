import type { ComponentDoc } from "../types";

export const kernPressable: ComponentDoc = {
  slug: "kern-pressable",
  name: "Kern pressable",
  oneLiner:
    "The narrow accessibility-defaults wrap for anything pressable on native: a 48dp minimum target, a button role by default, and `disabled` always reported.",
  features:
    "Reach for this when you are building a pressable that is not a Button and not an IconButton — a list row, a card, a chip-shaped target, a custom control — and you want kern's accessibility defaults applied without adopting a visual component. It owns exactly three things and passes everything else straight to React Native's `Pressable`: the 48dp minimum touch target, `button` as a DEFAULT role rather than an override, and `disabled` reported even when the caller supplied only `selected`. Everything visual is yours. It is deliberately not a Button: it has no variant, no size and no styling of its own, because a wrapper that grew those would be a new primitive family wearing a thin name and would duplicate the decision `Button` already made.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only by RULING: the 48dp figure is Material's, and the web is
    // governed by WCAG 2.2 Target Size (Minimum) at 24x24 CSS px. Pinning one
    // number across both would assert a value the other platform's standard
    // does not state.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["KernPressable"],
  customization: {
    supported: [
      "`accessibilityRole` overrides the `button` default, so a menu item can say it is a menu item.",
      "`accessibilityState` is MERGED with the wrapper's own `disabled`, never substituted — a caller supplying only `selected` still gets `disabled: false` reported.",
      "`style` may be an object or a function of the pressed state; the minimum target is applied first and the caller's style still wins.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop. This is not a Button and will not become one.",
      "It styles nothing. If you find yourself passing colours or padding, you wanted `Button` or `IconButton`.",
      "It sets no visual feedback for press. RN's `Pressable` opacity is the default and is not overridden.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "Rendered inside the pressable.",
    },
    {
      name: "accessibilityRole",
      type: "PressableProps['accessibilityRole']",
      default: '"button"',
      note: "The DEFAULT role, not a forced one. Override it when the control is not a button — a menu item is not a button.",
    },
    {
      name: "accessibilityState",
      type: "PressableProps['accessibilityState']",
      note: "Merged with the wrapper's own `disabled` rather than replaced, so the state axis stays complete when a caller passes only `selected`.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Disables the pressable AND is reported in `accessibilityState`, so the two can never disagree.",
    },
    {
      name: "style",
      type: "ViewStyle | (state) => ViewStyle",
      note: "Applied after the 48dp minimum, so a caller style wins while still reacting to press.",
    },
    {
      name: "MIN_TOUCH_TARGET",
      type: "number",
      note: "Exported constant: 48, Material's minimum touch target. Deliberately NOT the web's number — the web follows WCAG 2.2 at 24x24 CSS px.",
    },
  ],
  aria: [
    "Every pressable reports `button` unless it says otherwise, so a control that is not a Button does not have to remember.",
    "`disabled` is always in the accessibility state, never only in the press handling — a control that looks dead but does not announce as disabled is the defect this closes.",
    "The 48dp minimum is applied as real layout, not as padding on the child, so the hit area is the target a finger has to hit.",
  ],
};
