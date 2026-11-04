import { describe, expect, it } from "vitest";
import {
  filterTableRows,
  type NativeDataTableColumn,
  type NativeDataTableRow,
  sortTableRows,
} from "./data-table";

const columns: NativeDataTableColumn[] = [
  { key: "booking", title: "Booking", sortable: true },
  { key: "status", title: "Status", kind: "status" },
  { key: "amount", title: "Amount", kind: "numeric", sortable: true },
];

const rows: NativeDataTableRow[] = [
  { id: "BK-002", booking: "BK-002", status: "Live", amount: -120 },
  { id: "BK-001", booking: "BK-001", status: "Done", amount: 340 },
  { id: "BK-003", booking: "BK-003", status: "Live", amount: 45 },
];

describe("native table adapters (contract parity with web)", () => {
  it("sorts numerics numerically, not lexically", () => {
    expect(
      sortTableRows(rows, columns, "amount", "asc").map((row) => row.id),
    ).toEqual(["BK-002", "BK-003", "BK-001"]);
    expect(
      sortTableRows(rows, columns, "booking", "desc").map((row) => row.id),
    ).toEqual(["BK-003", "BK-002", "BK-001"]);
  });

  it("ignores unsortable and missing sort keys", () => {
    expect(sortTableRows(rows, columns, "status", "asc")).toEqual(rows);
    expect(sortTableRows(rows, columns, undefined, "asc")).toEqual(rows);
  });

  it("filters across every column value", () => {
    expect(filterTableRows(rows, "live")).toHaveLength(2);
    expect(filterTableRows(rows, "340")).toHaveLength(1);
    expect(filterTableRows(rows, "")).toHaveLength(3);
  });
});
