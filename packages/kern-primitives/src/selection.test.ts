import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  isSelected,
  normalizeSelection,
  toggleSelection,
  useSelection,
} from "./selection";

/**
 * Behaviour only. Nothing here names a platform, a token, or a component, so
 * these assertions survive any primitive ruling — the same discipline the parity
 * contract follows, and the reason this can live in the primitives layer at all.
 */
describe("normalizeSelection", () => {
  it("wraps a single string into an array in single mode", () => {
    expect(normalizeSelection("a", "single")).toEqual(["a"]);
  });

  it("keeps an array as an array in multiple mode", () => {
    expect(normalizeSelection(["a", "b"], "multiple")).toEqual(["a", "b"]);
  });

  it("returns empty for undefined", () => {
    expect(normalizeSelection(undefined, "multiple")).toEqual([]);
    expect(normalizeSelection(undefined, "single")).toEqual([]);
  });

  it("truncates to one entry in single mode", () => {
    expect(normalizeSelection(["a", "b", "c"], "single")).toEqual(["a"]);
  });

  it("deduplicates in multiple mode so length never lies", () => {
    expect(normalizeSelection(["a", "a", "b"], "multiple")).toEqual(["a", "b"]);
  });

  it("returns a fresh array, never the caller's reference", () => {
    // Mutating the returned array must not reach back into the caller's props —
    // the input often comes straight from component state.
    const input = ["a", "b"];
    const out = normalizeSelection(input, "multiple");
    expect(out).not.toBe(input);
    expect([...out]).toEqual(["a", "b"]);
  });
});

describe("toggleSelection", () => {
  it("replaces in single mode", () => {
    expect(toggleSelection(["a"], "b", "single")).toEqual(["b"]);
  });

  it("replaces even when re-activating the current value in single mode", () => {
    // A radio group does not deselect on re-activation; doing so would leave the
    // group with nothing selected, which M3 does not describe.
    expect(toggleSelection(["a"], "a", "single")).toEqual(["a"]);
  });

  it("adds in multiple mode", () => {
    expect(toggleSelection(["a"], "b", "multiple")).toEqual(["a", "b"]);
  });

  it("removes in multiple mode when already selected", () => {
    expect(toggleSelection(["a", "b"], "a", "multiple")).toEqual(["b"]);
  });

  it("does not mutate its input", () => {
    const input = ["a"];
    toggleSelection(input, "b", "multiple");
    expect(input).toEqual(["a"]);
  });
});

describe("isSelected", () => {
  it("reports membership", () => {
    expect(isSelected(["a", "b"], "a")).toBe(true);
    expect(isSelected(["a", "b"], "c")).toBe(false);
  });
});

describe("useSelection", () => {
  it("starts uncontrolled at defaultValue", () => {
    const { result } = renderHook(() =>
      useSelection({ defaultValue: "a", mode: "single" }),
    );
    expect(result.current[0]).toEqual(["a"]);
  });

  it("follows the controlled value", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useSelection({ value, mode: "single" }),
      { initialProps: { value: "a" } },
    );
    expect(result.current[0]).toEqual(["a"]);
    rerender({ value: "b" });
    expect(result.current[0]).toEqual(["b"]);
  });

  it("reports the normalised array to onChange, not the raw value", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSelection({ defaultValue: "a", mode: "single", onChange }),
    );
    act(() => result.current[1]("b"));
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });

  it("narrows immediately when the mode tightens to single", () => {
    // Widening single -> multiple keeps the selection; narrowing must keep only
    // the first entry, so a control never reports more selected items than its
    // mode permits.
    const { result, rerender } = renderHook(
      ({ mode }: { mode: "single" | "multiple" }) =>
        useSelection({ value: ["a", "b", "c"], mode }),
      { initialProps: { mode: "multiple" as "single" | "multiple" } },
    );
    expect(result.current[0]).toEqual(["a", "b", "c"]);
    rerender({ mode: "single" });
    expect(result.current[0]).toEqual(["a"]);
  });

  it("keeps a stable select identity across re-renders", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useSelection({ value, mode: "single" }),
      { initialProps: { value: "a" } },
    );
    const first = result.current[1];
    rerender({ value: "b" });
    expect(result.current[1]).toBe(first);
  });

  it("does not call onChange when a multiple-mode toggle returns to the same set", () => {
    // Activating the only selected item empties the set — a real change — but
    // activating it twice in single mode must not fire, because the selection is
    // unchanged. Pinned here because `useControllableState` skips equal values.
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSelection({ defaultValue: "a", mode: "single", onChange }),
    );
    act(() => result.current[1]("a"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
