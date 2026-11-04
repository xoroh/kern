import { List } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * List examples — the one list in ten layouts.
 *
 * One row model, ten `variant` presets: display rows, leading-media rows,
 * navigational links, labelled-checkbox selection, disclosure expansion
 * and sectioned groups. Selection and filtering travel with the rows
 * through controlled state, not through ten components.
 */
export const LIST_EXAMPLES: ExampleSpec[] = [
  {
    id: "list-variants",
    title: "One list, ten ways",
    description:
      "The variant picks the row affordance — display, media, navigation, selection, expansion or grouped sections — while the row data stays one shape.",
    render: () => (
      <div className="grid w-full gap-6 md:grid-cols-2">
        <List
          label="Two-line rows"
          variant="two-line"
          rows={[
            { id: "a", headline: "Inbox", supporting: "12 unread" },
            { id: "b", headline: "Sent", supporting: "Last 7 days" },
          ]}
        />
        <List
          label="Navigational rows"
          variant="navigational"
          rows={[
            { id: "a", headline: "Bookings", href: "#bookings" },
            { id: "b", headline: "Passengers", href: "#passengers" },
          ]}
        />
      </div>
    ),
    code: `<List
  label="Two-line rows"
  variant="two-line"
  rows={[
    { id: "a", headline: "Inbox", supporting: "12 unread" },
    { id: "b", headline: "Sent", supporting: "Last 7 days" },
  ]}
/>
<List
  label="Navigational rows"
  variant="navigational"
  rows={[
    { id: "a", headline: "Bookings", href: "#bookings" },
    { id: "b", headline: "Passengers", href: "#passengers" },
  ]}
/>`,
  },
  {
    id: "list-selectable-expandable",
    title: "Selection and disclosure",
    description:
      "Selectable rows are named checkboxes — one control per item, never a control hidden in a decorative slot. Expandable rows disclose a sibling panel with an announced trigger.",
    render: () => (
      <div className="grid w-full gap-6 md:grid-cols-2">
        <List
          label="Selectable rows"
          variant="selectable"
          defaultSelectedIds={["a"]}
          rows={[
            { id: "a", headline: "Airport pickup", supporting: "Today 14:00" },
            { id: "b", headline: "City tour", supporting: "Tomorrow 09:00" },
          ]}
        />
        <List
          label="Expandable rows"
          variant="expandable"
          rows={[
            {
              id: "a",
              headline: "Fare breakdown",
              supporting: "3 lines",
              panel: "Base 12.00 + distance 8.40 + night 2.00.",
            },
          ]}
        />
      </div>
    ),
    code: `<List
  label="Selectable rows"
  variant="selectable"
  defaultSelectedIds={["a"]}
  rows={[...]}
/>
<List
  label="Expandable rows"
  variant="expandable"
  rows={[{ id: "a", headline: "Fare breakdown", panel: "..." }]}
/>`,
  },
  {
    id: "list-grouped",
    title: "Sectioned groups",
    description:
      "Grouped rows carry their headers with them — sections are data, so the same rows render flat or sectioned without a second component.",
    render: () => (
      <div className="w-full max-w-sm">
        <List
          label="Grouped rows"
          variant="grouped"
          sections={[
            {
              id: "today",
              title: "Today",
              rows: [{ id: "a", headline: "Airport pickup" }],
            },
            {
              id: "older",
              title: "Older",
              rows: [{ id: "b", headline: "City tour" }],
            },
          ]}
        />
      </div>
    ),
    code: `<List
  label="Grouped rows"
  variant="grouped"
  sections={[{ id: "today", title: "Today", rows: [...] }]}
/>`,
  },
];
