import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Pagination, pageWindow } from "./pagination";

/**
 * `pageWindow` is tested directly: it is pure, and going through rendered
 * output to check a windowing algorithm tests the renderer as much as the logic.
 */
describe("pageWindow", () => {
  it("shows every page for a short list", async () => {
    expect(
      pageWindow(1, 5).map((e) => (e.kind === "page" ? e.page : "gap")),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("elides pages in a long list", async () => {
    const kinds = pageWindow(1, 20).map((e) => e.kind);
    expect(kinds).toContain("gap");
  });

  it("keeps the first, last and a window around the current page", async () => {
    const pages = pageWindow(10, 20)
      .filter((e) => e.kind === "page")
      .map((e) => (e.kind === "page" ? e.page : 0));
    expect(pages).toEqual([1, 2, 9, 10, 11, 19, 20]);
  });

  it("never emits a page outside 1..count", async () => {
    for (const current of [1, 2, 10, 19, 20]) {
      for (const entry of pageWindow(current, 20)) {
        if (entry.kind === "page") {
          expect(entry.page).toBeGreaterThanOrEqual(1);
          expect(entry.page).toBeLessThanOrEqual(20);
        }
      }
    }
  });

  it("emits no duplicate pages", async () => {
    for (const current of [1, 5, 10, 20]) {
      const pages = pageWindow(current, 20)
        .filter((e) => e.kind === "page")
        .map((e) => e.page);
      expect(new Set(pages).size).toBe(pages.length);
    }
  });

  /** A window that collapses into gaps everywhere would be nonsense output. */
  it("emits pages in ascending order with gaps only between them", async () => {
    const entries = pageWindow(10, 20);
    const last = { value: 0 };
    for (const entry of entries) {
      if (entry.kind === "gap") {
        expect(last.value).toBeGreaterThan(0);
      } else {
        expect(entry.page).toBeGreaterThan(last.value);
        last.value = entry.page;
      }
    }
  });

  it("handles a single page", async () => {
    expect(pageWindow(1, 1)).toEqual([{ kind: "page", page: 1 }]);
  });
});

describe("Pagination", () => {
  it("is a named navigation landmark", async () => {
    await render(<Pagination count={5} accessibilityLabel="Results pages" />);
    const nav = screen.getByLabelText("Results pages");
    expect(nav.props.role).toBe("navigation");
  });

  /**
   * The current page must be announced. RN has no `aria-current`, so `selected`
   * carries it — a recorded platform substitution, not an oversight.
   */
  it("marks the current page", async () => {
    await render(<Pagination count={5} defaultPage={3} />);
    const states = [1, 2, 3, 4, 5].map(
      (n) =>
        screen.getByLabelText(`Page ${n}`).props.accessibilityState.selected,
    );
    expect(states).toEqual([false, false, true, false, false]);
  });

  it("disables previous on the first page", async () => {
    await render(<Pagination count={5} defaultPage={1} />);
    expect(
      screen.getByLabelText("Previous page").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("disables next on the last page", async () => {
    await render(<Pagination count={5} defaultPage={5} />);
    expect(
      screen.getByLabelText("Next page").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("moves forward and reports the new page", async () => {
    const onPageChange = jest.fn();
    await render(
      <Pagination count={5} defaultPage={2} onPageChange={onPageChange} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Next page"));
    });
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(
      screen.getByLabelText("Page 3").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("moves backward", async () => {
    const onPageChange = jest.fn();
    await render(
      <Pagination count={5} defaultPage={3} onPageChange={onPageChange} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Previous page"));
    });
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("jumps straight to a page", async () => {
    const onPageChange = jest.fn();
    // From page 10 the window is 1, 2, 9, 10, 11, 19, 20 — so 11 and 19 are on
    // screen. Jumping to page 1 would assert nothing, because the window at page
    // 1 legitimately does not render page 11 at all.
    await render(
      <Pagination count={20} defaultPage={10} onPageChange={onPageChange} />,
    );
    expect(screen.getByLabelText("Page 11")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Page 19"));
    });
    expect(onPageChange).toHaveBeenCalledWith(19);
  });

  /** The window is a VIEW, not a filter: distant pages are genuinely absent. */
  it("omits pages outside the window", async () => {
    await render(<Pagination count={20} defaultPage={1} />);
    expect(screen.queryByLabelText("Page 11")).toBeNull();
    expect(screen.getByLabelText("Page 2")).toBeTruthy();
    expect(screen.getByLabelText("Page 19")).toBeTruthy();
  });

  /** A pager that wraps from last to first is a different component. */
  it("clamps at both ends rather than wrapping", async () => {
    const onPageChange = jest.fn();
    await render(
      <Pagination count={3} defaultPage={3} onPageChange={onPageChange} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Next page"));
    });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("honours a controlled page", async () => {
    const onPageChange = jest.fn();
    await render(<Pagination count={5} page={2} onPageChange={onPageChange} />);
    expect(
      screen.getByLabelText("Page 2").props.accessibilityState.selected,
    ).toBe(true);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Next page"));
    });
    // Told, but the host decides — the control must not move itself.
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(
      screen.getByLabelText("Page 2").props.accessibilityState.selected,
    ).toBe(true);
  });

  /** A host that hands back an out-of-range page must not produce nonsense. */
  it("clamps an out-of-range controlled page", async () => {
    await render(<Pagination count={5} page={99} />);
    expect(
      screen.getByLabelText("Page 5").props.accessibilityState.selected,
    ).toBe(true);
  });
});
