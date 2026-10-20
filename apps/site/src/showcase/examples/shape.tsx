import { Shape } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Shape examples — the six basic forms in the kern radius language.
 *
 * NATIVE-ONLY export: `Shape` ships in `@xoroh/kern-native` and has no web
 * counterpart to show, so the fence declares the package it imports from —
 * without that, the copyable export would resolve the fence's tags against
 * the web barrel, which exports no `Shape`, and hand the reader a module
 * that cannot compile.
 *
 * The forms come from the SHAPE SCALE, not from a freehand radius, and the
 * diamond is a rotated rounded square rather than a fourth path.
 */
export const SHAPE_EXAMPLES: ExampleSpec[] = [
  {
    id: "shape-six-forms",
    title: "The six forms, drawn from the shape scale",
    description:
      "Every radius comes from the scale rather than from a number you chose, and the diamond is a rotated rounded square rather than a path of its own. The fill is the on-surface role unless a classification hue overrides it.",
    render: () => (
      <div className="flex items-end gap-4">
        <Shape kind="circle" size={48} />
        <Shape kind="square" size={48} />
        <Shape kind="pill" size={48} />
        <Shape kind="arch" size={48} />
        <Shape kind="triangle" size={48} />
        <Shape kind="diamond" size={48} />
      </div>
    ),
    code: `<Shape kind="circle" size={48} />
<Shape kind="square" size={48} />
<Shape kind="pill" size={48} />
<Shape kind="arch" size={48} />
<Shape kind="triangle" size={48} />
<Shape kind="diamond" size={48} />`,
    package: "@xoroh/kern-native",
  },
];
