import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("applies the tonal variant", () => {
    // M3's filled tonal button uses the SECONDARY container roles, not a
    // kern-only `surface-tonal` (m3.material.io/components/buttons/overview).
    render(<Button variant="tonal">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-(--md-sys-color-secondary-container)",
    );
  });

  it("offers M3's five colour configurations", () => {
    // M3: elevated, filled, tonal, outlined, text. `destructive` is not one of them.
    const { rerender } = render(<Button variant="elevated">Save</Button>);
    for (const variant of ["primary", "tonal", "outlined", "ghost"] as const) {
      rerender(<Button variant={variant}>Save</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
    }
  });

  it("forwards disabled and handles clicks", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses submit only when requested", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("forwards a ref to the native button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Save" }));
  });

  it("renders the xs and xl sizes without changing the default", () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");
    rerender(<Button size="xs">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-7");
    rerender(<Button size="xl">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");
  });

  it("paints hover as a state layer, never a whole-button dim", () => {
    // M3: an 8% layer of the on-color over the container, label full-strength.
    // Whole-button hover:opacity dims the label too — that was the bug.
    const { rerender } = render(<Button>Save</Button>);
    const primary = screen.getByRole("button");
    expect(primary).toHaveClass(
      "before:bg-(--md-sys-color-on-primary)",
      "hover:before:opacity-[var(--md-sys-state-hover)]",
    );
    expect(primary.className).not.toContain("hover:opacity-");
    rerender(<Button variant="tonal">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "before:bg-(--md-sys-color-on-secondary-container)",
    );
    rerender(<Button variant="outlined">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "before:bg-(--md-sys-color-primary)",
    );
    rerender(<Button variant="ghost">Save</Button>);
    const ghost = screen.getByRole("button");
    expect(ghost).toHaveClass("before:bg-(--md-sys-color-primary)");
    expect(ghost.className).not.toContain("surface-tonal");
    rerender(
      <Button variant="ghost" color="danger">
        Delete
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass(
      "before:bg-(--md-sys-color-error)",
    );
  });

  it("paints the danger treatment per variant without adding a variant", () => {
    const { rerender } = render(<Button color="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-(--md-sys-color-error)");
    rerender(
      <Button variant="ghost" color="danger">
        Delete
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass(
      "text-(--md-sys-color-error)",
    );
    // Default color adds no classes — existing rendering cannot change.
    rerender(<Button>Save</Button>);
    expect(screen.getByRole("button").className).not.toContain("error");
  });

  it("renders square and rounded shapes; pill is the classless default", () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(screen.getByRole("button").className).not.toContain("rounded-none");
    rerender(<Button shape="square">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("rounded-none");
    rerender(<Button shape="rounded">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "rounded-(--md-sys-shape-corner-large)",
    );
  });

  it("stretches full width with block", () => {
    render(<Button block>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("blocks interaction and announces busy while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("places the icon beside the label and flips with iconPosition", () => {
    const { rerender } = render(
      <Button icon={<svg data-testid="i" />}>Save</Button>,
    );
    const button = screen.getByRole("button");
    const first = button.firstElementChild;
    expect(first?.querySelector('[data-testid="i"]')).not.toBeNull();
    rerender(
      <Button icon={<svg data-testid="i" />} iconPosition="end">
        Save
      </Button>,
    );
    const last = screen.getByRole("button").lastElementChild;
    expect(last?.querySelector('[data-testid="i"]')).not.toBeNull();
  });

  it("renders a link wearing the button treatment when href is set", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button href="/next" onClick={onClick as never}>
        Next
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Next" });
    expect(link).toHaveAttribute("href", "/next");
    expect(link).toHaveAttribute("data-slot", "button");
    await user.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("drops href and blocks navigation on a disabled link", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button href="/next" disabled onClick={onClick as never}>
        Next
      </Button>,
    );
    // No `href` means no `link` role — query the rendered anchor by text.
    const link = screen.getByText("Next");
    expect(link.tagName).toBe("A");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("carries the pressed state layer", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").className).toContain("active:");
  });
});
