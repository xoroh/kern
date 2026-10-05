import { Tabs } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Tabs configurator — the twenty-second Part-4 configurator (move #24),
 * first tab strip (Base UI Tabs under kern's M3 treatment). Knobs are the
 * selection axes the component doc leaves open: `initial` (which tab is
 * selected at first paint — overview or api, in-range by construction),
 * `disableApi` (the per-tab `disabled` axis — the middle tab cannot be
 * activated while disabled). No `orientation` (the kern treatment is the
 * horizontal strip; the doc rules out a vertical form), no `variant`/`size`,
 * no Root-level `disabled` (Base UI TabsRoot has none — disabling is
 * per-tab) — all ruled out, so none is a knob. The stage shows the
 * documented anatomy whole — Root, List, three Tabs, three Panels — so the
 * fence teaches it too. The stage remounts by key on every knob so it
 * cannot drift from the fence.
 */
function initialOf(v: ConfigValues): string {
  return v.initial === "api" ? "api" : "overview";
}

function disableApiOf(v: ConfigValues): boolean {
  return v.disableApi === true;
}

function rootPropsOf(v: ConfigValues): string {
  return ` defaultValue="${initialOf(v)}"`;
}

function tabPropsOf(v: ConfigValues): string {
  return disableApiOf(v) ? ` value="api" disabled` : ` value="api"`;
}

const TABS: Array<[string, string, string]> = [
  ["overview", "Overview", "What this project covers."],
  ["api", "API", "Every endpoint on one page."],
  ["changelog", "Changelog", "What changed and when."],
];

function tabsOf(v: ConfigValues): string {
  return TABS.map(([value, label]) =>
    value === "api"
      ? `    <Tabs.Tab${tabPropsOf(v)}>${label}</Tabs.Tab>`
      : `    <Tabs.Tab value="${value}">${label}</Tabs.Tab>`,
  ).join("\n");
}

function panelsOf(): string {
  return TABS.map(
    ([value, , body]) => `  <Tabs.Panel value="${value}">${body}</Tabs.Panel>`,
  ).join("\n");
}

export const TABS_CONFIGURATOR: ConfiguratorSpec = {
  id: "tabs-knobs",
  title: "Configure the tabs",
  description:
    "Which tab is selected at first paint, and whether the middle tab is disabled. Selecting a tab shows its panel and hides the others — that is the behaviour, not a bug. A disabled tab cannot be activated by click or arrow keys. The knobs describe the next mount (the stage remounts by key): switching the live tabs does not flip them back, so a switched stage with untouched knobs is by design.",
  controls: [
    {
      kind: "select",
      name: "initial",
      label: "Selected at first paint",
      options: ["overview", "api"],
      default: "overview",
    },
    {
      kind: "boolean",
      name: "disableApi",
      label: "Disable API tab",
      default: false,
    },
  ],
  render: (v) => (
    <Tabs.Root
      key={`${initialOf(v)}-${disableApiOf(v) ? "api-off" : "api-on"}`}
      defaultValue={initialOf(v)}
    >
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="api" disabled={disableApiOf(v) || undefined}>
          API
        </Tabs.Tab>
        <Tabs.Tab value="changelog">Changelog</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">What this project covers.</Tabs.Panel>
      <Tabs.Panel value="api">Every endpoint on one page.</Tabs.Panel>
      <Tabs.Panel value="changelog">What changed and when.</Tabs.Panel>
    </Tabs.Root>
  ),
  code: (v) =>
    `<Tabs.Root${rootPropsOf(v)}>\n  <Tabs.List aria-label="Project">\n${tabsOf(v)}\n  </Tabs.List>\n${panelsOf()}\n</Tabs.Root>`,
};
