import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup", () => {
  it("connects by default — joined radii, collapsed borders", () => {
    render(
      <ButtonGroup data-testid="group">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("data-variant", "connected");
    expect(group.className).toContain("rounded-r-none");
    expect(group.className).not.toContain("gap-2");
  });

  it("spaces as individuals in the standard variant", () => {
    render(
      <ButtonGroup data-testid="group" variant="standard">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("data-variant", "standard");
    expect(group.className).toContain("gap-2");
    expect(group.className).not.toContain("rounded-r-none");
  });

  it("lays out vertically with the join on the vertical axis", () => {
    render(
      <ButtonGroup data-testid="group" orientation="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group.className).toContain("rounded-b-none");
  });
});
