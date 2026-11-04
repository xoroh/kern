/**
 * List-detail block, native variant — ticket queue with one-pane detail.
 *
 * Same contract as `list-detail.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add list-detail --platform native`. One data contract with the web
 * twin (query + selected id); the native `ListDetail` collapses to one pane
 * at phone widths, so showing the detail is a back-navigable state here.
 */
import {
  Button,
  Card,
  EmptyState,
  ListDetail,
  ListItem,
  Search,
  StatusPill,
  Text,
} from "@xoroh/kern-native";
import { useState } from "react";

type Ticket = {
  id: string;
  subject: string;
  requester: string;
  status: "Open" | "Pending" | "Resolved";
  tone: "warning" | "info" | "success";
  updated: string;
  detail: string;
};

const TICKETS: Ticket[] = [
  {
    id: "t-1042",
    subject: "Airport pickup running late",
    requester: "Ada Lovelace",
    status: "Open",
    tone: "warning",
    updated: "2m ago",
    detail:
      "Flight SK1463 landed 25 minutes late. Driver is at arrivals with a name board; rider asked to be kept posted.",
  },
  {
    id: "t-1041",
    subject: "Receipt missing for Friday ride",
    requester: "Grace Hopper",
    status: "Pending",
    tone: "info",
    updated: "1h ago",
    detail:
      "Corporate rider needs a VAT receipt for expense sign-off. Invoice INV-003 covers the trip; resend it with the company header.",
  },
  {
    id: "t-1039",
    subject: "Child seat request confirmed",
    requester: "Faroeq",
    status: "Resolved",
    tone: "success",
    updated: "Yesterday",
    detail:
      "Saturday booking confirmed with a forward-facing seat. Driver notified; no further action needed.",
  },
];

export function ListDetailBlock({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(TICKETS[0].id);
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? TICKETS.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(needle) ||
          ticket.requester.toLowerCase().includes(needle),
      )
    : TICKETS;
  const selected = TICKETS.find((ticket) => ticket.id === selectedId) ?? null;
  return (
    <ListDetail
      list={
        <>
          <Search
            label="Search tickets"
            value={query}
            onValueChange={setQuery}
          />
          {visible.map((ticket) => (
            <ListItem
              key={ticket.id}
              title={ticket.subject}
              supporting={`${ticket.requester} · ${ticket.updated}`}
              trailing={
                <StatusPill tone={ticket.tone}>{ticket.status}</StatusPill>
              }
              selected={ticket.id === selectedId}
              onPress={() => {
                setSelectedId(ticket.id);
                onSelect?.(ticket.id);
              }}
            />
          ))}
          {visible.length === 0 ? (
            <EmptyState
              variant="list-row"
              title="No tickets match"
              description={`Nothing matches "${query}".`}
              action={
                <Button onPress={() => setQuery("")}>Clear search</Button>
              }
            />
          ) : null}
        </>
      }
      detail={
        selected ? (
          <Card variant="filled">
            <Text>
              {selected.subject} · {selected.id}
            </Text>
            <StatusPill tone={selected.tone}>{selected.status}</StatusPill>
            <Text>
              {selected.requester} · {selected.updated}
            </Text>
            <Text>{selected.detail}</Text>
          </Card>
        ) : (
          <EmptyState
            title="Select a ticket"
            description="Pick a row to read the full thread."
          />
        )
      }
      showingDetail={selected !== null}
      onBack={() => setSelectedId(null)}
      backLabel="Tickets"
    />
  );
}
