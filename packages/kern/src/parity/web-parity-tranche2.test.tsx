/**
 * Web side of the cross-renderer parity contract, tranche 2 (P2b-4).
 *
 * Reads the SAME declaration as the native suite (`parity/contract.ts`, aliased
 * `@kern-parity/contract`) and asserts only observable semantics — accessible
 * name, state axis, disabled behaviour. Nothing here reaches for a Base UI
 * internal, a `data-*` attribute, or a DOM node type, so if the primitive is
 * swapped these assertions should survive; that is the property under test.
 *
 * Tranche 1 lives in `web-parity.test.tsx` and is unchanged. This file is
 * additive: rows added here assert the shared subset measured on BOTH
 * renderers, and deliberately skip the four divergences recorded in
 * `.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md` until
 * they are ruled.
 */

import {
  assertParity,
  contractFor,
  divergenceMessage,
  type ParityRow,
} from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "../components/chip";
import { Dialog, DialogTitle } from "../components/dialog";
import { Input } from "../components/input";
import { ListItem } from "../components/list-item";
import { Textarea } from "../components/textarea";

const R = "web" as const;

/** Read a control's boolean state on whichever axis the contract names.
 *  `pressed` and `selected` both live on aria attributes here. */
function readAxis(el: Element, row: ParityRow): boolean {
  const attr =
    row.axis === "checked"
      ? "aria-checked"
      : row.axis === "selected"
        ? "aria-selected"
        : "aria-pressed";
  const raw = el.getAttribute(attr);
  // An assist chip omits the attribute entirely; "carries no pressed state" and
  // "reports pressed=false" are the same contract, so absent reads as false.
  return raw === null ? false : raw === "true";
}

describe("web parity contract (tranche 2): chip", () => {
  it("filter chip: one activation presses it, a second releases it", async () => {
    const user = userEvent.setup();
    const row = contractFor("chip", "Vegetarian");
    render(<Chip variant="filter">{row.name}</Chip>);
    const el = screen.getByRole("button", { name: row.name });
    expect(
      readAxis(el, row),
      divergenceMessage(row, R, "a filter chip starts unpressed"),
    ).toBe(row.expects.initial);
    await user.click(el);
    expect(
      readAxis(el, row),
      divergenceMessage(
        row,
        R,
        `after one activation should be ${row.expects.afterActivate}`,
      ),
    ).toBe(row.expects.afterActivate);
    await user.click(el);
    expect(
      readAxis(el, row),
      divergenceMessage(row, R, "a pressed filter chip must release again"),
    ).toBe(row.expects.initial);
  });

  it("filter chip: a disabled chip cannot be pressed", async () => {
    const user = userEvent.setup();
    const row = contractFor("chip", "Vegetarian");
    render(
      <Chip variant="filter" disabled>
        {row.name}
      </Chip>,
    );
    const el = screen.getByRole("button", { name: row.name });
    await user.click(el);
    expect(
      readAxis(el, row),
      divergenceMessage(row, R, "a disabled chip must stay unpressed"),
    ).toBe(row.expects.afterDisabledActivate);
  });

  it("assist chip: activation never leaves a pressed state behind", async () => {
    const user = userEvent.setup();
    const row = contractFor("chip", "Get directions");
    const onClick = vi.fn();
    render(
      <Chip variant="assist" onClick={onClick}>
        {row.name}
      </Chip>,
    );
    const el = screen.getByRole("button", { name: row.name });
    await user.click(el);
    // The press itself must still fire — an assist chip that swallows taps is
    // its own bug — but it must not report a pressed state afterwards.
    expect(
      onClick,
      "an assist chip must still fire onClick",
    ).toHaveBeenCalled();
    expect(
      readAxis(el, row),
      divergenceMessage(
        row,
        R,
        "an assist chip is not a toggle: activation must not leave a pressed state",
      ),
    ).toBe(row.expects.afterActivate);
  });
});

describe("web parity contract (tranche 2): named surfaces", () => {
  it("list item: announces both the headline and the supporting line", () => {
    const row = contractFor("list-item");
    render(
      <ul>
        <ListItem headline="Airplane mode" supporting="Updated 2 h ago" />
      </ul>,
    );
    const el = screen.getByRole("listitem");
    // Substring, not equality, and read from textContent rather than from an
    // accessible-name query.
    //
    // Both choices are forced by MEASURED facts, recorded in
    // `.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md`:
    //
    //  - An ARIA `listitem` does NOT derive its accessible name from content
    //    (verified: `getByRole("listitem", { name: /Airplane mode/ })` finds
    //    nothing, while the same query on a `button` matches). So there is no
    //    web accessible name to assert — only content. Native, by contrast,
    //    sets an explicit `accessibilityLabel`. That asymmetry is FILED, not
    //    papered over.
    //  - The separator is not asserted: web concatenates with no space
    //    ("Airplane modeUpdated 2 h ago") while native joins with ", ". Pinning
    //    either would pin an accident of each platform's naming, not a Kern
    //    decision.
    const name = el.textContent ?? "";
    for (const part of row.nameMustContain ?? []) {
      assertParity(
        row,
        R,
        name.includes(part),
        true,
        `the row must render ${JSON.stringify(part)} as announced text (got ${JSON.stringify(name)})`,
      );
    }
    // The supporting line must be ANNOUNCED, not merely rendered. This is the
    // half that `textContent` alone cannot prove, and it is mutation-proving:
    // adding `aria-hidden` to the supporting span leaves `textContent`
    // unchanged but strips the line from assistive tech, and this assertion is
    // what fails. An earlier draft asserted on `textContent` only and the
    // `aria-hidden` mutation passed it — decoration, not a test.
    const supporting = el.querySelector(".kern-list-item-supporting");
    assertParity(
      row,
      R,
      supporting === null,
      false,
      "the supporting line must be rendered when `supporting` is provided",
    );
    assertParity(
      row,
      R,
      supporting?.closest("[aria-hidden='true']") === null,
      true,
      "the supporting line must stay in the accessibility tree",
    );
  });

  it("dialog: is reachable by its title", () => {
    const row = contractFor("dialog");
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <DialogTitle>{row.name}</DialogTitle>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const el = screen.getByRole("dialog", { name: row.name });
    expect(
      el,
      divergenceMessage(
        row,
        R,
        "a dialog must be findable by its title — an unlabelled modal is a trap",
      ),
    ).toBeTruthy();
  });
});

describe("web parity contract (tranche 2): text fields", () => {
  it.each([
    ["input", false],
    ["textarea", true],
  ] as const)(
    "%s: accepts text, and is single- vs multi-line per the contract",
    async (component, multiline) => {
      const user = userEvent.setup();
      const row = contractFor(component);
      render(
        component === "input" ? (
          <Input aria-label={row.name} />
        ) : (
          <Textarea aria-label={row.name} />
        ),
      );
      const el = screen.getByRole("textbox", { name: row.name });
      await user.type(el, "Hello");
      assertParity(
        row,
        R,
        (el as HTMLInputElement | HTMLTextAreaElement).value,
        "Hello",
        "the field must accept typed text",
      );
      assertParity(
        row,
        R,
        el.tagName.toLowerCase() === "textarea",
        multiline,
        `multiline should be ${multiline}`,
      );
      expect(row.multiline).toBe(multiline);
    },
  );

  it.each([
    ["input", false],
    ["textarea", true],
  ] as const)(
    "%s: a disabled field refuses text",
    async (component, multiline) => {
      const user = userEvent.setup();
      const row = contractFor(component);
      render(
        component === "input" ? (
          <Input aria-label={row.name} disabled />
        ) : (
          <Textarea aria-label={row.name} disabled />
        ),
      );
      const el = screen.getByRole("textbox", { name: row.name }) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      await user.type(el, "Hello");
      assertParity(
        row,
        R,
        el.value,
        "",
        "a disabled field must not accept text",
      );
      expect(row.refusesTextWhenDisabled).toBe(true);
      expect(row.multiline).toBe(multiline);
    },
  );

  it("input: an error is announced to assistive tech", () => {
    const row = contractFor("input");
    // NOTE: `errorMessage` is deliberately NOT passed. Native `Input` accepts an
    // `errorMessage` prop; web `Input` does not (it is not in `InputProps`, and
    // passing it produced both a React unknown-prop warning and a typecheck
    // error). That is a real API asymmetry between the renderers, filed in
    // `.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md`; the
    // contract row asserts only that web announces invalidity AT ALL.
    render(<Input aria-label={row.name} error />);
    const el = screen.getByRole("textbox", { name: row.name });
    // Web announces invalidity via `aria-invalid`; native folds the message
    // into the hint because RN has no `accessibilityState.invalid`. That is a
    // deliberate, documented asymmetry, so the contract asserts only that the
    // error is announced AT ALL on this renderer.
    const announced =
      el.getAttribute("aria-invalid") === "true" ||
      el.getAttribute("aria-describedby") !== null ||
      (el.textContent ?? "").includes("Name required");
    assertParity(
      row,
      R,
      announced,
      true,
      "an invalid field must be announced as invalid",
    );
  });
});
