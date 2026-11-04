import { Button } from "./button";

/**
 * Native CsvExportButton — the web `CsvExportButton` twin (CL-007; MS-011).
 *
 * Contract S (shared): `buildCsv` is byte-identical logic. Platform N:
 * there is no DOM download, so `onExport` is REQUIRED — the host
 * share-saves the CSV (Share API, file system). A no-op export button
 * would be a trap, so the type refuses one.
 */

export type NativeCsvColumn = {
  key: string;
  title: string;
};

export type NativeCsvRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export function buildCsv(
  columns: NativeCsvColumn[],
  rows: NativeCsvRow[],
): string {
  function cell(value: string | number | boolean | null | undefined): string {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }
  const head = columns.map((column) => cell(column.title)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => cell(row[column.key])).join(","),
  );
  return [head, ...body].join("\r\n");
}

export type NativeCsvExportButtonProps = {
  columns: NativeCsvColumn[];
  rows: NativeCsvRow[];
  filename?: string;
  label?: string;
  /** Share-save the CSV (required: native has no silent download). */
  onExport: (csv: string, filename: string) => void;
  testID?: string;
};

export function CsvExportButton({
  columns,
  rows,
  filename = "export.csv",
  label = "Export CSV",
  onExport,
  testID,
}: NativeCsvExportButtonProps) {
  return (
    <Button
      variant="outlined"
      testID={testID ?? "kern-csv-export-button"}
      accessibilityLabel={label}
      onPress={() => onExport(buildCsv(columns, rows), filename)}
    >
      {label}
    </Button>
  );
}
