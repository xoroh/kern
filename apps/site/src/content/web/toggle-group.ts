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
      spec: "Material 3 defines no tonal surface role. Its surface roles are the surface, surface-dim, surface-bright and the surface-container family.",
      kern: "The group's container is painted with `--sys-color-surface-tonal`, a role kern adds beyond M3's 45.",
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
      "The track is `--sys-color-surface-tonal` and the pressed item is the primary roles — see Deviations for the track colour.",
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
      for: ["ToggleGroupRoot"],
      type: "Value | Value[]",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["ToggleGroupRoot"],
      type: "(value) => void",
      note: "Fires when the selection changes, carrying the whole selection rather than one item at a time.",
    },
    {
      name: "pressed",
      for: ["ToggleGroupItem"],
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
    {
      name: "orientation",
      for: ["ToggleGroupRoot"],
      type: "Orientation | undefined",
      note: "Whether toggles lay out horizontally or vertically.",
    },
    {
      name: "loopFocus",
      for: ["ToggleGroupRoot"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last toggle back to the first. Disabled stops at the ends.",
    },
    {
      name: "multiple",
      for: ["ToggleGroupRoot"],
      type: "boolean | undefined",
      note: "When true several toggles can stay pressed at once. False (default) makes it an exclusive choice: pressing one releases the others.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a toggle when the replacement is a native `<button>`.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ToggleGroupState` on the group, `ToggleState` (pressed, disabled) on a toggle.",
    },
    {
      name: "defaultPressed",
      for: ["ToggleGroupItem"],
      type: "boolean | undefined",
      note: "Whether the toggle starts pressed in the uncontrolled case. Use `pressed` for controlled.",
    },
    {
      name: "onPressedChange",
      for: ["ToggleGroupItem"],
      type: '((pressed: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element | undefined; }) => void) | undefined',
      note: "Fires when the toggle is pressed or released.",
    },
    {
      name: "nativeButton",
      for: ["ToggleGroupItem"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
  ],
  aria: [
    "Each item is a real button carrying `aria-pressed`, so its state is announced rather than implied by colour.",
    "The root groups the items so the set reads as one control with several states rather than as unrelated buttons.",
    "In exclusive mode the options are alternatives and only one is pressed at a time; in multi-select each carries its own state.",
    "The group has no label slot — give the question to a `Fieldset` and `FieldsetLegend`, so it is announced before the options.",
  ],
};
