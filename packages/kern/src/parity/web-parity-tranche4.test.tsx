/**
 * Web side of the cross-renderer parity contract, tranche 4 (the M3 Tooltip).
 *
 * Reads the SAME declaration as the native suite (`parity/contract.ts`, aliased
 * `@kern-parity/contract`) and asserts the observable semantics through the DOM
 * — never a Base UI internal, never a `data-*` attribute.
 *
 * **What this file deliberately does NOT assert.** The row was written after
 * measuring this component, and two measurements ruled things out:
 *
 *   - The popup renders with **no `role`**. `getByRole("tooltip")` returns null,
 *     so a role assertion would have to be written as an absence, which is not
 *     a contract.
 *   - The trigger carries **no `aria-describedby`**, open or closed. So "the
 *     hint is linked to the trigger" is not a property of the shipped web
 *     component; asserting it would be a red suite on day one, and asserting
 *     its absence would bless the gap as if it were the design.
 *
 * Both are filed as web-side debt in `parity/contract.ts`. What IS asserted is
 * the obligation the two renderers share — the supplementary text reaches the
 * user as text — plus the inertness of the surface, which is a property of the
 * shipped primitive and holds today.
 */
import { contractFor, divergenceMessage } from "@kern-parity/contract";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../components/tooltip";

const R = "web" as const;

function row() {
  const r = contractFor("tooltip");
  if (!r.hintCarriesText) {
    throw new Error("tooltip row declares no hintCarriesText");
  }
  // Narrowed once here so every call site below gets a `string`, not
  // `string | undefined`. A local alias rather than a non-null assertion at
  // each use: the throw above is the check, and it names the missing field.
  return { ...r, hint: r.hintCarriesText };
}

/** The tooltip surface, found by its text (it carries no role — see above). */
function surface(text: string): HTMLElement {
  const found = screen.queryByText(text);
  if (!found) {
    throw new Error(
      divergenceMessage(
        row(),
        R,
        `the surface carrying ${JSON.stringify(text)} must be present`,
      ),
    );
  }
  return found as HTMLElement;
}

describe("web parity contract (tranche 4): tooltip", () => {
  it("renders the supplementary text as text once the trigger is focused", async () => {
    const r = row();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>{r.name}</Tooltip.Trigger>
          <Tooltip.Content>{r.hint}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    const trigger = screen.getByRole("button", { name: r.name });
    // Focus is the trigger half that BOTH renderers implement, so the row is
    // written against it rather than against hover.
    trigger.focus();
    await waitFor(
      () => {
        expect(
          screen.queryByText(r.hint),
          divergenceMessage(
            r,
            R,
            `focusing the trigger must reveal ${JSON.stringify(r.hint)}`,
          ),
        ).not.toBeNull();
      },
      { timeout: 3000 },
    );
    expect(screen.getByText(r.hint).textContent).toBe(r.hint);
  });

  it("keeps the surface inert — not tabbable, not a control", async () => {
    const r = row();
    if (!r.surfaceInert)
      throw new Error("tooltip row must declare surfaceInert");
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>{r.name}</Tooltip.Trigger>
          <Tooltip.Content>{r.hint}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    screen.getByRole("button", { name: r.name }).focus();
    const popup = await waitFor(() => surface(r.hint));
    // `tabindex="-1"` is the measured value: focusable programmatically, absent
    // from the tab order. Anything else — `tabindex="0"`, or a focusable child —
    // would let a supplementary label trap a keyboard user.
    expect(
      popup.getAttribute("tabindex"),
      divergenceMessage(
        r,
        R,
        "the surface must be reachable only programmatically, never by tab",
      ),
    ).toBe("-1");
    // No interactive role INSIDE the surface. Scoped with `within`, not a bare
    // `screen.queryByRole`: the trigger itself is a button and always present,
    // so an unscoped query reports the trigger and fails for the wrong reason —
    // which is how a real defect here would have been waved through.
    for (const role of ["button", "link", "menuitem", "checkbox"]) {
      expect(
        within(popup).queryByRole(role),
        divergenceMessage(
          r,
          R,
          `a plain tooltip holds a label, so it must expose no ${role}`,
        ),
      ).toBeNull();
    }
  });

  it("does not fold the hint into the trigger's accessible name", async () => {
    // If the hint leaked into the name, a screen reader would announce
    // "Save, Saves your draft" as one label and the supplement would read as
    // part of the control's identity.
    const r = row();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>{r.name}</Tooltip.Trigger>
          <Tooltip.Content>{r.hint}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(screen.getByRole("button", { name: r.name })).toBeTruthy();
    expect(
      screen.queryByRole("button", {
        name: new RegExp(r.hint),
      }),
      divergenceMessage(
        r,
        R,
        "the hint must not become part of the trigger's accessible name",
      ),
    ).toBeNull();
  });

  it("renders no surface before the trigger is focused", () => {
    // The hint must not be permanently on screen — that is the difference
    // between a tooltip and a caption.
    const r = row();
    render(
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>{r.name}</Tooltip.Trigger>
          <Tooltip.Content>{r.hint}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(screen.queryByText(r.hint)).toBeNull();
  });
});
