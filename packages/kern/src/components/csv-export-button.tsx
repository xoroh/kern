import { Button, type ButtonButtonProps } from "./button";

/**
 * CsvExportButton — the shared export helper UI (CL-007; MS-011).
 *
 * Inventory: only CMP-0041 (dispatch BookingsTable) had CSV export; every
 * other table reinvented or skipped it. One helper: a pure RFC-4180
 * `buildCsv` (shared with the native twin — same contract, the host owns
 * share/save there) plus a Button that downloads on web.
 */

export type CsvColumn = {
  key: string;
  title: string;
};

/** RFC-4180: quote fields containing `"`, `,` or newlines; `"` doubles. */
export function buildCsv(
  columns: CsvColumn[],
  rows: Array<Record<string, string | number | boolean | null | undefined>>,
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

/** Web download: Blob + object URL + programmatic click. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export type CsvExportButtonProps = {
  columns: CsvColumn[];
  rows: Array<Record<string, string | number | boolean | null | undefined>>;
  filename?: string;
  label?: string;
  /**
   * Export interception (tests, native-style share sheets, analytics):
   * receives the CSV instead of downloading it.
   */
  onExport?: (csv: string, filename: string) => void;
} & Omit<
  ButtonButtonProps,
  "children" | "onClick" | "variant" | "size" | "icon"
>;

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
      <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

/** Small export affordance: outlined button, download icon, CSV out. */
export function CsvExportButton({
  columns,
  rows,
  filename = "export.csv",
  label = "Export CSV",
  onExport,
  ...rest
}: CsvExportButtonProps) {
  return (
    <Button
      data-slot="csv-export-button"
      variant="outlined"
      size="sm"
      icon={<DownloadIcon />}
      onClick={() => {
        const csv = buildCsv(columns, rows);
        if (onExport) onExport(csv, filename);
        else downloadCsv(filename, csv);
      }}
      {...rest}
    >
      {label}
    </Button>
  );
}
