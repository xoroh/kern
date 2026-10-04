import { Select } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Select configurator — the fifth Part-4 configurator (move #5), first past
 * the overlay flagships (Dialog, Sheet) into form controls. Knobs are the
 * real Root axes the component doc leaves open (`multiple`, `required`,
 * `disabled`, `defaultOpen` — none ruled out): `multiple` changes selection
 * behavior, the other three are states. No `variant`/`size`/`placeholder`/
 * `placement`/`elevation` axis exists (doc rules all five out), so none is a
 * knob. The stage shows the documented anatomy whole — trigger, value,
 * grouped items, separator — so the fence teaches it too.
 *
 * No `render`-prop trigger here, deliberately: unlike Dialog/Sheet, the
 * trigger carries no native button of its own in this anatomy — it renders
 * `Select.Value` (text), so there is no button-in-button to avoid. The
 * `defaultOpen` knob opens the popup at first paint (same painted-verify role
 * as Dialog's), and the stage remounts by key on every knob so it cannot
 * drift from the fence.
 */
function multipleOf(v: ConfigValues): boolean {
  return v.multiple === true;
}

function requiredOf(v: ConfigValues): boolean {
  return v.required === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function openOf(v: ConfigValues): boolean {
  return v.defaultOpen === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (multipleOf(v)) out.push("multiple");
  if (requiredOf(v)) out.push("required");
  if (disabledOf(v)) out.push("disabled");
  if (openOf(v)) out.push("defaultOpen");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

export const SELECT_CONFIGURATOR: ConfiguratorSpec = {
  id: "select-knobs",
  title: "Configure the select",
  description:
    "Single or multiple selection, required and disabled states, open at first paint or not. The trigger shows the current value; the popup groups options under labels. The knobs describe the next open (the stage remounts by key): interacting with the live select does not flip them back, so a changed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "multiple",
      label: "Multiple",
      default: false,
    },
    {
      kind: "boolean",
      name: "required",
      label: "Required",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
    {
      kind: "boolean",
      name: "defaultOpen",
      label: "Open (initial state)",
      default: false,
    },
  ],
  render: (v) => (
    // `multiple` flows as a runtime boolean because kern's `SelectRoot`
    // forwards Base UI's `Multiple` generic (an earlier wrapper dropped it,
    // making `<Select.Root multiple>` a type error for every consumer).
    <Select.Root
      key={`${multipleOf(v) ? "multi" : "single"}-${openOf(v) ? "open" : "shut"}`}
      multiple={multipleOf(v)}
      required={requiredOf(v)}
      disabled={disabledOf(v)}
      defaultOpen={openOf(v)}
    >
      <Select.Trigger aria-label="Region">
        <Select.Value placeholder="Choose a region" />
      </Select.Trigger>
      <Select.Content>
        <Select.GroupLabel>Europe</Select.GroupLabel>
        <Select.Item value="eu-west">
          <Select.ItemText>eu-west-1</Select.ItemText>
        </Select.Item>
        <Select.Item value="eu-central">
          <Select.ItemText>eu-central-1</Select.ItemText>
        </Select.Item>
        <Select.Separator />
        <Select.GroupLabel>Americas</Select.GroupLabel>
        <Select.Item value="us-east">
          <Select.ItemText>us-east-1</Select.ItemText>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  code: (v) =>
    `<Select.Root${rootPropsOf(v)}>\n  <Select.Trigger aria-label="Region">\n    <Select.Value placeholder="Choose a region" />\n  </Select.Trigger>\n  <Select.Content>\n    <Select.GroupLabel>Europe</Select.GroupLabel>\n    <Select.Item value="eu-west">\n      <Select.ItemText>eu-west-1</Select.ItemText>\n    </Select.Item>\n    <Select.Item value="eu-central">\n      <Select.ItemText>eu-central-1</Select.ItemText>\n    </Select.Item>\n    <Select.Separator />\n    <Select.GroupLabel>Americas</Select.GroupLabel>\n    <Select.Item value="us-east">\n      <Select.ItemText>us-east-1</Select.ItemText>\n    </Select.Item>\n  </Select.Content>\n</Select.Root>`,
};
