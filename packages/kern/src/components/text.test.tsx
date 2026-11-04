import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text, textVariants } from "./text";

/**
 * WP9 Part D P1: Text behavior pins.
 *
 * The typescale variant is the whole API: one role per rank, `body`
 * by default, polymorphic via `as`.
 */
describe("Text", () => {
  it("renders body copy by default on the surface token", () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-slot", "text");
    expect(el.className).toContain("text-(--sys-color-on-surface)");
    expect(el.className).toContain(
      "leading-(--sys-typescale-body-medium-line-height)",
    );
  });

  it("swaps the typescale per variant", () => {
    const { rerender } = render(<Text variant="label">Name</Text>);
    expect(screen.getByText("Name").className).toContain(
      "leading-(--sys-typescale-label-large-line-height)",
    );
    rerender(<Text variant="title">Settings</Text>);
    expect(screen.getByText("Settings").className).toContain(
      "leading-(--sys-typescale-title-large-line-height)",
    );
    rerender(<Text variant="headline">Welcome</Text>);
    expect(screen.getByText("Welcome").className).toContain(
      "leading-(--sys-typescale-headline-small-line-height)",
    );
  });

  it("renders as the requested element", () => {
    render(
      <Text as="h1" variant="headline">
        Title
      </Text>,
    );
    expect(screen.getByText("Title").tagName).toBe("H1");
  });

  it("exposes the variant branches without raw color", () => {
    for (const variant of ["body", "label", "title", "headline"] as const) {
      expect(textVariants({ variant })).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });
});
