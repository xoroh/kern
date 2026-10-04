import { Accordion } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Accordion configurator — the eleventh Part-4 configurator (move #11),
 * first disclosure control. Knobs are the behaviour axes the component doc
 * leaves open: `multiple` (one open panel vs many — the edge composition,
 * carried from the move-5 Group lesson), `openFirst` (which panel, if any,
 * is open at first paint), `disabled` (state). No `variant`/`size`, no
 * `animate`, no `headingLevel` — all ruled out, so none is a knob. No
 * `orientation` knob either: the kern treatment is horizontal-stacked panels
 * and the doc never claims a vertical form, so orientation is not offered
 * here (same caution as Tabs/Slider).
 *
 * The stage shows the documented anatomy whole — item, header, trigger,
 * panel — so the fence teaches it too. The stage remounts by key on every
 * knob so it cannot drift from the fence.
 */
function multipleOf(v: ConfigValues): boolean {
  return v.multiple === true;
}

function openFirstOf(v: ConfigValues): boolean {
  return v.openFirst === true;
}

function disabledOf(v: ConfigValues): boolean {
  return v.disabled === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out: string[] = [];
  if (multipleOf(v)) out.push("multiple");
  if (openFirstOf(v)) out.push('defaultValue={["kern"]}');
  if (disabledOf(v)) out.push("disabled");
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

const ITEMS: Array<[string, string, string]> = [
  ["kern", "What is Kern?", "An open-source design system."],
  ["platforms", "Which platforms?", "Web and React Native."],
];

function itemsOf(): string {
  return ITEMS.map(
    ([value, question, answer]) =>
      `  <Accordion.Item value="${value}">\n    <Accordion.Header>\n      <Accordion.Trigger>${question}</Accordion.Trigger>\n    </Accordion.Header>\n    <Accordion.Panel>${answer}</Accordion.Panel>\n  </Accordion.Item>`,
  ).join("\n");
}

export const ACCORDION_CONFIGURATOR: ConfiguratorSpec = {
  id: "accordion-knobs",
  title: "Configure the accordion",
  description:
    "One open panel or many, first panel open at first paint or not, disabled state. Opening a second panel closes the first unless multiple is on — that is the behaviour, not a bug. The knobs describe the next mount (the stage remounts by key): expanding the live accordion does not flip them back, so an expanded stage with untouched knobs is by design.",
  controls: [
    {
      kind: "boolean",
      name: "multiple",
      label: "Multiple open",
      default: false,
    },
    {
      kind: "boolean",
      name: "openFirst",
      label: "First open (initial state)",
      default: false,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      default: false,
    },
  ],
  render: (v) => (
    <Accordion.Root
      key={`${multipleOf(v) ? "multi" : "single"}-${openFirstOf(v) ? "open" : "shut"}-${disabledOf(v) ? "off" : "on"}`}
      multiple={multipleOf(v)}
      defaultValue={openFirstOf(v) ? ["kern"] : undefined}
      disabled={disabledOf(v)}
    >
      {ITEMS.map(([value, question, answer]) => (
        <Accordion.Item key={value} value={value}>
          <Accordion.Header>
            <Accordion.Trigger>{question}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  code: (v) =>
    `<Accordion.Root${rootPropsOf(v)}>\n${itemsOf()}\n</Accordion.Root>`,
};
