import { render, screen } from "@testing-library/react-native";
import { KernLoading } from "./kern-loading";

type HostNode = {
  props?: Record<string, unknown>;
  children?: unknown;
};

// Hidden-from-AT skeletons are skipped by safe queries: walk the host
// tree instead. This RNTL has no UNSAFE_* escape hatch.
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

describe("KernLoading", () => {
  it("renders a spinner with an announced label by default", async () => {
    await render(<KernLoading label="Loading rides" />);
    expect(screen.getByTestId("kern-loading")).toBeTruthy();
    expect(screen.getByLabelText("Loading rides")).toBeTruthy();
  });

  it("renders a skeleton list with the requested row count", async () => {
    const rendered = await render(
      <KernLoading kind="skeleton-list" count={4} label="Loading list" />,
    );
    expect(screen.getByLabelText("Loading list")).toBeTruthy();
    expect(countTestId(rendered.toJSON(), "kern-skeleton")).toBe(4);
  });

  it("renders determinate progress with a real value", async () => {
    await render(<KernLoading kind="progress" value={0.4} label="Syncing" />);
    const bar = screen.getByLabelText("Syncing");
    expect(bar.props.accessibilityValue).toMatchObject({ now: 40 });
  });

  it("renders the indeterminate loop when progress value is null", async () => {
    await render(<KernLoading kind="progress" value={null} label="Syncing" />);
    const bar = screen.getByLabelText("Syncing");
    expect(bar.props.accessibilityValue).toBeUndefined();
  });

  it("renders a shimmer card composition", async () => {
    const rendered = await render(
      <KernLoading kind="shimmer-card" label="Loading card" />,
    );
    expect(screen.getByLabelText("Loading card")).toBeTruthy();
    expect(countTestId(rendered.toJSON(), "kern-skeleton")).toBeGreaterThan(2);
  });
});
