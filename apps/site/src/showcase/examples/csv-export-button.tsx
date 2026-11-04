import { CsvExportButton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * CsvExportButton examples — the shared export helper.
 *
 * One RFC-4180 builder plus a small outlined button: every table that
 * needs export stops reinventing quoting. On native the same builder
 * feeds the host share sheet through the required onExport.
 */
export const CSV_EXPORT_BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "csv-export-button",
    title: "One export button for every table",
    description:
      "Columns and rows in, quoted CSV out — intercepted here for the demo instead of downloaded.",
    render: () => (
      <CsvExportButton
        columns={[
          { key: "booking", title: "Booking" },
          { key: "status", title: "Status" },
        ]}
        rows={[
          { booking: "BK-1", status: "Live" },
          { booking: "BK-2", status: "Done" },
        ]}
        filename="queue.csv"
        onExport={() => {}}
      />
    ),
    code: `<CsvExportButton
  columns={[{ key: "booking", title: "Booking" }]}
  rows={[{ booking: "BK-1" }]}
  filename="queue.csv"
/>`,
  },
];
