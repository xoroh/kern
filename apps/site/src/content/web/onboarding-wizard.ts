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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Arrow keys",
      action:
        "Moves between steps on the web strip — the steps keep the tab strip's roving keyboard with Home and End jumps; native uses press with screen-reader tab roles.",
    },
    {
      key: "Enter / Space",
      action:
        "Advances, backs out, completes or cancels through the footer's real buttons — each an allowlisted action, so the press is the browser's own.",
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
      type: "string | undefined",
      note: "Controlled active step id.",
    },
    {
      name: "defaultValue",
      type: "string | undefined",
      note: "Initial step for the uncontrolled case. Defaults to the first step.",
    },
    {
      name: "onValueChange",
      type: "((step: string) => void) | undefined",
    },
    {
      name: "variant",
      type: '"page" | "modal"',
      note: "`page` renders inline; `modal` wraps in `KernOverlay` (same strip + panel + footer, no second scaffold).",
    },
    {
      name: "open",
      type: "boolean | undefined",
      note: "Modal only: overlay open state (canonical pair with `onOpenChange`).",
    },
    {
      name: "defaultOpen",
      type: "boolean | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
    },
    {
      name: "onClose",
      type: "(() => void) | undefined",
      note: "Modal only: × action (allowlisted DOMAIN action).",
    },
    {
      name: "onBack",
      type: "((step: string) => void) | undefined",
      note: "Step-back notification (allowlisted).",
    },
    {
      name: "onComplete",
      type: "(() => void) | undefined",
      note: "Final-step Continue notification (allowlisted).",
    },
    {
      name: "onCancel",
      type: "(() => void) | undefined",
      note: "Abort notification (allowlisted; host renders the trigger).",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for the step strip.",
    },
    {
      name: "backLabel",
      type: "string | undefined",
    },
    {
      name: "continueLabel",
      type: "string | undefined",
    },
    {
      name: "finishLabel",
      type: "string | undefined",
    },
    {
      name: "cancelLabel",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "Step bodies ride the tab items' content, so every tab keeps a resolving panel target and no second panel sits beside the strip.",
    "`label` names the wizard; the step region reports progress politely as steps change.",
    "`onBack`, `onComplete` and `onCancel` are the allowlisted step actions — the wizard reports, the host routes.",
  ],
};
