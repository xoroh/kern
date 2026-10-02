import type { ComponentDoc } from "../types";

export const filterChipRow: ComponentDoc = {
  slug: "filter-chip-row",
  name: "Filter chip row",
  oneLiner:
    "Filter chip rows collect multiple filter choices and report the whole set.",
  features:
    "Reach for a filter chip row when several filters can be on at once and it helps to see them all: categories, tags, statuses. The row is options as data and the selection is a `string[]`, so it is explicitly a many-of-many control — which is the difference from `SegmentedButton`'s single mode and from `Select`'s one value. Chips are the right shape for this because each choice is visible and individually removable; a dropdown would hide the active set. Keep the option count modest, since the point is seeing what is on.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only composition of chips. Web composes filters from its own
    // `Chip`; there is no single web export to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["FilterChipRow"],
  customization: {
    supported: [
      "`options` are data — `value` and `label`.",
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled, and the value is the whole selected set.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no single-select mode. It is `string[]` — many-of-many by construction.",
      "There is no `max` or selection limit.",
      "There is no per-chip icon or avatar. Each chip is its label.",
    ],
  },
  api: [
    {
      name: "options",
      type: "{ value: string; label: string }[]",
      note: "The filters, as data.",
    },
    {
      name: "value / defaultValue",
      type: "string[]",
      note: "The whole selected SET — many-of-many by construction. This is the difference from `SegmentedButton`'s single mode and `Select`'s one value.",
    },
    {
      name: "onValueChange",
      type: "(value: string[]) => void",
      note: "Reports the complete next set rather than a single change.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Each chip is a real pressable with a `label`, so the active set is readable chip by chip rather than as one summary.",
    "The selection is a set, so each chip reports its own on/off state — which is what makes the active filters legible without opening anything.",
    "Keeping every choice visible is the reason to use chips rather than a dropdown: a filter you cannot see is a filter you forget you set.",
  ],
};
