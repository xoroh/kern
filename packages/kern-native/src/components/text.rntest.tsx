import { render, screen } from "@testing-library/react-native";
import { defaultScheme, useKernTheme } from "../theme";
import { Text, textStyles } from "./text";

/**
 * WP9 Part D P1: native Text behavior pins.
 *
 * The typescale variant is the whole API: one rank per role, `body` by
 * default, always set in the on-surface role.
 */
describe("textStyles", () => {
  it("resolves each rank to its documented scale entry", () => {
    // body-medium and label-large share 14px — the ranks differ by
    // weight/tracking, not size, so the pin is size AND weight per rank.
    expect(textStyles("body")).toMatchObject({ fontSize: 14 });
    expect(textStyles("label")).toMatchObject({ fontSize: 14 });
    expect(textStyles("title")).toMatchObject({ fontSize: 22 });
    expect(textStyles("headline")).toMatchObject({ fontSize: 24 });
    expect(textStyles("label").fontFamily).not.toBe(
      textStyles("body").fontFamily,
    );
  });
});

describe("Text", () => {
  it("renders body copy by default", async () => {
    await render(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeTruthy();
    expect(JSON.stringify(screen.getByText("Hello").props.style)).toContain(
      String(textStyles("body").fontSize),
    );
  });

  it("swaps the typescale per variant", async () => {
    await render(<Text variant="title">Settings</Text>);
    expect(JSON.stringify(screen.getByText("Settings").props.style)).toContain(
      String(textStyles("title").fontSize),
    );
  });

  it("renders the headline rank", async () => {
    await render(<Text variant="headline">Welcome</Text>);
    expect(JSON.stringify(screen.getByText("Welcome").props.style)).toContain(
      String(textStyles("headline").fontSize),
    );
  });

  it("sets the text in the on-surface role", async () => {
    const scheme = defaultScheme();
    await render(<Text>Hello</Text>);
    expect(JSON.stringify(screen.getByText("Hello").props.style)).toContain(
      scheme.color.onSurface,
    );
  });

  it("lets a caller style win over the rank", async () => {
    await render(<Text style={{ fontSize: 99 }}>Hello</Text>);
    expect(JSON.stringify(screen.getByText("Hello").props.style)).toContain(
      "99",
    );
  });

  it("reads the rank through the theme hook", () => {
    expect(typeof useKernTheme).toBe("function");
  });
});
