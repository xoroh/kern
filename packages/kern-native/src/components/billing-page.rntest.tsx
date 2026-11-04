import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { BillingPage } from "./billing-page";

describe("native BillingPage", () => {
  it("renders the plan display slot and the invoice ledger", async () => {
    await render(
      <BillingPage
        title="Billing"
        plan={<Text>Growth plan</Text>}
        invoiceColumns={[
          { key: "id", title: "Invoice" },
          { key: "total", title: "Total" },
        ]}
        invoiceRows={[{ id: "INV-001", total: 2900 }]}
      />,
    );
    expect(screen.getByTestId("kern-billing-page")).toBeTruthy();
    expect(screen.getByText("Growth plan")).toBeTruthy();
    expect(screen.getByText("INV-001")).toBeTruthy();
    // MS-012 gate: no payment surface exists on the skeleton.
    expect(screen.queryByRole("button", { name: /pay/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /top.?up/i })).toBeNull();
  });

  it("shows skeletons while loading", async () => {
    const view = await render(<BillingPage title="Billing" loading />);
    expect(view.getByTestId("kern-loading")).toBeTruthy();
  });

  it("shows the empty state with no invoices", async () => {
    const view = await render(<BillingPage title="Billing" />);
    expect(view.getByText("No invoices yet")).toBeTruthy();
  });
});
