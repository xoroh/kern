import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { CheckboxGroup, CheckboxGroupItem } from "./checkbox-group";

/**
 * Behaviour only — no platform internals named beyond the accessibility axes
 * themselves, which are the contract. Each test says what a user or a screen
 * reader can observe.
 */
describe("CheckboxGroup", () => {
  it("starts with nothing checked", async () => {
    await render(
      <CheckboxGroup accessibilityLabel="Filters">
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    expect(
      screen.getByLabelText("Alpha").props.accessibilityState.checked,
    ).toBe(false);
  });

  it("starts from defaultValue", async () => {
    await render(
      <CheckboxGroup defaultValue={["a"]} accessibilityLabel="Filters">
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
        <CheckboxGroupItem value="b">Beta</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    expect(
      screen.getByLabelText("Alpha").props.accessibilityState.checked,
    ).toBe(true);
    expect(screen.getByLabelText("Beta").props.accessibilityState.checked).toBe(
      false,
    );
  });

  /**
   * The behavioural difference from RadioGroup, and the reason this component
   * exists separately: MULTIPLE items may be checked at once.
   */
  it("allows several items checked simultaneously", async () => {
    const onValueChange = jest.fn();
    await render(
      <CheckboxGroup onValueChange={onValueChange} accessibilityLabel="Filters">
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
        <CheckboxGroupItem value="b">Beta</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    await act(async () => {
      fireEvent.press(screen.getByLabelText("Alpha"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Beta"));
    });

    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    expect(
      screen.getByLabelText("Alpha").props.accessibilityState.checked,
    ).toBe(true);
    expect(screen.getByLabelText("Beta").props.accessibilityState.checked).toBe(
      true,
    );
  });

  /** Additive mode also means activating a CHECKED item UNCHECKS it. */
  it("unchecks an item when it is pressed again", async () => {
    const onValueChange = jest.fn();
    await render(
      <CheckboxGroup
        defaultValue={["a", "b"]}
        onValueChange={onValueChange}
        accessibilityLabel="Filters"
      >
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
        <CheckboxGroupItem value="b">Beta</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    await act(async () => {
      fireEvent.press(screen.getByLabelText("Alpha"));
    });
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
    expect(
      screen.getByLabelText("Alpha").props.accessibilityState.checked,
    ).toBe(false);
  });

  it("exposes the group itself to assistive tech", async () => {
    await render(
      <CheckboxGroup accessibilityLabel="Filters">
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    const group = screen.getByLabelText("Filters");
    expect(group.props.accessibilityRole).toBe("group");
  });

  /**
   * A checkbox reports `checked`, not `selected`. RadioGroup uses `selected`
   * because that is RN's `radio` mapping; using the wrong axis here would be
   * silently ignored by the platform.
   */
  it("reports the checked axis, not selected", async () => {
    await render(
      <CheckboxGroup defaultValue={["a"]} accessibilityLabel="Filters">
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    const state = screen.getByLabelText("Alpha").props.accessibilityState;
    expect(state.checked).toBe(true);
    expect(state.selected).toBeUndefined();
  });

  it("disables every item when the group is disabled", async () => {
    const onValueChange = jest.fn();
    await render(
      <CheckboxGroup
        disabled
        onValueChange={onValueChange}
        accessibilityLabel="F"
      >
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    const item = screen.getByLabelText("Alpha");
    expect(item.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(item);
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("honours a per-item disabled override", async () => {
    const onValueChange = jest.fn();
    await render(
      <CheckboxGroup onValueChange={onValueChange} accessibilityLabel="F">
        <CheckboxGroupItem value="a" disabled>
          Alpha
        </CheckboxGroupItem>
        <CheckboxGroupItem value="b">Beta</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    await act(async () => {
      fireEvent.press(screen.getByLabelText("Alpha"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Beta"));
    });
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });

  it("reports the normalised array to a controlled host", async () => {
    const onValueChange = jest.fn();
    await render(
      <CheckboxGroup
        value={[]}
        onValueChange={onValueChange}
        accessibilityLabel="F"
      >
        <CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    await act(async () => {
      fireEvent.press(screen.getByLabelText("Alpha"));
    });
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  it("refuses to render an item outside a group", async () => {
    // A missing provider would otherwise be a null-dereference deep in the item,
    // which reads as a crash rather than as a usage error.
    //
    // `render` is ASYNC here, so the throw surfaces as a rejected promise rather
    // than synchronously — `expect(() => render(...)).toThrow()` passes against
    // an implementation that genuinely does throw. Assert on the rejection.
    await expect(
      render(<CheckboxGroupItem value="a">Alpha</CheckboxGroupItem>),
    ).rejects.toThrow(/must be rendered inside CheckboxGroup/);
  });
});
