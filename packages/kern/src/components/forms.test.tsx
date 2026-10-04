import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "./checkbox-group";
import { Drawer } from "./drawer";
import { Fieldset } from "./fieldset";
import { Form } from "./form";
import { InputOTP } from "./input-otp";
import { NativeSelect } from "./native-select";
import { NumberField } from "./number-field";
import { Search } from "./search";
import { Sheet } from "./sheet";
import { Slider } from "./slider";

describe("Fieldset", () => {
  it("groups controls under a legend", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Address</Fieldset.Legend>
        <input aria-label="Street" />
      </Fieldset.Root>,
    );
    expect(screen.getByRole("group", { name: "Address" })).toBeInTheDocument();
  });

  it("disables the whole group", () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Address</Fieldset.Legend>
        <input aria-label="Street" />
      </Fieldset.Root>,
    );
    expect(screen.getByLabelText("Street")).toBeDisabled();
  });
});

describe("Form", () => {
  it("submits values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <input name="email" aria-label="Email" defaultValue="a@b.co" />
        <button type="submit">Send</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("NumberField", () => {
  it("steps the value with buttons", async () => {
    const user = userEvent.setup();
    render(
      <NumberField.Root defaultValue={4}>
        <NumberField.Input aria-label="Quantity" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("textbox", { name: "Quantity" });
    expect(input).toHaveValue("4");
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("5");
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(input).toHaveValue("3");
  });

  it("holds at the bounds instead of wrapping", async () => {
    // Edge composition, carried from the move-5 Group lesson: the clamp
    // range is the whole reason the min/max knobs exist, so the test pins
    // both bounds. Sensitivity-proven: the same assertions against an
    // unbounded render fail (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <NumberField.Root defaultValue={9} min={0} max={10} step={5}>
        <NumberField.Input aria-label="Clamped" />
      </NumberField.Root>,
    );
    const input = screen.getByRole("textbox", { name: "Clamped" });
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("10");
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("10");
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(input).toHaveValue("5");
  });
});

describe("InputOTP", () => {
  it("renders one box per character", () => {
    render(
      <InputOTP.Root length={4} aria-label="Code">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>,
    );
    const group = screen.getByRole("group", { name: "Code" });
    expect(within(group).getAllByRole("textbox")).toHaveLength(4);
  });
});

describe("NativeSelect", () => {
  it("selects an option", async () => {
    const user = userEvent.setup();
    render(
      <NativeSelect aria-label="Country" defaultValue="de">
        <option value="de">Germany</option>
        <option value="fr">France</option>
      </NativeSelect>,
    );
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("de");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Country" }),
      "fr",
    );
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("fr");
  });
});

describe("Search", () => {
  it("submits the query and clears", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    render(<Search label="Docs" onSearch={(q) => seen.push(q)} />);
    const input = screen.getByRole("searchbox", { name: "Docs" });
    await user.type(input, "tokens");
    await user.keyboard("{Enter}");
    expect(seen).toEqual(["tokens"]);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
  });
});

describe("CheckboxGroup", () => {
  it("checks multiple values", async () => {
    const user = userEvent.setup();
    render(
      <CheckboxGroup.Root aria-label="Toppings" defaultValue={["cheese"]}>
        <CheckboxGroup.Item value="cheese" label="Cheese" />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Salami" }));
    expect(screen.getByRole("checkbox", { name: "Salami" })).toBeChecked();
  });
});

describe("Slider", () => {
  it("moves with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Slider.Root defaultValue={30}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Thumb aria-label="Volume" />
        <Slider.Value />
      </Slider.Root>,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "31");
  });

  it("moves each thumb independently in range mode", async () => {
    // Edge composition, carried from the move-5 Group lesson: two thumbs
    // share one root and must not move together. Sensitivity-proven: the
    // same assertions against a single-thumb render fail (one slider, not
    // two, and no Minimum/Maximum names).
    const user = userEvent.setup();
    render(
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
        <Slider.Thumb aria-label="Minimum volume" />
        <Slider.Thumb aria-label="Maximum volume" />
      </Slider.Root>,
    );
    const min = screen.getByRole("slider", { name: "Minimum volume" });
    const max = screen.getByRole("slider", { name: "Maximum volume" });
    expect(min).toHaveAttribute("aria-valuenow", "20");
    expect(max).toHaveAttribute("aria-valuenow", "80");
    min.focus();
    await user.keyboard("{ArrowRight}");
    expect(min).toHaveAttribute("aria-valuenow", "21");
    expect(max).toHaveAttribute("aria-valuenow", "80");
  });
});

describe("Drawer", () => {
  it("opens from the trigger and closes", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Filters</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Filter results</Drawer.Title>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Sheet", () => {
  it("opens a side panel with a title", async () => {
    const user = userEvent.setup();
    render(
      <Sheet.Root>
        <Sheet.Trigger>Details</Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Title>Order 42</Sheet.Title>
          <Sheet.Description>Summary.</Sheet.Description>
        </Sheet.Content>
      </Sheet.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Order 42")).toBeInTheDocument();
  });
});
