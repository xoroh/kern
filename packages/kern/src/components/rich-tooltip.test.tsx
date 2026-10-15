import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  RichTooltipActions,
  RichTooltipContent,
  RichTooltipTitle,
  Tooltip,
} from "./tooltip";

describe("RichTooltip (M3)", () => {
  it("renders the surface-container surface with 12/8/16 padding", () => {
    render(
      <Tooltip.Root open>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <RichTooltipContent>
          <RichTooltipTitle>Drafts</RichTooltipTitle>
          Autosaved.
          <RichTooltipActions>
            <button type="button">Undo</button>
          </RichTooltipActions>
        </RichTooltipContent>
      </Tooltip.Root>,
    );
    const surface = screen.getByText("Autosaved.").closest("div");
    expect(surface?.className).toContain(
      "bg-(--sys-color-surface-container)",
    );
    expect(surface?.className).toContain("px-4");
    expect(screen.getByText("Drafts")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Undo" }),
    ).toBeTruthy();
  });
});
