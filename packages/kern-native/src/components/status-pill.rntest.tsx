import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { defaultScheme } from "../theme";
import { StatusPill, statusPillStyles } from "./status-pill";

type HostNode = {
  props?: Record<string, unknown>;
  children?: unknown;
};

// Hidden-from-AT nodes (the dot) are skipped by safe queries: walk the
// host tree instead. This RNTL has no UNSAFE_* escape hatch.
function countTestId(node: unknown, testID: string): number {
  if (Array.isArray(node))
    return node.reduce<number>((n, c) => n + countTestId(c, testID), 0);
  if (node !== null && typeof node === "object") {
    const host = node as HostNode;
    return (
      (host.props?.testID === testID ? 1 : 0) +
      countTestId(host.children, testID)
    );
  }
  return 0;
}

describe("StatusPill", () => {
  it("renders the label with the neutral container by default", async () => {
    await render(<StatusPill>Pending</StatusPill>);
    expect(screen.getByTestId("kern-status-pill")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("shows a dot by default", async () => {
    const rendered = await render(
      <StatusPill tone="success">Active</StatusPill>,
    );
    expect(countTestId(rendered.toJSON(), "kern-status-pill-dot")).toBe(1);
  });

  it("renders an icon slot instead of the dot when given", async () => {
    const rendered = await render(
      <StatusPill tone="warning" icon={<Text testID="pill-icon">!</Text>}>
        Hold
      </StatusPill>,
    );
    expect(screen.getByTestId("pill-icon")).toBeTruthy();
    expect(countTestId(rendered.toJSON(), "kern-status-pill-dot")).toBe(0);
  });

  it("hides the dot when dot={false}", async () => {
    const rendered = await render(
      <StatusPill tone="info" dot={false}>
        Quiet
      </StatusPill>,
    );
    expect(countTestId(rendered.toJSON(), "kern-status-pill-dot")).toBe(0);
  });
});

describe("statusPillStyles (tone registry, CL-010)", () => {
  it("resolves soft tones to scheme container roles", async () => {
    const scheme = defaultScheme();
    const soft = statusPillStyles("success", "soft", "medium", scheme);
    // Native resolves roles to compiled sRGB (tokens.json carries sRGB
    // for native by design) — the "no raw hex" law applies to the role
    // lookup, so the assertion is identity with the scheme role.
    expect(soft.container.backgroundColor).toBe(scheme.color.successContainer);
    expect(soft.dotColor).toBe(scheme.color.success);
  });

  it("resolves solid tones to filled roles", async () => {
    const scheme = defaultScheme();
    const solid = statusPillStyles("error", "solid", "medium", scheme);
    expect(solid.container.backgroundColor).toBe(scheme.color.error);
    expect(solid.dotColor).toBe(scheme.color.error);
  });

  it("scales with density (24 compact / 32 medium)", async () => {
    const scheme = defaultScheme();
    expect(
      statusPillStyles("info", "soft", "compact", scheme).container.height,
    ).toBe(24);
    expect(
      statusPillStyles("info", "soft", "medium", scheme).container.height,
    ).toBe(32);
  });
});
