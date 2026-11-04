import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BillingPage } from "./billing-page";
import { StatusPill } from "./status-pill";

describe("BillingPage", () => {
  it("renders the plan display slot and the invoice ledger", () => {
    const { container } = render(
      <BillingPage
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
        invoiceRows={[{ id: "INV-001", total: 2900 }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Billing" })).toBeTruthy();
    expect(screen.getByText("Growth plan")).toBeTruthy();
    expect(screen.getByText("INV-001")).toBeTruthy();
    // MS-012 gate: the skeleton exposes no payment surface.
    expect(
      container.querySelector('[data-billing-gate="display-only"]'),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: /pay/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /top.?up/i })).toBeNull();
  });

  it("shows skeletons while loading and the empty state with no invoices", () => {
    const { container, rerender } = render(
      <BillingPage title="Billing" loading />,
    );
    expect(container.querySelector('[data-slot="kern-loading"]')).toBeTruthy();
    rerender(<BillingPage title="Billing" />);
    expect(screen.getByText("No invoices yet")).toBeTruthy();
  });
});
