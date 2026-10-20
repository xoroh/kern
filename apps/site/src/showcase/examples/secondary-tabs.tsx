import { SecondaryTabs } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Secondary tabs examples — the sub-section switcher.
 *
 * One data array is the whole component: each tab carries its own panel as
 * `content`, so the active panel is mounted and the inactive ones are not —
 * a hidden panel is still announced by a screen reader.
 */
export const SECONDARY_TABS_EXAMPLES: ExampleSpec[] = [
  {
    id: "secondary-tabs-sections",
    title: "Sections under a primary view",
    description:
      "Each tab carries its own panel as `content`, so the set is one array rather than a tab strip wired to a panel by hand. The arrows move and select, and disabled tabs are skipped.",
    render: () => (
      <SecondaryTabs
        defaultValue="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: "Overview panel.",
          },
          { value: "usage", label: "Usage", content: "Usage panel." },
        ]}
      />
    ),
    code: `<SecondaryTabs
  defaultValue="overview"
  tabs={[
    { value: "overview", label: "Overview", content: "Overview panel." },
    { value: "usage", label: "Usage", content: "Usage panel." },
  ]}
/>`,
  },
];
