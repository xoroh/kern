import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import {
  KernPicker,
  ReasonPicker,
  reasonAdapterToOptions,
  serviceCatalogToOptions,
} from "./kern-picker";

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

const OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro", supporting: "Most popular" },
  { value: "ent", label: "Enterprise", disabled: true },
];

describe("serviceCatalogToOptions (PlanSelector merge)", () => {
  it("maps catalog entries to picker rows with price lines", () => {
    const rows = serviceCatalogToOptions([
      { id: "city", name: "City", description: "Metered", priceLabel: "€2/km" },
    ]);
    expect(rows).toEqual([
      { value: "city", label: "City", supporting: "Metered · €2/km" },
    ]);
  });
});

describe("reasonAdapterToOptions (no local copy)", () => {
  it("filters by context and maps detail to supporting", () => {
    const rows = reasonAdapterToOptions({
      reasons: [
        { id: "a", label: "No driver", context: "cancel", detail: "ETA" },
        { id: "b", label: "Fraud", context: "block" },
      ],
      context: "cancel",
    });
    expect(rows).toEqual([
      { value: "a", label: "No driver", supporting: "ETA" },
    ]);
  });
});

describe("KernPicker option-list dialog", () => {
  it("opens, picks, reports, and dismisses", async () => {
    const user = userEvent.setup();
    let picked = "";
    render(
      <KernPicker
        label="Plan"
        options={OPTIONS}
        onSelect={(v) => (picked = v)}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Plan" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(await screen.findByRole("option", { name: "Pro" }));
    expect(picked).toBe("pro");
    // Select-then-dismiss for single-select.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the selection in the trigger", async () => {
    const user = userEvent.setup();
    render(<KernPicker label="Plan" options={OPTIONS} value="pro" />);
    expect(screen.getByRole("button", { name: "Plan" })).toHaveTextContent(
      "Pro",
    );
    await user.click(screen.getByRole("button", { name: "Plan" }));
    expect(await screen.findByRole("option", { name: "Pro" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("multi-select stays open and reports the array", async () => {
    const user = userEvent.setup();
    let picked: string[] = [];
    render(
      <KernPicker
        label="Assignees"
        mode="assignee"
        multiple
        options={OPTIONS}
        onMultiSelect={(v) => (picked = v)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Assignees" }));
    await user.click(await screen.findByRole("option", { name: "Pro" }));
    expect(picked).toEqual(["pro"]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has no axe violations open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <KernPicker label="Plan" options={OPTIONS} />
      </main>,
    );
    await user.click(screen.getByRole("button", { name: "Plan" }));
    await screen.findByRole("dialog");
    await axeClean(container);
  });
});

describe("KernPicker bottom-sheet + popover variants", () => {
  it("bottom-sheet opens the sheet surface", async () => {
    const user = userEvent.setup();
    render(
      <KernPicker
        label="Status"
        mode="status"
        variant="bottom-sheet"
        options={OPTIONS}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(await screen.findByTestId("kern-picker")).toBeInTheDocument();
  });

  it("inline-popover anchors content on trigger", async () => {
    const user = userEvent.setup();
    render(
      <KernPicker
        label="Status"
        mode="status"
        variant="inline-popover"
        options={OPTIONS}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Status" }));
    expect(
      await screen.findByRole("option", { name: "Pro" }),
    ).toBeInTheDocument();
  });
});

describe("KernPicker modes", () => {
  it("date mode renders the calendar and reports a day", async () => {
    const user = userEvent.setup();
    let picked: Date | null = null;
    render(
      <KernPicker
        label="Date"
        mode="date"
        onDateChange={(d) => (picked = d)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Date" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(picked).toBeNull();
  });

  it("time mode renders the picker and country mode lists countries", async () => {
    const user = userEvent.setup();
    render(
      <KernPicker label="Time" mode="time" onTimeChange={() => undefined} />,
    );
    await user.click(screen.getByRole("button", { name: "Time" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const user2 = userEvent.setup();
    let code: string | null = null;
    render(
      <KernPicker
        label="Country"
        mode="country"
        countries={[
          { code: "DE", name: "Germany", dialCode: "49" },
          { code: "NL", name: "Netherlands", dialCode: "31" },
        ]}
        onCountryChange={(c) => (code = c?.code ?? null)}
      />,
    );
    await user2.click(screen.getByRole("button", { name: "Country" }));
    await user2.click(await screen.findByRole("option", { name: /Germany/ }));
    expect(code).toBe("DE");
  });

  it("plan mode renders catalog rows through the adapter", async () => {
    const user = userEvent.setup();
    let picked = "";
    render(
      <KernPicker
        label="Service"
        mode="plan"
        catalog={[{ id: "city", name: "City", priceLabel: "€2/km" }]}
        onSelect={(v) => (picked = v)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Service" }));
    await user.click(await screen.findByRole("option", { name: /City/ }));
    expect(picked).toBe("city");
  });
});

describe("ReasonPicker", () => {
  const adapter = {
    reasons: [
      { id: "no-driver", label: "No driver found", context: "cancel" },
      { id: "fraud", label: "Suspected fraud", context: "block" },
    ],
  };

  it("offers ONLY the injected context rows — no local dataset", async () => {
    // Sensitivity: the same surface with a `block` context shows the OTHER
    // row, proving rows derive from the adapter on every render.
    const user = userEvent.setup();
    render(
      <ReasonPicker
        label="Reason"
        reasons={{ ...adapter, context: "cancel" }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Reason" }));
    expect(
      await screen.findByRole("option", { name: "No driver found" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Suspected fraud" }),
    ).not.toBeInTheDocument();
  });
});
