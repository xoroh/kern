import { DataTable } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * DataTable examples — the one table in four presets.
 *
 * Variants are presets, not components: the dispatch queue, the admin
 * grid, the ledger and the CSV preview share sort, filter, pagination
 * and selection. Density and row actions follow the preset; every
 * preset can still be overridden per table.
 */
export const DATA_TABLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "data-table-bookings",
    title: "A dispatch queue with status cells and row actions",
    description:
      "Sortable headers announce their direction, status renders as chips, and each row keeps an overflow menu — one grid, composed from the Table primitives.",
    render: () => (
      <div className="w-full max-w-2xl">
        <DataTable
          variant="bookings"
          caption="Today's queue"
          columns={[
            { key: "booking", title: "Booking", sortable: true },
            {
              key: "status",
              title: "Status",
              kind: "status",
              statusTone: (value) => (value === "Live" ? "success" : "neutral"),
            },
            { key: "amount", title: "Amount", kind: "numeric", sortable: true },
            { key: "more", title: "More", kind: "actions" },
          ]}
          rows={[
            { id: "BK-1", booking: "BK-1", status: "Live", amount: 42 },
            { id: "BK-2", booking: "BK-2", status: "Done", amount: 18 },
          ]}
          rowActions={[{ label: "Refund", onSelect: () => {} }]}
        />
      </div>
    ),
    code: `<DataTable
  variant="bookings"
  caption="Today's queue"
  columns={[
    { key: "booking", title: "Booking", sortable: true },
    {
      key: "status",
      title: "Status",
      kind: "status",
      statusTone: (value) => (value === "Live" ? "success" : "neutral"),
    },
    { key: "more", title: "More", kind: "actions" },
  ]}
  rows={[]}
  rowActions={[{ label: "Refund", onSelect: () => {} }]}
/>`,
  },
  {
    id: "data-table-ledger",
    title: "A compact ledger with signed amounts",
    description:
      "The ledger preset compacts rows, right-aligns numerics and paints negative amounts in the error role — the raw red/green hex drift from inventory has one home now.",
    render: () => (
      <div className="w-full max-w-2xl">
        <DataTable
          variant="ledger"
          caption="Transactions"
          columns={[
            { key: "ref", title: "Reference", sortable: true },
            { key: "amount", title: "Amount", kind: "numeric", sortable: true },
          ]}
          rows={[
            { id: "t1", ref: "Payout 1042", amount: 1200 },
            { id: "t2", ref: "Refund 88", amount: -120 },
          ]}
        />
      </div>
    ),
    code: `<DataTable
  variant="ledger"
  columns={[
    { key: "ref", title: "Reference", sortable: true },
    { key: "amount", title: "Amount", kind: "numeric" },
  ]}
  rows={[]}
/>`,
  },
];
