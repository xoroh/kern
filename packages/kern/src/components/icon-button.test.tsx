import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button";

/**
 * P2-1 proof, item 3 of 7: the icon button.
 *
 * The component's doc comment makes an accessibility contract. These assert the
 * behaviour it claims, and where the claim was false the comment is corrected
 * rather than the test written to match the bug.
 */
describe("IconButton", () => {
  // An icon-only button with no accessible name is announced as nothing. The
  // name must land on the element itself.
  it("carries the accessible name on the element", () => {
    render(<IconButton icon={<svg />} label="Add booking" />);
    expect(
      screen.getByRole("button", { name: "Add booking" }),
    ).toBeInTheDocument();
  });

  // M3 puts the label in a tooltip; kern keeps ONE prop driving both the
  // announced name and the visible tooltip, so they cannot drift apart.
  it("renders the tooltip from the same label prop", () => {
    render(<IconButton icon={<svg />} label="Add booking" />);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Add booking");
  });

  // The icon is decorative; the name is on the button. Announcing both would
  // read the icon's own label on top of the action name.
  it("hides the icon glyph from assistive tech", () => {
    const { container } = render(<IconButton icon={<svg />} label="Add" />);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  // ---------------------------------------------------------------------
  // Toggle state — "the variant that actually carries state"
  // ---------------------------------------------------------------------

  it("is not a toggle button unless toggle is set", () => {
    render(<IconButton icon={<svg />} label="Add" />);
    // A plain button wearing a selected colour is exactly the state a screen
    // reader cannot see, so aria-pressed must be ABSENT, not false.
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("exposes uncontrolled toggle state as aria-pressed", async () => {
    const user = userEvent.setup();
    render(<IconButton icon={<svg />} label="Star" toggle />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("honours defaultPressed", () => {
    render(<IconButton icon={<svg />} label="Star" toggle defaultPressed />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  // A controlled toggle must reflect the prop, not move its own — otherwise the
  // visual state and the host's state disagree.
  it("reports toggle changes without moving a controlled value", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <IconButton
        icon={<svg />}
        label="Star"
        toggle
        pressed={false}
        onPressedChange={onPressedChange}
      />,
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    // Still false: the host owns it.
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  // The spread comes FIRST in the source so a host's own onClick cannot
  // overwrite the toggle. Spreading last silently disables the toggle, and only
  // for consumers who pass onClick — so this test exists to keep that ordering.
  it("still toggles when the host passes its own onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<svg />} label="Star" toggle onClick={onClick} />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks the pressed state with data-selected", async () => {
    const user = userEvent.setup();
    render(<IconButton icon={<svg />} label="Star" toggle />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("data-selected");
    await user.click(button);
    expect(button).toHaveAttribute("data-selected", "true");
  });

  it("exposes the variant as data-variant", () => {
    render(<IconButton icon={<svg />} label="Add" variant="tonal" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "tonal");
  });

  // ---------------------------------------------------------------------
  // Disabled
  // ---------------------------------------------------------------------

  it("disables the button", () => {
    render(<IconButton icon={<svg />} label="Add" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton icon={<svg />} label="Add" disabled onClick={onClick} />,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  // The component's own doc comment claimed `disabled` PLUS `aria-disabled`
  // "so the state survives any host that re-enables pointer events". That is
  // false: no aria-disabled attribute is rendered. The native `disabled`
  // attribute is what actually removes it from the tab order, and that is what
  // the test pins. The comment is corrected in this commit.
  it("relies on the native disabled attribute, which removes it from the tab order", async () => {
    const user = userEvent.setup();
    render(
      <>
        <IconButton icon={<svg />} label="Add" disabled />
        <IconButton icon={<svg />} label="Remove" />
      </>,
    );
    await user.tab();
    // Tab lands on the enabled button only.
    expect(screen.getByRole("button", { name: "Remove" })).toHaveFocus();
  });

  // ---------------------------------------------------------------------
  // Dev-time name warning
  // ---------------------------------------------------------------------

  it("warns in development when the accessible name is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon={<svg />} />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("`label` is missing"),
    );
    warn.mockRestore();
  });

  it("renders no tooltip when there is no label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon={<svg />} />);
    expect(screen.queryByRole("tooltip")).toBeNull();
    warn.mockRestore();
  });

  it("does not warn when the label is supplied", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon={<svg />} label="Add" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  // ---------------------------------------------------------------------
  // Variants + sizes
  // ---------------------------------------------------------------------

  it("applies the tonal variant's container colours", () => {
    render(<IconButton icon={<svg />} label="Add" variant="tonal" />);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-(--md-sys-color-secondary-container)",
      "text-(--md-sys-color-on-secondary-container)",
    );
  });

  it("applies the filled variant", () => {
    render(<IconButton icon={<svg />} label="Add" variant="filled" />);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-(--md-sys-color-surface-container-highest)",
    );
  });

  it("applies the outlined variant", () => {
    render(<IconButton icon={<svg />} label="Add" variant="outlined" />);
    expect(screen.getByRole("button").className).toContain("border");
  });

  // The 40dp visual box keeps an `after:` inset out to the M3 minimum touch
  // target. The inset lives on the class, not on a real element, so the
  // assertion is on the class — it is what a host inspecting DevTools sees.
  it("keeps a 48dp touch target via an inset pseudo-element", () => {
    const { container } = render(<IconButton icon={<svg />} label="Add" />);
    const className = container.querySelector("button")?.className ?? "";
    expect(className).toContain("after:-inset-2");
  });

  it.each([
    ["sm", "size-8"],
    ["default", "size-10"],
    ["lg", "size-12"],
  ] as const)("applies the %s size", (size, expected) => {
    render(<IconButton icon={<svg />} label="Add" size={size} />);
    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it("defaults type to button so it cannot submit a form by accident", () => {
    render(<IconButton icon={<svg />} label="Add" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
