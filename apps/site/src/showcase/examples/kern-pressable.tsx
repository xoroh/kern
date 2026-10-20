import { KernPressable } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Kern pressable examples — the narrow accessibility-defaults wrap.
 *
 * NATIVE-ONLY export: `KernPressable` ships in `@xoroh/kern-native` and has
 * no web counterpart by ruling — the 48dp figure is Material's, and the web
 * follows WCAG 2.2's Target Size (Minimum). So the fence declares the package
 * it imports from, or the copyable export would resolve the fence's tags
 * against the web barrel and hand the reader a module that cannot compile.
 *
 * The wrapper owns three things and nothing else: the minimum touch target,
 * `button` as the default role, and `disabled` always reported. The example
 * shows the override, because a menu item is not a button.
 */
export const KERN_PRESSABLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-pressable-defaults",
    title: "A press that already knows the rules",
    description:
      "The role defaults to `button` and `disabled` is always reported, so a control that refuses the press still says so. Pass `accessibilityRole` when the control is not a button — a menu item is not a button.",
    package: "@xoroh/kern-native",
    render: () => (
      <KernPressable onPress={() => {}}>Save changes</KernPressable>
    ),
    code: `<KernPressable onPress={() => {}}>Save changes</KernPressable>`,
  },
];
