import { RadioGroup, RadioGroupItem } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * RadioGroup examples — one choice out of several, enforced by the group.
 *
 * Exclusivity belongs to the group, not the items: the group owns the
 * value, an item only reports its own. Props mirror the registry demo.
 */
export const RADIO_GROUP_EXAMPLES: ExampleSpec[] = [
  {
    id: "radiogroup-shipping",
    title: "One shipping choice, one unavailable",
    description:
      "The group names itself once; every option is a plain item. A disabled option stays visible and named, so nobody wonders where pickup went.",
    render: () => (
      <RadioGroup defaultValue="standard" aria-label="Shipping">
        <RadioGroupItem value="standard">Standard — 5 days</RadioGroupItem>
        <RadioGroupItem value="express">Express — 2 days</RadioGroupItem>
        <RadioGroupItem value="pickup" disabled>
          Pickup — unavailable
        </RadioGroupItem>
      </RadioGroup>
    ),
    code: `<RadioGroup defaultValue="standard" aria-label="Shipping">
  <RadioGroupItem value="standard">Standard — 5 days</RadioGroupItem>
  <RadioGroupItem value="express">Express — 2 days</RadioGroupItem>
  <RadioGroupItem value="pickup" disabled>
    Pickup — unavailable
  </RadioGroupItem>
</RadioGroup>`,
  },
];
