import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "./checkbox-group";
import { Drawer } from "./drawer";
import { Field } from "./field";
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

  it("flags a cleared required field without submit in onChange mode", async () => {
    // Edge composition, carried from the move-5 Group lesson: the
    // validation knob changes WHEN the error appears, so the test pins the
    // timing — cleared while typing, no blur, no submit. Sensitivity-proven:
    // the same actions under the default onSubmit mode show nothing, and a
    // shut blur-only flow shows nothing either (scratch probes, RED
    // confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Form validationMode="onChange">
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <Field.Control aria-label="Full name" defaultValue="Ada" required />
          <Field.Error match="valueMissing">Please enter your name</Field.Error>
        </Field.Root>
        ,
      </Form>,
    );
    await user.clear(screen.getByRole("textbox", { name: "Full name" }));
    expect(
      await screen.findByText("Please enter your name"),
    ).toBeInTheDocument();
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

  it("masks slots as password inputs", () => {
    // Edge composition, carried from the move-5 Group lesson: the mask knob
    // changes the slots' rendered type, so the test pins no textbox
    // remaining. Sensitivity-proven: the same query on an unmasked render
    // finds four textboxes (scratch probe, RED confirmed, deleted).
    render(
      <InputOTP.Root length={4} mask aria-label="Code">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>,
    );
    const group = screen.getByRole("group", { name: "Code" });
    expect(within(group).queryAllByRole("textbox")).toHaveLength(0);
    expect(group.querySelectorAll('input[type="password"]')).toHaveLength(4);
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

  it("mounts prefilled and submits the preset", async () => {
    // Edge composition, carried from the move-5 Group lesson: the query
    // knob prefills the stage, so the test pins the preset submitted and
    // cleared. Sensitivity-proven: asserting a different query fails
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    const seen: string[] = [];
    render(
      <Search
        label="Docs"
        defaultValue="tokens"
        onSearch={(q) => seen.push(q)}
      />,
    );
    const input = screen.getByRole("searchbox", { name: "Docs" });
    expect(input).toHaveValue("tokens");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(seen).toEqual(["tokens"]);
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
  });

  it("renders the M3 anatomy (leading icon, icon clear action, trailing slot)", () => {
    const { container } = render(
      <Search
        label="Docs"
        defaultValue="tokens"
        leading={<span data-testid="avatar">A</span>}
        trailing={<span data-testid="overflow">…</span>}
      />,
    );
    // Leading slot takes the custom node instead of the default icon.
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="search-icon"]'),
    ).not.toBeInTheDocument();
    // Trailing slot renders beside the clear action, never inside it.
    expect(
      screen.getByTestId("overflow").closest('[data-slot="search-trailing"]'),
    ).not.toBeNull();
    // The clear action is an icon, not a × glyph.
    const clear = screen.getByRole("button", { name: "Clear search" });
    expect(clear.textContent).not.toContain("×");
    expect(
      clear.querySelector('[data-slot="search-clear-icon"]'),
    ).not.toBeNull();
  });

  it("defaults the leading slot to the search icon", () => {
    const { container } = render(<Search label="Docs" />);
    expect(
      container.querySelector('[data-slot="search-icon"]'),
    ).toBeInTheDocument();
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

  it("ignores clicks when the whole set is disabled", async () => {
    // Edge composition, carried from the move-5 Group lesson: the disabled
    // knob kills the entire set, so the test pins the dead boxes.
    // Sensitivity-proven: the same assertions on an enabled set fail
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <CheckboxGroup.Root disabled aria-label="Toppings">
        <CheckboxGroup.Item value="cheese" label="Cheese" />
        <CheckboxGroup.Item value="salami" label="Salami" />
      </CheckboxGroup.Root>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Salami" }));
    expect(screen.getByRole("checkbox", { name: "Salami" })).not.toBeChecked();
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

  it("paints the inactive track in surface-container-highest (M3, not surface-tonal)", () => {
    const { container } = render(
      <Slider.Root defaultValue={30}>
        <Slider.Thumb aria-label="Volume" />
      </Slider.Root>,
    );
    const track = container.querySelector('[data-slot="slider-track"]');
    expect(track).toHaveClass("bg-(--md-sys-color-surface-container-highest)");
    expect(track?.className).not.toContain("surface-tonal");
  });

  it("renders stop indicators for discrete sliders", () => {
    const { container } = render(
      <Slider.Root defaultValue={50} min={0} max={100} step={25} showTicks>
        <Slider.Thumb aria-label="Volume" />
      </Slider.Root>,
    );
    // Interior stops only (25/50/75) — endpoints are the track ends, not stops.
    const stops = container.querySelectorAll('[data-slot="slider-stop"]');
    expect(stops).toHaveLength(3);
    expect(stops[0]).toHaveClass("bg-(--md-sys-color-primary)");
  });

  it("renders no stops for continuous sliders", () => {
    const { container } = render(
      <Slider.Root defaultValue={30}>
        <Slider.Thumb aria-label="Volume" />
      </Slider.Root>,
    );
    expect(
      container.querySelectorAll('[data-slot="slider-stop"]'),
    ).toHaveLength(0);
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

  it("ignores outside clicks when pointer dismissal is disabled", async () => {
    // Edge composition, carried from the move-5 Group lesson: the guard is
    // the whole reason the knob exists, so the test pins the backdrop
    // going dead. Sensitivity-proven: the same assertions on an unguarded
    // drawer fail (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Drawer.Root disablePointerDismissal>
        <Drawer.Trigger>Filters</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Filter results</Drawer.Title>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
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
