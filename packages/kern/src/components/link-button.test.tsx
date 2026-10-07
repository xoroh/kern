import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LinkButton } from "./link-button";

describe("LinkButton", () => {
  it("renders a link wearing the button treatment", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <LinkButton href="/next" onClick={onClick}>
        Next
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Next" });
    expect(link).toHaveAttribute("href", "/next");
    expect(link).toHaveAttribute("data-slot", "button");
    await user.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("carries every Button axis without its own implementation", () => {
    const { rerender } = render(
      <LinkButton href="/x" variant="tonal" color="danger" size="xl" shape="square" block>
        Go
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link.className).toContain("bg-(--md-sys-color-error-container)");
    expect(link.className).toContain("h-12");
    expect(link.className).toContain("rounded-none");
    expect(link.className).toContain("w-full");
    rerender(
      <LinkButton href="/x" loading>
        Go
      </LinkButton>,
    );
    expect(screen.getByText("Go").closest("a")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("forwards anchor attributes to the anchor", () => {
    render(
      <LinkButton href="/x" target="_blank" rel="noopener" download="f.txt">
        File
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "File" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).toHaveAttribute("download", "f.txt");
  });
});
