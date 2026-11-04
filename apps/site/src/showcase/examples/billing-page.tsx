import { BillingPage, StatusPill } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * BillingPage examples — SKELETON ONLY (MS-012 gated).
 *
 * Plan/invoice DISPLAY slots only: no pay action, no top-up action, no
 * payment logic. The ledger preset keeps the invoice grid action-free by
 * construction.
 */
export const BILLING_PAGE_EXAMPLES: ExampleSpec[] = [
  {
    id: "billing-page",
    title: "Plan slot and invoice ledger",
    description:
      "Display-only skeleton: the host composes the plan summary, the template frames it and lists invoices in a ledger grid.",
    render: () => (
      <BillingPage
        title="Billing"
        plan={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Growth plan</p>
              <p className="text-sm opacity-70">Monthly · renews Dec 1</p>
            </div>
            <StatusPill tone="success">Active</StatusPill>
          </div>
        }
        invoiceColumns={[
          { key: "id", title: "Invoice" },
          { key: "total", title: "Total", kind: "numeric" },
        ]}
        invoiceRows={[
          { id: "INV-003", total: 2900 },
          { id: "INV-002", total: 2900 },
        ]}
      />
    ),
    code: `<BillingPage
  title="Billing"
  plan={
    <div>
      <p>Growth plan</p>
      <StatusPill tone="success">Active</StatusPill>
    </div>
  }
  invoiceColumns={[
    { key: "id", title: "Invoice" },
    { key: "total", title: "Total", kind: "numeric" },
  ]}
  invoiceRows={[{ id: "INV-003", total: 2900 }]}
/>`,
  },
];
