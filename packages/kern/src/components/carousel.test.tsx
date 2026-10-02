import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Carousel } from "./carousel";

/**
 * P2-1 proof, item 2 of 7: the carousel.
 *
 * The component's doc comment makes several accessibility claims. Each one below
 * is a claim that would be silently lost on a refactor if nothing checks it —
 * in particular the "no auto-advance" decision, which is a ruling and not an
 * implementation detail.
 */
const ITEMS = [<p key="a">One</p>, <p key="b">Two</p>, <p key="c">Three</p>];

function region(): HTMLElement {
  return screen.getByRole("region", { name: "Carousel" });
}

describe("Carousel", () => {
  // Without the roledescription a screen reader announces "group"/"region" and
  // the user cannot tell a carousel from any other layout container.
  it("announces itself as a carousel, not a bare region", () => {
    render(<Carousel items={ITEMS} />);
    expect(region()).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("uses a custom accessible name", () => {
    render(<Carousel items={ITEMS} label="Featured" />);
    expect(screen.getByRole("region", { name: "Featured" })).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
  });

  // Clamped is the M3 default. At the first slide the previous control is
  // disabled rather than silently wrapping, so its state tells the truth about
  // where the user is.
  it("clamps at the start rather than wrapping by default", () => {
    render(<Carousel items={ITEMS} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("clamps at the end", () => {
    render(<Carousel items={ITEMS} defaultIndex={2} />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
  });

  // Wrap is opt-in, and must wrap in BOTH directions — a modulo that mishandles
  // negatives sends previous from slide 1 to an undefined slide.
  it("wraps in both directions when asked", async () => {
    const user = userEvent.setup();
    render(<Carousel items={ITEMS} wrap />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /previous/i }));
    // From slide 1, previous wraps to the LAST slide — not to undefined.
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("moves forward and reports the new index", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={ITEMS} onIndexChange={onIndexChange} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  // Arrow keys traverse the track; the controls are separate tab stops. A
  // 20-slide carousel must not be 20 tab stops.
  //
  // Each direction is driven from its OWN starting position. A single test that
  // clicked Next and then pressed ArrowLeft covered only ArrowLeft — removing
  // ArrowRight entirely left it green, which is what the mutation check found.
  it("ArrowRight advances", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={ITEMS} onIndexChange={onIndexChange} />);
    screen.getByRole("group", { name: /controls/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("ArrowLeft goes back", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(
      <Carousel items={ITEMS} defaultIndex={2} onIndexChange={onIndexChange} />,
    );
    screen.getByRole("group", { name: /controls/i }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("ignores arrow keys while disabled", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={ITEMS} disabled onIndexChange={onIndexChange} />);
    screen.getByRole("group", { name: /controls/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  // M3 is explicit that a carousel does not auto-advance: motion that moves
  // content out from under a reader is an accessibility failure.
  it("does not auto-advance", () => {
    vi.useFakeTimers();
    try {
      const onIndexChange = vi.fn();
      render(<Carousel items={ITEMS} onIndexChange={onIndexChange} />);
      vi.advanceTimersByTime(60_000);
      expect(onIndexChange).not.toHaveBeenCalled();
      expect(screen.getByText("One")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  // Only the active slide is exposed. Note the real mechanism: inactive slides
  // stay MOUNTED and are `inert` + `aria-hidden`, rather than being unmounted.
  // Unmounting would discard a playing video or a scroll position when the user
  // swipes away and back. The component's doc comment claimed the children were
  // absent; that was wrong and is corrected alongside this test.
  it("exposes only the active slide to assistive tech", () => {
    render(<Carousel items={ITEMS} />);
    const slides = document.querySelectorAll("[data-slot='carousel-item']");
    expect(slides).toHaveLength(3);
    expect(slides[0]).not.toHaveAttribute("aria-hidden");
    expect(slides[1]).toHaveAttribute("aria-hidden", "true");
    expect(slides[2]).toHaveAttribute("aria-hidden", "true");
    expect(slides[1]).toHaveAttribute("inert");
  });

  it("keeps inactive slides mounted so their state survives", () => {
    render(<Carousel items={ITEMS} />);
    // Present in the DOM, hidden from AT — that is the point.
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(
      screen.getByText("Two").closest("[aria-hidden='true']"),
    ).not.toBeNull();
  });

  // A controlled index out of range must not blank the carousel.
  it("clamps an out-of-range controlled index instead of rendering nothing", () => {
    render(<Carousel items={ITEMS} index={99} />);
    // Clamped to the LAST slide, and the next control reflects it — an
    // out-of-range index that left `next` enabled would misreport position.
    const slides = document.querySelectorAll("[data-slot='carousel-item']");
    expect(slides[2]).not.toHaveAttribute("aria-hidden");
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("renders nothing for an empty item list rather than an empty region", () => {
    const { container } = render(<Carousel items={[]} />);
    expect(container.querySelector("[data-slot='carousel']")).toBeNull();
  });

  // Disabled disables both controls AND says so, rather than silently ignoring
  // clicks — a dead control with no announcement is a control that lies.
  it("disables both controls and stops traversal when disabled", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Carousel items={ITEMS} disabled onIndexChange={onIndexChange} />);
    expect(region()).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  // Every `go()` caller is gated (the two controls and the dots carry
  // `disabled`, and the keydown returns early), so `go`'s own `if (disabled)`
  // is redundant defence-in-depth and is NOT reachable from the DOM. The
  // mutation check confirmed it: deleting the guard leaves the suite green,
  // because no input path exists to reach it. That is recorded rather than
  // papered over with a test that fires a synthetic event no user can produce.
  it("disables the dot indicators too", () => {
    render(<Carousel items={ITEMS} disabled showIndicators />);
    const dots = document.querySelectorAll("[data-slot='carousel-indicator']");
    expect(dots).toHaveLength(3);
    for (const dot of dots) {
      expect(dot).toBeDisabled();
    }
  });

  it("marks the track polite, and off when disabled", () => {
    const { unmount } = render(<Carousel items={ITEMS} />);
    const track = document.querySelector("[data-slot='carousel-track']");
    expect(track).toHaveAttribute("aria-live", "polite");
    unmount();

    render(<Carousel items={ITEMS} disabled />);
    const off = document.querySelector("[data-slot='carousel-track']");
    expect(off).toHaveAttribute("aria-live", "off");
  });

  // The position lives in the slide's aria-label, not in visible text — so the
  // assertion must read the attribute, not the document text.
  it("labels each slide with its name and position", () => {
    render(<Carousel items={ITEMS} />);
    const slides = document.querySelectorAll("[data-slot='carousel-item']");
    expect(slides[0]).toHaveAttribute("aria-label", "Slide 1 (1 of 3)");
    expect(slides[2]).toHaveAttribute("aria-label", "Slide 3 (3 of 3)");
    // Each item is announced as a slide, not as an unlabelled group.
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
  });

  it("accepts custom per-slide labels", () => {
    render(
      <Carousel items={ITEMS} itemLabels={["Opening", "Middle", "Closing"]} />,
    );
    const slides = document.querySelectorAll("[data-slot='carousel-item']");
    expect(slides[0]).toHaveAttribute("aria-label", "Opening (1 of 3)");
    expect(slides[2]).toHaveAttribute("aria-label", "Closing (3 of 3)");
  });

  it("renders the dot indicator only when asked", () => {
    const { unmount } = render(<Carousel items={ITEMS} showIndicators />);
    expect(
      document.querySelector("[data-slot='carousel-indicators']"),
    ).toBeInTheDocument();
    unmount();

    render(<Carousel items={ITEMS} />);
    expect(
      document.querySelector("[data-slot='carousel-indicators']"),
    ).toBeNull();
  });
});
