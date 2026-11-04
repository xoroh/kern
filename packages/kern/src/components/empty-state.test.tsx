import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title, description and the primary action", () => {
    render(
      <EmptyState
        title="No rides yet"
        description="Book your first ride to get going."
        primaryAction={<button type="button">Book now</button>}
      />,
    );
    expect(screen.getByText("No rides yet")).toBeInTheDocument();
    expect(
      screen.getByText("Book your first ride to get going."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book now" }),
    ).toBeInTheDocument();
  });

  it("keeps `action` as the primary-action alias", () => {
    render(
      <EmptyState
        title="Empty"
        action={<button type="button">Retry</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders primary + secondary actions side by side", () => {
    render(
      <EmptyState
        title="Empty"
        primaryAction={<button type="button">Retry</button>}
        secondaryAction={<button type="button">Contact support</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Contact support" }),
    ).toBeInTheDocument();
  });

  it("scales metrics per placement variant", () => {
    const { unmount } = render(<EmptyState title="Page" variant="page" />);
    expect(
      document.querySelector("[data-variant='page']")?.className,
    ).toContain("py-12");
    unmount();

    render(<EmptyState title="Row" variant="list-row" />);
    expect(
      document.querySelector("[data-variant='list-row']")?.className,
    ).toContain("py-4");
  });

  it("hides the visual from assistive tech", () => {
    render(<EmptyState title="Empty" visual={<span>i</span>} />);
    expect(
      document.querySelector("[data-slot='empty-state-visual']"),
    ).toHaveAttribute("aria-hidden", "true");
  });
});
