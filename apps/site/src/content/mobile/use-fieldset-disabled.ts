import type { ComponentDoc } from "../types";

/**
 * `useFieldsetDisabled` is NOT a component. It is a hook, and this page
 * documents its contract rather than inventing an anatomy it does not have.
 */
export const useFieldsetDisabled: ComponentDoc = {
  slug: "use-fieldset-disabled",
  name: "useFieldsetDisabled",
  oneLiner:
    "useFieldsetDisabled reports whether the enclosing fieldset is disabled, and false when there is none.",
  features:
    "This is a hook, not a component, and it answers one question: is the group I am in disabled? It returns `false` outside a fieldset so a control used standalone still works — the absence of a group is a valid state, not an error. kern controls call this and OR it with their own `disabled`/`editable` prop, so a control is disabled if it is disabled directly OR if any ancestor fieldset is. That is exactly the web's semantics, and it is the reason this is a hook rather than each control reading the context itself: one place states the rule, every control inherits it.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only. The web equivalent is the native `<fieldset disabled>`
    // semantics of the DOM itself, not a kern export — no counterpart to name.
    nativePeer: "none",
    variants: [],
    elevation: "none",
  },
  // Which exports this page documents. `parts` is ownership, not anatomy — so
  // the hook is listed here while `anatomy` stays absent below.
  parts: ["useFieldsetDisabled"],
  customization: {
    supported: [
      "OR its result with your control's own `disabled` prop — that is the intended call pattern and it matches the web's semantics.",
    ],
    notSupported: [
      "It renders nothing and has no visual form.",
      "There is no configuration and no options argument. It answers one question.",
    ],
  },
  api: [
    {
      name: "returns",
      type: "boolean",
      note: "`true` when an ancestor fieldset is disabled. Returns `false` outside a fieldset, so a standalone control keeps working.",
    },
    {
      name: "the OR rule",
      type: "—",
      note: "A control is disabled if it is disabled directly OR any ancestor fieldset is. kern controls OR this result with their own `disabled`/`editable` prop; do the same in your own and you match the web exactly.",
    },
  ],
  aria: [
    "Disabled state is what a screen reader announces, so getting this right is an accessibility requirement and not a convenience.",
    "The web's `<fieldset disabled>` disables every control inside it; this hook is how the native renderer reproduces that, since React Native has no fieldset element.",
    "Outside a fieldset it returns `false` rather than `null`, so a standalone control is never accidentally announced as disabled.",
  ],
};
