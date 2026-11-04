/**
 * Billing block — plan display slot + invoice ledger, wired with mock data.
 *
 * A block is a real source file composed ONLY from shipped packages
 * (`@xoroh/kern`, `react`). It renders the shipped `BillingPage` with a
 * realistic Growth-plan slot and two ledger rows — copy it, then replace
 * the mock plan/invoices with host data. Display-only: no pay action, no
 * top-up action, no payment logic (the component refuses actions by
 * construction; so does this block).
 */
import { BillingPage, StatusPill } from "@xoroh/kern";

export function BillingPageBlock() {
  return (
    <BillingPage
      title="Billing"
      description="Plan, invoices, and usage — display only."
      plan={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-(--sys-typescale-title-large-font-size) font-(--sys-typescale-title-large-font-weight)">
              Growth plan
            </p>
            <p className="text-(--sys-typescale-body-small-font-size) opacity-70">
              Monthly · renews Dec 1
            </p>
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
  );
}
