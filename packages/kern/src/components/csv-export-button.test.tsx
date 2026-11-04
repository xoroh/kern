import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { buildCsv, CsvExportButton } from "./csv-export-button";

describe("CsvExportButton", () => {
  const columns = [
    { key: "id", title: "ID" },
    { key: "note", title: "Note" },
  ];
  const rows = [
    { id: 1, note: "Plain" },
    { id: 2, note: 'Has, comma and "quotes"' },
  ];

  it("formats RFC-4180 CSV with escaped quotes and commas", () => {
    const csv = buildCsv(columns, rows);
    expect(csv).toBe('ID,Note\r\n1,Plain\r\n2,"Has, comma and ""quotes"""');
  });

  it("invokes onExport with built CSV and filename when clicked", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <CsvExportButton
        columns={columns}
        rows={rows}
        filename="report.csv"
        onExport={onExport}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(onExport).toHaveBeenCalledWith(
      'ID,Note\r\n1,Plain\r\n2,"Has, comma and ""quotes"""',
      "report.csv",
    );
  });
});
