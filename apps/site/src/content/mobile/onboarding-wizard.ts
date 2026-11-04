import type { ComponentDoc } from "../types";

export const onboardingWizard: ComponentDoc = {
  slug: "onboarding-wizard",
  name: "Onboarding wizard",
  oneLiner:
    "Onboarding wizard walks steps inline or in a modal with canonical step state.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "OnboardingWizard",
    variants: ["variant: page · modal"],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["OnboardingWizard"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects steps and advances, backs out, completes or cancels — steps keep the tab press model and the footer keeps real buttons.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the steps with their tab roles, then the footer actions.",
    },
  ],
  customization: {
    supported: [
      "`steps` are data — id, title, description, content — over the canonical `value`/`defaultValue`/`onValueChange` step trio.",
      "`variant` page renders the inline flow; `modal` wraps the same strip with panel and footer in the overlay — one scaffold, never two.",
      "Back, continue, finish and cancel labels are props, and the modal adds the open trio with `onClose`.",
    ],
    notSupported: [
      "There is no second panel beside the strip. Bodies ride tab content by axe rule; a parallel panel would orphan the tab targets.",
      "There is no product logic inside. The service step preset composes the picker over the injected catalog — the wizard never holds domain state.",
    ],
  },
  api: [
    {
      name: "steps",
      type: "OnboardingStep[]",
      required: true,
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
      type: "(step: string) => void",
    },
    {
      name: "variant",
      type: "OnboardingWizardVariant",
    },
    {
      name: "open",
      type: "boolean",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
    },
    {
      name: "onClose",
      type: "() => void",
    },
    {
      name: "onBack",
      type: "(step: string) => void",
    },
    {
      name: "onComplete",
      type: "() => void",
    },
    {
      name: "onCancel",
      type: "() => void",
    },
    {
      name: "accessibilityLabel",
      type: "string",
    },
    {
      name: "backLabel",
      type: "string",
    },
    {
      name: "continueLabel",
      type: "string",
    },
    {
      name: "finishLabel",
      type: "string",
    },
    {
      name: "cancelLabel",
      type: "string",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Steps render with the tab press model and screen-reader tab roles — the same split as the native tab strip.",
    "Step bodies ride the tab items' content, so every tab keeps a resolving panel target and no second panel sits beside the strip.",
    "`accessibilityLabel` names the wizard; the footer actions are the allowlisted step intents.",
  ],
};
