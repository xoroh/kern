/**
 * List-detail block — searchable ticket queue beside its detail pane.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `@xoroh/kern/start`, `react`). It wires the shipped
 * `ListDetail` recipe with `Search` + `ListItem` rows in the list pane and
 * a `Card` detail pane with an `EmptyState` for no-match and no-selection —
 * copy it, then replace the mock tickets and the select handler with host
 * data.
 */
import { Button, Card, EmptyState, ListItem, Search, StatusPill } from "@xoroh/kern";
import { ListDetail } from "@xoroh/kern/start";
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
        <div
          style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8 }}
        >
          <Search
            label="Search tickets"
            placeholder="Search tickets"
            value={query}
            onValueChange={setQuery}
          />
          {visible.length > 0 ? (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {visible.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  headline={ticket.subject}
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
            </ul>
          ) : (
            <EmptyState
              variant="list-row"
              title="No tickets match"
              description={`Nothing matches "${query}".`}
              action={
                <Button onClick={() => setQuery("")}>Clear search</Button>
              }
            />
          )}
        </div>
      }
      detail={
        selected ? (
          <div style={{ padding: 16 }}>
            <Card variant="filled" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <p className="text-(--sys-typescale-title-large-font-size) font-(--sys-typescale-title-large-font-weight)">
                  {selected.subject}
                </p>
                <StatusPill tone={selected.tone}>
                  {selected.status}
                </StatusPill>
              </div>
              <p className="text-(--sys-typescale-body-small-font-size) opacity-70">
                {selected.id} · {selected.requester} · {selected.updated}
              </p>
              <p className="text-(--sys-typescale-body-medium-font-size)">
                {selected.detail}
              </p>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="Select a ticket"
            description="Pick a row to read the full thread."
          />
        )
      }
    />
  );
}
