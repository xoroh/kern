/**
 * Native behaviour suite for the M3 plain Tooltip.
 *
 * Two kinds of test, deliberately separated (the tranche-1/2/3 convention):
 *
 * 1. The `parity contract (tranche 4)` block reads the SAME declaration as the
 *    web suite (`parity/contract.ts`, aliased `@kern-parity/contract`). It is
 *    cross-renderer: a failure means the two disagree.
 * 2. The rest assert behaviour the contract deliberately does NOT pin, because
 *    the two renderers legitimately differ there — chiefly the TRIGGER, which
 *    is the one declared divergence.
 *
 * **Why the trigger is not cross-renderer.** M3's trigger is hover OR focus.
 * Touch has no hover, so the native side implements focus only. That is a
 * divergence declared on purpose (SPECS-6 / D-026.1′), and a contract row
 * asserting a hover trigger would be red on web and a contract asserting
 * focus-only would be red on touch hardware. The row therefore pins the
 * obligation both sides share — the hint text reaches assistive technology —
 * and the trigger is asserted here, natively, as kern's own decision.
 *
 * This file imports nothing from `@xoroh/kern` — ADR 002.
 */
import { assertParity, contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react-native";
import { resolveThemeDetails } from "@xoroh/kern-theme";
import { act } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import { Text } from "../components/text";
import { Tooltip } from "../components/tooltip";

const R = "native" as const;

/** Collapse RN's nested style arrays into one object. */
const flatten = (style: StyleProp<ViewStyle>): ViewStyle =>
  StyleSheet.flatten(style) ?? {};

/** The trigger, found by the contract's own accessible name. */
function trigger(name: string) {
  return screen.getByLabelText(name);
}

describe("native parity contract (tranche 4): tooltip", () => {
  it("delivers the supplementary text to assistive technology", async () => {
    const row = contractFor("tooltip");
    await render(
      <Tooltip label={row.name} hint={row.hintCarriesText}>
        <Text>Save</Text>
      </Tooltip>,
    );
    // The hint must be TEXT on the a11y tree — not merely painted. This is the
    // obligation both renderers share and the reason the row exists.
    assertParity(
      row,
      R,
      String(trigger(row.name).props.accessibilityHint),
      row.hintCarriesText,
      "the supplementary text must reach assistive technology as text",
    );
  });

  it("keeps the hint reachable while the surface is closed", async () => {
    // The case a screen-reader user actually hits. A tooltip that only exists
    // while focused would put the text behind an interaction, which is M3's
    // NC-3 negative: a tooltip must not hide crucial information.
    const row = contractFor("tooltip");
    await render(
      <Tooltip label={row.name} hint={row.hintCarriesText}>
        <Text>Save</Text>
      </Tooltip>,
    );
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
    assertParity(
      row,
      R,
      String(trigger(row.name).props.accessibilityHint),
      row.hintCarriesText,
      "the hint must not depend on the surface being open",
    );
  });

  it("renders the surface inertly, with no interactive role", async () => {
    // `surfaceInert` is a real assertion, not a restatement: a tooltip that
    // could be pressed would let a supplementary label trap a touch.
    const row = contractFor("tooltip");
    if (!row.surfaceInert)
      throw new Error("tooltip row must declare surfaceInert");
    await render(
      <Tooltip label={row.name} hint={row.hintCarriesText} defaultOpen>
        <Text>Save</Text>
      </Tooltip>,
    );
    const surface = screen.getByTestId("kern-tooltip-content");
    assertParity(
      row,
      R,
      surface.props.pointerEvents,
      "none",
      "the surface must not swallow a touch meant for the trigger",
    );
    assertParity(
      row,
      R,
      String(surface.props.accessibilityRole),
      "text",
      "a plain tooltip is a label, so it takes no interactive role of its own",
    );
  });

  it("merges a host's own hint rather than replacing it", async () => {
    const row = contractFor("tooltip");
    await render(
      <Tooltip
        label={row.name}
        hint={row.hintCarriesText}
        accessibilityHint="Double tap to save"
      >
        <Text>Save</Text>
      </Tooltip>,
    );
    const hint = String(trigger(row.name).props.accessibilityHint);
    expect(hint).toContain("Double tap to save");
    expect(hint).toContain(row.hintCarriesText);
  });
});

describe("tooltip trigger (native)", () => {
  it("opens on focus — the half of M3's trigger that touch has", async () => {
    // M3's trigger is hover OR focus. Touch has no hover; focus exists on every
    // RN platform that has one at all (keyboard, switch, TV, screen readers).
    // Opening on focus is therefore M3-conformant as written, not a substitute.
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    expect(screen.getByTestId("kern-tooltip-content")).toBeTruthy();
    expect(screen.getByText("Saves your draft")).toBeTruthy();
  });

  it("closes on blur", async () => {
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    expect(screen.getByTestId("kern-tooltip-content")).toBeTruthy();
    await act(async () => {
      trigger("Save").props.onBlur();
    });
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
  });

  it("reports the open state exactly once per change", async () => {
    // A host that opens its own layout on the second report would be reacting
    // to an echo of its own state.
    const seen: boolean[] = [];
    await render(
      <Tooltip
        label="Save"
        hint="Saves your draft"
        onOpenChange={(open) => seen.push(open)}
      >
        <Text>Save</Text>
      </Tooltip>,
    );
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    await act(async () => {
      trigger("Save").props.onBlur();
    });
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    expect(seen).toEqual([true, false, true]);
  });

  it("host-controlled: the host owns the surface, the trigger does not", async () => {
    await render(
      <Tooltip label="Save" hint="Saves your draft" open={false}>
        <Text>Save</Text>
      </Tooltip>,
    );
    // Focus reports, but the host's `open={false}` stands.
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
  });

  it("names the trigger separately from the hint", async () => {
    // If the hint leaked into the accessible NAME, a screen reader would
    // announce "Save, Saves your draft" as one label and the supplement would
    // read as part of the control's identity.
    await render(
      <Tooltip label="Save" hint="Saves your draft" defaultOpen>
        <Text>Save</Text>
      </Tooltip>,
    );
    const node = trigger("Save");
    expect(node.props.accessibilityLabel).toBe("Save");
    expect(String(node.props.accessibilityHint)).toBe("Saves your draft");
  });

  it("does not implement hover — touch has none to implement", async () => {
    // A regression guard on the DECLARED divergence. If someone adds a
    // hover/mouse path to the native tooltip, this fires: the touch affordance
    // is `design-system-lead`'s open ruling (D-026.1′ / SPECS-6), and shipping a
    // gesture before that ruling would make the behaviour a kern invention.
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    const node = trigger("Save");
    expect(node.props.onHoverIn).toBeUndefined();
    expect(node.props.onHoverOut).toBeUndefined();
    expect(node.props.onMouseEnter).toBeUndefined();
  });

  it("announces the expanded state on the trigger", async () => {
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    expect(trigger("Save").props.accessibilityState.expanded).toBe(false);
    await act(async () => {
      trigger("Save").props.onFocus();
    });
    expect(trigger("Save").props.accessibilityState.expanded).toBe(true);
  });

  it("resolves the surface to M3's inverse-surface pair", async () => {
    // The tokens law is enforced on SOURCE by `check:m3` (no raw hex in a
    // component file). What is worth asserting HERE is the resolution: the
    // surface must land on the M3 tooltip container roles — `inverseSurface` /
    // `inverseOnSurface`, the same pair `--md-comp-tooltip-container-*`
    // publishes for web — and not on some hand-picked dark colour. Resolving
    // the theme is what turns a role into a hex, so a hex here is correct; a
    // hex that is NOT the role's value would be the bug.
    await render(
      <Tooltip label="Save" hint="Saves your draft" defaultOpen>
        <Text>Save</Text>
      </Tooltip>,
    );
    const scheme = resolveThemeDetails("light", "standard", "m3");
    const surfaceStyle = flatten(
      screen.getByTestId("kern-tooltip-content").props.style,
    );
    expect(surfaceStyle.backgroundColor).toBe(scheme.color.inverseSurface);
    expect(surfaceStyle.borderRadius).toBe(
      Number.parseFloat(scheme.shape["extra-small"]),
    );
  });

  it("places the surface on the requested side", async () => {
    await render(
      <Tooltip
        label="Save"
        hint="Saves your draft"
        placement="bottom"
        defaultOpen
      >
        <Text>Save</Text>
      </Tooltip>,
    );
    const flat = JSON.stringify(
      screen.getByTestId("kern-tooltip-content").props.style,
    );
    expect(flat).toContain("marginTop");
  });
});
