import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import { act } from "react";
import { Select } from "./select";

function renderWithPortal(element: React.ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

const OPTIONS = [
  { value: "opt-1", label: "Option 1" },
  { value: "opt-2", label: "Option 2" },
  { value: "opt-3", label: "Option 3" },
];

describe("Select native component", () => {
  it("renders trigger with placeholder", async () => {
    await renderWithPortal(
      <Select options={OPTIONS} placeholder="Choose an option" />,
    );
    expect(screen.getByText("Choose an option")).toBeTruthy();
  });

  it("exposes all compound parts on Select", () => {
    expect(Select.Root).toBeDefined();
    expect(Select.Trigger).toBeDefined();
    expect(Select.Value).toBeDefined();
    expect(Select.Portal).toBeDefined();
    expect(Select.Positioner).toBeDefined();
    expect(Select.Backdrop).toBeDefined();
    expect(Select.Popup).toBeDefined();
    expect(Select.Arrow).toBeDefined();
    expect(Select.ScrollUpArrow).toBeDefined();
    expect(Select.ScrollDownArrow).toBeDefined();
    expect(Select.Group).toBeDefined();
    expect(Select.GroupLabel).toBeDefined();
    expect(Select.Item).toBeDefined();
    expect(Select.ItemText).toBeDefined();
    expect(Select.ItemIndicator).toBeDefined();
    expect(Select.Separator).toBeDefined();
  });

  it("selects an item and reports onValueChange", async () => {
    const onValueChange = jest.fn();
    await renderWithPortal(
      <Select
        options={OPTIONS}
        onValueChange={onValueChange}
        defaultOpen={true}
      />,
    );

    const item = screen.getByLabelText("Option 2");
    await act(async () => {
      fireEvent.press(item);
    });

    expect(onValueChange).toHaveBeenCalledWith("opt-2");
  });

  it("supports multiple selections", async () => {
    const onValueChange = jest.fn();
    await renderWithPortal(
      <Select
        multiple
        options={OPTIONS}
        onValueChange={onValueChange}
        defaultOpen={true}
      />,
    );

    const item1 = screen.getByLabelText("Option 1");
    await act(async () => {
      fireEvent.press(item1);
    });

    expect(onValueChange).toHaveBeenCalledWith(["opt-1"]);
  });
});
