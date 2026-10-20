import type { ComponentDoc } from "../types";

export const search: ComponentDoc = {
  slug: "search",
  name: "Search",
  oneLiner:
    "Search is a labelled field with submit and clear, for finding things by text.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/search",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Search",
    // No variant axis. One treatment.
    variants: [],
    elevation: "surface",
  },
  parts: ["Search"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Enter",
      action:
        "Submits the form — `onSearch` fires with the query. No extra wiring: it is a real form.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through leading slot, field, clear control, and trailing slot in order.",
    },
    {
      key: "Enter / Space on the clear control",
      action:
        "Empties the query. The clear control is a real button, and it is on the page only while there is something to clear.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through to the form, merged after its own classes.",
      "`label` sets the accessible name of the search landmark; the placeholder is separate and defaults to the same wording.",
      "It is controlled or uncontrolled through `value`/`defaultValue`, the same as a plain input.",
    ],
    notSupported: [
      "`onSubmit` and `onChange` are STRIPPED from the form props this component otherwise passes through — the type omits them. Use `onSearch` and `onValueChange` instead. Passing the usual form handlers will not typecheck, which is the point, but it is the first thing to trip over.",
      "There is no `results` or `suggestions` prop. Search finds; what it finds is the page's business.",
      "There is no `size` or `variant` prop.",
    ],
  },
  api: [
    {
      name: "onSearch",
      type: "(value: string) => void",
      note: "Called with the query when the form is submitted. This is the submit handler — `onSubmit` is deliberately not part of this component's props.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires as the text changes. This is the change handler — `onChange` is deliberately not part of this component's props.",
    },
    {
      name: "value",
      type: "string",
      note: "Controlled query. Omit and the component keeps its own state from `defaultValue`.",
    },
    {
      name: "defaultValue",
      type: "string",
      default: '""',
      note: "Initial query when uncontrolled.",
    },
    {
      name: "label",
      type: "string",
      default: '"Search"',
      note: "The accessible name of the search landmark, not the visible caption. Distinguishable from `placeholder` so the two can read differently.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Search"',
      note: "The hint in the empty field. Separate from `label` — one is announced, the other is seen.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the form's own classes.",
    },
    {
      name: "leading",
      type: "ReactNode",
      note: "Leading slot (M3: search icon, avatar, or menu control). Defaults to the search icon.",
    },
    {
      name: "trailing",
      type: "ReactNode",
      note: "Trailing slot (M3: avatar or overflow control). The clear action renders beside it, never inside it.",
    },
  ],
  aria: [
    'The component renders a `<form>` with `role="search"` and `aria-label`, which is the recommended pattern for a search landmark — a bare input with a magnifier icon is not.',
    "Because it is a form, submitting with Enter works without extra wiring.",
    "`label` names the landmark and is announced; `placeholder` is visual and should not be the only description of the field.",
  ],
};
