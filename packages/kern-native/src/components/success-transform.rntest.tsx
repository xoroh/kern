import { render, screen } from "@testing-library/react-native";
import { FEEDBACK_SIZE_DP } from "@xoroh/kern-m3";
import { defaultScheme } from "../theme";
import { SuccessTransform, successTransformStyles } from "./success-transform";

describe("SuccessTransform", () => {
  it("shows the loader while waiting", async () => {
    await render(<SuccessTransform state="loading" />);
    expect(screen.getByTestId("kern-success-transform")).toBeTruthy();
    expect(screen.getByLabelText("Loading")).toBeTruthy();
    expect(screen.queryByTestId("kern-success-transform-tick")).toBeNull();
  });

  it("announces Done with the tick on success", async () => {
    await render(<SuccessTransform state="success" />);
    expect(screen.getByLabelText("Done")).toBeTruthy();
    expect(screen.getByTestId("kern-success-transform-tick")).toBeTruthy();
  });

  it("paints the disc with the success role by default", async () => {
    const scheme = defaultScheme();
    await render(<SuccessTransform state="success" />);
    expect(screen.getByLabelText("Done")).toHaveStyle({
      backgroundColor: scheme.color.success,
    });
  });

  it("honors successColor and custom testID overrides", async () => {
    const scheme = defaultScheme();
    await render(
      <SuccessTransform
        state="success"
        successColor={scheme.color.primary}
        testID="done"
      />,
    );
    expect(screen.getByTestId("done")).toHaveStyle({
      backgroundColor: scheme.color.primary,
    });
  });
});

describe("successTransformStyles", () => {
  it("sizes the disc from the feedback shape metric", () => {
    const scheme = defaultScheme();
    const edge = FEEDBACK_SIZE_DP.md.shape * 1.6;
    const styles = successTransformStyles("md", scheme.color.success, scheme);
    expect(styles.check).toMatchObject({
      width: edge,
      height: edge,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.success,
    });
  });

  it("draws the tick with the border trick on the on-success role", () => {
    const scheme = defaultScheme();
    const styles = successTransformStyles("sm", scheme.color.success, scheme);
    expect(styles.tick.borderColor).toBe(scheme.color.onSuccess);
    expect(styles.tick.borderRadius).toBe(
      Number.parseFloat(scheme.shape["extra-small"]),
    );
    // The tick is two borders, never a fill.
    expect(styles.tick).not.toHaveProperty("backgroundColor");
    expect(styles.tick.borderLeftWidth).toBeGreaterThan(0);
    expect(styles.tick.borderBottomWidth).toBeGreaterThan(0);
  });
});
