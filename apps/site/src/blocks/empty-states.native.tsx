/**
 * Empty-states block, native variant — the three zero-data placements.
 *
 * Same contract as `empty-states.tsx`: real source composed ONLY from
 * shipped packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add empty-states --platform native`. Same three placements with
 * the same handlers, stacked for a phone column.
 */
import { Button, EmptyState, LinkButton } from "@xoroh/kern-native";

export function EmptyStatesBlock({
  onCreate,
  onRetry,
}: {
  onCreate?: () => void;
  onRetry?: () => void;
}) {
  return (
    <>
      <EmptyState
        variant="page"
        title="No projects yet"
        description="Create your first project and it will show up here, ready to track."
        primaryAction={
          <Button onPress={onCreate}>Create project</Button>
        }
        secondaryAction={
          <LinkButton href="#support">Talk to support</LinkButton>
        }
      />
      <EmptyState
        variant="section"
        title="No activity this week"
        description="Share the project link and new events will land here."
        primaryAction={<Button onPress={onRetry}>Refresh</Button>}
      />
      <EmptyState
        variant="list-row"
        title="No rows match"
        description="Try a different search."
      />
    </>
  );
}
