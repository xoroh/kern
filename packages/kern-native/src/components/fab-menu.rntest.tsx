/**
 * Part A P1 — native FabMenu states the family suite does not pin.
 *
 * fab-family.rntest.tsx owns the default name, open/select and icon-swap
 * rows; these rows cover the naming precedence, controlled/uncontrolled
 * open state, the empty-action fallback name and the separated-action path.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { FabMenu } from "./fab-menu";
import { Text } from "./text";

const ACTIONS = [
  { key: "new", label: "New" },
  { key: "edit", label: "Edit" },
];

describe("FabMenu states (native P1)", () => {
  it("prefers an explicit label over the first action", async () => {
    await render(
      <FabMenu icon={<Text>+</Text>} label="File actions" actions={ACTIONS} />,
    );
    expect(screen.queryByRole("button", { name: "File actions" })).toBeTruthy();
  });

  it("prefers menuLabel over both label and the first action", async () => {
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        label="File actions"
        menuLabel="More actions"
        actions={ACTIONS}
        testID="fm"
      />,
    );
    expect(screen.getByTestId("fm").props.accessibilityLabel).toBe(
      "More actions",
    );
  });

  it("mounts open with defaultOpen", async () => {
    await render(
      <FabMenu icon={<Text>+</Text>} actions={ACTIONS} defaultOpen />,
    );
    expect(
      screen.queryByRole("button", { name: "New", expanded: true }),
    ).toBeTruthy();
  });

  it("reports through onOpenChange when uncontrolled", async () => {
    const states: boolean[] = [];
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        actions={ACTIONS}
        onOpenChange={(open: boolean) => states.push(open)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    expect(states).toEqual([true]);
  });

  it("reports without moving a controlled open prop", async () => {
    const states: boolean[] = [];
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        actions={ACTIONS}
        open={false}
        onOpenChange={(open: boolean) => states.push(open)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    expect(states).toEqual([true]);
    // The host owns the prop and has not agreed yet.
    expect(
      screen.queryByRole("button", { name: "New", expanded: false }),
    ).toBeTruthy();
  });

  it("keeps the trigger icon while open when no openIcon is given", async () => {
    await render(<FabMenu icon={<Text>plus</Text>} actions={ACTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    expect(screen.getByText("plus")).toBeTruthy();
  });

  it("names an empty-action trigger Actions without opening a surface", async () => {
    await render(<FabMenu icon={<Text>+</Text>} actions={[]} testID="fm" />);
    expect(screen.getByTestId("fm").props.accessibilityLabel).toBe("Actions");
    await act(async () => {
      fireEvent.press(screen.getByTestId("fm"));
    });
    expect(screen.getByLabelText("Actions")).toBeTruthy();
  });

  it("selects through a separated action", async () => {
    let selected = "";
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        actions={[
          { key: "new", label: "New" },
          {
            key: "edit",
            label: "Edit",
            separated: true,
            onSelect: () => {
              selected = "edit";
            },
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Edit"));
    });
    expect(selected).toBe("edit");
  });
});
