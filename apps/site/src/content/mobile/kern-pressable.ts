import type { ComponentDoc } from "../types";

export const kernPressable: ComponentDoc = {
  slug: "kern-pressable",
  name: "Kern pressable",
  oneLiner:
    "The narrow accessibility-defaults wrap for anything pressable on native: Material's minimum touch target, a button role by default, and `disabled` always reported.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The control reads as a button unless the caller overrides the role, and double-tap runs the press.",
    },
    {
      key: "Swipe over a disabled control (TalkBack / VoiceOver)",
      action:
        "The disabled state is always reported, so a control that refuses the press still says so instead of looking available.",
    },
  ],
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
      note: "Applied after the minimum touch target, so a caller style wins while still reacting to press.",
    },
    {
      name: "MIN_TOUCH_TARGET",
      type: "number",
      note: "Exported constant: 48, Material's minimum touch target. Deliberately NOT the web's number — the web follows WCAG 2.2's Target Size (Minimum).",
    },
  ],
  aria: [
    "Every pressable reports `button` unless it says otherwise, so a control that is not a Button does not have to remember.",
    "`disabled` is always in the accessibility state, never only in the press handling — a control that looks dead but does not announce as disabled is the defect this closes.",
    "The minimum touch target is applied as real layout, not as padding on the child, so the hit area is the target a finger has to hit.",
  ],
};
