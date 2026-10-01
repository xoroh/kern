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
 * renderers, plus the three divergences ruled in
 * `.team/reports/reviews/m3/2026-10-01-p2b4-tranche2-divergence-rulings.md`
 * and fixed on the WEB side (list-item interactive role, dialog `aria-modal`,
 * `Input.errorMessage`). The native `dialog` role fix is `kern-lead`'s.
 */

import {
  assertParity,
  contractFor,
  contractForInteractive,
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

  it("list item (static): is a list item, not a control", () => {
    const row = contractFor("list-item");
    render(
      <ul>
        <ListItem headline="Airplane mode" supporting="Updated 2 h ago" />
      </ul>,
    );
    // The static row's role is STATED, not left to the DOM default. The
    // assertion is on the ATTRIBUTE, not on `getByRole("listitem")`: a bare
    // `<li>` already resolves to that role implicitly, so a role query passes
    // with the attribute absent — which is exactly the case a mutation
    // reintroduces, and why this looked green when it was not. Reading the
    // attribute is the only assertion that can tell stated from inherited.
    const row_ = screen.getByRole("listitem");
    assertParity(
      row,
      R,
      row_.getAttribute("role"),
      "listitem",
      "a static row must STATE role=listitem, not inherit it from <li>",
    );
    assertParity(
      row,
      R,
      screen.queryByRole("button"),
      null,
      "a static row must NOT masquerade as a control",
    );
    assertParity(
      row,
      R,
      screen.queryByRole("link"),
      null,
      "a static row must NOT masquerade as a link",
    );
    expect(row.interactive).toBe(false);
  });

  it("list item (interactive): an actionable row is a button, operable by keyboard", async () => {
    const user = userEvent.setup();
    const row = contractForInteractive("list-item");
    const onPress = vi.fn();
    render(
      <ul>
        <ListItem
          headline="Airplane mode"
          supporting="Updated 2 h ago"
          onPress={onPress}
        />
      </ul>,
    );
    // The whole point of the variant: a row that acts is a CONTROL, so it is
    // reachable as one. Before this, the row rendered a bare `<li>` and this
    // query found nothing — a clickable-looking row that no screen reader
    // could activate. `role="button"` on the wrapper is explicitly ruled out
    // too: a `<li role="button">` is not focusable and not Enter/Space
    // operable, so it would pass a role assertion while remaining a mouse-only
    // control. The real `<button>` is what makes the keyboard half true.
    const el = screen.getByRole(row.interactiveRole ?? "button");
    assertParity(
      row,
      R,
      el.tagName.toLowerCase(),
      "button",
      "the actionable element must be a real button, not a role on a non-control",
    );
    await user.tab();
    assertParity(
      row,
      R,
      document.activeElement === el,
      true,
      "an actionable row must be reachable in the tab order",
    );
    await user.keyboard("{Enter}");
    assertParity(
      row,
      R,
      onPress.mock.calls.length,
      1,
      "Enter must activate an actionable row",
    );
    await user.keyboard(" ");
    assertParity(
      row,
      R,
      onPress.mock.calls.length,
      2,
      "Space must activate an actionable row too — a button, not a div",
    );
  });

  it("list item (interactive): a navigational row is a link", () => {
    const row = contractForInteractive("list-item");
    render(
      <ul>
        <ListItem
          headline="Airplane mode"
          supporting="Updated 2 h ago"
          href="/settings/airplane"
        />
      </ul>,
    );
    // `href` ⇒ link, `onPress` ⇒ button. Conflating them is the divergence in
    // miniature: a navigational row announced as a button misleads about what
    // activation does (it should navigate, and it should expose a destination).
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/settings/airplane");
    assertParity(
      row,
      R,
      link.tagName.toLowerCase(),
      "a",
      "a row with `href` must render an anchor",
    );
  });

  it("list item (interactive): a disabled actionable row cannot be activated", async () => {
    const user = userEvent.setup();
    const row = contractForInteractive("list-item");
    const onPress = vi.fn();
    render(
      <ul>
        <ListItem
          headline="Airplane mode"
          supporting="Updated 2 h ago"
          onPress={onPress}
          disabled
        />
      </ul>,
    );
    await user.click(screen.getByRole("button"));
    assertParity(
      row,
      R,
      onPress.mock.calls.length,
      0,
      "a disabled actionable row must not fire",
    );
    expect(row.expects.afterDisabledActivate).toBe(false);
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

  it("dialog: announces that it is modal", () => {
    const row = contractFor("dialog");
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <DialogTitle>{row.name}</DialogTitle>
        </Dialog.Content>
      </Dialog.Root>,
    );
    // Base UI's `Dialog.Popup` traps focus and inerts the page but emits no
    // `aria-modal` (measured; the same gap the navigation drawer had to fix by
    // hand). Without this attribute a screen reader announces a dialog with
    // no indication that the rest of the page is unreachable — the visual and
    // the accessibility trees disagree about whether you are trapped.
    // Mutation-proving: the dialog behaviour above passes with this attribute
    // absent, so this assertion is the only thing standing behind it.
    const el = screen.getByRole("dialog", { name: row.name });
    assertParity(
      row,
      R,
      el.getAttribute("aria-modal"),
      "true",
      "a modal dialog must expose its modality (aria-modal)",
    );
    expect(row.modal).toBe(true);
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

  it("input: an errorMessage implies the error state", () => {
    const row = contractFor("input");
    // The prop surface is now the same on both renderers, so a host writes
    // `errorMessage` once. The STATE is implied by the message: requiring both
    // `error` and `errorMessage` is how a field ends up showing red text with
    // no `aria-invalid`, which announces nothing.
    render(<Input aria-label={row.name} errorMessage="Name required" />);
    const el = screen.getByRole("textbox", { name: row.name });
    assertParity(
      row,
      R,
      el.getAttribute("aria-invalid"),
      "true",
      "passing errorMessage alone must mark the field invalid",
    );
  });

  it("input: an errorMessage reaches assistive tech as text, wired to the field", () => {
    const row = contractFor("input");
    render(<Input aria-label={row.name} errorMessage="Name required" />);
    const el = screen.getByRole("textbox", { name: row.name });
    // Three separate obligations, and the interesting one is the last:
    //  1. the message renders as `FieldMessage variant="error"` → `role="alert"`
    //  2. the field POINTS at it via `aria-describedby` — a `role="alert"`
    //     paragraph that nothing references is announced on a timer at best,
    //     and not at all on focus, which is when a screen-reader user needs it
    //  3. the id in `aria-describedby` resolves to that element, so the text
    //     the field describes it with is the text that was rendered
    const alert = screen.getByRole("alert");
    assertParity(
      row,
      R,
      alert.textContent,
      "Name required",
      "the error message must render its text",
    );
    const describedBy = el.getAttribute("aria-describedby");
    assertParity(
      row,
      R,
      describedBy !== null && describedBy === alert.id,
      true,
      `the field's aria-describedby (${JSON.stringify(describedBy)}) must reference the message element (id ${JSON.stringify(alert.id)})`,
    );
    expect(row.errorMessageCarriesText).toBe(true);
  });

  it("input: an existing aria-describedby is kept alongside the error message", () => {
    const row = contractFor("input");
    // Overwriting a host's own description would silently drop it — the
    // regression this shape invites, since `aria-describedby` is a space-
    // separated list and the naive implementation assigns rather than appends.
    render(
      <>
        <Input
          aria-label={row.name}
          aria-describedby="hint-1"
          errorMessage="Name required"
        />
        <span id="hint-1">As it appears on your passport</span>
      </>,
    );
    const el = screen.getByRole("textbox", { name: row.name });
    const describedBy = el.getAttribute("aria-describedby") ?? "";
    const alert = screen.getByRole("alert");
    expect(describedBy.split(" ")).toContain("hint-1");
    expect(describedBy.split(" ")).toContain(alert.id);
    expect(document.getElementById("hint-1")).not.toBeNull();
  });
});
