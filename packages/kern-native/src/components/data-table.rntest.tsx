import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { DataTable } from "./data-table";

const columns = [
  { key: "booking", title: "Booking", sortable: true },
  { key: "status", title: "Status", kind: "status" as const },
  { key: "amount", title: "Amount", kind: "numeric" as const, sortable: true },
];

const rows = [
  { id: "BK-002", booking: "BK-002", status: "Live", amount: -120 },
  { id: "BK-001", booking: "BK-001", status: "Done", amount: 340 },
  { id: "BK-003", booking: "BK-003", status: "Live", amount: 45 },
];

describe("native DataTable (list-cards fallback)", () => {
  it("renders one card per row with labelled cells", async () => {
    await render(<DataTable columns={columns} rows={rows} caption="Queue" />);
    expect(screen.getByTestId("kern-data-table")).toBeTruthy();
    expect(screen.getByText("Queue")).toBeTruthy();
    expect(screen.getByTestId("kern-data-table-row-BK-001")).toBeTruthy();
    expect(screen.getAllByText("BK-001").length).toBeGreaterThan(0);
  });

  it("sorts on header press", async () => {
    await render(<DataTable columns={columns} rows={rows} />);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Sort by Booking"));
    });
    // Ascending: BK-001 card precedes BK-002. Cards render in order, so the
    // first booking title in tree order is the head of the sorted page.
    const titles = screen
      .getAllByText(/^BK-00[123]$/)
      .map((node) => node.props.children);
    expect(titles[0]).toBe("BK-001");
  });

  it("selects rows and paginates long queues", async () => {
    const seen: string[][] = [];
    const many = Array.from({ length: 25 }, (_, index) => ({
      id: `BK-${index}`,
      booking: `BK-${index}`,
      status: "Live",
      amount: index,
    }));
    await render(
      <DataTable
        columns={columns}
        rows={many}
        pageSize={10}
        onSelectedChange={(ids) => seen.push(ids)}
      />,
    );
    expect(screen.getByText("Showing 1–10 of 25")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Page 3"));
    });
    expect(screen.getByText("Showing 21–25 of 25")).toBeTruthy();
    expect(seen).toEqual([]);
  });

  it("fires row actions from the card button row", async () => {
    const selected: unknown[] = [];
    await render(
      <DataTable
        columns={columns}
        rows={rows}
        rowActions={[
          { label: "Refund", onSelect: (row) => selected.push(row) },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Refund for row BK-002"));
    });
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({ id: "BK-002" });
  });

  it("renders status cells through the tone mapping when given", async () => {
    const seen: Array<string | undefined> = [];
    await render(
      <DataTable
        columns={columns.map((column) =>
          column.kind === "status"
            ? {
                ...column,
                statusTone: (
                  value: string | number | boolean | null | undefined,
                ) => {
                  seen.push(typeof value === "string" ? value : undefined);
                  return value === "Live" ? "success" : "neutral";
                },
              }
            : column,
        )}
        rows={rows}
      />,
    );
    expect(screen.getAllByText("Live")).toHaveLength(2);
    expect(screen.getByText("Done")).toBeTruthy();
    expect(seen).toEqual(["Live", "Done", "Live"]);
  });

  it("shows the empty state when the query matches nothing", async () => {
    await render(<DataTable columns={columns} rows={rows} query="zzz" />);
    expect(screen.queryByTestId("kern-data-table")).toBeNull();
    expect(screen.getByText("No matching rows")).toBeTruthy();
  });

  it("csv-preview renders without selection controls", async () => {
    await render(
      <DataTable columns={columns} rows={rows} variant="csv-preview" />,
    );
    expect(screen.queryByLabelText(/Select row/)).toBeNull();
  });
});
