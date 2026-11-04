import {
  ContactCard,
  ContactDirectory,
  ContactRow,
  StatusPill,
} from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Contact examples — the trio plus the directory block. One adapter
 * (user / driver / group → row), one tone contract for every disc, the
 * directory composing search + grouped rows + empty state.
 */
export const KERN_CONTACT_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-contact-trio",
    title: "Row, card, and tone",
    description:
      "The disc tone is deterministic per contact on the status registry — photo or initials, row or card, the identity contract never forks.",
    render: () => (
      <div className="flex w-full max-w-xl flex-col gap-4">
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
    code: `<ContactRow contact={{ id: "ada", name: "Ada Lovelace", detail: "Driver" }} />
<ContactCard
  contact={{ id: "ada", name: "Ada Lovelace" }}
  status={<StatusPill tone="success">Online</StatusPill>}
/>`,
  },
  {
    id: "kern-contact-directory",
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
    code: `<ContactDirectory contacts={contacts} onSelect={setActive} />`,
  },
];
