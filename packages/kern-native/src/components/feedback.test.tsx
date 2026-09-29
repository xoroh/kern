import { act, Component, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

/**
 * Self-contained react-native double. The shared `test-doubles/react-native`
 * stub only exists to satisfy style-map imports; this suite renders, so it
 * carries its own minimal host + Animated implementation.
 */
vi.mock("react-native", async () => {
  const React = await import("react");

  type StubProps = Record<string, unknown> & { children?: ReactNode };

  function host(name: string) {
    const Component = (props: StubProps) => React.createElement(name, props);
    Component.displayName = name;
    return Component;
  }

  class AnimatedValue {
    value: number;
    constructor(value = 0) {
      this.value = value;
    }
    setValue(next: number) {
      this.value = next;
    }
    interpolate() {
      return this;
    }
  }

  type Composite = {
    start: (done?: (result: { finished: boolean }) => void) => void;
    stop: () => void;
  };

  function composite(
    run: (done: (result: { finished: boolean }) => void) => void,
  ): Composite {
    return {
      start: (done) => run(done ?? (() => {})),
      stop: () => {},
    };
  }

  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    StyleSheet: {
      create: <T,>(styles: T) => styles,
      hairlineWidth: 1,
    },
    Animated: {
      Value: AnimatedValue,
      View: host("Animated.View"),
      Text: host("Animated.Text"),
      timing: (value: AnimatedValue, config: { toValue?: number }) =>
        composite((done) => {
          value.setValue(config?.toValue ?? 1);
          done({ finished: true });
        }),
      delay: () => composite((done) => done({ finished: true })),
      sequence: (steps: Composite[]) =>
        composite((done) => {
          for (const step of steps) step.start();
          done({ finished: true });
        }),
      loop: (anim: Composite) => anim,
    },
    Easing: {
      linear: (t: number) => t,
      cubic: (t: number) => t,
      quad: (t: number) => t,
      out: (fn: (t: number) => number) => fn,
      inOut: (fn: (t: number) => number) => fn,
      bezier:
        () =>
        (t: number): number =>
          t,
    },
    useColorScheme: () => "light",
    Platform: {
      OS: "ios",
      select: (spec: Record<string, unknown>) => spec.ios ?? spec.default,
    },
  };
});

import {
  FEEDBACK_SHAPES,
  FEEDBACK_SIZE_DP,
  registerFeedbackVariant,
  resolveFeedbackVariant,
  themes,
} from "@xoroh/kern-theme";
// react-test-renderer ships without type declarations in this workspace.
// @ts-expect-error — untyped package.
import { create as createTree } from "react-test-renderer";
import {
  arcRotations,
  barStyles,
  CircularProgress,
  ringStyles,
} from "./circular-progress";
import { LinearProgress, linearProgressStyles } from "./linear-progress";
import { LoadingButton } from "./loading-button";
import { Shape, shapeStyles } from "./shape";

type TestNode = {
  type: string | ((props: Record<string, unknown>) => ReactNode);
  props: Record<string, unknown>;
};

type TestTree = {
  root: { findAll: (match: (node: TestNode) => boolean) => TestNode[] };
  unmount: () => void;
};

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>((acc, entry) => {
      return Object.assign(acc, flattenStyle(entry));
    }, {});
  }
  return style as Record<string, unknown>;
}

/** Host nodes (`View`, `Text`, …) carrying the given testID. */
function hostsByTestID(tree: TestTree, testID: string): TestNode[] {
  return tree.root.findAll(
    (node) => typeof node.type === "string" && node.props.testID === testID,
  );
}

// React 19 commits are deferred — yield a macrotask after render before
// asserting rather than relying on act() alone.
async function render(
  element: ReactElement | ReactElement[],
): Promise<TestTree> {
  let tree!: TestTree;
  await act(async () => {
    tree = createTree(element) as unknown as TestTree;
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
  });
  return tree;
}

async function expectRenderError(
  element: ReactElement | ReactElement[],
  message: string,
): Promise<void> {
  const seen: Error[] = [];
  try {
    await act(async () => {
      createTree(
        <ErrorCatcher onError={(error) => seen.push(error)}>
          {element}
        </ErrorCatcher>,
      );
      await new Promise((resolve) => {
        setTimeout(resolve);
      });
    });
  } catch (error) {
    seen.push(error as Error);
  }
  expect(seen.length).toBeGreaterThan(0);
  expect(seen[0].message).toContain(message);
}

class ErrorCatcher extends Component<
  { children: ReactNode; onError: (error: Error) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

describe("CircularProgress", () => {
  it("renders the M3 spinner ring for the `spinner` style", async () => {
    const tree = await render(<CircularProgress loaderStyle="spinner" />);
    const roots = hostsByTestID(tree, "kern-circular-progress");
    expect(roots.length).toBe(1);
    expect(roots[0].props.accessibilityRole).toBe("progressbar");
    expect(roots[0].props.accessibilityLabel).toBe("Loading");
    const rings = hostsByTestID(tree, "kern-circular-progress-ring");
    expect(rings.length).toBe(1);
    const ring = flattenStyle(rings[0].props.style);
    expect(ring.width).toBe(FEEDBACK_SIZE_DP.md.container);
    expect(ring.borderTopColor).toBe(themes.m3.color.light.onSurface);
    expect(ring.borderLeftColor).toBe("transparent");
  });

  it("renders three staggered dots for the `dots` style", async () => {
    const tree = await render(<CircularProgress loaderStyle="dots" />);
    const dots = hostsByTestID(tree, "kern-circular-progress-dot");
    expect(dots.length).toBe(3);
    for (const dot of dots) {
      const style = flattenStyle(dot.props.style);
      expect(style.width).toBe(FEEDBACK_SIZE_DP.md.shape / 2);
      expect(style.height).toBe(FEEDBACK_SIZE_DP.md.shape / 2);
      expect(style.borderRadius).toBe(Number.parseFloat(themes.m3.radius.full));
    }
  });

  it("renders four equalizer bars for the `bar` style", async () => {
    const tree = await render(<CircularProgress loaderStyle="bar" />);
    const bars = hostsByTestID(tree, "kern-circular-progress-bar");
    expect(bars.length).toBe(4);
    expect(bars.map((bar) => flattenStyle(bar.props.style).height)).toEqual([
      "60%",
      "100%",
      "80%",
      "50%",
    ]);
    expect(flattenStyle(bars[0].props.style).width).toBe(
      barStyles("md", themes.m3.color.light.onSurface).bar.width,
    );
  });

  it("renders the brand trio for the `shapes` style", async () => {
    const tree = await render(<CircularProgress loaderStyle="shapes" />);
    const glyphs = tree.root.findAll((node) => node.type === Shape);
    expect(glyphs.length).toBe(3);
    expect(glyphs.map((glyph) => glyph.props.kind)).toEqual([
      "triangle",
      "circle",
      "square",
    ]);
    expect(hostsByTestID(tree, "kern-circular-progress-shape").length).toBe(3);
  });

  it("renders the determinate M3 arc with progress semantics", () => {
    expect(arcRotations(0)).toEqual({ lead: -180, trail: -180 });
    expect(arcRotations(0.25)).toEqual({ lead: -90, trail: -180 });
    expect(arcRotations(0.5)).toEqual({ lead: 0, trail: -180 });
    expect(arcRotations(0.75)).toEqual({ lead: 0, trail: -90 });
    expect(arcRotations(1)).toEqual({ lead: 0, trail: 0 });
  });

  it("clamps determinate values to the 0–1 range", async () => {
    const high = await render(<CircularProgress value={2} label="High" />);
    expect(
      hostsByTestID(high, "kern-circular-progress")[0].props.accessibilityValue,
    ).toEqual({ now: 100, min: 0, max: 100 });
    const low = await render(<CircularProgress value={-1} label="Low" />);
    expect(
      hostsByTestID(low, "kern-circular-progress")[0].props.accessibilityValue,
    ).toEqual({ now: 0, min: 0, max: 100 });
  });

  it("renders the determinate arc regardless of loader style", async () => {
    const tree = await render(
      <CircularProgress value={0.5} loaderStyle="dots" label="Mix" />,
    );
    const roots = hostsByTestID(tree, "kern-circular-progress");
    expect(roots[0].props.accessibilityLabel).toBe("Mix");
    expect(roots[0].props.accessibilityValue).toEqual({
      now: 50,
      min: 0,
      max: 100,
    });
    expect(hostsByTestID(tree, "kern-circular-progress-dot").length).toBe(0);
    expect(hostsByTestID(tree, "kern-circular-progress-track").length).toBe(1);
    expect(hostsByTestID(tree, "kern-circular-progress-arc").length).toBe(2);
  });

  for (const reserved of [
    "conveyor",
    "contained",
    "orbit",
    "morph",
    "assembly",
  ] as const) {
    it(`throws on the reserved "${reserved}" style`, async () => {
      await expectRenderError(
        <CircularProgress loaderStyle={reserved} />,
        `CircularProgress: loading style "${reserved}" is reserved and not rendered yet`,
      );
    });
  }
});

describe("resolveFeedbackVariant parity", () => {
  it("matches the native suite literal for the default JSON", () => {
    expect(JSON.stringify(resolveFeedbackVariant())).toBe(
      '{"shapes":["triangle","circle","square"],"style":"shapes","tone":"surface"}',
    );
  });

  it("matches the native suite literal for a registered tenant JSON", () => {
    registerFeedbackVariant("native-parity", {
      shapes: ["diamond", "pill", "circle"],
      style: "dots",
      tone: "inverse",
    });
    expect(JSON.stringify(resolveFeedbackVariant("native-parity"))).toBe(
      '{"shapes":["diamond","pill","circle"],"style":"dots","tone":"inverse"}',
    );
  });

  it("fails loud on an unknown tenant id", () => {
    expect(() => resolveFeedbackVariant("native-nope")).toThrow(
      "Unknown feedback variant: native-nope",
    );
  });
});

describe("Shape", () => {
  it("renders the six shapes with shape-scale radii", async () => {
    const radius = themes.m3.radius;
    const tree = await render(
      FEEDBACK_SHAPES.map((kind) => (
        <Shape key={kind} kind={kind} testID={`shape-${kind}`} />
      )) as ReactElement[],
    );
    const styles = Object.fromEntries(
      FEEDBACK_SHAPES.map((kind) => [
        kind,
        flattenStyle(hostsByTestID(tree, `shape-${kind}`)[0].props.style),
      ]),
    );
    expect(styles.triangle.borderBottomColor).toBe(
      themes.m3.color.light.onSurface,
    );
    expect(styles.triangle.borderLeftColor).toBe("transparent");
    expect(styles.circle.borderRadius).toBe(Number.parseFloat(radius.full));
    expect(styles.square.borderRadius).toBe(Number.parseFloat(radius.small));
    expect(styles.pill.borderRadius).toBe(Number.parseFloat(radius.full));
    expect(styles.pill.height).toBe(FEEDBACK_SIZE_DP.md.shape * 0.55);
    expect(styles.diamond.borderRadius).toBe(
      Number.parseFloat(radius["extra-small"]),
    );
    expect(styles.diamond.transform).toEqual([{ rotate: "45deg" }]);
    expect(styles.arch.borderTopLeftRadius).toBe(
      Number.parseFloat(radius.full),
    );
    expect(styles.arch.borderBottomLeftRadius).toBe(
      Number.parseFloat(radius.small),
    );
    expect(shapeStyles("circle", 24, "ink").backgroundColor).toBe("ink");
  });
});

describe("LinearProgress", () => {
  it("renders the determinate fill with progress semantics", async () => {
    const tree = await render(<LinearProgress value={0.4} label="Sync" />);
    const roots = hostsByTestID(tree, "kern-linear-progress");
    expect(roots.length).toBe(1);
    expect(roots[0].props.accessibilityRole).toBe("progressbar");
    expect(roots[0].props.accessibilityLabel).toBe("Sync");
    expect(roots[0].props.accessibilityValue).toEqual({
      now: 40,
      min: 0,
      max: 100,
    });
    const fill = hostsByTestID(tree, "kern-linear-progress-indicator");
    expect(fill.length).toBe(1);
    expect(flattenStyle(fill[0].props.style).width).toBe("40%");
    expect(linearProgressStyles(1.8).fill.width).toBe("100%");
  });
});

describe("LoadingButton", () => {
  it("keeps its label and blocks interaction while loading", async () => {
    const idle = await render(<LoadingButton>Send</LoadingButton>);
    const idleRoot = hostsByTestID(idle, "kern-loading-button")[0];
    expect(idleRoot.props.accessibilityRole).toBe("button");
    expect(idleRoot.props.accessibilityState).toEqual({
      disabled: false,
      busy: false,
    });
    expect(idleRoot.props.disabled).toBe(false);
    expect(
      idle.root.findAll(
        (node) => node.type === "Text" && node.props.children === "Send",
      ).length,
    ).toBe(1);
    expect(hostsByTestID(idle, "kern-circular-progress").length).toBe(0);

    const busy = await render(
      <LoadingButton loading value={0.5}>
        Send
      </LoadingButton>,
    );
    const busyRoot = hostsByTestID(busy, "kern-loading-button")[0];
    expect(busyRoot.props.accessibilityState).toEqual({
      disabled: true,
      busy: true,
    });
    expect(busyRoot.props.disabled).toBe(true);
    expect(
      busy.root.findAll(
        (node) => node.type === "Text" && node.props.children === "Send",
      ).length,
    ).toBe(1);
    expect(hostsByTestID(busy, "kern-circular-progress").length).toBe(1);
    expect(ringStyles("sm", themes.m3.color.light.onPrimary).box.width).toBe(
      FEEDBACK_SIZE_DP.sm.container,
    );
  });
});
