import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SplitButton } from "./split-button";

/**
 * P2-1 proof, item 6 of 7: the split button.
 *
 * M3 is explicit that the two halves must not be one element: a single button
 * that opens a menu on part of itself cannot be announced as either control. So
 * "two tab stops, two names" is the component's whole reason to exist, and that
 * is what these assert.
 */
const ACTIONS = [
  { key: "new", label: "New booking", onSelect: vi.fn() },
  { key: "edit", label: "Edit booking", onSelect: vi.fn() },
];

function primary(): HTMLElement {
  return document.querySelector(
    "[data-slot='split-button-primary']",
  ) as HTMLElement;
}

function overflow(): HTMLElement {
  return document.querySelector(
    "[data-slot='split-button-trigger']",
  ) as HTMLElement;
}

/**
 * Open via the KEYBOARD. Base UI's trigger opens on pointerdown past a
 * movement threshold, and a bare click dispatches no pointer sequence — so a
 * click-based helper silently does nothing here. ArrowDown is the primitive's own
 * open path. The same polyfills jsdom needs are in `vitest.setup.ts`.
 */
async function openOverflow(user: ReturnType<typeof userEvent.setup>) {
  overflow().focus();
  await user.keyboard("{ArrowDown}");
  await screen.findByRole("menu");
}

describe("SplitButton", () => {
  // ---------------------------------------------------------------
  // Two tab stops, two names
  // ---------------------------------------------------------------

  it("is two separately-named buttons, not one", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save more" }),
    ).toBeInTheDocument();
    // Distinct elements — the component's entire reason to exist.
    expect(primary()).not.toBe(overflow());
  });

  it("announces the overflow as opening a menu", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} />);
    expect(overflow()).toHaveAttribute("aria-haspopup", "menu");
    expect(overflow()).toHaveAttribute("aria-expanded", "false");
  });

  it("accepts a custom overflow name", () => {
    render(
      <SplitButton
        label="Save"
        onClick={vi.fn()}
        menuLabel="More actions"
        actions={ACTIONS}
      />,
    );
    expect(
      screen.getByRole("button", { name: "More actions" }),
    ).toBeInTheDocument();
  });

  it("reaches both halves with two tab stops", async () => {
    const user = userEvent.setup();
    render(<SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} />);
    await user.tab();
    expect(primary()).toHaveFocus();
    await user.tab();
    expect(overflow()).toHaveFocus();
  });

  // ---------------------------------------------------------------
  // The primary does NOT open the menu — the separation is the component
  // ---------------------------------------------------------------

  it("fires the primary action without opening the menu", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton label="Save" onClick={onClick} actions={ACTIONS} />);
    await user.click(primary());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens the menu without firing the primary action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton label="Save" onClick={onClick} actions={ACTIONS} />);
    await openOverflow(user);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(onClick).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------
  // Overflow actions
  // ---------------------------------------------------------------

  it("runs the selected overflow action and dismisses the menu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SplitButton
        label="Save"
        onClick={vi.fn()}
        actions={[{ key: "new", label: "New booking", onSelect }]}
      />,
    );
    await openOverflow(user);
    await user.click(screen.getByRole("menuitem", { name: "New booking" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("closes on Escape and returns focus to the overflow trigger", async () => {
    const user = userEvent.setup();
    render(<SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} />);
    await openOverflow(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(overflow()).toHaveFocus();
  });

  it("refuses to choose a disabled overflow action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SplitButton
        label="Save"
        onClick={vi.fn()}
        actions={[
          { key: "ok", label: "Keep", onSelect },
          { key: "no", label: "Delete", disabled: true, onSelect },
        ]}
      />,
    );
    await openOverflow(user);
    const del = screen.getByRole("menuitem", { name: "Delete" });
    expect(del).toHaveAttribute("aria-disabled", "true");
    await user.click(del);
    expect(onSelect).not.toHaveBeenCalled();
  });

  // With no actions there is no overflow half at all — rendering a trigger that
  // opens an empty menu would be a control that cannot do anything.
  it("renders no overflow trigger when there are no actions", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} actions={[]} />);
    expect(overflow()).toBeNull();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Disabled — BOTH halves
  // ---------------------------------------------------------------

  // "a split button whose overflow is live while its primary is dead is a trap"
  it("disables both halves together", () => {
    render(
      <SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} disabled />,
    );
    expect(primary()).toBeDisabled();
    expect(overflow()).toBeDisabled();
  });

  // The trap the component names: "a split button whose overflow is live while
  // its primary is dead is a trap". Disabled on BOTH the root and the trigger
  // independently — deleting either alone leaves the menu unreachable, and the
  // test asserts the observable outcome rather than which layer did it.
  it("cannot open the overflow menu while disabled", async () => {
    const user = userEvent.setup();
    render(
      <SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} disabled />,
    );
    // A disabled trigger is not focusable, so there is nothing to press.
    expect(overflow()).toBeDisabled();
    overflow().focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not fire the primary action when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton label="Save" onClick={onClick} actions={ACTIONS} disabled />,
    );
    await user.click(primary());
    expect(onClick).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------
  // Geometry that reads as ONE control
  // ---------------------------------------------------------------

  // "Two visibly separate buttons with a seam would be a button group, which is
  // a different component."
  it("splits the corner-full between the halves with an outline divider", () => {
    render(<SplitButton label="Save" onClick={vi.fn()} actions={ACTIONS} />);
    // The shared pill: full rounding on the container, one rounded corner each.
    const container = document.querySelector("[data-slot='split-button']");
    expect(container?.className).toContain(
      "rounded-(--md-sys-shape-corner-full)",
    );
    expect(primary().className).toContain(
      "rounded-s-(--md-sys-shape-corner-full)",
    );
    expect(overflow().className).toContain(
      "rounded-e-(--md-sys-shape-corner-full)",
    );
    // The M3 1dp outline divider between the halves.
    expect(overflow().className).toContain("border-s");
  });

  it("hides the primary icon from assistive tech", () => {
    const { container } = render(
      <SplitButton
        label="Save"
        icon={<svg />}
        onClick={vi.fn()}
        actions={ACTIONS}
      />,
    );
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });
});
