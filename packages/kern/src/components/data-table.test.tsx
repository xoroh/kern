import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DataTable,
  type DataTableColumn,
  type DataTableRow,
  filterTableRows,
  sortTableRows,
} from "./data-table";

const columns: DataTableColumn[] = [
  { key: "booking", title: "Booking", sortable: true },
  { key: "status", title: "Status", kind: "status" },
  { key: "amount", title: "Amount", kind: "numeric", sortable: true },
];

const rows: DataTableRow[] = [
  { id: "BK-002", booking: "BK-002", status: "Live", amount: -120 },
  { id: "BK-001", booking: "BK-001", status: "Done", amount: 340 },
  { id: "BK-003", booking: "BK-003", status: "Live", amount: 45 },
];

describe("DataTable", () => {
  it("renders one grid with scoped headers", () => {
    render(<DataTable columns={columns} rows={rows} caption="Queue" />);
    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: /Booking/ }),
    ).toHaveAttribute("scope", "col");
    expect(screen.getByText("Queue")).toBeTruthy();
  });

  it("sorts ascending then descending on header activation", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} />);
    const table = screen.getByRole("table");
    const bookings = () =>
      within(table)
        .getAllByRole("cell")
        .map((cell) => cell.textContent)
        .filter((text) => text?.startsWith("BK-"));
    expect(bookings()).toEqual(["BK-002", "BK-001", "BK-003"]);
    await user.click(screen.getByRole("button", { name: "Sort by Booking" }));
    expect(bookings()).toEqual(["BK-001", "BK-002", "BK-003"]);
    expect(
      within(table).getByRole("columnheader", { name: /Booking/ }),
    ).toHaveAttribute("aria-sort", "ascending");
    await user.click(screen.getByRole("button", { name: "Sort by Booking" }));
    expect(bookings()).toEqual(["BK-003", "BK-002", "BK-001"]);
  });

  it("filters rows by query and shows the empty state", () => {
    const { rerender } = render(
      <DataTable columns={columns} rows={rows} query="BK-001" />,
    );
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.queryByText("BK-002")).toBeNull();
    rerender(<DataTable columns={columns} rows={rows} query="zzz" />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("No matching rows")).toBeTruthy();
  });

  it("selects rows with header select-all", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Select all rows on this page" }),
    );
    expect(onSelectedChange).toHaveBeenLastCalledWith([
      "BK-002",
      "BK-001",
      "BK-003",
    ]);
  });

  it("paginates long queues with a range label", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 25 }, (_, index) => ({
      id: `BK-${index}`,
      booking: `BK-${index}`,
      status: "Live",
      amount: index,
    }));
    render(<DataTable columns={columns} rows={many} pageSize={10} />);
    expect(screen.getByText("Showing 1–10 of 25")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(screen.getByText("Showing 21–25 of 25")).toBeTruthy();
  });

  it("paints negative ledger amounts in the error role", () => {
    render(<DataTable columns={columns} rows={rows} variant="ledger" />);
    expect(screen.getByText("-120").className).toContain(
      "text-(--sys-color-error)",
    );
  });

  it("csv-preview renders without selection controls", () => {
    render(<DataTable columns={columns} rows={rows} variant="csv-preview" />);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("renders row actions behind an overflow trigger", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DataTable
        columns={[...columns, { key: "more", title: "More", kind: "actions" }]}
        rows={rows}
        rowActions={[{ label: "Refund", onSelect }]}
      />,
    );
    await user.click(
      screen.getByRole("button", { name: "Actions for row BK-002" }),
    );
    // The overflow menu portals in a tick after the trigger press.
    await user.click(await screen.findByRole("menuitem", { name: "Refund" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: "BK-002" });
  });
});

describe("table adapters", () => {
  it("sorts numerics numerically, not lexically", () => {
    const sorted = sortTableRows(rows, columns, "amount", "asc");
    expect(sorted.map((row) => row.id)).toEqual(["BK-002", "BK-003", "BK-001"]);
    expect(
      sortTableRows(rows, columns, "status", "asc").map((r) => r.id),
    ).toEqual(["BK-002", "BK-001", "BK-003"]);
  });

  it("filters across every column value", () => {
    expect(filterTableRows(rows, "live")).toHaveLength(2);
    expect(filterTableRows(rows, "340")).toHaveLength(1);
    expect(filterTableRows(rows, "")).toHaveLength(3);
  });
});
