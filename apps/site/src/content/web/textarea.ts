import type { ComponentDoc } from "../types";

export const textarea: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  oneLiner:
    "Textareas take several lines of text from someone and hand it to you.",
  features:
    "Reach for a textarea when the answer is prose and its length is the point: a message, a description, a bug report. It matches the input's border and type so a form mixing both keeps one rhythm, and it starts tall enough to signal that more than a line is expected. Wrap it in a Field so its label, help text and error are wired to it — the same as an input. If the answer is one line, that is an input; if it is a choice, that is not text at all.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Textarea",
    // No variant axis. Tone comes from the field state (error, disabled,
    // focused) rather than from a variant.
    variants: [],
    elevation: "surface",
  },
  parts: ["Textarea"],
  customization: {
    supported: [
      "`className` is passed through and merged after the textarea's own classes.",
      "`error` turns the border to the error role and sets `aria-invalid`.",
      "Height, radius and border come from system tokens, matching the input.",
    ],
    notSupported: [
      "There is no `errorMessage` prop — this is the asymmetry with `Input`, and it is easy to assume otherwise. `Input` accepts `errorMessage` and wires the message itself; `Textarea` takes only a boolean `error`, so the message is yours to render and associate.",
      "There is no `autoResize` or `rows` prop. Height is `className`'s job.",
      "There is no `maxLength` prop. That is a plain textarea attribute you pass through, not a component feature.",
    ],
  },
  api: [
    {
      name: "error",
      type: "boolean",
      default: "false",
      note: "Marks the control invalid and turns the border to the error role. State only — unlike `Input`, there is no `errorMessage` here, so anything the person should read is yours to render and wire.",
    },
    {
      name: "aria-describedby",
      type: "string",
      note: "Passed through unchanged. Nothing is appended for you, so an error message you render must be linked by hand.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the textarea's own classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLTextAreaElement>",
      note: "Forwarded to the underlying `<textarea>`.",
    },
  ],
  aria: [
    "The control is a real `<textarea>`, so multi-line editing, selection and screen-reader text handling all behave as expected.",
    "It takes the name of the `FieldLabel` it sits inside.",
    "`error` sets `aria-invalid`, but with no `errorMessage` prop nothing is announced about WHY it is invalid — pair it with a message you associate yourself.",
  ],
};
