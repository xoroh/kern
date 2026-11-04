/**
 * Empty-states block — the three zero-data placements, wired with actions.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `EmptyState` in its
 * `page`, `section` and `list-row` placements — the same component with
 * different metrics, not three components — each with a primary recovery
 * action and a support link. Copy it, then swap the titles, copy and
 * handlers for the host's own zero-data cases.
 */
import { Button, EmptyState, LinkButton } from "@xoroh/kern";

export function EmptyStatesBlock({
  onCreate,
  onRetry,
}: {
  onCreate?: () => void;
  onRetry?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <EmptyState
        variant="page"
        title="No projects yet"
        description="Create your first project and it will show up here, ready to track."
        primaryAction={<Button onClick={onCreate}>Create project</Button>}
        secondaryAction={
          <LinkButton href="mailto:support@example.com">
            Talk to support
          </LinkButton>
        }
      />
      <EmptyState
        variant="section"
        title="No activity this week"
        description="Share the project link and new events will land here."
        primaryAction={<Button onClick={onRetry}>Refresh</Button>}
      />
      <EmptyState
        variant="list-row"
        title="No rows match"
        description="Try a different search."
      />
    </div>
  );
}
