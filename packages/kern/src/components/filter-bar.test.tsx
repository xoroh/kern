import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  applyFilterDefs,
  FilterBar,
  type FilterDef,
  fromFilterQuery,
  toFilterQuery,
} from "./filter-bar";

const statusDef: FilterDef = {
  key: "status",
  label: "Status",
  options: [
    { value: "live", label: "Live" },
    { value: "done", label: "Done" },
  ],
};
const planDef: FilterDef = {
  key: "plan",
  label: "Plan",
  multi: false,
  options: [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ],
};
const defs: FilterDef[] = [statusDef, planDef];

describe("FilterBar", () => {
  it("renders a labelled toolbar with facet groups", () => {
    render(<FilterBar filters={defs} />);
    expect(screen.getByRole("toolbar", { name: "Filters" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Status" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Live" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("toggles multi-select options and reports the merged model", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<FilterBar filters={defs} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole("button", { name: "Live" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: ["live"] });
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({
      status: ["live", "done"],
    });
  });

  it("single-select facets replace the value", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<FilterBar filters={defs} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole("button", { name: "Free" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({ plan: ["free"] });
    await user.click(screen.getByRole("button", { name: "Pro" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({ plan: ["pro"] });
  });

  it("clears everything through Clear all", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(<FilterBar filters={defs} onFiltersChange={onFiltersChange} />);
    await user.click(screen.getByRole("button", { name: "Live" }));
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({});
    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
  });

  it("applies saved views and clears the view on manual toggle", async () => {
    const user = userEvent.setup();
    const onSavedViewSelect = vi.fn();
    const onFiltersChange = vi.fn();
    render(
      <FilterBar
        filters={defs}
        savedViews={[
          { id: "live", label: "Live now", filters: { status: ["live"] } },
        ]}
        onSavedViewSelect={onSavedViewSelect}
        onFiltersChange={onFiltersChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Live now" }));
    expect(onFiltersChange).toHaveBeenLastCalledWith({ status: ["live"] });
    expect(onSavedViewSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "live" }),
    );
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onSavedViewSelect).toHaveBeenLastCalledWith(undefined);
  });

  it("opens host-owned full filters with an active count", async () => {
    const user = userEvent.setup();
    const onOpenFilters = vi.fn();
    render(<FilterBar filters={defs} onOpenFilters={onOpenFilters} />);
    await user.click(screen.getByRole("button", { name: "Live" }));
    await user.click(screen.getByRole("button", { name: "All filters (1)" }));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });
});

describe("filter query adapter", () => {
  it("round-trips the active model through a query string", () => {
    const active = { status: ["live", "done"], plan: ["pro"] };
    const query = toFilterQuery(active);
    expect(query).toBe("?status=live%2Cdone&plan=pro");
    expect(fromFilterQuery(query)).toEqual(active);
    expect(toFilterQuery({})).toBe("");
    expect(fromFilterQuery("")).toEqual({});
  });

  it("facets rows by the active defs", () => {
    const rows = [
      { status: "live", plan: "pro" },
      { status: "done", plan: "free" },
      { status: "live", plan: "free" },
    ];
    const get = (row: (typeof rows)[number], key: string) =>
      key === "status" ? row.status : row.plan;
    expect(
      applyFilterDefs(rows, [{ ...statusDef, value: ["live"] }], get),
    ).toHaveLength(2);
    expect(
      applyFilterDefs(
        rows,
        [
          { ...statusDef, value: ["live"] },
          { ...planDef, value: ["pro"] },
        ],
        get,
      ),
    ).toHaveLength(1);
    expect(applyFilterDefs(rows, defs, get)).toHaveLength(3);
  });
});
