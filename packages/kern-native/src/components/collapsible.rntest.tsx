/**
 * Part A P1 — native Collapsible behaviour, test half only.
 *
 * Boundary: accordion/collapsible a11y lives in Part B — these rows assert
 * open-state behaviour only (toggle, default, controlled, naming).
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Collapsible } from "./collapsible";
import { Text } from "./text";

describe("Collapsible (native P1)", () => {
  it("renders the title with content hidden", async () => {
    await render(
      <Collapsible title="Details">
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    expect(screen.getByText("Details")).toBeTruthy();
    expect(screen.queryByText("Hidden rules")).toBeNull();
  });

  it("opens on press and marks itself expanded", async () => {
    await render(
      <Collapsible title="Details">
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Details" }));
    });
    expect(screen.getByText("Hidden rules")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Details", expanded: true }),
    ).toBeTruthy();
  });

  it("toggles closed on a second press", async () => {
    await render(
      <Collapsible title="Details">
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Details" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Details" }));
    });
    expect(screen.queryByText("Hidden rules")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Details", expanded: false }),
    ).toBeTruthy();
  });

  it("mounts open with defaultOpen", async () => {
    await render(
      <Collapsible title="Details" defaultOpen>
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    expect(screen.getByText("Hidden rules")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Details", expanded: true }),
    ).toBeTruthy();
  });

  it("reports without moving a controlled open prop", async () => {
    const states: boolean[] = [];
    await render(
      <Collapsible
        title="Details"
        open={false}
        onOpenChange={(open: boolean) => states.push(open)}
      >
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Details" }));
    });
    expect(states).toEqual([true]);
    // The host owns the prop and has not agreed yet.
    expect(screen.queryByText("Hidden rules")).toBeNull();
  });

  it("follows a controlled open prop", async () => {
    await render(
      <Collapsible title="Details" open>
        <Text>Hidden rules</Text>
      </Collapsible>,
    );
    expect(screen.getByText("Hidden rules")).toBeTruthy();
  });
});
