import type { ComponentDoc } from "../types";

export const onboardingServiceStep: ComponentDoc = {
  slug: "onboarding-service-step",
  name: "Onboarding service step",
  oneLiner:
    "Onboarding service step is the service-catalog preset step over the picker plan mode.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "OnboardingServiceStep",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["OnboardingServiceStep"],
  keyboard: [
    {
      key: "Press",
      action:
        "Picks the service through the plan picker's option pressables — the picker's own press model, composed rather than replaced.",
    },
  ],
  customization: {
    supported: [
      "`services` is the injected standard service catalog — data in, never a local copy.",
      "The canonical selection trio carries the chosen service out to the wizard.",
      "It closes the no-service-step gap in the orchestrator flow as a composition, never product-specific logic.",
    ],
    notSupported: [
      "There is no catalog inside. The D924 entries arrive injected; the step maps them to picker options and nothing else.",
      "There is no second plan selector. Plan choosing converges on the picker's plan mode — this step is its preset, not a fork.",
    ],
  },
  api: [
    {
      name: "services",
      type: "readonly ServiceCatalogEntry[]",
      required: true,
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "value",
      type: "string",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "onValueChange",
      type: "(service: string) => void",
    },
    {
      name: "description",
      type: "string",
    },
  ],
  aria: [
    "Services render through the picker plan mode, so options announce with the picker's listbox contract.",
    "`label` and `placeholder` name the step's picker; `description` carries the supporting line.",
  ],
};
