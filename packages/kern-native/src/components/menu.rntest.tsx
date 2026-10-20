import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import { act } from "react";
import { Text } from "react-native";
import { Menu } from "./menu";

function renderWithPortal(element: React.ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

const ITEMS = [
  { label: "Edit" },
  { label: "Duplicate" },
  { label: "Delete", disabled: true },
];

describe("Menu native component", () => {
  it("renders trigger and accessible label", async () => {
    await renderWithPortal(
      <Menu
        trigger={<Text>Actions</Text>}
        triggerLabel="Actions menu"
        items={ITEMS}
      />,
    );
    expect(screen.getByText("Actions")).toBeTruthy();
  });

  it("exposes all compound parts on Menu", () => {
    expect(Menu.Root).toBeDefined();
    expect(Menu.Trigger).toBeDefined();
    expect(Menu.Portal).toBeDefined();
    expect(Menu.Positioner).toBeDefined();
    expect(Menu.Backdrop).toBeDefined();
    expect(Menu.Popup).toBeDefined();
    expect(Menu.Arrow).toBeDefined();
    expect(Menu.Item).toBeDefined();
    expect(Menu.CheckboxItem).toBeDefined();
    expect(Menu.CheckboxItemIndicator).toBeDefined();
    expect(Menu.RadioGroup).toBeDefined();
    expect(Menu.RadioItem).toBeDefined();
    expect(Menu.RadioItemIndicator).toBeDefined();
    expect(Menu.SubmenuRoot).toBeDefined();
    expect(Menu.SubmenuTrigger).toBeDefined();
    expect(Menu.SubmenuContent).toBeDefined();
    expect(Menu.Group).toBeDefined();
    expect(Menu.GroupLabel).toBeDefined();
    expect(Menu.Separator).toBeDefined();
    expect(Menu.Clear).toBeDefined();
    expect(Menu.Empty).toBeDefined();
    expect(Menu.Input).toBeDefined();
    expect(Menu.LinkItem).toBeDefined();
  });

  it("selects an item and triggers onSelect callback", async () => {
    const onSelect = jest.fn();
    const items = [{ label: "Action 1", onSelect }];
    await renderWithPortal(
      <Menu
        defaultOpen={true}
        trigger={<Text>Menu</Text>}
        triggerLabel="Open menu"
        items={items}
      />,
    );

    const item = screen.getByLabelText("Action 1");
    await act(async () => {
      fireEvent.press(item);
    });

    expect(onSelect).toHaveBeenCalled();
  });
});
