import { render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { Avatar, avatarStyles } from "./avatar";

describe("Avatar", () => {
  it("shows the fallback with an accessible name when imageless", async () => {
    await render(<Avatar fallback="XO" />);
    expect(screen.getByLabelText("XO")).toBeTruthy();
    expect(screen.getByText("XO")).toBeTruthy();
  });

  it("keeps the primary fallback disc by default", async () => {
    const scheme = defaultScheme();
    expect(avatarStyles("default", scheme).container.backgroundColor).toBe(
      scheme.color.primary,
    );
  });

  it("resolves any registry tone on the fallback disc (KernStatus, CL-010)", async () => {
    const scheme = defaultScheme();
    expect(
      avatarStyles("default", scheme, "success").container.backgroundColor,
    ).toBe(scheme.color.success);
  });

  it("scales dimensions per size", async () => {
    const scheme = defaultScheme();
    expect(avatarStyles("small", scheme).dimension).toBe(32);
    expect(avatarStyles("default", scheme).dimension).toBe(40);
    expect(avatarStyles("large", scheme).dimension).toBe(56);
  });
});
