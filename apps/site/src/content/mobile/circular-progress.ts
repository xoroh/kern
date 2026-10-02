import type { ComponentDoc } from "../types";

export const circularProgress: ComponentDoc = {
  slug: "circular-progress",
  name: "Circular progress",
  oneLiner:
    "Circular progress is the ring — measured when it has a value, looping when it does not.",
  features:
    "Reach for circular progress when the wait is a ring: an inline spinner, a determinate arc, a branded loading moment. It is the one progress component that does BOTH jobs — pass `value` and it draws a measured arc, omit it and it runs the indeterminate loop. The rule the component enforces is worth knowing: determinate renders the Material 3 circular arc regardless of the style you ask for, because known progress means determinate. The decorative styles are for the unmeasured wait, and some of them are reserved — defined in the spec but not rendered yet, and they throw rather than silently falling back, which is the honest failure.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "CircularProgress",
    variants: [],
    elevation: "surface",
  },
  parts: ["CircularProgress"],
  customization: {
    supported: [
      "`value` in 0–1 picks determinate; omitting it runs the indeterminate loop.",
      "`loaderStyle` chooses the indeterminate look, and `shapes` customises the `shapes` style (defaulting to the brand trio).",
      "`tenantId` selects a tenant variant override, and unknown ids fail loud.",
      "`size` is the shared feedback size axis.",
    ],
    notSupported: [
      "You cannot style the determinate arc. Known progress renders the Material 3 arc regardless of `loaderStyle` — the style is for the unmeasured wait.",
      "The reserved styles `conveyor`, `contained`, `orbit`, `morph` and `assembly` are defined in the spec but NOT rendered yet. They throw rather than falling back.",
      "There is no `max`. The value is already a 0–1 proportion, not an amount.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number",
      note: "0–1. Omit it for the indeterminate loading indicator. Passing it makes the component determinate whatever else you ask for.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "The indeterminate look. Reserved styles (`conveyor`, `contained`, `orbit`, `morph`, `assembly`) are in the spec but not rendered yet — they THROW, rather than silently falling back to something else.",
    },
    {
      name: "shapes",
      type: "readonly FeedbackShapeKind[]",
      note: "For the `shapes` style. Defaults to the brand trio.",
    },
    {
      name: "tenantId",
      type: "string",
      note: "Tenant variant override. Unknown ids fail loud rather than defaulting.",
    },
    {
      name: "label",
      type: "string",
      note: "The accessible name.",
    },
    {
      name: "size",
      type: "FeedbackSize",
      note: "The shared feedback size axis, `sm`/`default`/`lg`.",
    },
  ],
  aria: [
    "`label` names the ring, so it is announced rather than being an anonymous shape.",
    "Determinate and indeterminate are different messages: a measured arc says how far along, a loop says only that something is happening. Passing `value` changes which one is said.",
    "A reserved style throws rather than rendering something else — so a failure here is loud. That is deliberate: a loading style that silently becomes a different one misrepresents the product.",
  ],
};
