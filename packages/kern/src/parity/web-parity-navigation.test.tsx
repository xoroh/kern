import { contractFor } from "@kern-parity/contract";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel, TimePicker } from "@xoroh/kern";
import { describe, expect, it, vi } from "vitest";

/**
 * Web side of the carousel and time-picker rows — the last two that recorded
 * `none on web - GAP` because they were built natively first.
 *
 * The obligations are the ones the native suites already prove, stated in
 * primitive-agnostic terms:
 *
 *   carousel     exactly ONE item is the current one
 *   time-picker   each field has exactly ONE selected option, and the reported
 *                 value is normalised (hours 0-23 whatever is rendered)
 *
 * Note the two native platform substitutions recorded on the rows: web uses
 * `aria-roledescription="carousel"` where native has no such concept, and web
 * uses `role="listbox"` where React Native's Role union has only `list`. Those
 * are real divergences; what is asserted here is the shared behaviour underneath,
 * never the mechanism.
 */

describe("web parity contract: carousel", () => {
  // Web `items` are ReactNode slides, NOT {value,label} objects like the native
  // component takes -- a real API asymmetry between the renderers. The contract
  // deliberately pins neither shape: it pins that exactly ONE slide is current,
  // which is the same obligation the native suite proves via `selected`.
  const items = [
    <p key="1">Slide one</p>,
    <p key="2">Slide two</p>,
    <p key="3">Slide three</p>,
  ];

  it("marks exactly one indicator as current", async () => {
    const r = contractFor("carousel");
    render(
      <Carousel
        showIndicators
        items={items}
        defaultIndex={1}
        label="Promotions"
      />,
    );
    // `aria-current` on the indicator is the web mechanism for "you are here";
    // the obligation is that there is exactly ONE, never zero and never several.
    const current = document.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(r.role).toBe("group");
  });

  it("names the carousel region", async () => {
    render(
      <Carousel
        showIndicators
        items={items}
        defaultIndex={0}
        label="Promotions"
      />,
    );
    // The region carries the label on both sides, though web adds a
    // roledescription ("carousel") that native has no way to express.
    expect(screen.getByRole("group", { name: /Promotions/ })).toBeTruthy();
  });

  it("exposes only the current slide to assistive tech", async () => {
    render(
      <Carousel
        showIndicators
        items={items}
        defaultIndex={1}
        label="Promotions"
      />,
    );
    // A hidden slide that is still announced reads as duplicate content, so the
    // inactive ones are aria-hidden. The native side achieves the same by
    // marking only the active item selected.
    const hidden = document.querySelectorAll(
      '[data-slot="carousel-item"][aria-hidden="true"]',
    );
    expect(hidden).toHaveLength(items.length - 1);
  });

  it("moves the current item on activation", async () => {
    const user = userEvent.setup();
    render(
      <Carousel
        showIndicators
        items={items}
        defaultIndex={0}
        label="Promotions"
      />,
    );
    // Queried by slot rather than accessible name: the indicator's label is
    // built from an internal `slideName` helper, so pinning it here would
    // assert an implementation detail instead of the obligation.
    const indicators = document.querySelectorAll(
      '[data-slot="carousel-indicator"]',
    );
    expect(indicators).toHaveLength(items.length);
    await user.click(indicators[1]);
    const current = document.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    // …and it moved: the current indicator is now the second one.
    expect(current[0]).toBe(indicators[1]);
  });
});

describe("web parity contract: time-picker", () => {
  const VALUE = { hours: 9, minutes: 30 };

  it("gives each field exactly one selected option", async () => {
    const r = contractFor("time-picker");
    render(<TimePicker defaultValue={VALUE} label="Departure" />);
    // Three fields on the web side too (hour, minute, and period in 12h). Each
    // listbox has exactly one `aria-selected` option -- three separate single
    // selections, not one across the picker and not many per field.
    const listboxes = screen.getAllByRole("listbox");
    expect(listboxes.length).toBeGreaterThan(0);
    for (const listbox of listboxes) {
      const options = within(listbox).getAllByRole("option");
      const selected = options.filter(
        (o) => o.getAttribute("aria-selected") === "true",
      );
      expect(selected).toHaveLength(1);
    }
    expect(r.role).toBe("list");
  });

  it("adds the period field only in 12-hour mode", async () => {
    const { unmount } = render(
      <TimePicker defaultValue={VALUE} format="24h" label="Departure" />,
    );
    const twentyFour = screen.getAllByRole("listbox").length;
    unmount();
    render(<TimePicker defaultValue={VALUE} format="12h" label="Departure" />);
    // 12h adds the AM/PM field; 24h does not. The value stays 24-hour either way.
    expect(screen.getAllByRole("listbox").length).toBe(twentyFour + 1);
  });

  it("reports a normalised value when a minute is chosen", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        defaultValue={VALUE}
        step={15}
        onValueChange={onValueChange}
        label="Departure"
      />,
    );
    await user.click(screen.getByRole("option", { name: "45" }));
    // A consumer must never be handed 18:75 -- that is the whole obligation.
    expect(onValueChange).toHaveBeenCalled();
    const reported = onValueChange.mock.calls.at(-1)?.[0];
    expect(reported.minutes).toBeLessThanOrEqual(59);
    expect(reported.hours).toBeGreaterThanOrEqual(0);
    expect(reported.hours).toBeLessThanOrEqual(23);
  });
});
