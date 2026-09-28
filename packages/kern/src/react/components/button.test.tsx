import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies the tonal variant", () => {
    render(<Button variant="tonal">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-[#efefef]");
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
  });
});
