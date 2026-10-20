import type { ComponentDoc } from "../types";

export const textarea: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  oneLiner:
    "Textareas take several lines of text from someone and hand it to you.",
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Enter",
      action:
        "Inserts a line break in the field. It does not submit the form — submitting is the form's business, and a multi-line field that submitted on Enter would be a trap.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the field. Disabled fields are skipped.",
    },
  ],
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
    {
      name: "defaultValue",
      type: "string | number | readonly string[] | undefined",
      note: "Initial value when uncontrolled. The field edits text; `value` makes it controlled.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state: FieldControlState) => CSSProperties | undefined) | undefined",
      note: "Style for the control, or a function of its state (focused, filled, disabled, invalid) returning style.",
    },
    {
      name: "onValueChange",
      type: '((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element | undefined; }) => void) | undefined',
      note: "Fires when the text changes. The controlled-`value` counterpart for observing; the `reason` form carries cancellation for composed controls.",
    },
    {
      name: "variant",
      type: '"filled" | "outlined" | undefined',
      note: "M3 treatment: `outlined` (default) draws the outline; `filled` fills `surface-container-highest` with a bottom active indicator. Functionally identical — pick by surface.",
    },
    {
      name: "rows",
      type: "number | undefined",
      note: "Initial visible row count. Defaults to 2 per M3.",
    },
  ],
  aria: [
    "The control is a real `<textarea>`, so multi-line editing, selection and screen-reader text handling all behave as expected.",
    "It takes the name of the `FieldLabel` it sits inside.",
    "`error` sets `aria-invalid`, but with no `errorMessage` prop nothing is announced about WHY it is invalid — pair it with a message you associate yourself.",
  ],
};
