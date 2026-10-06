import { Field, Form } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Form configurator — the thirty-first Part-4 configurator (move #34),
 * first validation-timing surface. One genuine knob: `validation`
 * (when the form flags a bad field — on submit, on blur, or on change;
 * the only behavioural axis the Root type leaves open). Everything else
 * is composition or app wiring by design: no `fields`/`schema` (a form is
 * composed from caller-rendered fields), no `submitLabel`/`submitting`
 * (the submit control is the caller's), no `validation` object
 * (constraint validation is the browser's and the fields'), and
 * `errors`/`onFormSubmit`/`actionsRef` are state, callbacks, or
 * imperative handles — not knobs. The stage shows the documented anatomy
 * whole — required name field plus Save — so the fence teaches it too.
 * The stage remounts by key on the knob so it cannot drift from the
 * fence.
 */
function modeOf(v: ConfigValues): "onSubmit" | "onBlur" | "onChange" {
  if (v.validation === "onBlur" || v.validation === "onChange")
    return v.validation;
  return "onSubmit";
}

function rootPropsOf(v: ConfigValues): string {
  const mode = modeOf(v);
  return mode === "onSubmit" ? "" : ` validationMode="${mode}"`;
}

export const FORM_CONFIGURATOR: ConfiguratorSpec = {
  id: "form-knobs",
  title: "Configure the form",
  description:
    "When a bad field gets flagged. On submit waits for Save; on blur flags the field the moment it is left empty; on change flags while typing. The knob describes the next mount (the stage remounts by key): submitting or blurring the live form does not flip it back, so a flagged stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "validation",
      label: "Validation timing",
      options: ["onSubmit", "onBlur", "onChange"],
      default: "onSubmit",
    },
  ],
  render: (v) => (
    <Form
      key={modeOf(v)}
      className="flex w-full max-w-sm flex-col gap-3"
      validationMode={modeOf(v)}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field.Root>
        <Field.Label>Full name</Field.Label>
        <Field.Control placeholder="Ada Lovelace" required />
        <Field.Error match="valueMissing">Please enter your name</Field.Error>
      </Field.Root>
      <button type="submit">Save</button>
    </Form>
  ),
  code: (v) =>
    `<Form${rootPropsOf(v)}>\n  <Field.Root>\n    <Field.Label>Full name</Field.Label>\n    <Field.Control placeholder="Ada Lovelace" required />\n    <Field.Error match="valueMissing">Please enter your name</Field.Error>\n  </Field.Root>\n  <button type="submit">Save</button>\n</Form>\n\n// No fields/schema/submitLabel/validation props: composition is the caller's.\n// errors/onFormSubmit/actionsRef are state, callbacks, handles — not knobs.`,
};
