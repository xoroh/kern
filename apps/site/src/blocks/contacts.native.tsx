/**
 * Contacts block, native variant — searchable contact directory.
 *
 * Same contract as `contacts.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add contacts --platform native`.
 */
import { ContactDirectory } from "@xoroh/kern-native";

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
