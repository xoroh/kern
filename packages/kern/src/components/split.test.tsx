import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Split } from "./split";

/**
 * Web `Split` — the N-column layout.
 *
 * The counterpart assertions to native's suite. Primitive-agnostic by design:
 * role / label / structure, never Base UI internals, so a future primitive
 * ruling cannot invalidate this file.
 */

describe("Split", () => {
  it("renders every column", () => {
    render(
      <Split label="Workspace">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Split>,
    );
    expect(screen.getByText("One")).toBeTruthy();
    expect(screen.getByText("Two")).toBeTruthy();
    expect(screen.getByText("Three")).toBeTruthy();
  });

  it("names the split region", () => {
    render(
      <Split label="Workspace">
        <div>One</div>
        <div>Two</div>
      </Split>,
    );
    // The region is a layout, and a screen-reader user needs to be able to say
    // "the workspace split" before moving into it. Asserted on the ROLE + the
    // accessible name together: a bare `getByLabelText` would pass on any
    // element carrying the label, including one with no group semantics.
    const region = screen.getByRole("group", { name: "Workspace" });
    expect(region).toBeTruthy();
  });

  it("gives every column an equal share", () => {
    const { container } = render(
      <Split label="Workspace">
        <div>One</div>
        <div>Two</div>
      </Split>,
    );
    // `flex: 1` on EACH COLUMN is the native contract. Asserted per column, not
    // on the container: a column that is not equally weighted is the classic
    // split-layout bug and is invisible until one child has longer content.
    const cols = container.querySelectorAll('[data-slot="split-column"]');
    expect(cols.length).toBe(2);
    for (const col of cols) {
      expect(col.className).toContain("flex-1");
      // min-w-0 is the other half: without it a long child pushes its sibling
      // off screen instead of shrinking.
      expect(col.className).toContain("min-w-0");
    }
    const region = screen.getByRole("group", { name: "Workspace" });
    expect(region.className).toContain("flex");
  });

  it("draws dividers from the container, not from the children", () => {
    const { container } = render(
      <Split label="Workspace">
        <div>One</div>
        <div>Two</div>
      </Split>,
    );
    const region = screen.getByRole("group", { name: "Workspace" });
    // The container carries the background for the gap to show through, plus
    // the gap itself.
    expect(region.className).toContain("gap-px");
    expect(region.className).toContain("outline-variant");
    // ...and the children carry NO borders. Borders per child would give the
    // first column a leading border and the last a trailing one, at every
    // column count. Asserted on the COLUMNS: a container-only assertion passes
    // whether or not a border was moved onto them.
    for (const col of container.querySelectorAll('[data-slot="split-column"]')) {
      expect(col.className).not.toContain("border");
    }
  });

  it("supports three columns", () => {
    const { container } = render(
      <Split columns={3} label="Workspace">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Split>,
    );
    expect(screen.getByText("Three")).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="split-column"]').length).toBe(
      3,
    );
  });

  it("renders the columns it is given, not the declared count", () => {
    // `columns` is a hint. Padding or truncating to match the declared number
    // would silently drop a real child.
    const { container } = render(
      <Split columns={2} label="Workspace">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
        <div>Four</div>
      </Split>,
    );
    expect(container.querySelectorAll('[data-slot="split-column"]').length).toBe(
      4,
    );
    expect(screen.getByText("Four")).toBeTruthy();
  });
});