import { FilterBar } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * FilterBar examples — one FilterDef contract, chips out.
 *
 * Facets render as M3 filter chips with saved views beside them; the full
 * filter surface stays host-owned (dialog on web, sheet on native) behind
 * the trigger. The same defs drive the query-string adapter, so a view
 * is shareable as a URL.
 */
export const FILTER_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "filter-bar-facets",
    title: "Facets, saved views and a host-owned surface",
    description:
      "Multi-select facets accumulate, single-select facets replace, saved views apply at once — and every change reports the merged model the list filters by.",
    render: () => (
      <div className="w-full max-w-2xl">
        <FilterBar
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "live", label: "Live" },
                { value: "done", label: "Done" },
              ],
            },
            {
              key: "plan",
              label: "Plan",
              multi: false,
              options: [
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
              ],
            },
          ]}
          savedViews={[
            { id: "live", label: "Live now", filters: { status: ["live"] } },
          ]}
          onOpenFilters={() => {}}
          onFiltersChange={() => {}}
        />
      </div>
    ),
    code: `<FilterBar
  filters={[
    { key: "status", label: "Status", options: [] },
    { key: "plan", label: "Plan", multi: false, options: [] },
  ]}
  savedViews={[{ id: "live", label: "Live now", filters: { status: ["live"] } }]}
  onOpenFilters={() => {}}
  onFiltersChange={(active) => {}}
/>`,
  },
];
