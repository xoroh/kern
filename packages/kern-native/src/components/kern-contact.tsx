import { STATUS_TONES, type StatusTone } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Avatar } from "./avatar";
import { EmptyState } from "./empty-state";
import { Input } from "./input";
import { Text } from "./text";

/**
 * KernContact — native twin of web `KernContact` (CL-006; D925).
 *
 * Same contract (adapter, deterministic `contactToneFor`, initials,
 * row/card/grouped-list/directory); only the interaction idiom differs
 * (N): press + screen-reader roles, sheet-less inline search (the
 * directory search is a docked input, never the cmd-K dialog), haptics
 * left to the host. The disc is the registry tone through the native
 * `Avatar` — the HSL-disc fork is gone on both renderers.
 */

export type ContactAdapter = {
  id: string;
  name: string;
  detail?: string;
  photoUrl?: string;
  tone?: StatusTone;
  group?: string;
};

const TONE_WHEEL: readonly StatusTone[] = STATUS_TONES.filter(
  (tone) => tone !== "neutral",
);

/** Deterministic disc tone from any key (same spec as the web twin). */
export function contactToneFor(key: string): StatusTone {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return TONE_WHEEL[Math.abs(hash) % TONE_WHEEL.length] ?? "primary";
}

/** Initials disc text: first letters of the first two words, uppercased. */
export function contactInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export type NativeContactRowProps = {
  contact: ContactAdapter;
  /** Row activation (DOMAIN action, not state). */
  onSelect?: (contact: ContactAdapter) => void;
  trailing?: ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** One directory row: avatar + name + meta + action. */
export function ContactRow({
  contact,
  onSelect,
  trailing,
  selected = false,
  style,
  testID,
}: NativeContactRowProps) {
  const scheme = useKernScheme();
  const tone = contact.tone ?? contactToneFor(contact.id);
  const body = (
    <>
      <Avatar
        size="default"
        tone={tone}
        fallback={contactInitials(contact.name)}
        source={contact.photoUrl ? { uri: contact.photoUrl } : undefined}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="title" numberOfLines={1}>
          {contact.name}
        </Text>
        {contact.detail ? (
          <Text
            variant="label"
            numberOfLines={1}
            style={{ color: scheme.color.onSurfaceVariant }}
          >
            {contact.detail}
          </Text>
        ) : null}
      </View>
      {trailing ?? (
        <Text variant="title" style={{ color: scheme.color.onSurfaceVariant }}>
          ›
        </Text>
      )}
    </>
  );
  const rowStyle: ViewStyle = {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: selected
      ? scheme.color.secondaryContainer
      : scheme.color.surface,
  };
  if (!onSelect) {
    return (
      <View
        testID={testID ?? `kern-contact-row-${contact.id}`}
        style={[rowStyle, style]}
      >
        {body}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={contact.name}
      accessibilityState={{ selected }}
      onPress={() => onSelect(contact)}
      testID={testID ?? `kern-contact-row-${contact.id}`}
      style={[rowStyle, style]}
    >
      {body}
    </Pressable>
  );
}

export type NativeContactCardProps = {
  contact: ContactAdapter;
  actions?: ReactNode;
  status?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Identity card: large disc + name + detail + status + actions. */
export function ContactCard({
  contact,
  actions,
  status,
  style,
  testID,
}: NativeContactCardProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? `kern-contact-card-${contact.id}`}
      style={[
        {
          flexDirection: "column",
          gap: 12,
          borderRadius: Number.parseFloat(scheme.shape.medium),
          backgroundColor: scheme.color.surface,
          padding: 16,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar
          size="large"
          tone={contact.tone ?? contactToneFor(contact.id)}
          fallback={contactInitials(contact.name)}
          source={contact.photoUrl ? { uri: contact.photoUrl } : undefined}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="headline" numberOfLines={1}>
            {contact.name}
          </Text>
          {contact.detail ? (
            <Text
              variant="label"
              numberOfLines={2}
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {contact.detail}
            </Text>
          ) : null}
        </View>
        {status}
      </View>
      {actions ? (
        <View style={{ flexDirection: "row", gap: 8 }}>{actions}</View>
      ) : null}
    </View>
  );
}

export type ContactGroup = {
  id: string;
  title: string;
  contacts: readonly ContactAdapter[];
};

export type NativeContactGroupListProps = {
  groups: readonly ContactGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Row activation (DOMAIN action; fires beside selection). */
  onSelect?: (contact: ContactAdapter) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Sectioned rows with single selection (the group picker shape). */
export function ContactGroupList({
  groups,
  value,
  defaultValue,
  onValueChange,
  onSelect,
  style,
  testID,
}: NativeContactGroupListProps) {
  const scheme = useKernScheme();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value ?? uncontrolled;
  const choose = (contact: ContactAdapter) => {
    if (value === undefined) setUncontrolled(contact.id);
    onValueChange?.(contact.id);
    onSelect?.(contact);
  };
  return (
    <View
      testID={testID ?? "kern-contact-group-list"}
      style={[{ flexDirection: "column", gap: 16 }, style]}
    >
      {groups.map((group) => (
        <View key={group.id}>
          <Text
            variant="label"
            style={{
              color: scheme.color.onSurfaceVariant,
              paddingHorizontal: 16,
              paddingBottom: 4,
            }}
          >
            {group.title.toUpperCase()}
          </Text>
          <View
            style={{
              flexDirection: "column",
              borderRadius: Number.parseFloat(scheme.shape.medium),
              overflow: "hidden",
              backgroundColor: scheme.color.surfaceContainer,
              gap: 1,
            }}
          >
            {group.contacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                selected={contact.id === selected}
                onSelect={onSelect || onValueChange ? choose : undefined}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/** Case-insensitive match on name + detail. */
export function filterContacts(
  contacts: readonly ContactAdapter[],
  query: string,
): ContactAdapter[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...contacts];
  return contacts.filter((contact) =>
    [contact.name, contact.detail ?? ""].some((term) =>
      term.toLowerCase().includes(needle),
    ),
  );
}

/** Contacts → groups by `group` (ungrouped land under `fallbackTitle`). */
export function groupContacts(
  contacts: readonly ContactAdapter[],
  fallbackTitle = "Contacts",
): ContactGroup[] {
  const order: ContactGroup[] = [];
  const byGroup = new Map<string, ContactGroup>();
  for (const contact of contacts) {
    const key = contact.group ?? fallbackTitle;
    let group = byGroup.get(key);
    if (!group) {
      group = { id: key, title: key, contacts: [] };
      byGroup.set(key, group);
      order.push(group);
    }
    (group.contacts as ContactAdapter[]).push(contact);
  }
  return order;
}

export type NativeContactDirectoryProps = {
  contacts: readonly ContactAdapter[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Row activation (DOMAIN action, not state). */
  onSelect?: (contact: ContactAdapter) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** ContactDirectory block: inline search + grouped rows + empty state. */
export function ContactDirectory({
  contacts,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onSelect,
  searchLabel = "Search contacts",
  searchPlaceholder = "Search",
  emptyTitle = "No contacts",
  emptyDescription = "Try a different search.",
  style,
  testID,
}: NativeContactDirectoryProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const query = queryProp ?? internalQuery;
  const setQuery = (next: string) => {
    if (queryProp === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  };
  const matches = filterContacts(contacts, query);
  return (
    <View
      testID={testID ?? "kern-contact-directory"}
      style={[{ flexDirection: "column", gap: 12 }, style]}
    >
      <Input
        aria-label={searchLabel}
        placeholder={searchPlaceholder}
        value={query}
        onChangeText={setQuery}
        testID="kern-contact-directory-search"
      />
      {matches.length > 0 ? (
        <ContactGroupList groups={groupContacts(matches)} onSelect={onSelect} />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </View>
  );
}
