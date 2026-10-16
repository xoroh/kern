import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { DialogContent, DialogRoot } from "./dialog";

/**
 * Ref proof for the spread-based dialog parts: every part spreads its
 * remainder onto the primitive, so React 19 ref-as-prop flows without an
 * explicit `ref` in the part's own prop type. If a part ever stops
 * spreading, this fails.
 */
describe("DialogContent", () => {
  it("forwards a ref to the dialog popup", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DialogRoot open>
        <DialogContent aria-label="Details" ref={ref}>
          <p>body</p>
        </DialogContent>
      </DialogRoot>,
    );
    expect(ref.current).toBe(screen.getByRole("dialog"));
  });
});
