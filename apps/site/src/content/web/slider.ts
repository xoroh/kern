import type { ComponentDoc } from "../types";

export const slider: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  oneLiner:
    "Sliders pick a value from a range by feel, showing where it sits along the way.",
  features:
    "Reach for a slider when the answer is a range and the shape of it matters more than the exact number: volume, opacity, a price ceiling, an intensity. The value is continuous and the extremes are visible, so someone can see what is possible before committing. Show the number beside it — a slider alone says roughly where, not what. If the value must be exact, that is a number field; if it is one of a few known options, that is not a range at all.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Slider",
    // No variant axis. The value is the axis.
    variants: [],
    // M3 places "slider" at resting level 0, and level 0 is `shadow: none`.
    // kern ships no elevation token on Slider, which is the conformant state —
    // the gate asserts the absence, so adding an unearned shadow later fails.
    elevation: 0,
  },
  parts: ["Slider", "SliderRoot", "SliderThumb", "SliderLabel", "SliderValue"],
  anatomy: [
    {
      name: "SliderRoot",
      role: "The control. Owns the value and the range, and lays out the track, thumb and labels.",
    },
    {
      name: "SliderThumb",
      role: "The handle. Drag it, or move it with the keyboard, to change the value.",
    },
    { name: "SliderLabel", role: "Names the slider." },
    {
      name: "SliderValue",
      role: "Renders the current number beside the track, so the position reads as a value and not just as a distance.",
    },
    { name: "Slider", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The active track and the thumb are the primary roles, so a theme moves every slider at once.",
      "State is exposed as `data-disabled` and the primitive's own attributes, so a stylesheet can restyle without new props.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One thickness, one treatment.",
      "There is no `orientation` prop. This is a horizontal slider; a vertical one is the root's `className` and its own layout.",
      "There is no `showValue` boolean. The value is its own part — render `SliderValue` where you want it and omit it where you do not.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number | number[]",
      note: "Controlled value on `SliderRoot`. A single number for one thumb, an array for a range with two — the shape says whether you are picking a point or a span.",
    },
    {
      name: "defaultValue",
      type: "number | number[]",
      note: "Initial value when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value, eventDetails: object) => void",
      note: "Fires as the value moves, including while dragging.",
    },
    {
      name: "min",
      type: "number",
      note: "Lower end of the track.",
    },
    {
      name: "max",
      type: "number",
      note: "Upper end of the track.",
    },
    {
      name: "step",
      type: "number",
      note: "How fine the movement is, and how far one arrow key press travels. Set it to the smallest difference that matters.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the control.",
    },
  ],
  aria: [
    "The thumb is a slider-role control with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, so its position is announced as a number rather than a pixel.",
    "Arrow keys move by one step, Page Up/Down by a larger jump, Home and End to the extremes — the WAI-ARIA slider pattern.",
    "`SliderLabel` names it and `SliderValue` shows the number, so the value is available both visually and to assistive tech.",
    "Dragging works, but every value is reachable by keyboard too — a slider that is pointer-only is unusable for many people.",
  ],
};
