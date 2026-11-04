/**
 * Billing block, native variant — plan display slot + invoice ledger, wired
 * with mock data.
 *
 * Same contract as `billing.tsx`: real source composed ONLY from shipped
 * packages (`@xoroh/kern-native`, `react`), installed by
 * `kern add billing --platform native`. Display-only: no pay action, no
 * top-up action, no payment logic.
 */
import { BillingPage, StatusPill, Text } from "@xoroh/kern-native";

export function BillingPageBlock() {
  return (
    <BillingPage
      title="Billing"
      description="Plan, invoices, and usage — display only."
      planLabel="Current plan"
      plan={
        <>
          <Text>Growth plan · Monthly · renews Dec 1</Text>
          <StatusPill tone="success">Active</StatusPill>
        </>
      }
      invoicesLabel="Invoices"
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
