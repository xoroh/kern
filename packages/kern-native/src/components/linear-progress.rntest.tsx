import { render, screen } from "@testing-library/react-native";
import { Animated, Easing } from "react-native";
import { useKernMotion } from "../theme";
import { LinearProgress } from "./linear-progress";

jest.mock("../theme", () => {
  const actual = jest.requireActual("../theme");
  return {
    ...actual,
    useKernMotion: jest.fn((...args: unknown[]) =>
      (actual.useKernMotion as (...a: unknown[]) => unknown)(...args),
    ),
  };
});

const motionMock = useKernMotion as jest.Mock;
const actualTheme = jest.requireActual("../theme") as {
  useKernMotion: (...args: never[]) => unknown;
};

type LoopHandle = {
  start: (...args: never[]) => void;
  stop: () => void;
  reset: () => void;
};
let handles: LoopHandle[];
let timingSpy: jest.SpyInstance;

const fakeLoop: typeof Animated.loop = () => {
  const handle: LoopHandle = {
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  };
  handles.push(handle);
  return handle;
};

beforeEach(() => {
  handles = [];
  motionMock.mockImplementation((...args: never[]) =>
    actualTheme.useKernMotion(...args),
  );
  timingSpy = jest.spyOn(Animated, "timing");
  jest.spyOn(Animated, "loop").mockImplementation(fakeLoop);
});

afterEach(() => {
  jest.restoreAllMocks();
});

function timingDurations(): number[] {
  return timingSpy.mock.calls.map(
    (call) => (call[1] as { duration: number }).duration,
  );
}

describe("LinearProgress determinate (unchanged)", () => {
  it("renders the fill with progress semantics", async () => {
    await render(<LinearProgress value={0.4} label="Sync" />);
    const root = screen.getByTestId("kern-linear-progress");
    expect(root.props.accessibilityRole).toBe("progressbar");
    expect(root.props.accessibilityLabel).toBe("Sync");
    expect(root.props.accessibilityValue).toEqual({
      now: 40,
      min: 0,
      max: 100,
    });
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
  });

  it("renders the 4dp stop circle at the track end, determinate only", async () => {
    await render(<LinearProgress value={0.4} label="Sync" stop />);
    expect(screen.getByTestId("kern-linear-progress-stop")).toBeTruthy();
    const bare = await render(<LinearProgress value={0.4} label="Sync" />);
    expect(bare.queryByTestId("kern-linear-progress-stop")).toBeNull();
  });

  it("starts no animation loops when determinate", async () => {
    await render(<LinearProgress value={0.4} label="Sync" />);
    expect(Animated.loop).not.toHaveBeenCalled();
  });
});

describe("LinearProgress indeterminate", () => {
  it("renders two sliding bars with no numeric value", async () => {
    await render(<LinearProgress value={null} label="Wait" />);
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
    expect(
      screen.getByTestId("kern-linear-progress-indicator-secondary"),
    ).toBeTruthy();
    // Unknown durations report no reading — an indeterminate bar is a
    // status, not a measurement.
    expect(
      screen.getByTestId("kern-linear-progress").props.accessibilityValue,
    ).toBeUndefined();
  });

  it("drives the bars on a 2s linear loop", async () => {
    await render(<LinearProgress value={null} label="Wait" />);
    expect(Animated.loop).toHaveBeenCalled();
    expect(timingDurations()).toContain(2000);
    const slideCall = timingSpy.mock.calls.find(
      (call) => (call[1] as { duration: number }).duration === 2000,
    );
    expect(slideCall?.[1]).toMatchObject({
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    // Every started loop gets a handle, so every bar animates.
    expect(handles.length).toBeGreaterThan(0);
    for (const handle of handles) {
      expect(handle.start).toHaveBeenCalled();
    }
  });

  it("stops every loop on unmount", async () => {
    const view = await render(<LinearProgress value={null} label="Wait" />);
    expect(handles.length).toBeGreaterThan(0);
    // RNTL v14 unmount is async (act-wrapped) — the loop cleanup lands
    // after the await, matching the async `render` contract.
    await view.unmount();
    for (const handle of handles) {
      expect(handle.stop).toHaveBeenCalled();
    }
  });

  it("hides the stop indicator while indeterminate", async () => {
    await render(<LinearProgress value={null} label="Wait" stop />);
    expect(screen.queryByTestId("kern-linear-progress-stop")).toBeNull();
  });

  it("holds static bars and starts no loops under reduced motion", async () => {
    motionMock.mockReturnValue({ suppressSpatial: true });
    await render(<LinearProgress value={null} label="Wait" />);
    // "The feedback does not move" — both bars stay rendered, mid-cycle.
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
    expect(
      screen.getByTestId("kern-linear-progress-indicator-secondary"),
    ).toBeTruthy();
    expect(Animated.loop).not.toHaveBeenCalled();
  });
});

describe("LinearProgress fourColor", () => {
  it("adds an 8s color cycle to the 2s slide loop", async () => {
    await render(<LinearProgress value={null} fourColor label="Wait" />);
    expect(timingDurations()).toContain(2000);
    expect(timingDurations()).toContain(8000);
    const colorCall = timingSpy.mock.calls.find(
      (call) => (call[1] as { duration: number }).duration === 8000,
    );
    expect(colorCall?.[1]).toMatchObject({
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: false,
    });
  });

  it("runs no color cycle without fourColor", async () => {
    await render(<LinearProgress value={null} label="Wait" />);
    expect(timingDurations()).not.toContain(8000);
  });

  it("holds the primary color under reduced motion", async () => {
    motionMock.mockReturnValue({ suppressSpatial: true });
    await render(<LinearProgress value={null} fourColor label="Wait" />);
    expect(timingDurations()).not.toContain(8000);
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
  });
});

describe("LinearProgress wavy", () => {
  it("renders the wave at the platform geometry", async () => {
    await render(<LinearProgress value={0.5} label="Sync" wavy />);
    const wave = screen.getByTestId("kern-linear-progress-wave");
    expect(wave.props.viewBox).toBe("0 0 40 12");
    const path = screen.getByTestId("kern-linear-progress-wave-path");
    expect(path.props.d).toBe("M0 6 Q 10 0 20 6 T 40 6");
    expect(path.props.strokeWidth).toBe(4);
    // The determinate bar is replaced by the wave, not doubled.
    expect(screen.queryByTestId("kern-linear-progress-indicator")).toBeNull();
  });

  it("ignores wavy while indeterminate", async () => {
    await render(<LinearProgress value={null} label="Wait" wavy />);
    expect(screen.queryByTestId("kern-linear-progress-wave")).toBeNull();
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
  });
});

describe("LinearProgress buffer", () => {
  it("renders the buffer wash behind the bar", async () => {
    await render(<LinearProgress value={0.5} buffer={0.8} label="Buffered" />);
    const buffer = screen.getByTestId("kern-linear-progress-buffer");
    const style = Array.isArray(buffer.props.style)
      ? Object.assign({}, ...buffer.props.style)
      : buffer.props.style;
    expect(style.width).toBe("80%");
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
  });

  it("ignores buffer while indeterminate", async () => {
    await render(<LinearProgress value={null} buffer={0.8} label="Wait" />);
    expect(screen.queryByTestId("kern-linear-progress-buffer")).toBeNull();
  });
});
