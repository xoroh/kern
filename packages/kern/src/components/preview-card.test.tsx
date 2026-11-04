import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PreviewCard } from "./preview-card";

/**
 * Part A P1 — PreviewCard states the overlay suite does not pin.
 *
 * overlays.test.tsx owns the hover-open and defaultOpen rows; these rows
 * cover the closed-by-default contract and the M3 popup paint (surface
 * fill, small corners, level-2 elevation, 8dp offset is structural).
 */
describe("PreviewCard states (P1)", () => {
  it("stays closed until hovered", () => {
    render(
      <PreviewCard.Root>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.queryByText("Preview body")).toBeNull();
  });

  it("exposes the trigger slot for styling", () => {
    render(
      <PreviewCard.Root>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    expect(screen.getByText("Docs")).toHaveAttribute(
      "data-slot",
      "preview-card-trigger",
    );
  });

  it("paints the popup in surface with small corners and level-2 elevation", async () => {
    render(
      <PreviewCard.Root defaultOpen>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    const popup = await screen.findByText("Preview body");
    expect(popup).toHaveAttribute("data-slot", "preview-card-content");
    expect(popup.className).toContain("bg-(--sys-color-surface)");
    expect(popup.className).toContain("rounded-(--sys-shape-corner-small)");
    expect(popup.className).toContain("shadow-(--sys-elevation-level2)");
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    render(
      <PreviewCard.Root>
        <PreviewCard.Trigger>Docs</PreviewCard.Trigger>
        <PreviewCard.Content>Preview body</PreviewCard.Content>
      </PreviewCard.Root>,
    );
    await user.hover(screen.getByText("Docs"));
    expect(await screen.findByText("Preview body")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Preview body")).toBeNull());
  });
});
