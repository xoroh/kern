import { STATUS_TONES, type StatusTone } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar";
import { EmptyState } from "./empty-state";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { Search } from "./search";

/**
 * KernContact — ONE contact trio (CL-006; D925 "one contact row").
 *
 * Replaces the raw-hex / light-dark-forked copies (CMP-2524/2525 avatar +
 * line, CMP-2537 web ContactPicker, CMP-2499 CountryPickerScreen,
 * CMP-2526 ContactGroupPicker, desk-mobile directory rows): the avatar
 * disc, the line and the picker share ONE tone contract (KernStatus
 * registry, CL-010) on both renderers — the web headless span vs native
 * HSL disc fork is gone.
 *
 * - `ContactRow` — avatar + name + meta + action (the directory row).
 * - `ContactCard` — header (avatar + identity) + actions slot.
 * - `ContactGroupList` — sectioned rows with selection.
 * - `ContactDirectory` — the block: search + grouped list + empty state
 *   (composes `Search` + `EmptyState`, never a second list/search).
 *
 * Adapter: `ContactAdapter` maps user / driver / group records to one row
 * shape. `contactToneFor` picks the disc tone deterministically from any
 * key (name, id, email) — a NAME-level pick over `STATUS_TONES`, so both
 * renderers agree with no scheme object (web reads CSS vars, never a
 * resolved RoleTable; the native twin resolves the same name through its
 * scheme). It is stable within Kern, not identical to `avatarToneFor`'s
 * ramp pick — recorded here so nobody "unifies" them by hand.
 *
 * M3: lists (https://m3.material.io/components/lists) — avatars are an
 * M3 pattern, not a component (Lists + custom visuals).
 */

export type ContactAdapter = {
  /** Stable identity: keys, selection, tone pick. */
  id: string;
  /** Display name. Required: the row is named by this. */
  name: string;
  /** Second line: role, phone, status… */
  detail?: string;
  /** Photo URL. Absent → initials disc in the registry tone. */
  photoUrl?: string;
  /** Explicit disc tone. Absent → `contactToneFor(id)`. */
  tone?: StatusTone;
  /** Group heading for the directory. Absent → ungrouped. */
  group?: string;
};

const TONE_WHEEL: readonly StatusTone[] = STATUS_TONES.filter(
  (tone) => tone !== "neutral",
);

/** Deterministic disc tone from any key (FNV-1a over the tone wheel). */
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

export type ContactRowProps = {
  contact: ContactAdapter;
  /** Row activation (R2 lexicon: DOMAIN action, not state). */
  onSelect?: (contact: ContactAdapter) => void;
  /** Trailing slot: call/chat action, chevron, presence… */
  trailing?: ReactNode;
  selected?: boolean;
  className?: string;
  testID?: string;
};

/** One directory row: avatar + name + meta + action. */
export function ContactRow({
  contact,
  onSelect,
  trailing,
  selected = false,
  className,
  testID,
}: ContactRowProps) {
  const tone = contact.tone ?? contactToneFor(contact.id);
  const row = (
    <>
      <AvatarRoot size="default" data-tone={tone}>
        {contact.photoUrl ? (
          <AvatarImage src={contact.photoUrl} alt="" />
        ) : null}
        <AvatarFallback tone={tone}>
          {contactInitials(contact.name)}
        </AvatarFallback>
      </AvatarRoot>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-(--sys-color-on-surface)">
          {contact.name}
        </span>
        {contact.detail ? (
          <span className="truncate text-xs text-(--sys-color-on-surface-variant)">
            {contact.detail}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center">{trailing}</span>
      ) : (
        <span
          aria-hidden="true"
          className="shrink-0 text-(--sys-color-on-surface-variant)"
        >
          ›
        </span>
      )}
    </>
  );
  const rowClass = cn(
    "kern-contact-row flex min-h-14 w-full items-center gap-3 bg-(--sys-color-surface) px-4 py-2 text-left",
    selected &&
      "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)",
    className,
  );
  if (!onSelect) {
    return (
      <div
        data-slot="contact-row"
        data-testid={testID ?? `kern-contact-row-${contact.id}`}
        className={rowClass}
      >
        {row}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(contact)}
      aria-label={contact.name}
      data-slot="contact-row"
      data-testid={testID ?? `kern-contact-row-${contact.id}`}
      className={cn(
        rowClass,
        "cursor-pointer",
        FOCUS_RING_CLASS,
        "outline-none",
      )}
    >
      {row}
    </button>
  );
}

export type ContactCardProps = {
  contact: ContactAdapter;
  /** Actions slot: call / chat / email buttons (host-owned). */
  actions?: ReactNode;
  /** Leading status slot (usually a `StatusPill`). */
  status?: ReactNode;
  className?: string;
  testID?: string;
};

/** Identity card: large disc + name + detail + status + actions. */
export function ContactCard({
  contact,
  actions,
  status,
  className,
  testID,
}: ContactCardProps) {
  const tone = contact.tone ?? contactToneFor(contact.id);
  return (
    <div
      data-slot="contact-card"
      data-testid={testID ?? `kern-contact-card-${contact.id}`}
      className={cn(
        "kern-contact-card flex flex-col gap-3 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface) p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <AvatarRoot size="lg" data-tone={tone}>
          {contact.photoUrl ? (
            <AvatarImage src={contact.photoUrl} alt="" />
          ) : null}
          <AvatarFallback tone={tone}>
            {contactInitials(contact.name)}
          </AvatarFallback>
        </AvatarRoot>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base font-semibold text-(--sys-color-on-surface)">
            {contact.name}
          </span>
          {contact.detail ? (
            <span className="truncate text-sm text-(--sys-color-on-surface-variant)">
              {contact.detail}
            </span>
          ) : null}
        </span>
        {status}
      </div>
      {actions ? (
        <div data-slot="contact-card-actions" className="flex gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export type ContactGroup = {
  id: string;
  title: ReactNode;
  contacts: readonly ContactAdapter[];
};

export type ContactGroupListProps = {
  groups: readonly ContactGroup[];
  /** Controlled selected contact id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Row activation (DOMAIN action; fires beside selection). */
  onSelect?: (contact: ContactAdapter) => void;
  className?: string;
  testID?: string;
};

/** Sectioned rows with single selection (the group picker shape). */
export function ContactGroupList({
  groups,
  value,
  defaultValue,
  onValueChange,
  onSelect,
  className,
  testID,
}: ContactGroupListProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value ?? uncontrolled;
  const choose = (contact: ContactAdapter) => {
    if (value === undefined) setUncontrolled(contact.id);
    onValueChange?.(contact.id);
    onSelect?.(contact);
  };
  return (
    <div
      data-slot="contact-group-list"
      data-testid={testID ?? "kern-contact-group-list"}
      className={cn("flex flex-col gap-4", className)}
    >
      {groups.map((group) => (
        <section
          key={group.id}
          aria-label={typeof group.title === "string" ? group.title : undefined}
        >
          <h3 className="px-4 pb-1 text-xs font-medium tracking-wide text-(--sys-color-on-surface-variant)">
            {group.title}
          </h3>
          <ul
            data-slot="contact-group-rows"
            className="flex flex-col gap-px overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container)"
          >
            {group.contacts.map((contact) => (
              <li key={contact.id}>
                <ContactRow
                  contact={contact}
                  selected={contact.id === selected}
                  onSelect={onSelect || onValueChange ? choose : undefined}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
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

export type ContactDirectoryProps = {
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
  className?: string;
  testID?: string;
};

/** ContactDirectory block: search + grouped rows + empty state. */
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
  className,
  testID,
}: ContactDirectoryProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const query = queryProp ?? internalQuery;
  const setQuery = (next: string) => {
    if (queryProp === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  };
  const matches = filterContacts(contacts, query);
  return (
    <div
      data-slot="contact-directory"
      data-testid={testID ?? "kern-contact-directory"}
      className={cn("flex flex-col gap-3", className)}
    >
      <Search
        label={searchLabel}
        placeholder={searchPlaceholder}
        value={query}
        onValueChange={setQuery}
        onSearch={setQuery}
      />
      {matches.length > 0 ? (
        <ContactGroupList groups={groupContacts(matches)} onSelect={onSelect} />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
