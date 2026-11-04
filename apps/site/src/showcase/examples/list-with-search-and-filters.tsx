import { ListWithSearchAndFilters } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * ListWithSearchAndFilters examples — the discovery block.
 *
 * Search, FilterBar and List wired into one section: type to filter,
 * chip to facet, clear to recover. Filtering with zero matches is
 * EmptySearch; idle with zero rows is the host's empty state. The
 * booking, desk and ticket compositions from inventory collapse here.
 */
export const LIST_WITH_SEARCH_AND_FILTERS_EXAMPLES: ExampleSpec[] = [
  {
    id: "list-with-search-and-filters",
    title: "Search, facets and list — wired",
    description:
      "One block owns the query and the active-filter model; the host owns the rows and the facet adapter. Try a query with no matches, then clear it.",
    render: () => (
      <div className="w-full max-w-xl">
        <ListWithSearchAndFilters
          label="Trips"
          rows={[
            { id: "a", headline: "Airport pickup", supporting: "Today 14:00" },
            { id: "b", headline: "City tour", supporting: "Tomorrow 09:00" },
          ]}
          filterDefs={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "live", label: "Live" },
                { value: "done", label: "Done" },
              ],
            },
          ]}
          searchPlaceholder="Search trips"
        />
      </div>
    ),
    code: `<ListWithSearchAndFilters
  label="Trips"
  rows={[{ id: "a", headline: "Airport pickup" }]}
  filterDefs={[{ key: "status", label: "Status", options: [...] }]}
/>`,
  },
];
