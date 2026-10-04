import { Field } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Field configurator — the thirteenth Part-4 configurator (move #13), first
 * form-field wrapper (it names no control of its own — the control is
 * slotted in). Knobs are the state axes the component doc leaves open:
 * `invalid` (the error state — the edge composition, carried from the move-5
 * Group lesson), `disabled` (state), `message` (which helper part hangs
 * under the control: description or error). No `required`/`optional` marker,
 * no `size`, no `layout` — all ruled out, so none is a knob.
 *
 * The error part is wired with `match` to the root's invalid state, not
 * force-shown: with invalid off, the error knob selection renders but stays
 * hidden, and the fence shows exactly that. The description explains the
 * pairing so the hidden error reads as teaching, not breakage. The stage
 * remounts by key on every knob so it cannot drift from the fence.
 */
function invalidOf(v: ConfigValues): boolean {
  return v.invalid === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function messageOf(v: ConfigValues): "description" | "error" {
  return v.message === "error" ? "error" : "description";
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (invalidOf(v)) out.push("invalid");
  if (disabledOf(v)) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

function messageOfFence(v: ConfigValues): string {
  if (messageOf(v) === "error") {
    return `  <Field.Error match={${invalidOf(v) ? "true" : "false"}}>Enter a valid email.</Field.Error>`;
  }
  return "  <Field.Description>We only use this for sign-in.</Field.Description>";
}

export const FIELD_CONFIGURATOR: ConfiguratorSpec = {
  id: "field-knobs",
  title: "Configure the field",
  description:
    "Invalid and disabled states, description or error underneath. The error appears only when invalid is on — its match is wired to the root state, so selecting the error message with invalid off renders a hidden error, honestly shown in the fence. The knobs describe the next mount (the stage remounts by key): typing in the live control does not flip them back, so a typed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "invalid",
      label: "Invalid",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "select",
      name: "message",
      label: "Message",
      options: ["description", "error"],
      default: "description",
    },
  ],
  render: (v) => (
    <Field.Root
      key={`${invalidOf(v) ? "bad" : "ok"}-${disabledOf(v) ? "off" : "on"}-${messageOf(v)}`}
      invalid={invalidOf(v)}
      disabled={disabledOf(v)}
    >
      <Field.Label>Email address</Field.Label>
      <Field.Control placeholder="you@example.com" />
      {messageOf(v) === "error" ? (
        <Field.Error match={invalidOf(v)}>Enter a valid email.</Field.Error>
      ) : (
        <Field.Description>We only use this for sign-in.</Field.Description>
      )}
    </Field.Root>
  ),
  code: (v) =>
    `<Field.Root${rootPropsOf(v)}>\n  <Field.Label>Email address</Field.Label>\n  <Field.Control placeholder="you@example.com" />\n${messageOfFence(v)}\n</Field.Root>`,
};
