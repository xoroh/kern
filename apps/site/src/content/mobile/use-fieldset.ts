import type { ComponentDoc } from "../types";

/**
 * `useFieldset` is NOT a component. It is a hook, and this page documents its
 * contract rather than inventing an anatomy it does not have.
 */
export const useFieldset: ComponentDoc = {
  slug: "use-fieldset",
  name: "useFieldset",
  oneLiner:
    "useFieldset reads the enclosing fieldset's context, or null when there is none.",
  features:
    "This is a hook, not a component. It returns what the nearest `Fieldset` provides — its disabled state, its legend text and the setter a legend uses to name the group — or `null` when the call happens outside any fieldset. Reach for it when building a control that needs to know the group it sits in, rather than reaching for context directly. The `null` case is the useful part: it means a control used standalone still works, because the absence of a fieldset is a valid state and not an error.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only. The web equivalent is the native `<fieldset disabled>`
    // semantics of the DOM itself, not a kern export — there is no counterpart
    // to name.
    nativePeer: "none",
    variants: [],
    elevation: "none",
  },
  // Which exports this page documents. `parts` is ownership, not anatomy — so
  // the hook is listed here while `anatomy` stays absent below.
  parts: ["useFieldset"],
  customization: {
    supported: [
      "Call it inside a control to read the group's state and behave accordingly.",
    ],
    notSupported: [
      "It renders nothing and has no visual form.",
      "There is no configuration: it reads one context, and the context's shape is `Fieldset`'s.",
    ],
  },
  api: [
    {
      name: "returns",
      type: "FieldsetContextValue | null",
      note: "`{ disabled: boolean, legend?: string, setLegend: (text: string | undefined) => void }`, or `null` outside a fieldset. `setLegend` exists so a `FieldsetLegend` can name the group; it is not usually what a control wants.",
    },
    {
      name: "when there is no fieldset",
      type: "null",
      note: "Not an error. A control used standalone gets `null` and should keep working — which is why the sibling `useFieldsetDisabled` exists and returns `false` rather than `null`.",
    },
  ],
  aria: [
    "`legend` is the group's accessible name. If you are rendering a legend, this is where the text comes from.",
    "The `null` case is an accessibility-relevant fact: outside a group, there is no group name to announce, and pretending otherwise would invent one.",
    "Hooks produce no accessibility tree of their own — whatever is announced comes from the control that calls this.",
  ],
};
