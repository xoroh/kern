import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { buildCsv, CsvExportButton } from "./csv-export-button";

describe("CsvExportButton (native)", () => {
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
  ];
  const rows = [
    { id: 1, name: "Alpha" },
    { id: 2, name: "Beta, Inc." },
  ];

  it("builds RFC-4180 CSV strings", () => {
    expect(buildCsv(columns, rows)).toBe(
      'ID,Name\r\n1,Alpha\r\n2,"Beta, Inc."',
    );
  });

  it("calls onExport with the generated CSV and filename on press", async () => {
    const onExport = jest.fn();
    await render(
      <CsvExportButton
        columns={columns}
        rows={rows}
        filename="items.csv"
        onExport={onExport}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Export CSV" }));
    });
    expect(onExport).toHaveBeenCalledWith(
      'ID,Name\r\n1,Alpha\r\n2,"Beta, Inc."',
      "items.csv",
    );
  });
});
