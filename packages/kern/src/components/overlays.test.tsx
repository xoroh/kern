import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AlertDialog } from "./alert-dialog";
import { Combobox } from "./combobox";
import { ContextMenu } from "./context-menu";
import { Dialog } from "./dialog";
import { Menu } from "./menu";
import { Menubar } from "./menubar";
import { Popover } from "./popover";
import { PreviewCard } from "./preview-card";
import { Select } from "./select";
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
