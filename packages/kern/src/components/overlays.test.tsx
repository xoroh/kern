import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AlertDialog } from "./alert-dialog";
import { Combobox } from "./combobox";
import { ContextMenu } from "./context-menu";
import { Dialog } from "./dialog";
import { Menu } from "./menu";
import { Menubar } from "./menubar";
import { Popover } from "./popover";
import { PreviewCard } from "./preview-card";
import { Select } from "./select";
import { Sheet } from "./sheet";
import { Tooltip } from "./tooltip";

describe("Dialog", () => {
  it("opens on trigger and closes on action", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Change settings.</Dialog.Description>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("announces itself as modal", async () => {
    // Base UI's `Dialog.Popup` traps focus but emits no `aria-modal`; the
    // parity contract requires a modal surface to say so, and the navigation
    // drawer already had to set it by hand for the same reason. Asserted here
    // so the attribute cannot be dropped silently — the focus-trap behaviour
    // above still passes without it.
    //
    // Scope honesty for this whole describe: trap-wrap and background
    // inertness are NOT asserted in jsdom — neither is observable here. A
    // 5-tab probe walks Extra → guard → BODY → Close → Extra; the BODY stop
    // may be a jsdom artifact (floating-ui's own redirect logic keys off
    // `isElementVisible`, false for everything in jsdom) or a real hole, and
    // jsdom cannot distinguish them. The document `[aria-hidden]` census
    // matches only backdrop/guard machinery in both modes, the trigger is
    // unmarked in both, jsdom lacks the `inert` IDL. Both legs stay browser
    // legs: the 4d verdict measured trap 10/10 + 26 markers, and the
    // in-flight re-verify re-probes them on both knob positions.
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("dismisses on Escape with focus returning to the trigger", async () => {
    // Modal knob: Escape-with-return, operated. (No trap cycle, no inert leg:
    // see the note on `announces itself as modal` below — neither is
    // jsdom-observable here. Trap-wrap and inertness stay browser legs owned
    // by review-m3's in-flight re-verify, on both knob positions.)
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("non-modal Dialog", () => {
  const setupOpen = async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root modal={false}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content modal={false}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    return user;
  };

  it("does not claim modality", async () => {
    // review-m3 4d NOTE-1, measured live: the hardcoded marker made a
    // `modal={false}` dialog announce itself as modal. The `modal` prop on
    // Content must be kept in step with Root's — no public context exposes
    // it (see the prop doc), so this pair is asserted together or not at all.
    await setupOpen();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
  });

  it("dismisses on tab-out: no trap, no background to protect", async () => {
    // Non-modal dialogs do not trap: moving focus outside dismisses via
    // `closeOnFocusOut` instead of wrapping. A trapped dialog would still be
    // open here — so asserting CLOSED is the honest untrapped proof, stronger
    // than asserting where focus landed.
    const user = await setupOpen();
    await user.tab();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("still dismisses on Escape", async () => {
    const user = await setupOpen();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("AlertDialog", () => {
  it("announces as an alert dialog", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm</AlertDialog.Title>
          <AlertDialog.Description>Irreversible.</AlertDialog.Description>
          <AlertDialog.Close>Cancel</AlertDialog.Close>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("announces itself as modal", async () => {
    // The identical `aria-modal` gap `Dialog` had: same primitive, same fix,
    // one attribute. An alert dialog is modal by definition, so a surface that
    // does not say so misreports the accessibility tree against the visual.
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm</AlertDialog.Title>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alertdialog")).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("mounts open without a trigger click", async () => {
    // Edge composition, carried from the move-5 Group lesson: the open knob
    // mounts the dialog at first paint, so the test pins the painted
    // surface with no interaction. Sensitivity-proven: the same query on a
    // shut mount finds nothing (scratch probe, RED confirmed, deleted).
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm</AlertDialog.Title>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });
});

describe("Sheet", () => {
  it("announces itself as modal by default", async () => {
    // Same AT-lie class as Dialog NOTE-1, one surface over: Base UI's Popup
    // emits no `aria-modal`, so the default (modal root) must claim it.
    const user = userEvent.setup();
    render(
      <Sheet.Root>
        <Sheet.Trigger>Open</Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Title>Filters</Sheet.Title>
        </Sheet.Content>
      </Sheet.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "aria-modal",
      "true",
    );
  });

  it("does not claim modality when non-modal", async () => {
    // The `modal` prop on Content must be kept in step with Root's — same
    // constraint as DialogContent (no public context exposes it), asserted
    // as a pair or not at all.
    const user = userEvent.setup();
    render(
      <Sheet.Root modal={false}>
        <Sheet.Trigger>Open</Sheet.Trigger>
        <Sheet.Content modal={false}>
          <Sheet.Title>Filters</Sheet.Title>
        </Sheet.Content>
      </Sheet.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "aria-modal",
      "false",
    );
  });
});

describe("Popover", () => {
  it("toggles anchored content", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Info</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Details</Popover.Title>
        </Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Info" }));
    expect(await screen.findByText("Details")).toBeInTheDocument();
  });
});

describe("Tooltip", () => {
  it("reveals content on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content>Save changes</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await user.hover(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Save changes")).toBeInTheDocument();
  });

  it("stays hidden when disabled", () => {
    // Edge composition, carried from the move-5 Group lesson: the disabled
    // knob kills the tip even forced open via defaultOpen — no timers, no
    // hover-delay guessing. Sensitivity-proven: the same assertions on an
    // enabled tip fail (scratch probe, RED confirmed, deleted).
    render(
      <Tooltip.Provider>
        <Tooltip.Root disabled defaultOpen>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content>Save changes</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(screen.queryByText("Save changes")).toBeNull();
  });
});

describe("Menu", () => {
  it("opens and activates an item", async () => {
    const user = userEvent.setup();
    let chosen = "";
    render(
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onClick={() => (chosen = "new")}>New</Menu.Item>
          <Menu.Item onClick={() => (chosen = "open")}>Open</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "File" }));
    await user.click(await screen.findByRole("menuitem", { name: "Open" }));
    expect(chosen).toBe("open");
  });

  it("moves through items with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>New</Menu.Item>
          <Menu.Item>Open</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "File" }));
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menuitem", { name: "New" })).toHaveFocus();
  });

  it("wraps focus past the last item when looping", async () => {
    // Edge composition, carried from the move-5 Group lesson: loop focus is
    // the whole reason the knob exists, so the test pins the wrap.
    // Sensitivity-proven: the same assertions with loopFocus off fail
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>New</Menu.Item>
          <Menu.Item>Open</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "File" }));
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menuitem", { name: "New" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menuitem", { name: "Open" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menuitem", { name: "New" })).toHaveFocus();
  });
});

describe("Menubar", () => {
  it("opens a top-level menu", async () => {
    const user = userEvent.setup();
    render(
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>New</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>,
    );
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(
      await screen.findByRole("menuitem", { name: "New" }),
    ).toBeInTheDocument();
  });

  it("opens nothing when the whole bar is disabled", async () => {
    // Edge composition, carried from the move-5 Group lesson: the disabled
    // knob kills the entire bar, so the test pins the dead triggers.
    // Sensitivity-proven: the same assertions on an enabled bar fail
    // (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    render(
      <Menubar.Root disabled aria-label="App">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>New</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>,
    );
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(screen.queryByRole("menuitem", { name: "New" })).toBeNull();
  });
});

describe("Select", () => {
  it("chooses an option", async () => {
    const user = userEvent.setup();
    render(
      <Select.Root
        items={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
      >
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    await user.click(await screen.findByRole("option", { name: "Pro" }));
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveTextContent(
      "Pro",
    );
  });

  it("selects several options when multiple", async () => {
    // Locks the `Multiple` generic forwarding: before it, `<Select.Root
    // multiple>` was a type error for every consumer (TS2322, caught while
    // building the move-5 configurator), so multi-select existed in Base UI
    // but was unreachable through kern's wrapper.
    const user = userEvent.setup();
    render(
      <Select.Root
        multiple
        defaultValue={["free"]}
        items={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
      >
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    await user.click(await screen.findByRole("option", { name: "Pro" }));
    expect(await screen.findByRole("option", { name: "Free" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(await screen.findByRole("option", { name: "Pro" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("opens a grouped popup with zero console errors", async () => {
    // Locks the `Group` forwarding (move-5 re-verify FAIL): Base UI's
    // `GroupLabel` throws `SelectGroupContext is missing` unless it renders
    // inside `<Select.Group>`, and kern's `Select` object exported no `Group`
    // — so every grouped popup crashed on open. The error spy is the point:
    // React logs the render throw via console.error even where the test
    // renderer keeps the tree alive, so options-present alone would pass on a
    // crashing tree.
    const errors: unknown[][] = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args: unknown[]) => {
        errors.push(args);
      });
    try {
      const user = userEvent.setup();
      render(
        <Select.Root
          items={[
            { value: "eu-west", label: "eu-west-1" },
            { value: "us-east", label: "us-east-1" },
          ]}
        >
          <Select.Trigger aria-label="Region">
            <Select.Value placeholder="Choose a region" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.GroupLabel>Europe</Select.GroupLabel>
              <Select.Item value="eu-west">eu-west-1</Select.Item>
            </Select.Group>
            <Select.Group>
              <Select.GroupLabel>Americas</Select.GroupLabel>
              <Select.Item value="us-east">us-east-1</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>,
      );
      await user.click(screen.getByRole("combobox", { name: "Region" }));
      expect(
        await screen.findByRole("option", { name: "eu-west-1" }),
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("option", { name: "us-east-1" }),
      ).toBeInTheDocument();
      expect(errors).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("Combobox", () => {
  it("filters options by typing", async () => {
    const user = userEvent.setup();
    render(
      <Combobox.Root
        items={[
          { value: "apple", label: "Apple" },
          { value: "apricot", label: "Apricot" },
        ]}
      >
        <Combobox.Label>Fruit</Combobox.Label>
        <Combobox.Input aria-label="Fruit" />
        <Combobox.Content>
          <Combobox.Item value="apple">Apple</Combobox.Item>
          <Combobox.Empty>No match</Combobox.Empty>
        </Combobox.Content>
      </Combobox.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.keyboard("zzz");
    expect(await screen.findByText("No match")).toBeInTheDocument();
  });
});

describe("PreviewCard", () => {
  it("shows a preview on hover", async () => {
    const user = userEvent.setup();
    render(
      <PreviewCard.Root>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    await user.hover(screen.getByText("Docs"));
    expect(await screen.findByText("Preview body")).toBeInTheDocument();
  });

  it("mounts open without hovering", async () => {
    // Edge composition, carried from the move-5 Group lesson: the open knob
    // mounts the card at first paint, so the test pins the painted body
    // with no interaction. Sensitivity-proven: the same query on a shut
    // mount finds nothing (scratch probe, RED confirmed, deleted).
    render(
      <PreviewCard.Root defaultOpen>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    expect(await screen.findByText("Preview body")).toBeInTheDocument();
  });
});

describe("ContextMenu", () => {
  it("opens on right click", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Area"),
    });
    expect(
      await screen.findByRole("menuitem", { name: "Copy" }),
    ).toBeInTheDocument();
  });
});
