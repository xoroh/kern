import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

/**
 * Part A P1 — Pagination behaviour the token suite does not pin.
 *
 * navigation-family-m3.test.tsx owns the paint rows (current fill, disabled
 * split, 48dp target); these rows cover the M3 paging contract: landmark,
 * current announcement, prev/next ends, controlled/uncontrolled state,
 * windowing with ellipsis gaps, and clamping.
 */
describe("Pagination behaviour (P1)", () => {
  it("is a named navigation landmark", () => {
    render(<Pagination count={5} />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("honours a custom landmark name", () => {
    render(<Pagination count={5} aria-label="Results pages" />);
    expect(
      screen.getByRole("navigation", { name: "Results pages" }),
    ).toBeInTheDocument();
  });

  it("announces the current page and marks nothing else", () => {
    render(<Pagination count={5} defaultValue={3} />);
    const current = screen.getByRole("button", { name: "Page 3" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("data-current", "");
    expect(screen.getByRole("button", { name: "Page 2" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("disables previous on the first page", () => {
    render(<Pagination count={5} defaultValue={1} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).not.toBeDisabled();
  });

  it("disables next on the last page", () => {
    render(<Pagination count={5} defaultValue={5} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).not.toBeDisabled();
  });

  it("moves forward and back through prev/next and reports each page", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Pagination count={5} defaultValue={2} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("jumps straight to a page", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Pagination count={5} defaultValue={1} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole("button", { name: "Page 4" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not move a controlled value on its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Pagination count={5} value={2} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    // The host owns the value and has not agreed yet.
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("clamps an out-of-range controlled page", () => {
    render(<Pagination count={5} value={99} />);
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("shows every page for a short list with no gaps", () => {
    render(<Pagination count={5} defaultValue={1} />);
    for (let page = 1; page <= 5; page++) {
      expect(
        screen.getByRole("button", { name: `Page ${page}` }),
      ).toBeInTheDocument();
    }
    expect(screen.queryByText("…")).toBeNull();
  });

  it("elides distant pages behind aria-hidden gaps in a long list", () => {
    const { container } = render(<Pagination count={20} defaultValue={1} />);
    const gaps = container.querySelectorAll('[aria-hidden="true"]');
    expect(gaps.length).toBeGreaterThan(0);
    // The window is a view, not a filter: distant pages are genuinely absent.
    expect(screen.queryByRole("button", { name: "Page 11" })).toBeNull();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
  });

  it("renders extra content after the page buttons", () => {
    render(
      <Pagination count={3}>
        <span data-testid="pager-extra">Showing 1–10</span>
      </Pagination>,
    );
    expect(screen.getByTestId("pager-extra")).toHaveTextContent("Showing 1–10");
  });
});
