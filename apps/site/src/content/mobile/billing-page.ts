import type { ComponentDoc } from "../types";

export const billingPage: ComponentDoc = {
  slug: "billing-page",
  name: "Billing page",
  oneLiner:
    "Billing page renders plan and invoice display slots with no payment actions.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    // Recorded as having no Material 3 source — a kern extension.
    specUrl: "none",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "BillingPage",
    variants: [],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["BillingPage"],
  customization: {
    supported: [
      "`plan`, `invoiceColumns` and `invoiceRows` are display slots: the page shows plan and invoice data, never money movement.",
      "`planLabel`, `invoicesLabel` and `invoicesEmpty` name the regions and the empty state.",
      "`children` slots extra display content around the two sections.",
    ],
    notSupported: [
      "There are no pay, top-up or payout actions. No Stage 2/5 verification backs any payment behaviour, so actions wait for the owning lane — the gate is structural, not a missing prop.",
      "There is no invoice fetching. Columns and rows arrive as props; `loading` only paints the skeleton.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "plan",
      type: "ReactNode",
      note: "Plan display SLOT (host composition, display nodes only).",
    },
    {
      name: "planLabel",
      type: "string",
    },
    {
      name: "invoiceColumns",
      type: "NativeDataTableColumn[]",
    },
    {
      name: "invoiceRows",
      type: "NativeDataTableRow[]",
    },
    {
      name: "invoicesLabel",
      type: "string",
    },
    {
      name: "invoicesEmpty",
      type: "ReactNode",
    },
    {
      name: "loading",
      type: "boolean",
    },
    {
      name: "children",
      type: "ReactNode",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Plan and invoices render as two labelled sections, so the page announces as regions with the title naming the whole.",
    "`loading` renders skeletons; no invoices renders the section empty state.",
    "The invoice grid uses the ledger preset — no selection, no row actions — so a payment cannot start by construction.",
  ],
};
