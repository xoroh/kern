import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FabMenu } from "./fab-menu";

/**
 * P2-1 proof, item 5 of 7: the FAB menu.
 *
 * The component is composed on the Base UI menu root, so roving focus,
 * typeahead, Escape and focus-return are the primitive's. What kern owns — and
 * what these assert — is the FAB-shaped trigger, the open-state cue, and the
 * guarantee that selecting an action dismisses the menu.
 */
const ACTIONS = [
  { key: "new", label: "New booking", onSelect: vi.fn() },
  { key: "edit", label: "Edit booking", onSelect: vi.fn() },
  { key: "delete", label: "Delete booking", disabled: true, onSelect: vi.fn() },
];

/**
 * Find the trigger by its slot, NOT by guessing a label: each fixture names its
 * actions differently, and a name-regex helper fails on the fixtures it does not
 * anticipate — which reads as a component failure.
 */
function trigger(): HTMLElement {
  const el = document.querySelector<HTMLElement>(
    "[data-slot='fab-menu-trigger']",
  );
  if (!el) throw new Error("no FAB menu trigger rendered");
  return el;
}

/**
 * Open the menu with the KEYBOARD, not a click.
 *
 * Base UI's Menu.Trigger opens on pointerdown past a small movement threshold,
 * and `fireEvent.click` dispatches no pointer sequence at all, so a click-based
 * helper silently does nothing: no error, no menu, `aria-expanded` stuck at
 * "false". ArrowDown is the primitive's own open path and is what a keyboard
 * user does anyway, so the tests drive the real path.
 *
 * This cost real time to diagnose because it presents as a component bug. The
 * polyfills it needed first (setPointerCapture & friends, absent from jsdom)
 * live in `vitest.setup.ts` with the same explanation.
 */
async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  const button = trigger();
  button.focus();
  await user.keyboard("{ArrowDown}");
  await screen.findByRole("menu");
  return button;
}

describe("FabMenu", () => {
  // ---------------------------------------------------------------
  // The trigger is a FAB that opens a MENU, not a button that fires.
  // ---------------------------------------------------------------

  // A FAB that silently opens a menu is announced as a plain button, so the
  // user has no idea pressing it produces a list rather than an action.
  it("announces that it opens a menu, before it is pressed", () => {
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    const button = trigger();
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("is a FAB in shape — 56dp, primary container, level-3 elevation", () => {
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    const className = trigger().className;
    expect(className).toContain("size-14");
    expect(className).toContain("bg-(--md-sys-color-primary)");
    expect(className).toContain("shadow-(--md-sys-elevation-level3)");
    expect(className).toContain("rounded-(--md-sys-shape-corner-large)");
  });

  // M3's open-state cue is a ROTATION of the icon, not a colour swap.
  it("shows open state by rotating, not by swapping colour", () => {
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    // The rotation is a data-attribute-driven transform.
    expect(trigger().className).toContain("data-[open]:rotate-90");
  });

  it("defaults the trigger name to the first action's label", () => {
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    expect(
      screen.getByRole("button", { name: "New booking" }),
    ).toBeInTheDocument();
  });

  it("prefers an explicit label", () => {
    render(<FabMenu icon={<svg />} label="Compose" actions={ACTIONS} />);
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
  });

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  it("opens the menu on trigger activation", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    expect(screen.queryByRole("menu")).toBeNull();
    await openMenu(user);
    expect(screen.getByRole("menuitem", { name: "New booking" })).toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  // Escape closing AND returning focus is the composed-primitive claim. A
  // keyboard user dropped at the top of the document is the failure this
  // prevents, so the focus assertion is the one that matters.
  it("closes on Escape and returns focus to the FAB", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    const button = await openMenu(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(button).toHaveFocus();
  });

  it("swaps to the open icon when open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FabMenu
        icon={<span data-testid="closed-icon" />}
        openIcon={<span data-testid="open-icon" />}
        actions={ACTIONS}
      />,
    );
    await openMenu(user);
    expect(container.querySelector("[data-testid='open-icon']")).not.toBeNull();
  });

  // ---------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------

  it("runs the selected action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <FabMenu
        icon={<svg />}
        actions={[{ key: "a", label: "New booking", onSelect }]}
      />,
    );
    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "New booking" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  // The host never closes by hand and cannot forget to — that is the whole
  // reason actions are data rather than composed children.
  it("dismisses the menu after an action is chosen", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "Edit booking" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("announces a disabled action as disabled and refuses to choose it", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <FabMenu
        icon={<svg />}
        actions={[
          { key: "ok", label: "Keep", onSelect },
          { key: "no", label: "Delete", disabled: true, onSelect },
        ]}
      />,
    );
    await openMenu(user);
    const del = screen.getByRole("menuitem", { name: "Delete" });
    expect(del).toHaveAttribute("data-disabled");
    expect(del).toHaveAttribute("aria-disabled", "true");
    await user.click(del);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders a separator before a separated action", async () => {
    const user = userEvent.setup();
    render(
      <FabMenu
        icon={<svg />}
        actions={[
          { key: "a", label: "One" },
          { key: "b", label: "Two", separated: true },
        ]}
      />,
    );
    await openMenu(user);
    // Asserted by ROLE, not by a guessed data-slot: Base UI's Separator renders
    // role="separator" with no data-slot, so a slot selector here would have
    // failed against a correct implementation.
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  // The `key !== actions[0]?.key` guard in the source means a first action
  // marked `separated` draws no leading rule. Asserted because a leading
  // separator above the first item is a visible layout bug.
  it("draws no leading separator before the first action", async () => {
    const user = userEvent.setup();
    render(
      <FabMenu
        icon={<svg />}
        actions={[
          { key: "a", label: "One", separated: true },
          { key: "b", label: "Two" },
        ]}
      />,
    );
    await openMenu(user);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  // ---------------------------------------------------------------
  // Controlled / uncontrolled
  // ---------------------------------------------------------------

  // The source comments a real trap: feeding internal state back as `open`
  // makes the root permanently controlled, so setOpen updates a value nothing
  // reads and the menu can NEVER open — a controlled-looking prop that silently
  // kills the component. This test is the regression guard for that.
  it("opens when uncontrolled, without the open prop being fed back", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    await openMenu(user);
  });

  /**
   * The source names this trap explicitly:
   *
   *   "`open` is passed ONLY when the host controls it. Feeding the internal
   *   state back in as `open` would make the root permanently controlled, so
   *   `setOpen` would update a value nothing reads and the menu could never
   *   open — a controlled-looking prop that silently kills the component."
   *
   * Writing that test found the trap was NOT covered: feeding `open={isOpen}`
   * unconditionally leaves every test in this file green, because nothing else
   * opens the menu a second time in the uncontrolled case. `setOpen` then
   * updates state the root never reads, so the menu silently never opens —
   * and no existing assertion notices.
   *
   * The regression has to be driven as a USER would hit it: open, then close
   * again. A single open cannot distinguish the two implementations.
   */
  it("still opens after being closed, when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    await openMenu(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    // Re-open. With `open` fed back unconditionally this is where the component
    // is dead: setOpen writes a value the root ignores and nothing appears.
    await openMenu(user);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("re-opens after selecting an action, when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={<svg />} actions={ACTIONS} />);
    await openMenu(user);
    await user.click(screen.getByRole("menuitem", { name: "New booking" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    // The second open is the one that matters: a permanently-controlled root
    // handles the first open and then goes silent forever.
    await openMenu(user);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("reports open state without moving a controlled open prop", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FabMenu
        icon={<svg />}
        actions={ACTIONS}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Still closed: the host owns it.
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("honours defaultOpen", async () => {
    render(<FabMenu icon={<svg />} actions={ACTIONS} defaultOpen />);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });
});