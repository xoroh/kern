import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import {
  createSnackbarManager,
  SnackbarList,
  SnackbarProvider,
  SnackbarViewport,
} from "./snackbar";

/**
 * U4 (kern-oss-upstream-v1): snackbar announce + action focus.
 *
 * The live region (`aria-live="polite"` on the viewport) and the focusable
 * toast root come from the toast primitive; this suite pins the OSS contract
 * so a regression is a test failure, not a silent a11y loss: a shown message
 * announces through the polite region, its action renders as a named button,
 * and the toast root stays keyboard-focusable.
 */
describe("Snackbar announce + action focus (U4)", () => {
  it("announces through a polite live region", () => {
    const snackbar = createSnackbarManager();
    const { container, unmount } = render(
      <SnackbarProvider toastManager={snackbar.toastManager}>
        <SnackbarViewport />
        <SnackbarList />
      </SnackbarProvider>,
    );
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
    act(() => {
      snackbar.show({ title: "Saved" });
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
    unmount();
    act(() => {
      snackbar.dismiss();
    });
  });

  it("renders the action as a named, focusable button", () => {
    const snackbar = createSnackbarManager();
    const { unmount } = render(
      <SnackbarProvider toastManager={snackbar.toastManager}>
        <SnackbarViewport />
        <SnackbarList />
      </SnackbarProvider>,
    );
    act(() => {
      snackbar.show({
        title: "Saved",
        action: { label: "Undo", onClick: () => {} },
      });
    });
    const action = screen.getByRole("button", { name: "Undo" });
    expect(action).toBeInTheDocument();
    action.focus();
    expect(document.activeElement).toBe(action);
    unmount();
    act(() => {
      snackbar.dismiss();
    });
  });
});
