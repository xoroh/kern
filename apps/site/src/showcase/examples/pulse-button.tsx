import { PulseButton } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * PulseButton examples — shape-locked M3 Expressive button.
 *
 * The outer silhouette (pill or square) stays invariant across rest, hover,
 * press, and toggle while tactile feedback comes from a spring scale pulse
 * and an inner radial highlight wave.
 */
export const PULSE_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "pulse-button-shape-lock",
    title: "Locked silhouette with spring pulse",
    description:
      'Pressing or toggling keeps `shape="pill"` or `shape="square"` invariant while the container scales with the M3 Expressive fast-spatial spring and emits an inner radial pulse wave.',
    render: () => (
      <>
        <PulseButton variant="filled">Confirm order</PulseButton>
        <PulseButton variant="tonal" shape="square">
          Square lock
        </PulseButton>
        <PulseButton variant="outlined" icon={<Icon name="bolt" />}>
          Expressive pulse
        </PulseButton>
      </>
    ),
    code: `<PulseButton variant="filled">Confirm order</PulseButton>
<PulseButton variant="tonal" shape="square">Square lock</PulseButton>
<PulseButton variant="outlined" icon={<Icon name="bolt" />}>
  Expressive pulse
</PulseButton>`,
  },
];
