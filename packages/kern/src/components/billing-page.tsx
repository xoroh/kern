import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Card } from "./card";
import type { DataTableColumn, DataTableRow } from "./data-table";
import { DataTable } from "./data-table";
import { EmptyState } from "./empty-state";
import { KernLoading } from "./kern-loading";

/**
 * BillingPage — SKELETON ONLY (D951 WP4; MS-012 gated, binding).
 *
 * MS-012 GATE: "Tenant payout-request + usage-invoice pay/top-up actions —
 * verify vs Stage 2/5 reports before building." No Stage 2/5 verification
 * reports exist in lead `reports/` (checked 2026-11-04; only per-area
 * billing and financials lane reports) — see
 * `docs/inventory-4-design-baseline.md` §(b). Until the owning lane verifies,
 * this file renders plan/invoice DISPLAY SLOTS ONLY:
 * - NO pay action, NO top-up action, NO payout-request action.
 * - NO payment logic, NO provider calls, NO amount mutation.
 * - Adding an action or payment path here without the owning lane's
 *   verification violates the gate — extend the DISPLAY contract only.
 *
 * Composes ONLY `Card` (plan slot frame) + `DataTable` (`ledger` preset for
 * the invoice list) + `KernLoading`/`EmptyState` (D925). Q3 split: designed
 * here as a Kern-component composition, never Xoroh-specific logic — the
 * host owns plan/invoice data and every future verified action.
 *
 * M3: cards (https://m3.material.io/components/cards) + lists; no M3
 * billing component — page pattern on M3 type/shape/color roles.
 */

export type BillingPageProps = Omit<
  ComponentPropsWithRef<"main">,
  "title" | "children"
> & {
  /** Page heading. */
  title?: ReactNode;
  description?: ReactNode;
  /**
   * Plan display SLOT (host composition: plan name, status pill, cycle
   * line — display nodes only). The template frames it in a `Card`; it
   * never inspects or mutates plan data.
   */
  plan?: ReactNode;
  planLabel?: string;
  /** Invoice columns/rows (display data; `ledger` preset: compact,
   * right-aligned numerics, no selection, no row actions — a display grid
   * cannot start a payment by construction). */
  invoiceColumns?: DataTableColumn[];
  invoiceRows?: DataTableRow[];
  invoicesLabel?: string;
  /** Zero-invoice state node. Defaults to an `EmptyState`. */
  invoicesEmpty?: ReactNode;
  /** Loading state: plan + invoice skeletons with a polite status. */
  loading?: boolean;
  /** Extra display slots (usage meters, history sections from host). */
  children?: ReactNode;
};

/**
 * BillingPage — plan display slot + invoice ledger. Display-only by gate:
 * there is deliberately no action prop on this component.
 *
 * Usage: `<BillingPage title="Billing" plan={<PlanSummary …/>}
 * invoiceColumns={…} invoiceRows={…} />`.
 */
export function BillingPage({
  title = "Billing",
  description,
  plan,
  planLabel = "Current plan",
  invoiceColumns = [],
  invoiceRows = [],
  invoicesLabel = "Invoices",
  invoicesEmpty,
  loading = false,
  children,
  className,
  ...props
}: BillingPageProps) {
  return (
    <main
      data-slot="billing-page"
      data-billing-gate="display-only"
      aria-label={typeof title === "string" ? title : "Billing"}
      className={cn(
        "kern-billing-page mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-(length:--sys-typescale-headline-small-font-size) leading-(--sys-typescale-headline-small-line-height) font-(--sys-typescale-headline-small-font-weight) text-(--sys-color-on-surface)">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-prose text-(length:--sys-typescale-body-medium-font-size) leading-(--sys-typescale-body-medium-line-height) text-(--sys-color-on-surface-variant)">
            {description}
          </p>
        ) : null}
      </div>

      {loading ? (
        <KernLoading kind="skeleton-list" count={4} label="Loading billing" />
      ) : (
        <>
          {plan ? (
            <section aria-label={planLabel}>
              <Card data-slot="billing-plan" className="p-4 sm:p-6">
                {plan}
              </Card>
            </section>
          ) : null}
          <section aria-label={invoicesLabel}>
            {invoiceRows.length > 0 ? (
              <DataTable
                variant="ledger"
                columns={invoiceColumns}
                rows={invoiceRows}
                caption={
                  typeof invoicesLabel === "string" ? invoicesLabel : undefined
                }
              />
            ) : (
              (invoicesEmpty ?? (
                <EmptyState
                  variant="section"
                  title="No invoices yet"
                  description="Invoices appear here once billing runs."
                />
              ))
            )}
          </section>
          {children}
        </>
      )}
    </main>
  );
}
