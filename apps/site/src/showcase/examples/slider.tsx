import { Slider } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Slider examples — a continuous value with a visible label.
 *
 * The label names the control for everyone; the value readout is what
 * sighted users track while dragging. Props mirror the registry demo.
 */
export const SLIDER_EXAMPLES: ExampleSpec[] = [
  {
    id: "slider-volume",
    title: "A labelled continuous value",
    description:
      "Label, value and thumb are separate parts of one root. The root owns the default; the thumb is the only pointer target.",
    render: () => (
      <div className="w-full max-w-sm">
        <Slider.Root defaultValue={40} aria-label="Volume">
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
          <Slider.Thumb />
        </Slider.Root>
      </div>
    ),
    code: `<Slider.Root defaultValue={40} aria-label="Volume">
  <Slider.Label>Volume</Slider.Label>
  <Slider.Value />
  <Slider.Thumb />
</Slider.Root>`,
  },
];
