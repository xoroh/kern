import { Checkbox, Input, Label } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Input examples — the form-controls cluster.
 *
 * The point of these is the WIRING, which is the part the type does not show:
 * a field-wrapped input gets its accessible name from context, and the error is
 * announced rather than only coloured.
 */
export const INPUT_EXAMPLES: ExampleSpec[] = [
  {
    id: "field-wiring",
    title: "A named field, with no name passed to the input",
    description:
      "The label and the error travel by context. The input picks them up, so its accessible name is correct without a single prop being threaded through.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-1.5">
        <Label htmlFor="email-example">Email</Label>
        <Input id="email-example" placeholder="you@example.com" />
      </div>
    ),
    code: `<Label htmlFor="email-example">Email</Label>
<Input id="email-example" placeholder="you@example.com" />`,
  },
  {
    id: "error-state",
    title: "An error that is announced, not just coloured",
    description:
      "The border turns to the error colour, and the message is what a screen reader hears. An error that only changes a border is one only sighted people learn about.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-1.5">
        <Label htmlFor="email-error-example">Email</Label>
        <Input
          id="email-error-example"
          defaultValue="not-an-email"
          aria-invalid="true"
          aria-describedby="email-error-message"
        />
        <p
          id="email-error-message"
          className="m-0 text-xs text-(--md-sys-color-error)"
        >
          Enter an email address.
        </p>
      </div>
    ),
    code: `<Input
  id="email-error-example"
  defaultValue="not-an-email"
  aria-invalid="true"
  aria-describedby="email-error-message"
/>
<p id="email-error-message" className="text-xs text-(--md-sys-color-error)">
  Enter an email.
</p>`,
  },
];

/**
 * Checkbox examples — kept separate from the input examples so each page shows
 * only what is about it. A shared array would put an email field on the
 * checkbox page.
 */
export const CHECKBOX_EXAMPLES: ExampleSpec[] = [
  {
    id: "checkbox-choice",
    title: "A checkbox is independent; the label is optional but risky",
    description:
      "`label` is optional on `Checkbox`, which makes an unnamed control easy to ship. Set it, or pair it with visible text as here.",
    render: () => (
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox-choice" defaultChecked />
        <Label htmlFor="checkbox-choice">Email me about new releases</Label>
      </div>
    ),
    code: `<Checkbox id="checkbox-choice" defaultChecked />
<Label htmlFor="checkbox-choice">Email me about new releases</Label>`,
  },
];
