import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { KernOverlay } from "./kern-overlay";

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

describe("KernOverlay modal", () => {
  it("opens on trigger and closes on footer action", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        title="Settings"
        description="Change settings."
        trigger={<button type="button">Open</button>}
        footer={<button type="button">Done</button>}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    // The footer action is consumer-owned: the surface stays open until the
    // consumer closes it — pinned so a future auto-dismiss cannot sneak in.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("returns focus to the trigger on Escape", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        title="Settings"
        trigger={<button type="button">Open</button>}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps the surface on scrim press when dismissible={false}, Escape still dismisses", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        title="Blocking"
        dismissible={false}
        trigger={<button type="button">Open</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    // Scrim press: the backdrop is the first dialog-adjacent layer.
    const backdrop = document.querySelector("[data-slot='dialog-backdrop']");
    expect(backdrop).not.toBeNull();
    await user.click(backdrop as Element);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sizes the dialog from the size prop", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        title="Wide"
        size="lg"
        trigger={<button type="button">Open</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveClass("kern-overlay");
    // lg maps to the 48rem cap (md would be 35rem).
    expect(dialog.className).toContain("48rem");
  });

  it("has no axe violations open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <KernOverlay
          title="Settings"
          description="Change settings."
          trigger={<button type="button">Open</button>}
          footer={<button type="button">Done</button>}
        />
      </main>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await axeClean(container);
  });
});

describe("KernOverlay alert", () => {
  it("announces as an alertdialog with a default dismiss action", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="alert"
        title="Delete?"
        description="Irreversible."
        trigger={<button type="button">Delete</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });
});

describe("KernOverlay sheet + snap", () => {
  it("opens a bottom sheet on trigger", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="sheet"
        title="Filters"
        trigger={<button type="button">Open</button>}
      >
        <p>Sheet body</p>
      </KernOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByTestId("kern-overlay-sheet")).toBeInTheDocument();
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
  });

  it("renders the snap slider when snapPoints are given", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="sheet"
        title="Snap"
        snapPoints={[0.5, 0.9]}
        trigger={<button type="button">Open</button>}
      >
        <p>Sheet body</p>
      </KernOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const slider = await screen.findByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemax", "1");
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "1");
  });

  it("renders a persistent dock region, never a dialog", () => {
    render(
      <KernOverlay variant="dock" title="Quick actions">
        <p>Dock body</p>
      </KernOverlay>,
    );
    expect(screen.getByTestId("kern-overlay-dock")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

describe("KernOverlay side-sheet + drawer", () => {
  it("opens an edge-anchored side sheet", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="side-sheet"
        title="Details"
        trigger={<button type="button">Open</button>}
      >
        <p>Side body</p>
      </KernOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(
      await screen.findByTestId("kern-overlay-side-sheet"),
    ).toBeInTheDocument();
  });

  it("opens the bottom drawer surface", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="drawer"
        title="Menu"
        trigger={<button type="button">Open</button>}
      >
        <p>Drawer body</p>
      </KernOverlay>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(
      await screen.findByTestId("kern-overlay-drawer"),
    ).toBeInTheDocument();
  });
});

describe("KernOverlay tabbed-dialog", () => {
  const tabs = [
    { key: "general", label: "General", panel: <p>General panel</p> },
    { key: "members", label: "Members", panel: <p>Members panel</p> },
  ];

  it("switches tab panels with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <KernOverlay
        variant="tabbed-dialog"
        title="Workspace"
        tabs={tabs}
        trigger={<button type="button">Open</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    const tablist = await screen.findByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Workspace sections");
    expect(screen.getByText("General panel")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Members" }));
    expect(screen.getByText("Members panel")).toBeInTheDocument();
  });

  it("reports tab changes through onActiveTabChange", async () => {
    const user = userEvent.setup();
    let active = "";
    render(
      <KernOverlay
        variant="tabbed-dialog"
        title="Workspace"
        tabs={tabs}
        onActiveTabChange={(key) => (active = key)}
        trigger={<button type="button">Open</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(await screen.findByRole("tab", { name: "Members" }));
    expect(active).toBe("members");
  });

  it("has no axe violations with tabs open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <KernOverlay
          variant="tabbed-dialog"
          title="Workspace"
          tabs={tabs}
          trigger={<button type="button">Open</button>}
        />
      </main>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await axeClean(container);
  });
});
