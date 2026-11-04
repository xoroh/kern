/**
 * Part A P1 — native Accordion behaviour, test half only.
 *
 * Boundary: accordion/collapsible a11y lives in Part B — these rows assert
 * open-state behaviour only (single-toggle, multiple, controlled, naming).
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Accordion } from "./accordion";
import { Text } from "./text";

const SECTIONS = [
  { title: "Fares", content: "Fare rules" },
  { title: "Fleet", content: "Fleet rules" },
];

describe("Accordion (native P1)", () => {
  it("renders every section title with contents hidden", async () => {
    await render(<Accordion sections={SECTIONS} />);
    expect(screen.getByText("Fares")).toBeTruthy();
    expect(screen.getByText("Fleet")).toBeTruthy();
    expect(screen.queryByText("Fare rules")).toBeNull();
    expect(screen.queryByText("Fleet rules")).toBeNull();
  });

  it("opens a section on press and marks it expanded", async () => {
    await render(<Accordion sections={SECTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    expect(screen.getByText("Fare rules")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Fares", expanded: true }),
    ).toBeTruthy();
  });

  it("closes an open section on a second press (single-toggle)", async () => {
    await render(<Accordion sections={SECTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    expect(screen.queryByText("Fare rules")).toBeNull();
  });

  it("keeps only one section open at a time by default", async () => {
    await render(<Accordion sections={SECTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fleet" }));
    });
    expect(screen.queryByText("Fare rules")).toBeNull();
    expect(screen.getByText("Fleet rules")).toBeTruthy();
  });

  it("holds several sections open with multiple", async () => {
    await render(<Accordion sections={SECTIONS} multiple />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fleet" }));
    });
    expect(screen.getByText("Fare rules")).toBeTruthy();
    expect(screen.getByText("Fleet rules")).toBeTruthy();
  });

  it("mounts sections open with defaultValue", async () => {
    await render(<Accordion sections={SECTIONS} defaultValue={[1]} />);
    expect(screen.queryByText("Fare rules")).toBeNull();
    expect(screen.getByText("Fleet rules")).toBeTruthy();
  });

  it("reports without moving a controlled value", async () => {
    const seen: number[][] = [];
    await render(
      <Accordion
        sections={SECTIONS}
        value={[]}
        onValueChange={(v: number[]) => seen.push(v)}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Fares" }));
    });
    expect(seen).toEqual([[0]]);
    // The host owns the value and has not agreed yet.
    expect(screen.queryByText("Fare rules")).toBeNull();
  });

  it("names a header with its accessibilityLabel", async () => {
    await render(
      <Accordion
        sections={[
          {
            title: "Fares",
            content: "Fare rules",
            accessibilityLabel: "Fare section",
          },
        ]}
      />,
    );
    expect(screen.queryByRole("button", { name: "Fare section" })).toBeTruthy();
  });

  it("renders node content, not just strings", async () => {
    await render(
      <Accordion
        sections={[{ title: "Fares", content: <Text>Rich rules</Text> }]}
        defaultValue={[0]}
      />,
    );
    expect(screen.getByText("Rich rules")).toBeTruthy();
  });
});
