import { KernNavigation } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernNavigation examples — ONE navigation on one destination contract:
 * drawer-modal, rail, bar, sidebar-pane. One list feeds bar and rail;
 * sectioned variants keep the headings; `flattenSections` feeds the
 * single-list surfaces.
 */
const SECTIONS = [
  {
    key: "main",
    destinations: [
      { key: "/home", label: "Home" },
      { key: "/dispatch", label: "Dispatch" },
      { key: "/inbox", label: "Inbox" },
    ],
  },
];

export const KERN_NAVIGATION_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-navigation-bar",
    title: "Compact bar",
    description:
      'Bottom bar for compact screens: 3–5 destinations, one active, `aria-current="page"` on the active destination. FABs dock above the bar, never inside.',
    render: () => (
      <div className="w-full max-w-xl">
        <KernNavigation
          variant="bar"
          label="Primary"
          sections={SECTIONS}
          defaultValue="/dispatch"
        />
      </div>
    ),
    code: `<KernNavigation
  variant="bar"
  label="Primary"
  sections={[
    {
      key: "main",
      destinations: [
        { key: "/home", label: "Home" },
        { key: "/dispatch", label: "Dispatch" },
        { key: "/inbox", label: "Inbox" },
      ],
    },
  ]}
  defaultValue="/dispatch"
/>`,
  },
  {
    id: "kern-navigation-sidebar-pane",
    title: "Sidebar with sections",
    description:
      "Persistent desk sidebar with section headings plus header (switcher) and footer (user) slots. The drill pane rides `detail` on wide screens.",
    render: () => (
      <div className="w-full max-w-xl">
        <KernNavigation
          variant="sidebar-pane"
          label="Primary"
          sections={[
            {
              key: "ops",
              title: "Operations",
              destinations: [
                { key: "/dispatch", label: "Dispatch" },
                { key: "/inbox", label: "Inbox" },
              ],
            },
          ]}
          defaultValue="/dispatch"
          header="Acme Taxi"
          footer="Ada Lovelace"
        />
      </div>
    ),
    code: `<KernNavigation
  variant="sidebar-pane"
  label="Primary"
  sections={[
    {
      key: "ops",
      title: "Operations",
      destinations: [
        { key: "/dispatch", label: "Dispatch" },
        { key: "/inbox", label: "Inbox" },
      ],
    },
  ]}
  defaultValue="/dispatch"
  header="Acme Taxi"
  footer="Ada Lovelace"
/>`,
  },
];
