import { Tabs } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Tabs examples — one tab list, one panel visible at a time.
 *
 * The value wiring is the point: `Root` owns the selected value, `Tab`
 * selects it, `Panel` shows for it. The demo mirrors the registry demo's
 * proven props; the fence is what the reader copies.
 */
export const TABS_EXAMPLES: ExampleSpec[] = [
  {
    id: "tabs-sections",
    title: "Sections with one visible panel",
    description:
      "The root owns the value, tabs select it, panels show for it. Keyboard users move with arrows; the wiring is the same uncontrolled default everywhere.",
    render: () => (
      <div className="w-full max-w-md">
        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="api">API</Tabs.Tab>
            <Tabs.Tab value="changelog">Changelog</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">
            Every component ships with tokens and states.
          </Tabs.Panel>
          <Tabs.Panel value="api">
            Props are typed; variants are a discriminated union.
          </Tabs.Panel>
          <Tabs.Panel value="changelog">
            Semantic versioning, per-package changesets.
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    ),
    code: `<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="api">API</Tabs.Tab>
    <Tabs.Tab value="changelog">Changelog</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">
    Every component ships with tokens and states.
  </Tabs.Panel>
  <Tabs.Panel value="api">
    Props are typed; variants are a discriminated union.
  </Tabs.Panel>
  <Tabs.Panel value="changelog">
    Semantic versioning, per-package changesets.
  </Tabs.Panel>
</Tabs.Root>`,
  },
];
