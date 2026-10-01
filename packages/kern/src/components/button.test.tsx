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
});
