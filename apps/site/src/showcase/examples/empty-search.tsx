import { EmptySearch } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * EmptySearch examples — the hardened no-results block.
 *
 * The CLI empty-search seed at the §4 bar: the query echoed in quotes, a
 * tonal clear action, and a slot for follow-ups like recent searches.
 */
export const EMPTY_SEARCH_EXAMPLES: ExampleSpec[] = [
  {
    id: "empty-search",
    title: "A no-results state that recovers",
    description:
      "Echoes what found nothing, offers the way back, and leaves room for suggestions — composed only from EmptyState and Button.",
    render: () => (
      <div className="w-full max-w-sm">
        <EmptySearch query="airprot" onClear={() => {}} />
      </div>
    ),
    code: `<EmptySearch query="airprot" onClear={() => {}} />`,
  },
];
