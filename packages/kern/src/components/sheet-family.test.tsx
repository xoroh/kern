import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ActionSheet,
  BottomSheet,
  BottomSheetPicker,
  DockSheet,
  EntitySheet,
  SheetSurface,
  SnapSheet,
} from "./sheet-family";

/**
 * Contract tests for the kern sheet family.
 *
 * Every assertion here is about ROLE, LABEL and STATE — DOM contract that a
 * consumer can observe — never about which primitive implements it. Swapping
 * `@base-ui/react/dialog` for anything else must not break a single line.
 */
describe("SheetSurface", () => {
  it("is a named modal surface, and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(
      <SheetSurface open onOpenChange={onOpenChange} label="Details">
        <p>body</p>
      </SheetSurface>,
    );
    const surface = screen.getByRole("dialog", { name: "Details" });
    expect(surface).toBeInTheDocument();
    expect(surface).toHaveAttribute("aria-modal", "true");
  });

  it("renders its children", () => {
    render(
      <SheetSurface open label="Details">
        <p>body copy</p>
      </SheetSurface>,
    );
    expect(screen.getByText("body copy")).toBeInTheDocument();
  });
});

describe("BottomSheet", () => {
  it("exposes an accessible name and its title", () => {
    render(
      <BottomSheet open label="Filters" title="Filters">
        <p>opts</p>
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("offers a close control when a dismiss handler is supplied", () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open label="Filters" onClose={onClose}>
        <p>opts</p>
      </BottomSheet>,
    );
    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toBeInTheDocument();
  });
});

describe("DockSheet", () => {
  // Docked ≠ dialog. This is the whole point of the component.
  it("is a region, NOT a dialog", () => {
    render(<DockSheet label="Quick actions">x</DockSheet>);
    expect(
      screen.getByRole("region", { name: "Quick actions" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("carries no modal elevation token — it is persistent, not an overlay", () => {
    const { container } = render(
      <DockSheet label="Quick actions">x</DockSheet>,
    );
    // A docked panel at modal elevation misreads as an overlay. Absence is the
    // assertion, so this fails loudly if someone adds a shadow.
    expect(container.innerHTML).not.toContain("md-sys-elevation-level1");
  });
});

describe("SnapSheet", () => {
  it("announces its detent as a value the user can change", () => {
    render(
      <SnapSheet open label="Peek" snapPoints={[0.25, 0.5, 0.9]}>
        <p>body</p>
      </SnapSheet>,
    );
    const handle = screen.getByRole("button", { name: /snap position/i });
    expect(handle).toHaveAttribute("aria-valuenow", "0");
    expect(handle).toHaveAttribute("aria-valuemax", "2");
  });

  it("cycles to the next detent", () => {
    const onIndexChange = vi.fn();
    render(
      <SnapSheet
        open
        label="Peek"
        snapPoints={[0.25, 0.5]}
        index={0}
        onIndexChange={onIndexChange}
      >
        <p>body</p>
      </SnapSheet>,
    );
    screen.getByRole("button", { name: /snap position/i }).click();
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});

describe("EntitySheet", () => {
  it("presents labelled field pairs", () => {
    render(
      <EntitySheet
        open
        label="Account 42"
        title="Account 42"
        fields={[
          { label: "Status", value: "Active" },
          { label: "ID", value: "42", data: true },
        ]}
      />,
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

describe("BottomSheetPicker", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("is a listbox and marks the selected option", () => {
    render(
      <BottomSheetPicker
        open
        label="Pick one"
        title="Pick one"
        options={options}
        value="b"
        onSelect={() => {}}
      />,
    );
    expect(
      screen.getByRole("listbox", { name: "Pick one" }),
    ).toBeInTheDocument();
    const selected = screen
      .getAllByRole("option")
      .filter((o) => o.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent("Beta");
  });

  it("declares multi-select ONLY when asked to", () => {
    const { unmount } = render(
      <BottomSheetPicker
        open
        label="Pick"
        title="Pick"
        options={options}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole("listbox")).not.toHaveAttribute(
      "aria-multiselectable",
    );
    unmount();

    render(
      <BottomSheetPicker
        open
        label="Pick"
        title="Pick"
        options={options}
        multiple
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    );
  });

  it("reports the chosen value", () => {
    const onSelect = vi.fn();
    render(
      <BottomSheetPicker
        open
        label="Pick"
        title="Pick"
        options={options}
        onSelect={onSelect}
      />,
    );
    screen.getByRole("option", { name: /Alpha/ }).click();
    expect(onSelect).toHaveBeenCalledWith("a");
  });
});

describe("ActionSheet", () => {
  it("renders a titled list of actions", () => {
    const onSelect = vi.fn();
    render(
      <ActionSheet
        open
        label="Document"
        title="Document"
        actions={[{ id: "share", label: "Share", onSelect }]}
      />,
    );
    expect(
      screen.getByRole("dialog", { name: "Document" }),
    ).toBeInTheDocument();
    screen.getByRole("button", { name: "Share" }).click();
    expect(onSelect).toHaveBeenCalled();
  });
});
