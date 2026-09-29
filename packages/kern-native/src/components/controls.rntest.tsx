import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Checkbox } from "./checkbox";
import { Chip } from "./chip";
import { Field } from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";

describe("native Checkbox render", () => {
  it("toggles on press", async () => {
    await render(<Checkbox label="Accept" />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).not.toBeChecked();
    await act(async () => {
      fireEvent.press(screen.getByRole("checkbox", { name: "Accept" }));
    });
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });
});

describe("native Switch render", () => {
  it("toggles on press", async () => {
    await render(<Switch testID="power" />);
    expect(screen.getByTestId("power")).not.toBeChecked();
    await act(async () => {
      fireEvent.press(screen.getByTestId("power"));
    });
    expect(screen.getByTestId("power")).toBeChecked();
  });
});

describe("native RadioGroup render", () => {
  it("selects one child and renders its label", async () => {
    await render(
      <RadioGroup accessibilityLabel="Plan" defaultValue="free">
        <RadioGroupItem value="free">Free</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
      </RadioGroup>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Pro" }));
    });
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });
});

describe("native Chip render", () => {
  it("toggles filter chips and leaves action chips unselected", async () => {
    await render(
      <>
        <Chip variant="filter">Filter</Chip>
        <Chip variant="assist">Action</Chip>
      </>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Filter" }));
    });
    expect(screen.getByRole("button", { name: "Filter" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Action" })).not.toBeSelected();
  });
});

describe("native Field render", () => {
  it("connects its label and announces its error", async () => {
    await render(
      <Field.Root label="Email" error="Enter a valid email.">
        <Field.Control testID="email" />
      </Field.Root>,
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityLabel",
      "Email",
    );
    expect(screen.getByTestId("email")).toHaveProp(
      "accessibilityHint",
      "Enter a valid email.",
    );
    expect(
      screen.getByText("Enter a valid email.").props.accessibilityRole,
    ).toBe("alert");
  });
});
