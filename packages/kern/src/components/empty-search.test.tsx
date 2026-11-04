import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { buildCsv, CsvExportButton } from "./csv-export-button";
import { EmptySearch } from "./empty-search";

describe("EmptySearch", () => {
  it("echoes the query with a clear-search recovery action", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<EmptySearch query="xyz" onClear={onClear} />);
    expect(screen.getByText(/No results for.*xyz/)).toBeTruthy();
    expect(
      screen.getByText("Try a different spelling", { exact: false }),
    ).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders follow-up suggestions when provided", () => {
    render(
      <EmptySearch
        query="xyz"
        onClear={() => {}}
        suggestions={<p>Popular right now</p>}
      />,
    );
    expect(screen.getByText("Popular right now")).toBeTruthy();
  });
});

describe("CsvExportButton", () => {
  it("builds RFC-4180 CSV with quoting", () => {
    const columns = [
      { key: "name", title: "Name" },
      { key: "note", title: "Note" },
    ];
    expect(
      buildCsv(columns, [
        { name: "Ada", note: "plain" },
        { name: 'O"Brien, Jr.', note: "line\nbreak" },
        { name: null, note: undefined },
      ]),
    ).toBe('Name,Note\r\nAda,plain\r\n"O""Brien, Jr.","line\nbreak"\r\n,');
  });

  it("hands the CSV to onExport instead of downloading", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(
      <CsvExportButton
        columns={[{ key: "name", title: "Name" }]}
        rows={[{ name: "Ada" }]}
        filename="crew.csv"
        onExport={onExport}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Export CSV" }));
    expect(onExport).toHaveBeenCalledWith("Name\r\nAda", "crew.csv");
  });
});
