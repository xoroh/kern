import { render, screen } from "@testing-library/react-native";
import { expressiveShapePath } from "@xoroh/kern-m3";
import { defaultScheme } from "../theme";
import { ExpressiveShape, ShapeArt, shapeArtStyles } from "./shape-art";

// The root hides itself from accessibility (decorative-only art), which also
// hides the subtree from RNTL queries — opt back in explicitly.
const hidden = { includeHiddenElements: true } as const;
const byHiddenTestId = (id: string) => screen.getByTestId(id, hidden);

describe("native ExpressiveShape render", () => {
  it("draws the default flower-8 path from the shared builder", async () => {
    await render(<ExpressiveShape />);
    const path = byHiddenTestId("kern-expressive-shape-path");
    expect(path.props.d).toBe(expressiveShapePath("flower-8", 100));
    expect(path.props.fill).toEqual(expect.any(String));
  });

  it("draws a named form in a square box with a custom fill", async () => {
    // Custom fills come from the scheme roles, never raw hex in-repo.
    const fill = defaultScheme().color.primary;
    await render(<ExpressiveShape shape="cookie-4" size={64} color={fill} />);
    expect(byHiddenTestId("kern-expressive-shape-path").props).toMatchObject({
      d: expressiveShapePath("cookie-4", 100),
      fill,
    });
    expect(byHiddenTestId("kern-expressive-shape")).toHaveStyle({
      width: 64,
      height: 64,
    });
  });

  it("stays out of the accessibility tree (decorative only)", async () => {
    await render(<ExpressiveShape shape="burst-12" />);
    const root = byHiddenTestId("kern-expressive-shape");
    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByTestId("kern-expressive-shape")).toBeNull();
  });

  it("fails loud on an unknown form", async () => {
    await expect(render(<ExpressiveShape shape="nope" />)).rejects.toThrow(
      "Unknown expressive shape: nope",
    );
  });
});

describe("native ShapeArt compositions", () => {
  it.each([
    ["scatter", 4],
    ["stack", 3],
    ["arch", 2],
  ] as const)(
    "renders the %s layout as its piece count",
    async (layout, pieces) => {
      await render(<ShapeArt layout={layout} />);
      expect(screen.getByTestId("kern-shape-art")).toBeTruthy();
      expect(screen.getAllByTestId("kern-shape")).toHaveLength(pieces);
    },
  );

  it("scales the whole mark by size and opacity", async () => {
    await render(<ShapeArt layout="stack" size={200} opacity={0.5} />);
    expect(screen.getByTestId("kern-shape-art")).toHaveStyle({
      width: 200,
      height: 200,
      opacity: 0.5,
    });
  });
});

describe("shapeArtStyles", () => {
  it("keeps the scatter band short and positions every piece absolutely", () => {
    const scheme = defaultScheme();
    const styles = shapeArtStyles("scatter", 120, scheme);
    expect(styles.root).toMatchObject({ width: 120, height: 120 * 0.6 });
    expect(styles.pieces).toHaveLength(4);
    for (const piece of styles.pieces) {
      expect(piece.position).toBe("absolute");
    }
  });

  it("draws the root from the large corner token", () => {
    const scheme = defaultScheme();
    expect(shapeArtStyles("arch", 100, scheme).root.borderRadius).toBe(
      Number.parseFloat(scheme.shape.large),
    );
  });
});
