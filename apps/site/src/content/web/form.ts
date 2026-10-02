import type { ComponentDoc } from "../types";

export const form: ComponentDoc = {
  slug: "form",
  name: "Form",
  oneLiner: "Forms collect several values and hand them over together.",
  features:
    "Reach for a form when the answer is several fields submitted as one: a sign-up, a record's details, a filter set. It is a real `<form>`, so Enter submits it and the browser's own validation and autofill work without help. Group related fields and ask one question per field — a field asking two things gets one answer and loses the other. When the fields are a single question's options rather than separate answers, put them in a fieldset with a legend so the grouping is announced as well as seen.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Form`. React Native has no form element; submission is
    // an explicit control and the fields are wired by the screen.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["Form"],
  customization: {
    supported: [
      "`className` is passed through and merged after the form's own classes.",
      "It forwards the form element's props, so `onSubmit` and friends are the browser's.",
      "Layout is entirely the caller's — the component supplies the semantics and a baseline, not a field grid.",
    ],
    notSupported: [
      "There is no `fields` or `schema` prop. A form is composed from fields the caller renders; a data-driven form builder is a different thing.",
      "There is no `submitLabel` or `submitting` prop. The submit control is the caller's, which is also where its label and its busy state live.",
      "There is no `validation` prop. Constraint validation is the browser's and the fields' — this is the container.",
    ],
  },
  api: [
    {
      name: "onSubmit",
      type: "(event: FormEvent<HTMLFormElement>) => void",
      note: "Fires when the form is submitted. `preventDefault` in your handler if the values should not go to a server in the usual way.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the form's own classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLFormElement>",
      note: "Forwarded to the underlying `<form>`.",
    },
  ],
  aria: [
    "A real `<form>` element, so Enter submits it and the browser's autofill and validation behave as expected.",
    "Give the form an accessible name when a page has more than one, so they are distinguishable in the landmark list.",
    "Each field still needs its own label; the form supplies the container and the submission, not the names.",
  ],
};
