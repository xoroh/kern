import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { assignRef } from "./assignRef";

describe("assignRef", () => {
  it("writes to object refs", () => {
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    assignRef(ref, node);
    expect(ref.current).toBe(node);
    assignRef(ref, null);
    expect(ref.current).toBeNull();
  });

  it("calls function refs", () => {
    const seen: Array<HTMLDivElement | null> = [];
    const node = document.createElement("div");
    assignRef((n) => {
      seen.push(n);
    }, node);
    assignRef(null, node);
    expect(seen).toEqual([node]);
  });
});
