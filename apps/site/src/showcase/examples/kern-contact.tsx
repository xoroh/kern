import {
  ContactCard,
  ContactDirectory,
  ContactGroupList,
  ContactRow,
  StatusPill,
} from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Contact examples — the trio plus the directory block. One adapter
 * (user / driver / group → row), one tone contract for every disc, the
 * directory composing search + grouped rows + empty state.
 */
export const CONTACT_ROW_EXAMPLES: ExampleSpec[] = [
  {
    id: "contact-row",
    title: "Identity row",
    description:
      "Photo or initials disc in the deterministic registry tone, name plus detail line; a row with `onSelect` is one real button.",
    render: () => (
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-px overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container)">
          <ContactRow
            contact={{
              id: "ada",
              name: "Ada Lovelace",
              detail: "Driver · online",
            }}
          />
          <ContactRow
            contact={{
              id: "grace",
              name: "Grace Hopper",
              detail: "Dispatcher",
            }}
          />
        </div>
      </div>
    ),
    code: `<ContactRow contact={{ id: "ada", name: "Ada Lovelace", detail: "Driver" }} />`,
  },
];
export const CONTACT_CARD_EXAMPLES: ExampleSpec[] = [
  {
    id: "contact-card",
    title: "Identity card",
    description:
      "The row's contract as a card — disc, name, detail, host status slot.",
    render: () => (
      <div className="w-full max-w-xl">
        <ContactCard
          contact={{
            id: "ada",
            name: "Ada Lovelace",
            detail: "Driver · AAA-123",
          }}
          status={<StatusPill tone="success">Online</StatusPill>}
        />
      </div>
    ),
    code: `<ContactCard
  contact={{ id: "ada", name: "Ada Lovelace" }}
  status={<StatusPill tone="success">Online</StatusPill>}
/>`,
  },
];
export const CONTACT_DIRECTORY_EXAMPLES: ExampleSpec[] = [
  {
    id: "contact-directory",
    title: "Directory with search",
    description:
      "Type to filter across names and details; groups follow the contact `group` field and the empty state recovers with clear text.",
    render: () => (
      <div className="w-full max-w-xl">
        <ContactDirectory
          contacts={[
            {
              id: "ada",
              name: "Ada Lovelace",
              detail: "Driver",
              group: "Drivers",
            },
            {
              id: "grace",
              name: "Grace Hopper",
              detail: "Dispatcher",
              group: "Staff",
            },
            {
              id: "alan",
              name: "Alan Turing",
              detail: "Driver",
              group: "Drivers",
            },
          ]}
        />
      </div>
    ),
    code: `<ContactDirectory
  contacts={[{ id: "ada", name: "Ada Lovelace", detail: "Driver" }]}
  onSelect={() => {}}
/>`,
  },
];
export const CONTACT_GROUP_LIST_EXAMPLES: ExampleSpec[] = [
  {
    id: "contact-group-list",
    title: "Grouped pick list",
    description:
      "Sections own their titles; selection is one contact id across every group, rows activate beside it.",
    render: () => (
      <div className="w-full max-w-xl">
        <ContactGroupList
          groups={[
            {
              id: "drivers",
              title: "Drivers",
              contacts: [
                { id: "ada", name: "Ada Lovelace", detail: "online" },
                { id: "alan", name: "Alan Turing", detail: "on trip" },
              ],
            },
            {
              id: "staff",
              title: "Staff",
              contacts: [
                { id: "grace", name: "Grace Hopper", detail: "Dispatcher" },
              ],
            },
          ]}
          defaultValue="ada"
        />
      </div>
    ),
    code: `<ContactGroupList
  groups={[{ id: "drivers", title: "Drivers", contacts: [{ id: "ada", name: "Ada" }] }]}
  defaultValue="ada"
  onValueChange={() => {}}
/>`,
  },
];
