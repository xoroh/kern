import { Button, Field, Form } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Form examples — several values handed over together.
 *
 * The form is the CONTAINER: it supplies the semantics and the validation
 * wiring, and the fields inside it are what the reader fills in. There is no
 * `fields` prop — a form is composed from fields the caller renders.
 */
export const FORM_EXAMPLES: ExampleSpec[] = [
  {
    id: "form-fields",
    title: "A form is the fields you render",
    description:
      "The container forwards the form element's own props, so `onSubmit` is the browser's. An invalid field blocks the submit and the focus moves to the first field that needs fixing.",
    render: () => (
      <Form className="flex w-full max-w-sm flex-col gap-3">
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Field.Control placeholder="Ada Lovelace" required />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Field.Control placeholder="you@example.com" type="email" required />
        </Field.Root>
        <Button type="submit">Save</Button>
      </Form>
    ),
    code: `<Form className="flex w-full max-w-sm flex-col gap-3">
  <Field.Root>
    <Field.Label>Full name</Field.Label>
    <Field.Control placeholder="Ada Lovelace" required />
  </Field.Root>
  <Field.Root>
    <Field.Label>Email address</Field.Label>
    <Field.Control placeholder="you@example.com" type="email" required />
  </Field.Root>
  <Button type="submit">Save</Button>
</Form>`,
  },
];
