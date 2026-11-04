import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { List } from "./list";

const inboxRow = { id: "a", title: "Inbox", supporting: "12 unread" };
const sentRow = { id: "b", title: "Sent", supporting: "Last 7 days" };
const rows = [inboxRow, sentRow];

describe("native List variants", () => {
  it("renders rows with title and supporting text", async () => {
    await render(<List rows={rows} accessibilityLabel="Mailbox" />);
    expect(screen.getByTestId("kern-list")).toBeTruthy();
    expect(screen.getByText("Inbox")).toBeTruthy();
    expect(screen.getByText("12 unread")).toBeTruthy();
  });

  it("one-line hides supporting text", async () => {
    await render(<List rows={rows} variant="one-line" />);
    expect(screen.queryByText("12 unread")).toBeNull();
  });

  it("selectable rows toggle through checkboxes with haptics", async () => {
    const seen: string[][] = [];
    const haptics: string[] = [];
    await render(
      <List
        rows={rows}
        variant="selectable"
        onSelectedChange={(ids) => seen.push(ids)}
        onHaptic={(event) => haptics.push(event)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Select Inbox"));
    });
    expect(seen).toEqual([["a"]]);
    expect(haptics).toEqual(["select"]);
  });

  it("expandable rows disclose panels with expanded state", async () => {
    await render(
      <List
        rows={[{ id: "a", title: "Details", panel: "Panel text" }]}
        variant="expandable"
      />,
    );
    expect(screen.queryByText("Panel text")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Expand Details"));
    });
    expect(screen.getByText("Panel text")).toBeTruthy();
    expect(screen.getByLabelText("Collapse Details")).toBeTruthy();
  });

  it("grouped renders section headers", async () => {
    await render(
      <List
        variant="grouped"
        sections={[
          { id: "s1", title: "Today", rows: [inboxRow] },
          { id: "s2", title: "Older", rows: [sentRow] },
        ]}
      />,
    );
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Older")).toBeTruthy();
  });

  it("loading announces busy, empty renders the fallback", async () => {
    const loading = await render(<List rows={rows} loading />);
    expect(screen.getByLabelText("Loading list")).toBeTruthy();
    await loading.unmount();
    await render(<List rows={[]} />);
    expect(screen.getByText("No items")).toBeTruthy();
  });

  it("row press reports the id with haptics", async () => {
    const pressed: string[] = [];
    const haptics: string[] = [];
    await render(
      <List
        rows={rows}
        variant="two-line"
        onRowPress={(id) => pressed.push(id)}
        onHaptic={(event) => haptics.push(event)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-list-row-a"));
    });
    expect(pressed).toEqual(["a"]);
    expect(haptics).toEqual(["press"]);
  });
});
