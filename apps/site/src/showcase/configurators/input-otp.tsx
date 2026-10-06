import { InputOTP } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * InputOTP configurator — the thirty-second Part-4 configurator
 * (move #36), first slot-count surface. Knobs are the axes the Root type
 * leaves open: `length` (how many slots — 4 or 6; the stage renders that
 * many inputs and the fence emits that many lines) and `mask` (slots
 * render as password inputs instead of textboxes — the edge composition,
 * carried from the move-5 Group lesson). No `creatable`-style extras; the
 * component doc's "no length prop" claim is stale (written against the old
 * primitive — the installed otp-field Root REQUIRES `length`, the demo
 * passes `length={4}`, and the Root type carries `autoSubmit`/`mask`/
 * `validationType`). `autoSubmit` needs an owning form to observe, so it
 * is noted in the fence, not a knob; `validationType`/`inputMode` are
 * fixed strings here. The stage remounts by key on every knob so it
 * cannot drift from the fence.
 */
function lengthOf(v: ConfigValues): 4 | 6 {
  return v.length === "6" ? 6 : 4;
}

function maskOf(v: ConfigValues): boolean {
  return v.mask === true;
}

function slotsOf(length: number): string {
  return Array.from({ length }, () => "  <InputOTP.Input />").join("\n");
}

export const INPUT_OTP_CONFIGURATOR: ConfiguratorSpec = {
  id: "input-otp-knobs",
  title: "Configure the one-time code",
  description:
    "Slot count and masking. A masked code renders its slots as password inputs — shoulder-surfing protection for codes read off a device. The knobs describe the next mount (the stage remounts by key): typing in the live slots does not flip them back, so a filled stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "length",
      label: "Slots",
      options: ["4", "6"],
      default: "4",
    },
    {
      kind: "boolean",
      name: "mask",
      label: "Masked",
      default: false,
    },
  ],
  render: (v) => {
    const length = lengthOf(v);
    return (
      <InputOTP.Root
        key={`${length}-${maskOf(v) ? "masked" : "plain"}`}
        length={length}
        mask={maskOf(v)}
        aria-label="One-time code"
      >
        {Array.from({ length }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: slots are static siblings that never reorder.
          <InputOTP.Input key={`slot-${length}-${i}`} />
        ))}
      </InputOTP.Root>
    );
  },
  code: (v) =>
    `<InputOTP.Root length={${lengthOf(v)}}${maskOf(v) ? " mask" : ""} aria-label="One-time code">\n${slotsOf(lengthOf(v))}\n</InputOTP.Root>\n\n// autoSubmit needs an owning form to observe — noted, not a knob here.`,
};
