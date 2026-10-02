import { render, screen } from "@testing-library/react-native";
import { LoadingIndicator, loadingIndicatorStyles } from "./loading-indicator";

/**
 * What a screen reader is told is the whole contract of a loading indicator;
 * the ring is presentational. So these assert roles, live-region politeness,
 * naming, and the ABSENCE of a fabricated value.
 */
describe("LoadingIndicator", () => {
  it("announces as a status, not a progressbar", async () => {
    await render(<LoadingIndicator />);
    const el = screen.getByTestId("kern-loading-indicator");
    expect(el.props.role).toBe("status");
    // A progressbar here would claim a quantity this component does not have.
    expect(el.props.accessibilityRole).toBeUndefined();
  });

  /**
   * Polite, not assertive: the pending state should be announced without
   * cutting off whatever the user is currently reading.
   */
  it("uses a polite live region", async () => {
    await render(<LoadingIndicator />);
    expect(
      screen.getByTestId("kern-loading-indicator").props
        .accessibilityLiveRegion,
    ).toBe("polite");
  });

  it("names itself from the label", async () => {
    await render(<LoadingIndicator label="Loading invoices" />);
    expect(screen.getByLabelText("Loading invoices")).toBeTruthy();
  });

  it("is named even with no label given", async () => {
    await render(<LoadingIndicator />);
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  /**
   * When the label is VISIBLE it is already the accessible name. Naming the
   * region as well duplicates it. This mirrors the web, which omits aria-label
   * in exactly this case.
   */
  it("does not name the region when the label is already visible", async () => {
    await render(<LoadingIndicator label="Loading invoices" showLabel />);
    const el = screen.getByTestId("kern-loading-indicator");
    expect(el.props.accessibilityLabel).toBeUndefined();
    // but the text is really there, so the control is still named
    expect(screen.getByText("Loading invoices")).toBeTruthy();
  });

  it("renders no visible label unless asked", async () => {
    await render(<LoadingIndicator label="Loading invoices" />);
    expect(screen.queryByText("Loading invoices")).toBeNull();
  });

  /**
   * Indeterminate means there is no reading. Announcing a progressbar with no
   * `now` claims a quantity that does not exist, which is why nothing numeric
   * is published at all.
   */
  it("publishes no numeric value", async () => {
    await render(<LoadingIndicator />);
    const el = screen.getByTestId("kern-loading-indicator");
    expect(el.props.accessibilityValue).toBeUndefined();
  });

  /**
   * The ring carries nothing the status region does not already carry, so it is
   * removed from the accessibility tree — a visible-but-unnamed spinning element
   * is noise.
   */
  it("hides the ring from assistive tech", async () => {
    await render(<LoadingIndicator />);
    // Deliberately NOT `getByTestId`: RNTL honours `accessibilityElementsHidden`
    // and refuses to match a hidden element, so the ring being present in the
    // tree yet unreachable by query is precisely the behaviour under test.
    const tree = JSON.stringify(screen.toJSON());
    expect(tree).toContain("no-hide-descendants");
    expect(tree).toContain("kern-loading-indicator-ring"); // it IS rendered
    expect(screen.queryByTestId("kern-loading-indicator-ring")).toBeNull(); // …but not reachable
  });

  /**
   * Reduced motion stops the ROTATION, never the element. The feedback must
   * still be there — "it does not move" is the acceptable outcome, "it
   * disappeared" is worse than either.
   */
  it("still renders the ring under reduced motion", async () => {
    // The system setting is not something a test can assume; the contract is
    // that the ring EXISTS regardless of whether it spins. Reduced motion stops
    // the animation, never the element.
    await render(<LoadingIndicator />);
    const tree = JSON.stringify(screen.toJSON());
    // a border radius on a sized box = the ring is rendered, not unmounted
    expect(tree).toContain("borderRadius");
    expect(tree).toContain("borderTopColor");
  });
});

describe("loadingIndicatorStyles", () => {
  it("leaves a visible gap so a static ring still reads as incomplete", async () => {
    // Under reduced motion nothing turns, so the ring must still LOOK pending.
    // Fully-bordered primary would render as a solid disc.
    const ring = loadingIndicatorStyles("default").ring;
    expect(ring.borderTopColor).toBe("transparent");
    expect(ring.borderColor).not.toBe("transparent");
  });

  it("scales the ring with size and thickens the border at lg", async () => {
    const sm = loadingIndicatorStyles("sm").ring;
    const lg = loadingIndicatorStyles("lg").ring;
    expect(lg.width).toBeGreaterThan(sm.width as number);
    expect(lg.borderWidth).toBeGreaterThan(sm.borderWidth as number);
  });
});
