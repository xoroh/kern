import { render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { Badge, badgeStyles } from "./badge";

describe("Badge", () => {
  it("announces counts and truncates past the max", async () => {
    await render(<Badge>3</Badge>);
    expect(screen.getByLabelText("Count: 3")).toBeTruthy();
  });

  it("stays on the error fill by default (M3 badge mapping)", async () => {
    const scheme = defaultScheme();
    const styles = badgeStyles("count", scheme);
    expect(styles.container.backgroundColor).toBe(scheme.color.error);
  });

  it("resolves any registry tone (KernStatus, CL-010)", async () => {
    const scheme = defaultScheme();
    const styles = badgeStyles("count", scheme, "success");
    expect(styles.container.backgroundColor).toBe(scheme.color.success);
    expect(styles.label.color).toBe(scheme.color.onSuccess);
  });

  it("keeps dot geometry separate from count geometry", async () => {
    const scheme = defaultScheme();
    expect(badgeStyles("dot", scheme).container.width).toBe(6);
    expect(badgeStyles("count", scheme).container.minWidth).toBe(16);
  });
});
