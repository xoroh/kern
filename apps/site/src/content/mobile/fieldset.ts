import type { ComponentDoc } from "../types";

export const fieldset: ComponentDoc = {
  slug: "fieldset",
  name: "Fieldset",
  oneLiner:
    "Fieldsets group controls under a shared legend and give them one disabled state.",
  features:
    "Reach for a fieldset when several controls answer one question and should be enabled or disabled together: a set of delivery options, a group of toggles. On the web this is a thin wrapper over `<fieldset>` and the browser hands you two behaviours for free — inherited disabled state, and the legend as the group's name. React Native has neither, so this component supplies both: `disabled` is published through context and read with `useFieldsetDisabled()`, and the legend names the group when it is the first child. That is the whole reason the family has an extra part on native: a plain `View` cannot know it is disabled, so `FieldsetItem` exists to visibly reflect it.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Fieldset",
    variants: [],
    elevation: "surface",
  },
  // `FieldsetItem` is NATIVE-ONLY — web's `<fieldset>` inherits disabled state
  // natively, so there is no web export for it. The gate's peer check is the
  // reason this is stated rather than assumed.
  parts: ["Fieldset", "FieldsetLegend", "FieldsetItem"],
  customization: {
    supported: [
      "`disabled` disables the group, published through context for `useFieldsetDisabled()`.",
      "`accessibilityLabel` overrides the group's accessible name; leave it unset to be named by the legend, which is what the web does.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `legend` prop. The legend is a part — `FieldsetLegend` — rendered as the first child, matching the web's structure rather than a flat string.",
      "There is no `orientation` prop. The group is a vertical stack.",
      "There is no `error` or `description`. Those belong to `Field`; a fieldset groups controls, it does not describe one.",
    ],
  },
  api: [
    {
      name: "disabled",
      type: "boolean",
      note: "Disables the group. On the web every descendant inherits this automatically; here it is published through context and read with `useFieldsetDisabled()`.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Overrides the group's accessible name. Leave unset to be named by the legend — that is what the web does, and overriding it should be deliberate.",
    },
    {
      name: "FieldsetLegend",
      type: "component",
      note: "The legend. Rendered inside the fieldset and, WHEN IT IS THE FIRST CHILD, it doubles as the group's accessible name. Position matters — that is the web's rule and this reproduces it.",
    },
    {
      name: "FieldsetItem",
      type: "component",
      note: "A row that renders itself disabled when the fieldset is. Native-only: web's `<fieldset>` inherits disabled state for free, so there is no web export. This is the OPT-IN part — a `View` cannot know it is disabled, so anything interactive must either be a kern control calling `useFieldsetDisabled()`, or an item that visibly reflects it.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The group is named by its legend when the legend is the first child — reproducing the web's behaviour, where `<fieldset>` takes its name from `<legend>`.",
    "`accessibilityLabel` overrides that, and the comment says to leave it unset unless the override is deliberate.",
    "Disabled state is inherited by descendants through `useFieldsetDisabled()`, and kern controls OR it with their own `disabled` — exactly the web's `<fieldset disabled>` semantics.",
    "`FieldsetItem` exists for anything that is NOT a kern control: a `View` cannot know it is disabled, so without it a group would disable its controls while the row still looked active.",
  ],
};
