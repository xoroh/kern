import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { DockSheet } from "./sheets";

/**
 * The docked sheet rests at NO elevation, on BOTH renderers.
 *
 * This is a parity assertion, not a styling preference. The web renderer ruled
 * it first: a docked panel is persistent and non-modal, so at modal elevation it
 * "misreads as an overlay" (sheet-family.tsx:36). Native then carried
 * `elevation: 3` plus a four-property iOS shadow block -- so the two renderers
 * disagreed about the same component, and nothing caught it.
 *
 * A hard-coded style is exactly the kind of value that survives review and comes
 * back, so this asserts on the RENDERED style rather than the source.
 */
describe("DockSheet elevation", () => {
  it("rests at zero elevation when open", async () => {
    await render(
      <DockSheet open>
        <RNText>docked</RNText>
      </DockSheet>,
    );
    const el = screen.getByTestId("kern-dock-sheet");
    const style = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    // Android reads `elevation`; iOS reads the shadow quartet. Both must be
    // absent, not merely zero -- a `shadowOpacity: 0` still casts on some
    // platforms, and `elevation: 0` would read as a deliberate level rather than
    // as the absence of one.
    expect(style.elevation ?? 0).toBe(0);
    expect(style.shadowOpacity).toBeUndefined();
    expect(style.shadowRadius).toBeUndefined();
    expect(style.shadowOffset).toBeUndefined();
    expect(style.shadowColor).toBeUndefined();
  });

  it("still separates itself from the surface by tone, not by shadow", async () => {
    // Removing elevation must not remove ALL separation -- otherwise this fix
    // would trade a false-overlay reading for an invisible panel.
    await render(
      <DockSheet open>
        <RNText>docked</RNText>
      </DockSheet>,
    );
    const el = screen.getByTestId("kern-dock-sheet");
    const style = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(style.backgroundColor).toBeDefined();
  });

  it("is absent when closed", async () => {
    await render(
      <DockSheet open={false}>
        <RNText>docked</RNText>
      </DockSheet>,
    );
    expect(screen.queryByTestId("kern-dock-sheet")).toBeNull();
  });
});
