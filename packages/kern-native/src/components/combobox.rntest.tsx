import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Combobox } from "./combobox";

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
];

async function open() {
  await act(async () => {
    fireEvent.press(screen.getByLabelText("Pick a fruit"));
  });
}

describe("native Combobox", () => {
  it("shows the placeholder and opens the full list on trigger press", async () => {
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        placeholder="Pick one"
        options={OPTIONS}
      />,
    );
    expect(screen.getByText("Pick one")).toBeTruthy();
    expect(screen.queryByTestId("kern-combobox-filter")).toBeNull();
    await open();
    expect(screen.getByTestId("kern-combobox-filter")).toBeTruthy();
    expect(screen.getByLabelText("Apple")).toBeTruthy();
    expect(screen.getByLabelText("Apricot")).toBeTruthy();
    expect(screen.getByLabelText("Banana")).toBeTruthy();
  });

  it("filters as you type", async () => {
    await render(
      <Combobox accessibilityLabel="Pick a fruit" options={OPTIONS} />,
    );
    await open();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-combobox-filter"), "ap");
    });
    expect(screen.getByLabelText("Apple")).toBeTruthy();
    expect(screen.getByLabelText("Apricot")).toBeTruthy();
    expect(screen.queryByLabelText("Banana")).toBeNull();
  });

  it("shows the empty state when nothing matches", async () => {
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        options={OPTIONS}
        emptyMessage="Nothing grows here"
      />,
    );
    await open();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-combobox-filter"), "zzz");
    });
    expect(screen.getByText("Nothing grows here")).toBeTruthy();
    expect(screen.queryByLabelText("Apple")).toBeNull();
  });

  it("commits an option: reports, shows its label, and closes", async () => {
    let chosen = "";
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        options={OPTIONS}
        onValueChange={(value) => (chosen = value)}
      />,
    );
    await open();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Banana"));
    });
    expect(chosen).toBe("banana");
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.queryByTestId("kern-combobox-filter")).toBeNull();
  });

  it("announces selection on the chosen option", async () => {
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        options={OPTIONS}
        defaultValue="apple"
      />,
    );
    await open();
    // The option carries the web listbox role plus the selection axis.
    expect(screen.getByLabelText("Apple").props.role).toBe("option");
    expect(
      screen.getByLabelText("Apple").props.accessibilityState,
    ).toMatchObject({ selected: true });
    expect(
      screen.getByLabelText("Banana").props.accessibilityState,
    ).toMatchObject({ selected: false });
  });

  it("reflects a controlled value in the trigger", async () => {
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        options={OPTIONS}
        value="apricot"
      />,
    );
    expect(screen.getByText("Apricot")).toBeTruthy();
  });

  it("reports popup visibility through onOpenChange", async () => {
    const seen: boolean[] = [];
    await render(
      <Combobox
        accessibilityLabel="Pick a fruit"
        options={OPTIONS}
        onOpenChange={(open) => seen.push(open)}
      />,
    );
    await open();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Banana"));
    });
    expect(seen).toEqual([true, false]);
  });

  it("resets the filter when the popup is dismissed", async () => {
    await render(
      <Combobox accessibilityLabel="Pick a fruit" options={OPTIONS} />,
    );
    await open();
    await act(async () => {
      fireEvent.changeText(screen.getByTestId("kern-combobox-filter"), "ap");
    });
    expect(screen.queryByLabelText("Banana")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss Pick a fruit"));
    });
    await open();
    // Full list again: the transient query did not survive dismissal.
    expect(screen.getByLabelText("Banana")).toBeTruthy();
  });

  it("marks the trigger expanded while open", async () => {
    await render(
      <Combobox accessibilityLabel="Pick a fruit" options={OPTIONS} />,
    );
    // NOTE: captured before opening — once the Modal is open the trigger
    // sits outside it and RNTL hides it from accessible queries (the
    // platform behaviour `accessibilityViewIsModal` describes). The held
    // instance still reflects the latest props after `act`.
    const trigger = screen.getByLabelText("Pick a fruit");
    expect(trigger.props.accessibilityRole).toBe("button");
    expect(trigger.props.accessibilityState).toMatchObject({
      expanded: false,
    });
    await open();
    expect(trigger.props.accessibilityState).toMatchObject({
      expanded: true,
    });
  });
});
