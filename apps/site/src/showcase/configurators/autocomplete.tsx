import { Autocomplete } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Autocomplete configurator — the sixteenth Part-4 configurator (move #16),
 * first free-text completion. Knobs are the completion axes the component
 * doc leaves open: `mode` (how completions present — list, both, inline, or
 * none; a genuine four-way axis the doc never rules out), `autoHighlight`
 * (first match highlighted while filtering), `inline` (inline completion
 * row). No `filter` (the primitive's matching is the only strategy — a
 * custom one is Command), no `multiple` (one value in the field; multi is
 * not this component), no `freeSolo` toggle (completing rather than
 * restricting is what this component IS) — all ruled out, so none is a
 * knob. The stage shows the documented anatomy whole — label, input,
 * filtered list, empty state — so the fence teaches it too. The stage
 * remounts by key on every knob so it cannot drift from the fence.
 *
 * With mode "none" the list still renders but nothing filters: typing
 * leaves every option in place and the input announces
 * aria-autocomplete="none". That degenerate pairing is honest, not broken —
 * the fence and the stage agree, and the edge test pins the unfiltered
 * list.
 */
function modeOf(v: ConfigValues): "list" | "both" | "inline" | "none" {
  return v.mode === "both" || v.mode === "inline" || v.mode === "none"
    ? v.mode
    : "list";
}

function autoHighlightOf(v: ConfigValues): boolean {
  return v.autoHighlight === true;
}

function inlineOf(v: ConfigValues): boolean {
  return v.inline === true;
}

function rootPropsOf(v: ConfigValues): string {
  const out = [`mode="${modeOf(v)}"`];
  if (autoHighlightOf(v)) out.push("autoHighlight");
  if (inlineOf(v)) out.push("inline");
  return ` ${out.join(" ")}`;
}

const ITEMS: Array<[string, string]> = [
  ["kern", "kern"],
  ["kern-native", "kern-native"],
  ["kern-cli", "kern-cli"],
];

export const AUTOCOMPLETE_CONFIGURATOR: ConfiguratorSpec = {
  id: "autocomplete-knobs",
  title: "Configure the autocomplete",
  description:
    "How completions present, first-match highlight, inline row. Free text stays free: the field accepts a value no suggestion matched — that is the point of an autocomplete, and the restricted version is Combobox. The knobs describe the next mount (the stage remounts by key): typing in the live field does not flip them back, so a typed stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "mode",
      label: "Mode",
      options: ["list", "both", "inline", "none"],
      default: "list",
    },
    {
      kind: "boolean",
      name: "autoHighlight",
      label: "Auto-highlight first match",
      default: false,
    },
    {
      kind: "boolean",
      name: "inline",
      label: "Inline completion",
      default: false,
    },
  ],
  render: (v) => (
    <Autocomplete.Root
      key={`${modeOf(v)}-${autoHighlightOf(v) ? "hl" : "nohl"}-${inlineOf(v) ? "inl" : "noinl"}`}
      items={ITEMS.map(([value, label]) => ({ value, label }))}
      mode={modeOf(v)}
      autoHighlight={autoHighlightOf(v)}
      inline={inlineOf(v)}
    >
      <Autocomplete.Label>Project</Autocomplete.Label>
      <Autocomplete.Input placeholder="Search projects" />
      <Autocomplete.Content>
        <Autocomplete.Empty>No project matches.</Autocomplete.Empty>
        {ITEMS.map(([value, label]) => (
          <Autocomplete.Item key={value} value={value}>
            {label}
          </Autocomplete.Item>
        ))}
      </Autocomplete.Content>
    </Autocomplete.Root>
  ),
  code: (v) =>
    `<Autocomplete.Root${rootPropsOf(v)} items={ITEMS}>\n  <Autocomplete.Label>Project</Autocomplete.Label>\n  <Autocomplete.Input placeholder="Search projects" />\n  <Autocomplete.Content>\n    <Autocomplete.Empty>No project matches.</Autocomplete.Empty>\n${ITEMS.map(([value, label]) => `    <Autocomplete.Item value="${value}">${label}</Autocomplete.Item>`).join("\n")}\n  </Autocomplete.Content>\n</Autocomplete.Root>`,
};
