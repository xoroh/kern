import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterChipRow, MenuScreen, MenuSheet } from "./menu-family";

/**
 * Contract tests for the menu family + filter chip row.
 *
 * Role / label / state only — never primitive internals.
 */
const groups = [
  { heading: "File", actions: [{ key: "new", label: "New" }, { key: "open", label: "Open" }] },
  { actions: [{ key: "signout", label: "Sign out", destructive: true }] },
];

describe("MenuScreen", () => {
  it("is a named list of destinations, not a dialog", () => {
    render(<MenuScreen label="Main menu" groups={groups} />);
    expect(screen.getByRole("list", { name: "Main menu" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("carries no modal elevation token — a list is not an overlay", () => {
    const { container } = render(<MenuScreen label="Main menu" groups={groups} />);
    expect(container.innerHTML).not.toContain("md-sys-elevation-level1");
  });

  it("names each group by its heading", () => {
    render(<MenuScreen label="Main menu" groups={groups} />);
    expect(screen.getByRole("group", { name: "File" })).toBeInTheDocument();
  });

  it("renders every action", () => {
    render(<MenuScreen label="Main menu" groups={groups} />);
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });
});

describe("MenuSheet", () => {
  it("is a named dialog hosting the same structure", () => {
    render(<MenuSheet open title="Main menu" groups={groups} />);
    expect(screen.getByRole("dialog", { name: "Main menu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });
});

describe("FilterChipRow", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("is a group whose chips are toggles", () => {
    render(<FilterChipRow options={options} />);
    expect(screen.getByRole("group", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("selects on press, as a multi-select filter", () => {
    const onValueChange = vi.fn();
    render(<FilterChipRow options={options} onValueChange={onValueChange} />);
    screen.getByRole("button", { name: "Alpha" }).click();
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  // A filter chip that cannot be switched off is not a toggle.
  it("REMOVES a value on a second press", () => {
    const onValueChange = vi.fn();
    render(
      <FilterChipRow
        options={options}
        value={["a"]}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    screen.getByRole("button", { name: "Alpha" }).click();
    expect(onValueChange).toHaveBeenCalledWith([]);
  });
});
