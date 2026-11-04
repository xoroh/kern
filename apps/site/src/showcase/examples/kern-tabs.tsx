import { KernTabs } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernTabs examples — the ONE tabs component: primary bars, secondary
 * sub-sections, and the vertical-pills settings pattern on one contract.
 */
export const KERN_TABS_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-tabs-primary",
    title: "Primary bar with panels",
    description:
      "Primary tabs sit under the app bar for main destinations: 3px primary indicator, primary active text, roving tabindex with arrow/Home/End keys. Only the active panel mounts.",
    render: () => (
      <div className="w-full max-w-xl">
        <KernTabs
          label="Bookings"
          defaultValue="upcoming"
          items={[
            {
              value: "upcoming",
              label: "Upcoming",
              content: "Upcoming rides.",
            },
            { value: "live", label: "Live", content: "Rides in progress." },
            { value: "done", label: "Completed", content: "Past rides." },
          ]}
        />
      </div>
    ),
    code: `<KernTabs
  label="Bookings"
  defaultValue="upcoming"
  items={[
    { value: "upcoming", label: "Upcoming", content: "Upcoming rides." },
    { value: "live", label: "Live", content: "Rides in progress." },
    { value: "done", label: "Completed", content: "Past rides." },
  ]}
/>`,
  },
  {
    id: "kern-tabs-secondary-vertical",
    title: "Secondary and vertical pills",
    description:
      "Secondary tabs switch sub-sections inside content (2px indicator, on-surface active text). Vertical orientation fills the active tab as a pill — the settings pattern. Never mix levels in one bar.",
    render: () => (
      <div className="flex w-full max-w-xl flex-col gap-8">
        <KernTabs
          variant="secondary"
          label="Trip details"
          defaultValue="route"
          items={[
            { value: "route", label: "Route", content: "Route sub-section." },
            { value: "fare", label: "Fare", content: "Fare sub-section." },
          ]}
        />
        <KernTabs
          variant="secondary"
          orientation="vertical"
          label="Settings"
          defaultValue="profile"
          items={[
            { value: "profile", label: "Profile", content: "Profile section." },
            {
              value: "security",
              label: "Security",
              content: "Security section.",
            },
          ]}
        />
      </div>
    ),
    code: `<KernTabs
  variant="secondary"
  label="Trip details"
  defaultValue="route"
  items={[
    { value: "route", label: "Route", content: "Route sub-section." },
    { value: "fare", label: "Fare", content: "Fare sub-section." },
  ]}
/>
<KernTabs
  variant="secondary"
  orientation="vertical"
  label="Settings"
  defaultValue="profile"
  items={[
    { value: "profile", label: "Profile", content: "Profile section." },
    { value: "security", label: "Security", content: "Security section." },
  ]}
/>`,
  },
];
