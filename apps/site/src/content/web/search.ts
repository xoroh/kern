import type { ComponentDoc } from "../types";

export const search: ComponentDoc = {
  slug: "search",
  name: "Search",
  oneLiner:
    "Search is a labelled field with submit and clear, for finding things by text.",
  features:
    "Reach for search when someone is looking for something among many and knows a word for it: a list of records, a documentation site, a settings page. It is a whole form rather than a bare input, so submitting works with the keyboard's Enter as well as the button, and it carries a search landmark so it is findable by assistive tech. Put it above what it filters and keep the results where the list already was, so the thing being searched never moves away from the field doing the searching.",
  meta: {
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
  ],
  usage: {
    do: [
      "`label` names the landmark, `placeholder` hints the empty field — keep them different jobs, not two copies.",
      "Run the query in `onSearch`, mirror keystrokes in `onValueChange` — submit and change are separate moments.",
      "Use the trailing slot for the one control that belongs with search (avatar, overflow) — the clear action renders beside it.",
    ],
    dont: [
      "Don't pass `onSubmit` or `onChange` — the type omits them on purpose; `onSearch` and `onValueChange` are the handlers.",
      "Don't render results inside the bar — search finds, what it finds is the page's business.",
    ],
  },
  tokens: [
    {
      element: "Bar",
      state: "resting",
      token: "comp.search.bar",
      value: "surface-container-high, full pill, h-14",
    },
    {
      element: "Clear control",
      state: "hover",
      token: "sys.state.hover-state-layer-opacity",
      value: "8% on-surface-variant wash over the 40px clear button",
    },
  ],
  faq: [
    {
      q: "Why is there no `onSubmit`?",
      a: "The type strips it deliberately — the form submits internally and reports through `onSearch`. Passing `onSubmit` will not typecheck, which is the point.",
    },
    {
      q: "Search or text field with a button?",
      a: "A landmark with submit-and-clear semantics means search. Free entry with validation means a text field.",
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
  ],
  aria: [
    'The component renders a `<form>` with `role="search"` and `aria-label`, which is the recommended pattern for a search landmark — a bare input with a magnifier icon is not.',
    "Because it is a form, submitting with Enter works without extra wiring.",
    "`label` names the landmark and is announced; `placeholder` is visual and should not be the only description of the field.",
  ],
};
