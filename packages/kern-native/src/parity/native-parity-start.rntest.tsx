import { assertParity, contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { ContrastToggle } from "../components/contrast-toggle";
import { Kbd } from "../components/kbd";
import { SettingsRow } from "../components/settings-row";
import { StatusBar } from "../components/status-bar";
import { ThemeToggle } from "../components/theme-toggle";
import { TopAppBarToggle } from "../components/top-app-bar-toggle";

/**
 * Native side of the start-tier GAP-fill rows (tranche 6): the six web-only
 * concepts that gained a native version after both sides were measured.
 *
 * Each describe consumes its contract row: the obligation is asserted through
 * `assertParity`, never reworded, so a row edit that weakens the obligation
 * breaks the suite that proves it.
 */
const R = "native" as const;

describe("native parity contract: kbd-hint", () => {
  it("announces the hint as static text", async () => {
    const r = contractFor("kbd");
    await render(<Kbd>Ctrl</Kbd>);
    const hint = screen.getByTestId("kern-kbd");
    assertParity(
      r,
      R,
      String(hint.props.accessibilityLabel ?? ""),
      "Ctrl",
      "the hint text must reach assistive tech as the accessible name",
    );
    assertParity(
      r,
      R,
      String(hint.props.accessibilityRole ?? ""),
      "text",
      "the hint is static text, not a control",
    );
  });
});

describe("native parity contract: settings-row-labelled", () => {
  it("carries label, supporting text and the trailing control", async () => {
    const r = contractFor("settings-row");
    await render(
      <SettingsRow
        label="Notifications"
        supporting="Badges, sounds, banners"
        trailing={<RNText testID="kern-trailing">On</RNText>}
      />,
    );
    const row = screen.getByTestId("kern-settings-row");
    assertParity(
      r,
      R,
      String(row.props.accessibilityLabel ?? ""),
      "Notifications",
      "the label is the accessible name",
    );
    assertParity(
      r,
      R,
      screen.getByText("Badges, sounds, banners") ? "present" : "absent",
      "present",
      "the supporting text renders beside the label",
    );
    assertParity(
      r,
      R,
      screen.getByTestId("kern-trailing") ? "present" : "absent",
      "present",
      "activation belongs to the trailing control, which the row carries",
    );
  });
});

describe("native parity contract: status-bar-strip", () => {
  it("carries the slots under one accessible name", async () => {
    const r = contractFor("status-bar");
    await render(
      <StatusBar leading={<RNText>●</RNText>} trailing={<RNText>100%</RNText>}>
        <RNText>Synced</RNText>
      </StatusBar>,
    );
    const strip = screen.getByTestId("kern-status-bar");
    assertParity(
      r,
      R,
      String(strip.props.accessibilityLabel ?? ""),
      "Status",
      "the strip carries one accessible name",
    );
    assertParity(
      r,
      R,
      screen.getByText("Synced") ? "present" : "absent",
      "present",
      "the status text stays centered between the slots",
    );
  });
});

describe("native parity contract: theme-toggle-action", () => {
  it("names the destination and leaves no pressed state", async () => {
    const r = contractFor("theme-toggle");
    const onToggle = jest.fn();
    await render(<ThemeToggle mode="dark" onToggle={onToggle} />);
    const toggle = screen.getByTestId("kern-theme-toggle");
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityLabel ?? ""),
      "Switch to light",
      "the name says where the press goes, never where it is",
    );
    fireEvent.press(toggle);
    assertParity(
      r,
      R,
      onToggle.mock.calls.length,
      1,
      "activation requests the theme change",
    );
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityState?.selected ?? "absent"),
      "absent",
      "no pressed axis latches behind",
    );
  });
});

describe("native parity contract: contrast-toggle-action", () => {
  it("names the destination and leaves no pressed state", async () => {
    const r = contractFor("contrast-toggle");
    const onToggle = jest.fn();
    await render(
      <ContrastToggle contrast="standard" onToggle={onToggle} />,
    );
    const toggle = screen.getByTestId("kern-contrast-toggle");
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityLabel ?? ""),
      "Use high contrast",
      "the name says where the press goes, never where it is",
    );
    fireEvent.press(toggle);
    assertParity(
      r,
      R,
      onToggle.mock.calls.length,
      1,
      "activation requests the contrast change",
    );
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityState?.selected ?? "absent"),
      "absent",
      "no pressed axis latches behind",
    );
  });
});

describe("native parity contract: top-app-bar-toggle-expanded", () => {
  it("reports which navigation state it is in", async () => {
    const r = contractFor("top-app-bar-toggle");
    const onToggle = jest.fn();
    const { rerender } = await render(
      <TopAppBarToggle open={false} onToggle={onToggle} />,
    );
    assertParity(
      r,
      R,
      String(
        screen.getByTestId("kern-top-app-bar-toggle").props
          .accessibilityLabel ?? "",
      ),
      "Open navigation",
      "closed shell names the opening action",
    );
    await rerender(<TopAppBarToggle open onToggle={onToggle} />);
    const toggle = screen.getByTestId("kern-top-app-bar-toggle");
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityLabel ?? ""),
      "Close navigation",
      "open shell names the closing action",
    );
    assertParity(
      r,
      R,
      String(toggle.props.accessibilityState?.expanded ?? ""),
      "true",
      "the open state is reported to assistive technology",
    );
  });
});
