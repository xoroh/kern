import { render, screen } from "@testing-library/react-native";
import { expressiveShapePath } from "@xoroh/kern-m3";
import { ExpressiveShape } from "./shape-art";

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
    await render(
      <ExpressiveShape shape="cookie-4" size={64} color="#16a34a" />,
    );
    expect(byHiddenTestId("kern-expressive-shape-path").props).toMatchObject({
      d: expressiveShapePath("cookie-4", 100),
      fill: "#16a34a",
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
