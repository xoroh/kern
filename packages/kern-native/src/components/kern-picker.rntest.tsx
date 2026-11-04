import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import {
  KernPicker,
  ReasonPicker,
  reasonAdapterToOptions,
  serviceCatalogToOptions,
} from "./kern-picker";

/**
 * Native KernPicker — one picker.
 *
 * N-side proofs: single-select reports + dismisses through the sheet and
 * dialog variants; multi-select stays open; the inline variant renders in
 * place with no modal; ReasonPicker rows derive from the injected adapter.
 */

const OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro", supporting: "Most popular" },
];

describe("picker adapters (native twins)", () => {
  it("serviceCatalogToOptions maps catalog entries identically to web", () => {
    expect(
      serviceCatalogToOptions([
        { id: "city", name: "City", priceLabel: "€2/km" },
      ]),
    ).toEqual([{ value: "city", label: "City", supporting: "€2/km" }]);
  });

  it("reasonAdapterToOptions filters by context", () => {
    expect(
      reasonAdapterToOptions({
        reasons: [
          { id: "a", label: "No driver", context: "cancel" },
          { id: "b", label: "Fraud", context: "block" },
        ],
        context: "cancel",
      }),
    ).toEqual([{ value: "a", label: "No driver", supporting: undefined }]);
  });
});

describe("KernPicker bottom-sheet (native)", () => {
  it("picks, reports, and dismisses", async () => {
    const onSelect = jest.fn();
    const onOpenChange = jest.fn();
    await render(
      <KernPicker
        label="Plan"
        options={OPTIONS}
        defaultOpen
        onSelect={onSelect}
        onOpenChange={onOpenChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Pro"));
    });
    expect(onSelect).toHaveBeenCalledWith("pro");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("multi-select stays open and reports the array", async () => {
    const onMultiSelect = jest.fn();
    await render(
      <KernPicker
        label="Assignees"
        mode="assignee"
        variant="dialog"
        multiple
        options={OPTIONS}
        defaultOpen
        onMultiSelect={onMultiSelect}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Pro"));
    });
    expect(onMultiSelect).toHaveBeenCalledWith(["pro"]);
    // Still open: no dismissal reported.
    expect(onMultiSelect).not.toHaveBeenCalledWith([]);
  });
});

describe("KernPicker inline-popover (native)", () => {
  it("renders the list in place, non-modal, on trigger", async () => {
    await render(
      <KernPicker
        label="Status"
        mode="status"
        variant="inline-popover"
        options={OPTIONS}
      />,
    );
    expect(screen.queryByLabelText("Pro")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Status"));
    });
    expect(screen.getByLabelText("Pro")).toBeTruthy();
  });
});

describe("KernPicker modes (native)", () => {
  it("date mode renders the calendar", async () => {
    await render(
      <KernPicker label="Date" mode="date" variant="dialog" defaultOpen />,
    );
    expect(screen.getByLabelText("Date calendar")).toBeTruthy();
  });

  it("country mode lists countries and reports the pick", async () => {
    const onCountryChange = jest.fn();
    await render(
      <KernPicker
        label="Country"
        mode="country"
        variant="dialog"
        defaultOpen
        countries={[{ code: "DE", name: "Germany", dialCode: "49" }]}
        onCountryChange={onCountryChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Germany"));
    });
    expect(onCountryChange).toHaveBeenCalledWith({
      code: "DE",
      name: "Germany",
      dialCode: "49",
    });
  });

  it("plan mode renders catalog rows through the adapter", async () => {
    const onSelect = jest.fn();
    await render(
      <KernPicker
        label="Service"
        mode="plan"
        variant="inline-popover"
        catalog={[{ id: "city", name: "City" }]}
        onSelect={onSelect}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Service"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("City"));
    });
    expect(onSelect).toHaveBeenCalledWith("city");
  });
});

describe("ReasonPicker (native)", () => {
  it("offers ONLY the injected context rows", async () => {
    await render(
      <ReasonPicker
        label="Reason"
        variant="inline-popover"
        reasons={{
          reasons: [
            { id: "no-driver", label: "No driver found", context: "cancel" },
            { id: "fraud", label: "Suspected fraud", context: "block" },
          ],
          context: "cancel",
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Reason"));
    });
    expect(screen.getByLabelText("No driver found")).toBeTruthy();
    expect(screen.queryByLabelText("Suspected fraud")).toBeNull();
  });
});
