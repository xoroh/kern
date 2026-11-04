import { render, screen } from "@testing-library/react-native";
import { FEEDBACK_SIZE_DP } from "@xoroh/kern-m3";
import { defaultScheme } from "../theme";
import { Shape, shapeStyles } from "./shape";

describe("Shape", () => {
  it("renders the default testID with the on-surface fill", async () => {
    const scheme = defaultScheme();
    await render(<Shape kind="circle" />);
    expect(screen.getByTestId("kern-shape")).toHaveStyle({
      backgroundColor: scheme.color.onSurface,
    });
  });

  it("honors color, size, and custom testID overrides", async () => {
    const scheme = defaultScheme();
    await render(
      <Shape
        kind="square"
        size={48}
        color={scheme.color.primary}
        testID="sq"
      />,
    );
    expect(screen.getByTestId("sq")).toHaveStyle({
      width: 48,
      height: 48,
      backgroundColor: scheme.color.primary,
    });
  });
});

describe("shapeStyles", () => {
  const size = FEEDBACK_SIZE_DP.md.shape;
  const fill = defaultScheme().color.onSurface;

  it("draws the circle from the full corner token", () => {
    const scheme = defaultScheme();
    expect(shapeStyles("circle", size, fill, scheme)).toMatchObject({
      width: size,
      height: size,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: fill,
    });
  });

  it("draws the square from the small corner token", () => {
    const scheme = defaultScheme();
    expect(shapeStyles("square", size, fill, scheme)).toMatchObject({
      borderRadius: Number.parseFloat(scheme.shape.small),
    });
  });

  it("draws the pill as a half-height full-radius bar", () => {
    const scheme = defaultScheme();
    const pill = shapeStyles("pill", size, fill, scheme);
    expect(pill).toMatchObject({
      width: size,
      height: size * 0.55,
      borderRadius: Number.parseFloat(scheme.shape.full),
    });
  });

  it("draws the diamond as a 45-degree rotated rounded square", () => {
    const scheme = defaultScheme();
    const diamond = shapeStyles("diamond", size, fill, scheme);
    expect(diamond).toMatchObject({
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
      backgroundColor: fill,
    });
    expect(JSON.stringify(diamond.transform)).toContain("45deg");
  });

  it("adds a caller rotation on top of the diamond base", () => {
    const rotated = shapeStyles("diamond", size, fill, defaultScheme(), 10);
    expect(JSON.stringify(rotated.transform)).toContain("55deg");
  });

  it("draws the triangle with the border trick (transparent sides)", () => {
    const triangle = shapeStyles("triangle", size, fill, defaultScheme());
    expect(triangle).toMatchObject({
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: fill,
    });
    expect(triangle).not.toHaveProperty("backgroundColor");
  });

  it("draws the arch with full top and small bottom radii", () => {
    const scheme = defaultScheme();
    expect(shapeStyles("arch", size, fill, scheme)).toMatchObject({
      borderTopLeftRadius: Number.parseFloat(scheme.shape.full),
      borderTopRightRadius: Number.parseFloat(scheme.shape.full),
      borderBottomLeftRadius: Number.parseFloat(scheme.shape.small),
      borderBottomRightRadius: Number.parseFloat(scheme.shape.small),
    });
  });
});
