import { KernPicker, ReasonPicker } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernPicker examples — ONE picker for every mode: date/time/country/
 * option-list/assignee/status/plan plus the generic ReasonPicker. Dialog on
 * web, bottom-sheet on native, inline-popover anchored; single-select closes
 * on pick, multi-select stays open.
 */
export const KERN_PICKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-picker-option-list",
    title: "Option list in a dialog",
    description:
      "Closed-list choice with a trigger, panel, and footer. The trigger shows the placeholder until a pick lands, then the picked label.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <KernPicker
          mode="option-list"
          label="Assignee"
          options={[
            { value: "ada", label: "Ada Lovelace" },
            { value: "grace", label: "Grace Hopper" },
          ]}
        />
        <KernPicker
          mode="status"
          label="Trip status"
          options={[
            { value: "live", label: "Live" },
            { value: "done", label: "Completed" },
          ]}
        />
      </div>
    ),
    code: `<KernPicker
  mode="option-list"
  label="Assignee"
  options={[
    { value: "ada", label: "Ada Lovelace" },
    { value: "grace", label: "Grace Hopper" },
  ]}
/>`,
  },
  {
    id: "kern-picker-plan",
    title: "Plan mode over the service catalog",
    description:
      "The PlanSelector merge point: pass catalog entries and the picker renders them through `serviceCatalogToOptions`. No second plan selector.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <KernPicker
          mode="plan"
          label="Service"
          catalog={[
            { id: "sedan", name: "Sedan", priceLabel: "from €9" },
            { id: "van", name: "Van", priceLabel: "from €14" },
          ]}
        />
      </div>
    ),
    code: `<KernPicker
  mode="plan"
  label="Service"
  catalog={[
    { id: "sedan", name: "Sedan", priceLabel: "from €9" },
    { id: "van", name: "Van", priceLabel: "from €14" },
  ]}
/>`,
  },
];

/**
 * ReasonPicker examples — the generic MS-020 select: rows arrive ONLY via
 * the injected adapter, never from a local copy in any context.
 */
export const REASON_PICKER_EXAMPLES: ExampleSpec[] = [
  {
    id: "reason-picker-cancel",
    title: "Reasons from the injected adapter",
    description:
      "The context selects which rows apply; the picker never invents rows for a context it was not given.",
    render: () => (
      <div className="flex max-w-xl flex-wrap items-center gap-2">
        <ReasonPicker
          label="Cancellation reason"
          reasons={{
            reasons: [
              { id: "rider", label: "Rider asked", context: "cancel" },
              { id: "traffic", label: "Stuck in traffic", context: "cancel" },
            ],
            context: "cancel",
          }}
        />
      </div>
    ),
    code: `<ReasonPicker
  label="Cancellation reason"
  reasons={{
    reasons: [
      { id: "rider", label: "Rider asked", context: "cancel" },
      { id: "traffic", label: "Stuck in traffic", context: "cancel" },
    ],
    context: "cancel",
  }}
/>`,
  },
];
