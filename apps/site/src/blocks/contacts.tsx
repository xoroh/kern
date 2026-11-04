/**
 * Contacts block — searchable contact directory, wired with mock people.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `ContactDirectory`:
 * inline search over grouped rows with an empty state — copy it, then
 * replace the mock contacts and the select handler with host data.
 */
import { ContactDirectory } from "@xoroh/kern";

const CONTACTS = [
  { id: "ada", name: "Ada Lovelace", detail: "Dispatcher · on shift" },
  { id: "faroeq", name: "Faroeq", detail: "Owner · on shift" },
  { id: "grace", name: "Grace Hopper", detail: "Driver · off shift" },
];

export function ContactsBlock({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  return (
    <ContactDirectory
      contacts={CONTACTS}
      searchLabel="Search contacts"
      searchPlaceholder="Search"
      emptyTitle="No contacts"
      emptyDescription="Try a different search."
      onSelect={(contact) => onSelect?.(contact.id)}
    />
  );
}
