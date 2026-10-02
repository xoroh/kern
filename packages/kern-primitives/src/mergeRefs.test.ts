import { createRef, useRef } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { assignRef, mergeRefs, useMergeRefs } from "./mergeRefs";

describe("assignRef", () => {
  it("calls a callback ref with the value", () => {
    const cb = vi.fn();
    assignRef(cb, "x");
    expect(cb).toHaveBeenCalledWith("x");
  });

  it("writes through a mutable ref object", () => {
    const ref = createRef<string | null>();
    // React 19's createRef is mutable in practice; assert the behaviour we own.
    assignRef(ref as never, "x");
    expect((ref as { current: string | null }).current).toBe("x");
  });

  it("accepts null and undefined without throwing", () => {
    expect(() => assignRef(null, "x")).not.toThrow();
    expect(() => assignRef(undefined, "x")).not.toThrow();
  });

  // A frozen RefObject cannot take the write. Failing the whole render over that
  // would be worse than not writing, so it is swallowed.
  it("swallows a write to a frozen ref rather than throwing", () => {
    const frozen = Object.freeze({ current: null });
    expect(() => assignRef(frozen as never, "x")).not.toThrow();
    expect(frozen.current).toBeNull();
  });
});

describe("mergeRefs", () => {
  it("assigns every ref in the list", () => {
    const a = vi.fn();
    const b = vi.fn();
    mergeRefs(a, b)("v");
    expect(a).toHaveBeenCalledWith("v");
    expect(b).toHaveBeenCalledWith("v");
  });

  it("ignores null and undefined entries", () => {
    const a = vi.fn();
    expect(() => mergeRefs(a, null, undefined)("v")).not.toThrow();
    expect(a).toHaveBeenCalledWith("v");
  });

  // `render` interop: a part that hands out a merged callback must still write
  // to BOTH the consumer's ref and its own internal one, or the ref silently
  // stops working the moment a consumer passes `render`.
  it("writes to a callback ref and a ref object together", () => {
    const cb = vi.fn();
    const obj = { current: null as string | null };
    mergeRefs<unknown>(cb, obj as never)("v");
    expect(cb).toHaveBeenCalledWith("v");
    expect(obj.current).toBe("v");
  });

  it("cleans up with null on unmount, as React does", () => {
    const a = vi.fn();
    const merged = mergeRefs(a);
    merged("v");
    merged(null);
    expect(a).toHaveBeenLastCalledWith(null);
  });
});

describe("useMergeRefs", () => {
  it("returns a stable identity across renders", () => {
    const { result, rerender } = renderHook(() =>
      useMergeRefs<HTMLDivElement>(useRef<HTMLDivElement | null>(null)),
    );
    const first = result.current;
    rerender();
    // A fresh callback each render would make consumers re-run effects that
    // depend on it — the classic mergeRefs bug this function exists to prevent.
    expect(result.current).toBe(first);
  });

  it("assigns to every supplied ref", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useMergeRefs<unknown>(cb));
    const node = {} as unknown;
    result.current(node);
    expect(cb).toHaveBeenCalledWith(node);
  });
});