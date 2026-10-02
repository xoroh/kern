import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import {
  IconButton,
  IconButtonTarget,
  iconButtonStyles,
  pressIsCancelled,
} from "./icon-button";

/**
 * Behaviour only. The two things that matter and are easy to get wrong:
 * the toggle state is announced, and the control is never unnamed.
 */
describe("IconButton", () => {
  it("is a named button", async () => {
    await render(<IconButton label="Bold" />);
    const el = screen.getByLabelText("Bold");
    expect(el.props.accessibilityRole).toBe("button");
    expect(el.props.accessibilityLabel).toBe("Bold");
  });

  it("renders its icon as children", async () => {
    await render(
      <IconButton label="Bold">
        <RNText>B</RNText>
      </IconButton>,
    );
    expect(screen.getByText("B")).toBeTruthy();
  });

  /**
   * The state a screen reader cannot see. A toggle icon button with no
   * `selected` is "a plain button wearing a selected colour".
   */
  it("reports the toggle state", async () => {
    await render(<IconButton label="Bold" defaultPressed />);
    expect(
      screen.getByLabelText("Bold").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("starts unpressed and reports pressing", async () => {
    const onPressedChange = jest.fn();
    await render(<IconButton label="Bold" onPressedChange={onPressedChange} />);
    const el = screen.getByLabelText("Bold");
    expect(el.props.accessibilityState.selected).toBe(false);

    await act(async () => {
      fireEvent.press(el);
    });
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByLabelText("Bold").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("unchecks on a second press", async () => {
    const onPressedChange = jest.fn();
    await render(
      <IconButton
        label="Bold"
        defaultPressed
        onPressedChange={onPressedChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Bold"));
    });
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it("honours a controlled pressed state", async () => {
    const onPressedChange = jest.fn();
    await render(
      <IconButton
        label="Bold"
        pressed={false}
        onPressedChange={onPressedChange}
      />,
    );
    const el = screen.getByLabelText("Bold");
    expect(el.props.accessibilityState.selected).toBe(false);
    await act(async () => {
      fireEvent.press(el);
    });
    // The host was told, and did not move: the control stays where it was put.
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByLabelText("Bold").props.accessibilityState.selected,
    ).toBe(false);
  });

  it("does not toggle when disabled", async () => {
    const onPressedChange = jest.fn();
    await render(
      <IconButton label="Bold" disabled onPressedChange={onPressedChange} />,
    );
    const el = screen.getByLabelText("Bold");
    expect(el.props.accessibilityState.disabled).toBe(true);
    await act(async () => {
      fireEvent.press(el);
    });
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  /**
   * A button reports `selected`; a checkbox reports `checked`. Using the wrong
   * axis here would be silently ignored by the platform.
   */
  it("uses the selected axis, not checked", async () => {
    await render(<IconButton label="Bold" defaultPressed />);
    const state = screen.getByLabelText("Bold").props.accessibilityState;
    expect(state.checked).toBeUndefined();
  });

  /**
   * The press-cancellation guard, tested through the exported predicate.
   *
   * Not driven through `fireEvent.press`: RNTL's synthetic press event exposes
   * both `preventDefault()` and `isDefaultPrevented()`, but the latter is a no-op
   * stub returning `false` even after `preventDefault()` was called. Verified by
   * probe, not assumed. Testing the predicate is the only honest coverage.
   *
   * Worth knowing: the same stub means this guard is unverified in Checkbox,
   * Toggle and the menus, which all inline the same check. The predicate is
   * offered as the version that CAN be tested.
   */
  it("honours a cancelled press", async () => {
    let prevented = false;
    const event = {
      preventDefault: () => {
        prevented = true;
      },
      isDefaultPrevented: () => prevented,
    };
    expect(pressIsCancelled(event)).toBe(false); // nothing cancelled it
    event.preventDefault();
    expect(pressIsCancelled(event)).toBe(true); // now it has
  });

  it("treats an absent event as not cancelled", async () => {
    expect(pressIsCancelled()).toBe(false);
    expect(pressIsCancelled({})).toBe(false);
  });

  /** 40dp visual box, 48dp hit area — an icon has no text to give it size. */
  it("keeps a 48dp touch target around a 40dp box", async () => {
    await render(<IconButton label="Bold" />);
    const el = screen.getByLabelText("Bold");
    expect(el.props.hitSlop).toEqual({ top: 4, bottom: 4, left: 4, right: 4 });
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain('"width":40');
  });
});

describe("IconButtonTarget", () => {
  it("guarantees the 48dp minimum", async () => {
    await render(
      <IconButtonTarget>
        <RNText>x</RNText>
      </IconButtonTarget>,
    );
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain('"minWidth":48');
    expect(tree).toContain('"minHeight":48');
  });
});

describe("iconButtonStyles", () => {
  it("gives filled and tonal a container, standard none", async () => {
    expect(
      iconButtonStyles("filled", false, false).backgroundColor,
    ).toBeTruthy();
    expect(
      iconButtonStyles("tonal", false, false).backgroundColor,
    ).toBeTruthy();
    expect(
      iconButtonStyles("standard", false, false).backgroundColor,
    ).toBeUndefined();
  });

  it("outlines the outlined variant", async () => {
    expect(iconButtonStyles("outlined", false, false).borderWidth).toBe(1);
  });

  it("dims when disabled", async () => {
    expect(iconButtonStyles("filled", false, true).opacity).toBeLessThan(1);
  });

  it("stays square", async () => {
    const s = iconButtonStyles("filled", false, false);
    expect(s.width).toBe(s.height);
  });
});
