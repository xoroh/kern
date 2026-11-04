import type { ComponentDoc } from "../types";

export const csvExportButton: ComponentDoc = {
  slug: "csv-export-button",
  name: "CSV export button",
  oneLiner:
    "CSV export button downloads rows as a CSV file, or hands the text to an interceptor.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "CsvExportButton",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["CsvExportButton"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Starts the export — the control is a button, so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`columns` are key/title pairs and `rows` are plain records — the CSV is built from data, never from the rendered grid.",
      "`filename` and `label` name the file and the button.",
      "`onExport` receives the CSV text instead of downloading it: the seam for tests, native-style share sheets and analytics.",
    ],
    notSupported: [
      "There is no `variant`, `size`, `icon`, `children` or `onClick` passthrough. The button props those names would collide with are omitted by type, so the export owns its rendering.",
      "There is no cell formatting. Values serialise as-is; shape them in `rows` before passing.",
    ],
  },
  api: [
    {
      name: "columns",
      type: "CsvColumn[]",
      required: true,
    },
    {
      name: "rows",
      type: "Record<string, string | number | boolean | null | undefined>[]",
      required: true,
    },
    {
      name: "filename",
      type: "string | undefined",
    },
    {
      name: "label",
      type: "string | undefined",
    },
    {
      name: "onExport",
      type: "((csv: string, filename: string) => void) | undefined",
      note: "Export interception (tests, native-style share sheets, analytics): receives the CSV instead of downloading it.",
    },
  ],
  aria: [
    "`label` names the export action; the default names the file format.",
    "Export interception reports through `onExport` instead of downloading, so tests and share sheets observe the same text the download would carry.",
  ],
};
