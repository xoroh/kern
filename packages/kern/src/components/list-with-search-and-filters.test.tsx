import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ListRow } from "./list";
import { ListWithSearchAndFilters } from "./list-with-search-and-filters";

const rows: ListRow[] = [
  {
    id: "a",
    headline: "Airport pickup",
    supporting: "Today 14:00",
    status: "live",
  } as ListRow & { status: string },
  {
    id: "b",
    headline: "City tour",
    supporting: "Tomorrow",
    status: "done",
  } as ListRow & { status: string },
];

const defs = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "live", label: "Live" },
      { value: "done", label: "Done" },
    ],
  },
];

describe("ListWithSearchAndFilters", () => {
  it("wires search to the list and recovers through EmptySearch", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ListWithSearchAndFilters rows={rows} searchLabel="Search trips" />,
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search trips" }),
      "zzz",
    );
    expect(screen.queryByText("Airport pickup")).toBeNull();
    const empty = container.querySelector('[data-slot="empty-search"]');
    expect(empty?.textContent).toMatch(/No results for/);
    await user.click(
      within(empty as HTMLElement).getByRole("button", {
        name: "Clear search",
      }),
    );
    expect(screen.getByText("Airport pickup")).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "Search trips" })).toHaveValue(
      "",
    );
  });

  it("facets rows through the filter bar", async () => {
    const user = userEvent.setup();
    render(<ListWithSearchAndFilters rows={rows} filterDefs={defs} />);
    await user.click(screen.getByRole("button", { name: "Live" }));
    expect(screen.getByText("Airport pickup")).toBeTruthy();
    expect(screen.queryByText("City tour")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByText("City tour")).toBeTruthy();
  });

  it("shows the idle empty state without query or filters", () => {
    render(
      <ListWithSearchAndFilters
        rows={[]}
        emptyState={<p>Nothing scheduled</p>}
      />,
    );
    expect(screen.getByText("Nothing scheduled")).toBeTruthy();
  });

  it("reports query and filter changes to the host", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onFiltersChange = vi.fn();
    render(
      <ListWithSearchAndFilters
        rows={rows}
        filterDefs={defs}
        onQueryChange={onQueryChange}
        onFiltersChange={onFiltersChange}
      />,
    );
    await user.type(screen.getByRole("searchbox"), "a");
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.stringContaining("a"),
    );
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: ["done"] });
  });

  it("renders loading skeletons while loading", () => {
    render(<ListWithSearchAndFilters rows={rows} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading list");
  });
});
