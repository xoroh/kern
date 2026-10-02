/**
 * Native side of the cross-renderer parity contract, tranche 2 (P2b-4).
 *
 * Reads the SAME declaration as the web suite (`parity/contract.ts`, aliased
 * `@kern-parity/contract`) and asserts the same observable semantics through
 * RNTL. This file imports nothing from `@xoroh/kern` — ADR 002 — and asserts
 * through `assertParity` rather than `expect`, because Jest's `expect` takes no
 * message argument and a bare `false !== true` here would be far harder to act
 * on than the web suite's failure.
 *
 * Every assertion below was measured against this renderer BEFORE being
 * written; see `.team/findings/2026-10-01-p2b4-tranche2-measured-divergences.md`.
 * Four measured divergences are deliberately NOT asserted here (list-item
 * interactive role, dialog role, dialog aria-modal, native text-field role) —
 * they need a design ruling first, and encoding one renderer's API into a
 * cross-renderer contract is the mistake this file exists to prevent.
 */

import {
  assertParity,
  contractFor,
  type ParityRow,
} from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Chip } from "../components/chip";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { ListItem } from "../components/list-item";
import { Textarea } from "../components/textarea";

const R = "native" as const;

/** Read a control's boolean state on whichever axis the contract names.
 *  RN reports the `pressed` axis as `accessibilityState.selected`. */
function readAxis(el: { props: Record<string, unknown> }, row: ParityRow) {
  const state = (el.props.accessibilityState ?? {}) as Record<string, unknown>;
  if (row.axis === "checked") return Boolean(state.checked);
  return Boolean(state.selected);
}

describe("native parity contract (tranche 2): chip", () => {
  it("filter chip: one activation selects it, a second releases it", async () => {
    const row = contractFor("chip", "Vegetarian");
    await render(<Chip variant="filter">{row.name}</Chip>);
    const el = screen.getByTestId("kern-chip");
    assertParity(
      row,
      R,
      readAxis(el, row),
      row.expects.initial,
      "a filter chip starts unselected",
    );
    await act(async () => {
      fireEvent.press(el);
    });
    assertParity(
      row,
      R,
      readAxis(el, row),
      row.expects.afterActivate,
      `after one activation should be ${row.expects.afterActivate}`,
    );
    await act(async () => {
      fireEvent.press(el);
    });
    assertParity(
      row,
      R,
      readAxis(el, row),
      row.expects.initial,
      "a selected filter chip must release again",
    );
  });

  it("filter chip: a disabled chip cannot be selected", async () => {
    const row = contractFor("chip", "Vegetarian");
    await render(
      <Chip variant="filter" disabled>
        {row.name}
      </Chip>,
    );
    const el = screen.getByTestId("kern-chip");
    await act(async () => {
      fireEvent.press(el);
    });
    assertParity(
      row,
      R,
      readAxis(el, row),
      row.expects.afterDisabledActivate,
      "a disabled chip must stay unselected",
    );
  });

  it("assist chip: activation never leaves a selected state behind", async () => {
    const row = contractFor("chip", "Get directions");
    let pressed = 0;
    await render(
      <Chip
        variant="assist"
        onPress={() => {
          pressed += 1;
        }}
      >
        {row.name}
      </Chip>,
    );
    const el = screen.getByTestId("kern-chip");
    await act(async () => {
      fireEvent.press(el);
    });
    // The press must still register — an assist chip that swallows taps is its
    // own bug — but it must not report a selected state afterwards.
    assertParity(row, R, pressed, 1, "an assist chip must still fire onPress");
    assertParity(
      row,
      R,
      readAxis(el, row),
      row.expects.afterActivate,
      "an assist chip is not a toggle: activation must not leave a selected state",
    );
  });
});

describe("native parity contract (tranche 2): named surfaces", () => {
  it("list item: announces both the headline and the supporting line", async () => {
    const row = contractFor("list-item");
    await render(
      <ListItem
        title="Airplane mode"
        supporting="Updated 2 h ago"
        testID="li"
      />,
    );
    const name = String(screen.getByTestId("li").props.accessibilityLabel);
    for (const part of row.nameMustContain ?? []) {
      assertParity(
        row,
        R,
        name.includes(part),
        true,
        `the accessible name must announce ${JSON.stringify(part)}`,
      );
    }
  });

  it("dialog: exposes its title to assistive tech", async () => {
    const row = contractFor("dialog");
    await render(
      <Dialog
        visible
        title={row.name}
        testID="dlg"
        actions={[{ label: "Keep" }]}
      />,
    );
    const el = screen.getByTestId("dlg");
    const label = String(el.props.accessibilityLabel ?? "");
    for (const part of row.nameMustContain ?? []) {
      assertParity(
        row,
        R,
        label.includes(part),
        true,
        `the dialog must announce its title ${JSON.stringify(part)}`,
      );
    }
    // The RN analogue of `aria-modal`. Asserting THIS rather than a shared
    // attribute name is deliberate: web sets no `aria-modal` on Dialog at all
    // (filed for a ruling), so a shared-attribute row would be red today.
    assertParity(
      row,
      R,
      el.parent?.props?.accessibilityViewIsModal ?? true,
      true,
      "a modal dialog must mark its surface as modal",
    );
  });

  it("dialog: an action press dismisses", async () => {
    const row = contractFor("dialog");
    let dismissed = 0;
    await render(
      <Dialog
        visible
        title={row.name}
        testID="dlg"
        actions={[{ label: "Discard" }]}
        onDismiss={() => {
          dismissed += 1;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Discard" }));
    });
    assertParity(
      row,
      R,
      dismissed,
      1,
      "acting on a dialog must dismiss it — a modal that stays open is a trap",
    );
  });
});

describe("native parity contract (tranche 2): text fields", () => {
  it.each([
    ["input", false],
    ["textarea", true],
  ] as const)(
    "%s: accepts text, and is single- vs multi-line per the contract",
    async (component, multiline) => {
      const row = contractFor(component);
      // The native field is UNCONTROLLED unless a host passes `value`, so the
      // assertion cannot read `props.value` back off the element (that is
      // `undefined` on both sides of an uncontrolled input, web included). What
      // a cross-renderer contract can hold is that the field REPORTS the typed
      // text — the observable a host actually depends on.
      const seen: string[] = [];
      const onChangeText = (next: string) => {
        seen.push(next);
      };
      await render(
        component === "input" ? (
          <Input
            accessibilityLabel={row.name}
            testID="f"
            onChangeText={onChangeText}
          />
        ) : (
          <Textarea
            accessibilityLabel={row.name}
            testID="f"
            onChangeText={onChangeText}
          />
        ),
      );
      const el = screen.getByTestId("f");
      await act(async () => {
        fireEvent.changeText(el, "Hello");
      });
      assertParity(
        row,
        R,
        seen.at(-1),
        "Hello",
        "the field must report the typed text to its host",
      );
      assertParity(
        row,
        R,
        Boolean(el.props.multiline),
        multiline,
        `multiline should be ${multiline}`,
      );
      assertParity(
        row,
        R,
        row.multiline,
        multiline,
        "the contract and the component disagree about multiline",
      );
    },
  );

  it.each([
    ["input", false],
    ["textarea", true],
  ] as const)(
    "%s: a disabled field refuses text",
    async (component, multiline) => {
      const row = contractFor(component);
      await render(
        component === "input" ? (
          <Input accessibilityLabel={row.name} testID="f" editable={false} />
        ) : (
          <Textarea accessibilityLabel={row.name} testID="f" editable={false} />
        ),
      );
      const el = screen.getByTestId("f");
      const disabled = Boolean(
        (el.props.accessibilityState as { disabled?: boolean })?.disabled,
      );
      assertParity(
        row,
        R,
        disabled,
        true,
        "editable={false} must report itself as disabled",
      );
      assertParity(row, R, row.refusesTextWhenDisabled, true, "contract field");
      assertParity(row, R, row.multiline, multiline, "contract multiline");
    },
  );

  it("input: an error is announced to assistive tech", async () => {
    const row = contractFor("input");
    await render(
      <Input
        accessibilityLabel={row.name}
        testID="f"
        error
        errorMessage="Name required"
      />,
    );
    const hint = String(screen.getByTestId("f").props.accessibilityHint ?? "");
    // RN has no `accessibilityState.invalid`, so native announces the error
    // through the hint. Asserting THAT is asserting this renderer's documented
    // mechanism, not pinning the web renderer's `aria-invalid`.
    assertParity(
      row,
      R,
      hint.includes("Name required"),
      true,
      "an invalid field must announce the error message",
    );
    assertParity(row, R, row.errorViaHint, true, "contract field");
  });
});
