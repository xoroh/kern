import { describe, expect, it, vi } from "vitest";
import { createRovingModel } from "./roving";

/**
 * The model, tested as a plain object. The React binding is exercised by the
 * renderers that consume it; what matters here is the invariant, and a hook test
 * would obscure it.
 */
describe("createRovingModel", () => {
  it("makes exactly one item tabbable", () => {
    const model = createRovingModel({ count: 5 });
    const tabbable = [0, 1, 2, 3, 4].filter(
      (i) => model.describe(i).isTabbable,
    );
    // THE invariant: a composite is one tab stop, not N.
    expect(tabbable).toEqual([0]);
  });

  it("moves the single tab stop on traversal", () => {
    const model = createRovingModel({ count: 5 });
    model.next();
    const tabbable = [0, 1, 2, 3, 4].filter(
      (i) => model.describe(i).isTabbable,
    );
    expect(tabbable).toEqual([1]);
    expect(model.activeIndex).toBe(1);
  });

  it("stops at the ends without looping", () => {
    const model = createRovingModel({ count: 3 });
    expect(model.previous()).toBe(0);
    expect(model.activeIndex).toBe(0);
    model.next();
    model.next();
    expect(model.activeIndex).toBe(2);
    expect(model.next()).toBe(2);
  });

  it("wraps when loop is set", () => {
    const model = createRovingModel({ count: 3, loop: true });
    expect(model.activeIndex).toBe(0);
    model.previous();
    expect(model.activeIndex).toBe(2);
    model.next();
    expect(model.activeIndex).toBe(0);
  });

  it("jumps to first and last", () => {
    const model = createRovingModel({ count: 10 });
    model.last();
    expect(model.activeIndex).toBe(9);
    model.first();
    expect(model.activeIndex).toBe(0);
  });

  /**
   * A disabled item keeps its POSITION. Skipping by deletion would renumber
   * everything after it, so a host's own state would silently shift.
   */
  it("skips disabled items without renumbering", () => {
    const model = createRovingModel({
      count: 3,
      isDisabled: (i) => i === 1,
    });
    model.next();
    expect(model.activeIndex).toBe(2);
    model.previous();
    expect(model.activeIndex).toBe(0);
  });

  it("leaves no tab stop when the active item is disabled", () => {
    const model = createRovingModel({ count: 3, isDisabled: (i) => i === 0 });
    // A group whose only stop is disabled contributes no stop — not a stop on a
    // disabled item, which would put focus somewhere unusable.
    expect(model.describe(0).isTabbable).toBe(false);
  });

  it("survives every item being disabled", () => {
    const model = createRovingModel({ count: 3, isDisabled: () => true });
    expect(() => {
      model.next();
      model.previous();
    }).not.toThrow();
    expect(model.activeIndex).toBe(0);
  });

  it("survives an empty group", () => {
    const model = createRovingModel({ count: 0 });
    expect(model.activeIndex).toBe(0);
    expect(model.describe(0).isTabbable).toBe(false);
    expect(model.next()).toBe(0);
  });

  it("clamps an out-of-range active index", () => {
    const model = createRovingModel({ count: 5, activeIndex: 99 });
    expect(model.activeIndex).toBe(4);
    const model2 = createRovingModel({ count: 5, activeIndex: -3 });
    expect(model2.activeIndex).toBe(0);
  });

  it("reports a controlled change to the host", () => {
    const onActiveIndexChange = vi.fn();
    const model = createRovingModel({
      count: 5,
      activeIndex: 0,
      onActiveIndexChange,
    });
    model.next();
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    // Controlled: the model does not move itself, the host decides.
    expect(model.activeIndex).toBe(0);
  });

  it("moves itself when uncontrolled", () => {
    const model = createRovingModel({ count: 5 });
    model.next();
    expect(model.activeIndex).toBe(1);
  });

  it("does not report a no-op change", () => {
    const onActiveIndexChange = vi.fn();
    const model = createRovingModel({
      count: 3,
      activeIndex: 0,
      onActiveIndexChange,
    });
    // Already at 0; previous() with no loop cannot move.
    model.previous();
    expect(onActiveIndexChange).not.toHaveBeenCalled();
  });

  it("keeps the index space stable while traversing a gap", () => {
    const model = createRovingModel({ count: 4, isDisabled: (i) => i === 2 });
    model.setActive(1);
    model.next();
    expect(model.activeIndex).toBe(3);
    expect(model.describe(3).index).toBe(3);
  });

  it("exposes orientation and loop as given", () => {
    const model = createRovingModel({
      count: 3,
      orientation: "vertical",
      loop: true,
    });
    expect(model.orientation).toBe("vertical");
    expect(model.loop).toBe(true);
  });
});
