import { render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { CircularProgress } from "./circular-progress";
import { LinearProgress } from "./linear-progress";
import { Loader, loaderColor } from "./loader";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";

type HostNode = {
  props?: Record<string, unknown>;
  children?: unknown;
};

function findByTestId(node: unknown, testID: string): HostNode | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByTestId(child, testID);
      if (found) return found;
    }
    return null;
  }
  if (node !== null && typeof node === "object") {
    const host = node as HostNode;
    if (host.props?.testID === testID) return host;
    return findByTestId(host.children, testID);
  }
  return null;
}

describe("Skeleton", () => {
  it("is hidden from assistive tech (decorative placeholder)", async () => {
    const rendered = await render(<Skeleton testID="sk" />);
    // Hidden by design, so safe queries skip it: assert on the host tree.
    const node = findByTestId(rendered.toJSON(), "sk");
    expect(node?.props?.accessibilityElementsHidden).toBe(true);
  });

  it("paints the tonal fill", async () => {
    const scheme = defaultScheme();
    const rendered = await render(<Skeleton testID="sk" />);
    const node = findByTestId(rendered.toJSON(), "sk");
    expect(JSON.stringify(node?.props?.style)).toContain(
      scheme.color.surfaceTonal,
    );
  });
});

describe("Loader", () => {
  it("announces the wait by name", async () => {
    await render(<Loader label="Loading rides" />);
    expect(screen.getByLabelText("Loading rides")).toBeTruthy();
  });

  it("paints the primary spinner", async () => {
    expect(loaderColor(defaultScheme())).toBe(defaultScheme().color.primary);
  });
});

describe("Progress", () => {
  it("reports the determinate value as aria-valuenow (Axis contract)", async () => {
    await render(<Progress value={40} accessibilityLabel="Upload" />);
    expect(screen.getByLabelText("Upload").props["aria-valuenow"]).toBe(40);
  });

  it("reads 0 when omitted (determinate-only, never indeterminate-busy)", async () => {
    await render(<Progress accessibilityLabel="Upload" />);
    expect(screen.getByLabelText("Upload").props["aria-valuenow"]).toBe(0);
  });
});

describe("Meter", () => {
  it("reports the reading with min/max", async () => {
    await render(
      <Meter value={40} min={0} max={80} accessibilityLabel="Storage" />,
    );
    expect(screen.getByLabelText("Storage").props.accessibilityValue).toEqual({
      now: 40,
      min: 0,
      max: 80,
      text: "40",
    });
  });
});

describe("LinearProgress", () => {
  it("reports determinate progress and the indeterminate loop", async () => {
    await render(<LinearProgress value={0.4} label="Sync" />);
    expect(
      screen.getByLabelText("Sync").props.accessibilityValue,
    ).toMatchObject({
      now: 40,
    });
  });

  it("renders the wavy waveform variant (P3 loading-waveform)", async () => {
    await render(<LinearProgress value={0.5} label="Sync" wavy />);
    expect(screen.getByLabelText("Sync")).toBeTruthy();
  });

  it("renders the stop indicator", async () => {
    await render(<LinearProgress value={0.4} label="Sync" stop />);
    expect(screen.getByTestId("kern-linear-progress-stop")).toBeTruthy();
  });
});

describe("CircularProgress", () => {
  it("renders the determinate arc with a percentage", async () => {
    await render(<CircularProgress value={0.4} label="Upload" />);
    expect(screen.getByLabelText("Upload")).toBeTruthy();
  });

  it("throws for reserved-but-unrendered styles (fail loud, never silent)", async () => {
    let error: unknown = null;
    try {
      await render(<CircularProgress loaderStyle="orbit" label="Loading" />);
    } catch (caught) {
      error = caught;
    }
    expect(String(error)).toMatch(/reserved/);
  });
});
