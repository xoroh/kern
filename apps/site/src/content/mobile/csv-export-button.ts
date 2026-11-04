import type { ComponentDoc } from "../types";

export const csvExportButton: ComponentDoc = {
  slug: "csv-export-button",
  name: "CSV export button",
  oneLiner:
    "CSV export button hands rows as CSV text to the required share handler.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
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
      key: "Press",
      action:
        "Builds the CSV and hands it to `onExport` — the control is a button, so activation is the platform's own.",
    },
  ],
  customization: {
    supported: [
      "`columns` are key/title pairs and `rows` are plain records — the CSV is built from data, never from the rendered grid.",
      "`filename` and `label` name the file and the button.",
      "`onExport` is required on native: it receives the CSV text for the share sheet, file write or analytics.",
    ],
    notSupported: [
      "There is no download. Native has no silent file save — every export goes through `onExport`.",
      "There is no cell formatting. Values serialise as-is; shape them in `rows` before passing.",
    ],
  },
  api: [
    {
      name: "columns",
      type: "NativeCsvColumn[]",
      required: true,
    },
    {
      name: "rows",
      type: "NativeCsvRow[]",
      required: true,
    },
    {
      name: "filename",
      type: "string",
    },
    {
      name: "label",
      type: "string",
    },
    {
      name: "onExport",
      type: "(csv: string, filename: string) => void",
      required: true,
      note: "Share-save the CSV (required: native has no silent download).",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "`label` names the export action; the default names the file format.",
    "Native has no silent download, so `onExport` is required — the share sheet, file write or test observes the same text a download would carry.",
  ],
};
