import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertDialog } from "./alert-dialog";
import { Banner } from "./banner";
import { CircularProgress } from "./circular-progress";
import { Dialog } from "./dialog";
import { EmptyState } from "./empty-state";
import { LinearProgress } from "./linear-progress";
import { Skeleton } from "./skeleton";
import { Snackbar } from "./snackbar";

/**
 * M3 feedback-family spec pins — every value from material-web tokens and
 * m3.material.io tabs (dialogs/specs+guidelines, snackbar/specs, progress
 * docs, all via text-extraction proxy).
 *
 * If M3 changes a value, these tests fail first.
 */

describe("Dialog — 28px shape, surface-container-high, no border", () => {
  it("renders the M3 container treatment", () => {
    render(
      <Dialog.Root open>
        <Dialog.Content aria-label="confirm">
          <Dialog.Title>Delete?</Dialog.Title>
          <Dialog.Description>This cannot be undone.</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const popup = document.querySelector('[data-slot="dialog-content"]');
    expect(popup?.className).toContain(
      "rounded-(--sys-shape-corner-extra-large)",
    );
    expect(popup?.className).toContain(
      "bg-(--sys-color-surface-container-high)",
    );
    expect(popup?.className).not.toContain("border");
    expect(popup?.className).toContain("shadow-(--sys-elevation-level3)");
  });

  it("sizes within 280–560px with 24px padding", () => {
    render(
      <Dialog.Root open>
        <Dialog.Content aria-label="sized">
          <Dialog.Title>T</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const popup = document.querySelector('[data-slot="dialog-content"]');
    expect(popup?.className).toContain("w-[min(35rem,calc(100vw-2rem))]");
    expect(popup?.className).toContain("min-w-[min(17.5rem,calc(100vw-2rem))]");
    expect(popup?.className).toContain("p-6");
  });

  it("titles render headline-small, descriptions body-medium", () => {
    render(
      <Dialog.Root open>
        <Dialog.Content aria-label="type">
          <Dialog.Title>Headline</Dialog.Title>
          <Dialog.Description>Supporting text.</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const title = document.querySelector('[data-slot="dialog-title"]');
    expect(title?.className).toContain("text-2xl");
    expect(title?.className).toContain("leading-8");
    const desc = document.querySelector('[data-slot="dialog-description"]');
    expect(desc?.className).toContain("leading-5");
    expect(desc?.className).toContain("mt-4");
  });
});

describe("AlertDialog — alert semantics on the dialog treatment", () => {
  it("announces as an alert dialog", () => {
    render(
      <AlertDialog.Root open>
        <AlertDialog.Content aria-label="confirm-delete">
          <AlertDialog.Title>Delete?</AlertDialog.Title>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    const popup = document.querySelector('[data-slot="alert-dialog-content"]');
    expect(popup).not.toBeNull();
    expect(popup?.getAttribute("role")).toBe("alertdialog");
  });
});

describe("Snackbar — inverse surface, level3, 4px", () => {
  it("renders the M3 inverse treatment at level3", async () => {
    const { createSnackbarManager } = await import("./snackbar");
    const manager = createSnackbarManager();
    render(
      <Snackbar.Provider toastManager={manager}>
        <Snackbar.Viewport>
          <Snackbar.List />
        </Snackbar.Viewport>
      </Snackbar.Provider>,
    );
    const { act } = await import("react");
    act(() => {
      manager.add({ title: "Saved" });
    });
    const bar = await screen.findByText("Saved");
    const root = bar.closest('[data-slot="snackbar"]');
    expect(root?.className).toContain("bg-(--sys-color-inverse-surface)");
    expect(root?.className).toContain("text-(--sys-color-inverse-on-surface)");
    expect(root?.className).toContain("shadow-(--sys-elevation-level3)");
    expect(root?.className).toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
  });

  it("paints the action in inverse-primary", async () => {
    const { createSnackbarManager } = await import("./snackbar");
    const manager = createSnackbarManager();
    render(
      <Snackbar.Provider toastManager={manager}>
        <Snackbar.Viewport>
          <Snackbar.List />
        </Snackbar.Viewport>
      </Snackbar.Provider>,
    );
    const { act } = await import("react");
    act(() => {
      manager.add({
        title: "Saved",
        actionProps: { children: "Undo", onClick: () => {} },
      });
    });
    const action = await screen.findByRole("button", { name: "Undo" });
    expect(action.className).toContain("text-(--sys-color-inverse-primary)");
  });
});

describe("Progress — M3 track, indicator, four-color, buffer", () => {
  it("linear track uses surface-container-highest at 4px", () => {
    render(<LinearProgress value={0.5} label="Download" />);
    const bar = screen.getByRole("progressbar", { name: "Download" });
    expect(bar.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(bar.className).toContain("h-1");
  });

  it("linear supports indeterminate, four-color, and buffer", () => {
    const { unmount } = render(<LinearProgress indeterminate label="Wait" />);
    expect(
      document.querySelector('[data-slot="linear-progress-indicator"]'),
    ).not.toBeNull();
    unmount();
    render(<LinearProgress indeterminate fourColor label="Wait" />);
    expect(
      document.querySelector('[data-slot="linear-progress-indicator"]'),
    ).not.toBeNull();
    const { unmount: u2 } = render(
      <LinearProgress value={0.5} buffer={0.8} label="Buffered" />,
    );
    void u2;
    expect(
      document.querySelector('[data-slot="linear-progress-buffer"]'),
    ).not.toBeNull();
  });

  it("circular supports four-color cycling", () => {
    render(<CircularProgress fourColor label="Loading" />);
    expect(
      document.querySelector('[data-slot="circular-progress"]'),
    ).not.toBeNull();
  });
});

describe("Banner, Skeleton, EmptyState — supporting roles", () => {
  it("banner renders with icon, text, and actions", () => {
    render(
      <Banner icon={<svg />}>
        No connection. <button type="button">Fix</button>
      </Banner>,
    );
    expect(screen.getByText("No connection.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fix" })).toBeInTheDocument();
  });

  it("skeleton renders an accessible placeholder", () => {
    render(<Skeleton aria-label="Loading content" />);
    expect(screen.getByLabelText("Loading content")).toBeInTheDocument();
  });

  it("empty state renders title, description, and action", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Get started by creating one."
        action={<button type="button">Create</button>}
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by creating one."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
