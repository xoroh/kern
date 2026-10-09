/**
 * Block: empty-search — a no-results state composed from shipped components.
 *
 * Category: Dashboard. Install with `kern add empty-search`.
 * Dependencies: @xoroh/kern, react.
 */
import { Button, EmptyState } from "@xoroh/kern";

export function EmptySearch({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      title={`No results for “${query}”`}
      description="Try a different spelling, or clear the search to browse everything."
      action={
        <Button variant="tonal" onClick={onClear}>
          Clear search
        </Button>
      }
    />
  );
}
