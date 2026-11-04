import type { ReactNode } from "react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

/**
 * EmptySearch — the no-results block (CL-011/CL-012; D925).
 *
 * Hardens the existing CLI `empty-search` block seed
 * (`apps/site/src/blocks/empty-search.tsx`) to the §4 bar: query echo,
 * clear-search recovery action, and an optional suggestions slot — composed
 * ONLY from `EmptyState` + `Button`, no re-implementation.
 *
 * M3: empty-states pattern + search
 * (https://m3.material.io/components/search).
 */

export type EmptySearchProps = {
  /** The query that yielded nothing. Echoed in the title. */
  query: string;
  /** Recovery: clear the search and browse everything. */
  onClear: () => void;
  /**
   * Custom title. Typed `string` (not `ReactNode`): `EmptyState`'s props
   * intersect the div `title` attribute, so only strings satisfy it today
   * (WP1b owns that type; not widened here).
   */
  title?: string;
  description?: ReactNode;
  clearLabel?: string;
  /** Follow-up content: recent searches, popular destinations, … */
  suggestions?: ReactNode;
  className?: string;
};

/** No-results state: query echo + clear action + optional suggestions. */
export function EmptySearch({
  query,
  onClear,
  title,
  description,
  clearLabel = "Clear search",
  suggestions,
  className,
}: EmptySearchProps) {
  return (
    <div data-slot="empty-search" className={className}>
      <EmptyState
        title={title ?? `No results for \u201C${query}\u201D`}
        description={
          description ??
          "Try a different spelling, or clear the search to browse everything."
        }
        action={
          <Button variant="tonal" onClick={onClear}>
            {clearLabel}
          </Button>
        }
      />
      {suggestions ? (
        <div
          data-slot="empty-search-suggestions"
          className="kern-empty-search-suggestions flex flex-col items-center gap-2 px-6 pb-8"
        >
          {suggestions}
        </div>
      ) : null}
    </div>
  );
}
