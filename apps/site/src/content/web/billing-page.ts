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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      type: "ReactNode",
      note: "Page heading.",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "plan",
      type: "ReactNode",
      note: "Plan display SLOT (host composition: plan name, status pill, cycle line — display nodes only). The template frames it in a `Card`; it never inspects or mutates plan data.",
    },
    {
      name: "planLabel",
      type: "string | undefined",
    },
    {
      name: "invoiceColumns",
      type: "DataTableColumn[] | undefined",
      note: "Invoice columns/rows (display data; `ledger` preset: compact, right-aligned numerics, no selection, no row actions — a display grid cannot start a payment by construction).",
    },
    {
      name: "invoiceRows",
      type: "DataTableRow[] | undefined",
    },
    {
      name: "invoicesLabel",
      type: "string | undefined",
    },
    {
      name: "invoicesEmpty",
      type: "ReactNode",
      note: "Zero-invoice state node. Defaults to an `EmptyState`.",
    },
    {
      name: "loading",
      type: "boolean | undefined",
      note: "Loading state: plan + invoice skeletons with a polite status.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Extra display slots (usage meters, history sections from host).",
    },
  ],
  aria: [
    "Plan and invoices render as two labelled sections, so the page announces as regions with the title naming the whole.",
    "`loading` renders skeletons; no invoices renders the section empty state.",
    "The invoice grid uses the ledger preset — no selection, no row actions — so a payment cannot start by construction.",
  ],
};
