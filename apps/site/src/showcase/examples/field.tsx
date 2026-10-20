import { Field } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Field examples — a control with its label, its help text and its error.
 *
 * The field is the WIRING: the label names the control, the description is
 * announced with it, and the error is announced when it appears. The control
 * itself is `Field.Control` — an `Input` in the field's own shape.
 */
export const FIELD_EXAMPLES: ExampleSpec[] = [
  {
    id: "field-group-wiring",
    title: "Label, control, help text and error",
    description:
      "One field, wired. The description is read with the control, and the error takes the same slot when the field is invalid — `match` is what keeps it on screen while the value is wrong.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Field.Control placeholder="you@example.com" />
          <Field.Description>We only use this for sign-in.</Field.Description>
        </Field.Root>
        <Field.Root>
          <Field.Label>Workspace name</Field.Label>
          <Field.Control defaultValue="Kern" />
          <Field.Error match>That name is already taken.</Field.Error>
        </Field.Root>
      </div>
    ),
    code: `<Field.Root>
  <Field.Label>Email address</Field.Label>
  <Field.Control placeholder="you@example.com" />
  <Field.Description>We only use this for sign-in.</Field.Description>
</Field.Root>
<Field.Root>
  <Field.Label>Workspace name</Field.Label>
  <Field.Control defaultValue="Kern" />
  <Field.Error match>That name is already taken.</Field.Error>
</Field.Root>`,
  },
];
