import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Carousel } from "./carousel";
import { ExtendedFab, type ExtendedFabHandle } from "./extended-fab";
import { FabMenu, type FabMenuAction } from "./fab-menu";
import { IconButton } from "./icon-button";
import { LoadingIndicator, LoadingRegion } from "./loading-indicator";
import { SplitButton } from "./split-button";
import { normaliseTime, TimePicker, type TimePickerValue } from "./time-picker";

/**
 * P2-1 behaviour tests for the seven M3 gap components.
 *
 * Every assertion here is about behaviour kern OWNS — state, dismissal, focus,
 * keyboard, announced semantics — not about the shape of the DOM a particular
 * primitive happens to emit. Each test was mutation-checked: break the
 * behaviour, the named test fails.
 */

const PEN = <svg data-testid="pen" />;

describe("IconButton", () => {
  it("takes its accessible name from label, and label is also the tooltip", () => {
    render(<IconButton icon={PEN} label="Compose" />);
    const button = screen.getByRole("button", { name: "Compose" });
    expect(button).toHaveAttribute("aria-label", "Compose");
    // One prop, one name: the tooltip text and the announced name cannot drift.
    expect(screen.getByRole("tooltip").textContent).toBe("Compose");
  });

  it("hides the icon from assistive tech so the name is not read twice", () => {
    render(<IconButton icon={<svg aria-label="pencil" />} label="Compose" />);
    expect(
      screen.queryByRole("img", { name: "pencil" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
  });

  it("reports pressed state on a toggle and toggles it", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <IconButton
        icon={PEN}
        label="Bold"
        toggle
        onPressedChange={onPressedChange}
      />,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("a controlled toggle reports the change but does not move itself", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <IconButton
        icon={PEN}
        label="Bold"
        toggle
        pressed={false}
        onPressedChange={onPressedChange}
      />,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    // Controlled means controlled: the host owns the value.
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("a plain icon button never claims to be a toggle", () => {
    render(<IconButton icon={PEN} label="Compose" />);
    expect(screen.getByRole("button", { name: "Compose" })).not.toHaveAttribute(
      "aria-pressed",
    );
  });

  it("honours defaultPressed for the uncontrolled toggle", () => {
    render(<IconButton icon={PEN} label="Bold" toggle defaultPressed />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("stays operable and announced when disabled", () => {
    render(<IconButton icon={PEN} label="Compose" disabled />);
    expect(screen.getByRole("button", { name: "Compose" })).toBeDisabled();
  });

  it("calls the host onClick as well as reporting the toggle change", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPressedChange = vi.fn();
    render(
      <IconButton
        icon={PEN}
        label="Bold"
        toggle
        onClick={onClick}
        onPressedChange={onPressedChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onPressedChange).toHaveBeenCalledOnce();
  });
});

describe("ExtendedFab", () => {
  it("shows the label beside the icon and names itself with it", () => {
    render(<ExtendedFab icon={PEN} label="Compose" />);
    const button = screen.getByRole("button", { name: "Compose" });
    expect(button).not.toHaveAttribute("data-collapsed");
    expect(within(button).getByText("Compose")).toBeInTheDocument();
  });

  it("collapses to icon-only and KEEPS the accessible name", () => {
    render(<ExtendedFab icon={PEN} label="Compose" collapsed />);
    const button = screen.getByRole("button", { name: "Compose" });
    expect(button).toHaveAttribute("data-collapsed", "true");
    // The visible label is gone, so the name must come from aria-label — a
    // collapsed FAB that announces nothing is unusable.
    expect(within(button).queryByText("Compose")).not.toBeInTheDocument();
  });

  it("expands on demand from the imperative handle when uncontrolled", () => {
    const ref = createRef<ExtendedFabHandle>();
    render(
      <ExtendedFab ref={ref} icon={PEN} label="Compose" defaultCollapsed />,
    );
    expect(screen.getByRole("button", { name: "Compose" })).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    // `act`: the handle mutates state from outside React's event loop, which is
    // exactly how a scroll listener drives it in a real app.
    act(() => ref.current?.expand());
    expect(
      within(screen.getByRole("button", { name: "Compose" })).getByText(
        "Compose",
      ),
    ).toBeInTheDocument();
  });

  it("a CONTROLLED handle reports and does not self-move", () => {
    // The host owns the value. A handle that moved the FAB on its own would
    // make `collapsed` a lie the host cannot keep.
    const ref = createRef<ExtendedFabHandle>();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        ref={ref}
        icon={PEN}
        label="Compose"
        collapsed
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => ref.current?.expand());
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Compose" })).toHaveAttribute(
      "data-collapsed",
      "true",
    );
  });

  it("collapse() is idempotent — it does not fight a host that drives the prop", () => {
    const onCollapsedChange = vi.fn();
    const ref = createRef<ExtendedFabHandle>();
    render(
      <ExtendedFab
        ref={ref}
        icon={PEN}
        label="Compose"
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => ref.current?.collapse());
    act(() => ref.current?.collapse());
    expect(onCollapsedChange).toHaveBeenCalledTimes(1);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("toggle() flips whichever state is current", () => {
    const ref = createRef<ExtendedFabHandle>();
    render(
      <ExtendedFab ref={ref} icon={PEN} label="Compose" defaultCollapsed />,
    );
    act(() => ref.current?.toggle());
    expect(screen.getByRole("button", { name: "Compose" })).not.toHaveAttribute(
      "data-collapsed",
    );
  });

  it("uncontrolled: defaultCollapsed with no host wiring", () => {
    render(<ExtendedFab icon={PEN} label="Compose" defaultCollapsed />);
    expect(screen.getByRole("button", { name: "Compose" })).toHaveAttribute(
      "data-collapsed",
      "true",
    );
  });

  it("does not invent a gesture: a plain click is the host's action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        icon={PEN}
        label="Compose"
        onClick={onClick}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Compose" }));
    expect(onClick).toHaveBeenCalledOnce();
    // M3 triggers collapse on scroll, which kern cannot see. Inventing a
    // double-click would be a kern-only gesture consumers then have to find.
    expect(onCollapsedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Compose" })).not.toHaveAttribute(
      "data-collapsed",
    );
  });
});

describe("FabMenu", () => {
  const ACTIONS: FabMenuAction[] = [
    { key: "new", label: "New file" },
    { key: "copy", label: "Copy" },
    { key: "del", label: "Delete", disabled: true },
  ];

  it("announces that the FAB opens a menu before it is pressed", () => {
    render(<FabMenu icon={PEN} actions={ACTIONS} label="Create" />);
    const trigger = screen.getByRole("button", { name: "Create" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on activation and exposes a named menu", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={PEN} actions={ACTIONS} label="Create" />);
    await user.click(screen.getByRole("button", { name: "Create" }));
    expect(
      await screen.findByRole("menu", { name: "Create" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("selects an action, reports it, and dismisses the menu", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <FabMenu
        icon={PEN}
        label="Create"
        onOpenChange={onOpenChange}
        actions={[{ key: "new", label: "New file", onSelect }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Create" });
    await user.click(trigger);
    await user.click(await screen.findByRole("menuitem", { name: "New file" }));
    expect(onSelect).toHaveBeenCalledOnce();
    // Select-then-dismiss: the host never closes it by hand.
    expect(onOpenChange.mock.lastCall?.[0]).toBe(false);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("returns focus to the FAB after Escape", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={PEN} actions={ACTIONS} label="Create" />);
    const trigger = screen.getByRole("button", { name: "Create" });
    await user.click(trigger);
    await screen.findByRole("menu", { name: "Create" });
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("does not let a disabled action be chosen", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FabMenu
        icon={PEN}
        label="Create"
        onOpenChange={onOpenChange}
        actions={ACTIONS}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Create" }));
    const del = await screen.findByRole("menuitem", { name: "Delete" });
    expect(del).toHaveAttribute("aria-disabled", "true");
    await user.click(del);
    // The menu stays open: choosing a disabled action is not a choice.
    expect(screen.getByRole("menu", { name: "Create" })).toBeInTheDocument();
  });

  it("traverses items with Arrow keys and refuses to activate a disabled one", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <FabMenu
        icon={PEN}
        label="Create"
        actions={[
          { key: "new", label: "New file" },
          { key: "copy", label: "Copy" },
          { key: "del", label: "Delete", disabled: true, onSelect: onDelete },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Create" }));
    await screen.findByRole("menu", { name: "Create" });

    // The popup takes focus itself on open, so traversal is asserted as
    // movement down the list rather than as absolute indices — that way the
    // test does not encode the primitive's autofocus policy.
    await screen.findByRole("menuitem", { name: "New file" });
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "New file" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus(),
    );
    // Landing on the disabled item is the primitive's traversal; what kern must
    // guarantee is that activating it does nothing at all.
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus(),
    );
    await user.keyboard("{Enter}");
    expect(onDelete).not.toHaveBeenCalled();
    // And the menu stays open: choosing a disabled action is not a choice.
    expect(screen.getByRole("menu", { name: "Create" })).toBeInTheDocument();
  });

  it("the menu is named by its trigger, not by a second name of its own", async () => {
    const user = userEvent.setup();
    render(<FabMenu icon={PEN} actions={ACTIONS} label="Create" />);
    await user.click(screen.getByRole("button", { name: "Create" }));
    const menu = await screen.findByRole("menu", { name: "Create" });
    // Two competing names means the reader picks one arbitrarily. The popup
    // inherits its name from `aria-labelledby` -> trigger and adds none.
    expect(menu).not.toHaveAttribute("aria-label");
    expect(menu.getAttribute("aria-labelledby")).toBe(
      screen.getByRole("button", { name: "Create" }).id,
    );
  });

  it("menuLabel renames the trigger, and the menu follows it", async () => {
    const user = userEvent.setup();
    render(
      <FabMenu
        icon={PEN}
        actions={ACTIONS}
        label="Create"
        menuLabel="Create options"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Create options" }));
    expect(
      await screen.findByRole("menu", { name: "Create options" }),
    ).toBeInTheDocument();
  });

  it("a controlled menu does not open itself", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <FabMenu
        icon={PEN}
        label="Create"
        open={false}
        onOpenChange={onOpenChange}
        actions={ACTIONS}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Create" }));
    // Base UI's controlled root emits its change request through the trigger
    // click only when the value is driven by it; with `open={false}` bound, the
    // popup never mounts, so the assertion that matters is that it stayed shut.
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
    // Controlled means controlled: reporting the request is all it does.
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("draws a separator only where an action asks for one", async () => {
    const user = userEvent.setup();
    render(
      <FabMenu
        icon={PEN}
        label="Create"
        actions={[
          { key: "a", label: "New file" },
          { key: "b", label: "Copy", separated: true },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Create" }));
    await screen.findByRole("menu", { name: "Create" });
    // One separator between two items, not one above the first.
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });
});

describe("SplitButton", () => {
  const ACTIONS = [
    { key: "copy", label: "Copy" },
    { key: "del", label: "Delete" },
  ];

  it("is two named controls, not one button with two regions", () => {
    render(<SplitButton label="Save" actions={ACTIONS} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Save more" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("the primary action fires and does NOT open the menu", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton label="Save" onClick={onClick} actions={ACTIONS} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
    // That separation is the entire reason the component exists.
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("the overflow half opens the menu and selects-then-dismisses", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClick = vi.fn();
    render(
      <SplitButton
        label="Save"
        onClick={onClick}
        actions={[{ key: "copy", label: "Copy", onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Save more" }));
    expect(
      await screen.findByRole("menu", { name: "Save more" }),
    ).toBeInTheDocument();
    await user.click(await screen.findByRole("menuitem", { name: "Copy" }));
    expect(onSelect).toHaveBeenCalledOnce();
    // The primary action must not have fired on the way through.
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("returns focus to the overflow trigger after Escape", async () => {
    const user = userEvent.setup();
    render(<SplitButton label="Save" actions={ACTIONS} />);
    const trigger = screen.getByRole("button", { name: "Save more" });
    await user.click(trigger);
    await screen.findByRole("menu", { name: "Save more" });
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("disables BOTH halves — a live overflow beside a dead primary is a trap", () => {
    render(<SplitButton label="Save" actions={ACTIONS} disabled />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save more" })).toBeDisabled();
  });

  it("renders no overflow half when there are no actions", () => {
    render(<SplitButton label="Save" actions={[]} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save more" }),
    ).not.toBeInTheDocument();
  });

  it("takes a custom overflow name", () => {
    render(
      <SplitButton
        label="Save"
        menuLabel="More save options"
        actions={ACTIONS}
      />,
    );
    expect(
      screen.getByRole("button", { name: "More save options" }),
    ).toBeInTheDocument();
  });
});

describe("TimePicker", () => {
  it("exposes three named listboxes and announces the selection", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 30 }} />);
    expect(
      screen.getByRole("listbox", { name: "Hour (24 hour)" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: "Minute" })).toBeInTheDocument();
    const selected = screen.getAllByRole("option", { selected: true });
    expect(selected).toHaveLength(2);
  });

  it("is ONE tab stop per field, not one per option", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 30 }} />);
    for (const field of screen.getAllByRole("listbox")) {
      const stops = within(field)
        .getAllByRole("option")
        .filter((o) => o.getAttribute("tabindex") === "0");
      expect(stops).toHaveLength(1);
    }
  });

  it("Arrow keys move within a field, wrap, and auto-select (M3 listbox model)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        onValueChange={onValueChange}
      />,
    );
    const hours = screen.getByRole("listbox", { name: "Hour (24 hour)" });
    const nine = within(hours).getByRole("option", { name: "09" });
    nine.focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalledWith({ hours: 10, minutes: 30 });
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith({ hours: 8, minutes: 30 });
  });

  it("Home and End jump to the field's ends", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        onValueChange={onValueChange}
      />,
    );
    const minutes = screen.getByRole("listbox", { name: "Minute" });
    within(minutes).getByRole("option", { name: "30" }).focus();
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith({ hours: 9, minutes: 0 });
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith({ hours: 9, minutes: 55 });
  });

  it("keeps the value 24-hour even when rendering 12-hour", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        format="12h"
        defaultValue={{ hours: 15, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByText("3:00 PM")).toBeInTheDocument();
    const hours = screen.getByRole("listbox", { name: "Hour" });
    within(hours).getByRole("option", { name: "03" }).focus();
    await user.keyboard("{ArrowDown}");
    // "4 PM" is 16:00 in state, not 4.
    expect(onValueChange).toHaveBeenLastCalledWith({ hours: 16, minutes: 0 });
  });

  it("12-hour mode adds the period field and switching it moves the hour", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        format="12h"
        defaultValue={{ hours: 9, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    const period = screen.getByRole("listbox", { name: "AM or PM" });
    within(period).getByRole("option", { name: "PM" }).focus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith({ hours: 21, minutes: 0 });
  });

  it("24-hour mode renders no period field", () => {
    render(<TimePicker defaultValue={{ hours: 9, minutes: 0 }} />);
    expect(
      screen.queryByRole("listbox", { name: "AM or PM" }),
    ).not.toBeInTheDocument();
  });

  it("offers only whole steps, so a step-15 picker never yields :07", () => {
    render(<TimePicker step={15} defaultValue={{ hours: 9, minutes: 0 }} />);
    const minutes = within(screen.getByRole("listbox", { name: "Minute" }));
    expect(minutes.getAllByRole("option")).toHaveLength(4);
    expect(
      minutes.queryByRole("option", { name: "07" }),
    ).not.toBeInTheDocument();
    expect(minutes.getByRole("option", { name: "45" })).toBeInTheDocument();
  });

  it("a step that cannot land on :00 falls back to minute-accurate", () => {
    render(<TimePicker step={7} defaultValue={{ hours: 9, minutes: 0 }} />);
    const minutes = within(screen.getByRole("listbox", { name: "Minute" }));
    expect(minutes.getAllByRole("option")).toHaveLength(60);
    expect(minutes.getByRole("option", { name: "00" })).toBeInTheDocument();
  });

  it("a controlled picker reports but does not self-move", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        value={{ hours: 9, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    const hours = screen.getByRole("listbox", { name: "Hour (24 hour)" });
    within(hours).getByRole("option", { name: "09" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalledWith({ hours: 10, minutes: 0 });
    expect(
      within(hours).getByRole("option", { selected: true }).textContent,
    ).toBe("09");
  });

  it("a host can bind it to its own state and see the change round-trip", async () => {
    const user = userEvent.setup();
    function Host() {
      const [value, setValue] = useState<TimePickerValue>({
        hours: 9,
        minutes: 0,
      });
      return (
        <>
          <output data-testid="host">{`${value.hours}:${value.minutes}`}</output>
          <TimePicker value={value} onValueChange={setValue} />
        </>
      );
    }
    render(<Host />);
    const hours = screen.getByRole("listbox", { name: "Hour (24 hour)" });
    within(hours).getByRole("option", { name: "09" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByTestId("host").textContent).toBe("10:0");
    expect(
      within(hours).getByRole("option", { selected: true }).textContent,
    ).toBe("10");
  });

  it("reports the normalised time, never an out-of-range one", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        value={{ hours: 9, minutes: 0 }}
        onValueChange={onValueChange}
      />,
    );
    const minutes = screen.getByRole("listbox", { name: "Minute" });
    within(minutes).getByRole("option", { name: "00" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenCalledWith({ hours: 9, minutes: 55 });
  });

  it("never reports an out-of-range time, whatever it is handed", () => {
    // The guarantee a consumer relies on: kern's reported value is always a
    // real clock time, so host arithmetic cannot put 18:75 into state.
    expect(normaliseTime({ hours: 25, minutes: 75 })).toEqual({
      hours: 1,
      minutes: 59,
    });
    expect(normaliseTime({ hours: -1, minutes: -5 })).toEqual({
      hours: 23,
      minutes: 0,
    });
    expect(normaliseTime({ hours: 9.6, minutes: 30.2 })).toEqual({
      hours: 10,
      minutes: 30,
    });
  });

  it("labels the whole picker as a group", () => {
    render(
      <TimePicker label="Start time" defaultValue={{ hours: 9, minutes: 0 }} />,
    );
    expect(
      screen.getByRole("group", { name: "Start time" }),
    ).toBeInTheDocument();
  });

  it("uses the clock text a host formats", () => {
    render(
      <TimePicker
        defaultValue={{ hours: 9, minutes: 5 }}
        formatValue={(v) => `${v.hours}h${v.minutes}`}
      />,
    );
    expect(screen.getByText("9h5")).toBeInTheDocument();
  });
});

describe("Carousel", () => {
  const SLIDES = [
    <div key="a">One</div>,
    <div key="b">Two</div>,
    <div key="c">Three</div>,
  ];

  it("exposes itself as a carousel, not a generic group", () => {
    render(<Carousel items={SLIDES} label="Highlights" />);
    const region = screen.getByRole("region", { name: "Highlights" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("announces each slide's position, so the user knows how many there are", () => {
    render(<Carousel items={SLIDES} />);
    expect(screen.getByLabelText("Slide 1 (1 of 3)")).toBeInTheDocument();
    expect(screen.getByLabelText("Slide 3 (3 of 3)")).toBeInTheDocument();
  });

  it("advances with the next control and reports the index", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} onIndexChange={onIndexChange} />);
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("clamps at the ends and disables the control that would do nothing", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} onIndexChange={onIndexChange} />);
    // At the first slide: previous is disabled, so its state tells the truth.
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledTimes(2);
  });

  it("wraps past the ends when asked", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} wrap onIndexChange={onIndexChange} />);
    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("does not auto-advance: motion that moves content is an a11y failure", async () => {
    vi.useFakeTimers();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} onIndexChange={onIndexChange} />);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(onIndexChange).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("traverses with Arrow keys from a single tab stop", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} onIndexChange={onIndexChange} />);
    // One tab stop for the whole carousel, on the controls group: a 20-slide
    // carousel must not cost 20 tab stops. It is not on the `<section>`,
    // because a non-interactive element with a tab stop is a lint error and a
    // keyboard trap for anyone who tabs past the arrows.
    const controls = screen.getByRole("group", { name: "Carousel controls" });
    expect(controls).toHaveAttribute("tabindex", "0");
    controls.focus();
    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(1);
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("hides inactive slides from assistive tech rather than reading all of them", () => {
    render(<Carousel items={SLIDES} />);
    const first = screen.getByLabelText("Slide 1 (1 of 3)");
    expect(first).not.toHaveAttribute("aria-hidden");
    expect(screen.getByLabelText("Slide 2 (2 of 3)")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("shows the dot indicator only when asked, and it jumps", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Carousel items={SLIDES} onIndexChange={onIndexChange} />,
    );
    expect(
      screen.queryByRole("button", { name: "Go to Slide 3" }),
    ).not.toBeInTheDocument();

    rerender(
      <Carousel items={SLIDES} showIndicators onIndexChange={onIndexChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Go to Slide 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(
      screen.getByRole("button", { name: "Go to Slide 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("does nothing when disabled, and says so", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={SLIDES} disabled onIndexChange={onIndexChange} />);
    const region = screen.getByRole("region", { name: "Carousel" });
    expect(region).toHaveAttribute("aria-disabled", "true");
    region.focus();
    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("clamps an out-of-range controlled index instead of blanking", () => {
    render(<Carousel items={SLIDES} index={99} />);
    expect(screen.getByLabelText("Slide 3 (3 of 3)")).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("takes per-slide names from the host", () => {
    render(<Carousel items={SLIDES} itemLabels={["Intro", "Middle", "End"]} />);
    expect(screen.getByLabelText("Intro (1 of 3)")).toBeInTheDocument();
  });

  it("renders nothing for an empty set rather than an empty carousel", () => {
    const { container } = render(<Carousel items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("LoadingIndicator", () => {
  it("is a polite live region, so the label is announced when it appears", () => {
    render(<LoadingIndicator label="Saving" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-label", "Saving");
  });

  it("has no aria-valuenow: there is no progress to report", () => {
    const { container } = render(<LoadingIndicator />);
    // A fabricated value, or an animated 0, is worse than none. Determinate
    // progress belongs to LinearProgress, which owns role="progressbar".
    expect(container.querySelector("[aria-valuenow]")).toBeNull();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("names itself once when the label is also visible", () => {
    render(<LoadingIndicator label="Saving" showLabel />);
    expect(screen.getByText("Saving")).toBeInTheDocument();
    // The visible text IS the name, so it must not be announced twice.
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-label");
  });

  it("hides the animated ring from assistive tech", () => {
    const { container } = render(<LoadingIndicator label="Saving" />);
    expect(container.querySelector("[role=status] > span")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("LoadingRegion puts aria-busy on the region being loaded", () => {
    const { rerender } = render(
      <LoadingRegion loading>
        <p>Content</p>
      </LoadingRegion>,
    );
    expect(
      screen.getByRole("status").closest("[aria-busy]"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    rerender(
      <LoadingRegion loading={false}>
        <p>Content</p>
      </LoadingRegion>,
    );
    expect(document.querySelector("[aria-busy]")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("LoadingRegion renders the host's own fallback when given one", () => {
    render(
      <LoadingRegion loading fallback={<p>Almost there</p>}>
        <p>Content</p>
      </LoadingRegion>,
    );
    expect(screen.getByText("Almost there")).toBeInTheDocument();
  });
});
