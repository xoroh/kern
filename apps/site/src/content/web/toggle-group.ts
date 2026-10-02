import type { ComponentDoc } from "../types";

export const toggleGroup: ComponentDoc = {
  slug: "toggle-group",
  name: "Toggle group",
  oneLiner:
    "Toggle groups hold related toggles together as one control, picking either one option or several.",
  features:
    "Reach for a toggle group when several related on-off or select-one choices belong in a single bar of controls: text alignment, visible columns, a date range's ends. The group is the segmented control — one container, one row of options, and the pressed one reads against the rest. Choose the mode deliberately: exclusive when the options are alternatives, multi-select when they are independent flags. If the options are alternatives but too many to fit in a bar, that is a radio group or a select.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ToggleGroup",
    // No variant axis. Exclusive vs multi-select is a selection model, not a
    // treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["ToggleGroup", "ToggleGroupRoot", "ToggleGroupItem"],
  deviations: [
    {
      id: "K3",
      m3: "Material 3 defines no tonal surface role. Its surface roles are the surface, surface-dim, surface-bright and the surface-container family.",
      kern: "The group's container is painted with `--md-sys-color-surface-tonal`, a role kern adds beyond M3's 45.",
      why: "A segmented control needs a track that reads as a container rather than as content, and none of M3's surface-container roles is tuned for a pill-shaped track holding pressed states. The role is registered as K3 in the role inventory, so it is a declared addition to the legal role space rather than a colour invented in a stylesheet. It is the token that deviates; this is simply the component whose whole look depends on it.",
    },
  ],
  anatomy: [
    {
      name: "ToggleGroupRoot",
      role: "The track. Owns the selection model — exclusive or multi-select — and the aggregate value.",
    },
    {
      name: "ToggleGroupItem",
      role: "One option. Takes the same props as `Toggle`, because it is a `Toggle` in a group; its `value` is what it contributes to the selection.",
    },
    { name: "ToggleGroup", role: "The namespace object: Root and Item." },
  ],
  customization: {
    supported: [
      "`className` on the root and on each item, merged after their own classes.",
      "Pressed state is `data-pressed` on each item, so the selected look is restylable without new props.",
      "The track is `--md-sys-color-surface-tonal` and the pressed item is the primary roles — see Deviations for the track colour.",
    ],
    notSupported: [
      "There is no `orientation` prop. The track is a horizontal row; a vertical stack is the root's `className`.",
      "There is no `size` or `variant` prop. Every option looks like every other, which is what makes the set comparable.",
      "There is no `label` on the group. The question belongs to a `Fieldset` with a `FieldsetLegend`, same as a radio group.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Value | Value[]",
      note: "Two roles, one name. On `ToggleGroupRoot` it is the selection — generic over the value type, one value in exclusive mode and several in multi-select, so the shape of the prop is what the selection model looks like from outside. On `ToggleGroupItem` it is what that option contributes to the selection, and in practice it is required: an item with no value cannot be chosen.",
    },
    {
      name: "defaultValue",
      type: "Value | Value[]",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value) => void",
      note: "Fires when the selection changes, carrying the whole selection rather than one item at a time.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "On an item: controlled pressed state. Inside a group this is normally driven by the group.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on the root and on each item, merged after their own classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an item, or on the root to disable the whole set.",
    },
  ],
  aria: [
    "Each item is a real button carrying `aria-pressed`, so its state is announced rather than implied by colour.",
    "The root groups the items so the set reads as one control with several states rather than as unrelated buttons.",
    "In exclusive mode the options are alternatives and only one is pressed at a time; in multi-select each carries its own state.",
    "The group has no label slot — give the question to a `Fieldset` and `FieldsetLegend`, so it is announced before the options.",
  ],
};
