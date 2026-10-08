import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

/**
 * Self-contained react-native double (the feedback.test.tsx shape): host
 * components that render through, so suites exercise the BINDINGS (mount,
 * press, presence) rather than the stub.
 */
vi.mock("react-native", async () => {
  const React = await import("react");

  type StubProps = Record<string, unknown> & { children?: ReactNode };

  function host(name: string) {
    const Component = (props: StubProps) =>
      React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
  }

  return {
    View: host("View"),
    Text: host("Text"),
    Pressable: host("Pressable"),
    ScrollView: host("ScrollView"),
    Modal: host("Modal"),
    StyleSheet: {
      create: <T,>(styles: T) => styles,
      flatten: (style: unknown) => style,
      hairlineWidth: 1,
    },
    AccessibilityInfo: { setAccessibilityFocus: () => {} },
    Platform: {
      OS: "ios",
      select: (spec: Record<string, unknown>) => spec.ios ?? spec.default,
    },
  };
});

import { View } from "react-native";
// react-test-renderer ships without type declarations in this workspace.
// @ts-expect-error — untyped package.
import { create as createTree, act as rendererAct } from "react-test-renderer";
import {
  describeAutofocus,
  getKernPortalRegistry,
  nextKernPortalId,
  PresenceGate,
  resolveKernPortalTarget,
  resolvePopoverOrigin,
  useDismissBranches,
  useKernDir,
  useKernPortalRegistration,
  useKernPress,
  VisuallyHidden,
} from "./presentation";

type TestNode = {
  type: string | ((props: Record<string, unknown>) => ReactNode);
  props: Record<string, unknown> & { children?: ReactNode };
};

type TestTree = {
  root: {
    findAll: (match: (node: TestNode) => boolean) => TestNode[];
    findByType: (type: string) => TestNode;
  };
  update: (element: ReactNode) => void;
  unmount: () => void;
};

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acc, entry) => Object.assign(acc, flattenStyle(entry)),
      {},
    );
  }
  return style as Record<string, unknown>;
}

/** Render a hook result through a probe component. */
function probeHook<T>(useHook: () => T): { current: () => T; tree: TestTree } {
  let latest!: T;
  const Probe = () => {
    latest = useHook();
    return null;
  };
  let tree!: TestTree;
  rendererAct(() => {
    tree = createTree(<Probe />) as TestTree;
  });
  return { current: () => latest, tree };
}

describe("VisuallyHidden (native)", () => {
  it("stays announced with a collapsed footprint", () => {
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(
        <VisuallyHidden testID="vh">Close</VisuallyHidden>,
      ) as TestTree;
    });
    const text = tree.root.findByType("Text");
    expect(text.props.children).toBe("Close");
    expect(text.props.accessible).toBe(true);
    const style = flattenStyle(text.props.style);
    expect(style.width).toBe(1);
    expect(style.height).toBe(1);
    expect(style.opacity).toBe(0);
  });

  it("merges a consumer style with the consumer winning per key", () => {
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(
        <VisuallyHidden style={{ color: "red", width: 99 }}>
          Close
        </VisuallyHidden>,
      ) as TestTree;
    });
    const style = flattenStyle(tree.root.findByType("Text").props.style);
    expect(style.color).toBe("red");
    // Slot semantics: an explicit consumer declaration wins per key.
    expect(style.width).toBe(99);
  });
});

describe("owned portal registry (native)", () => {
  it("tracks mounts in order and cleans up on unmount", () => {
    const registry = getKernPortalRegistry();
    function Surface({ id }: { id: string }) {
      useKernPortalRegistration(id, true);
      return null;
    }
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(
        <>
          <Surface id="native-portal-a" />
          <Surface id="native-portal-b" />
        </>,
      ) as TestTree;
    });
    expect(registry.order()).toContain("native-portal-a");
    expect(registry.order()).toContain("native-portal-b");
    rendererAct(() => tree.unmount());
    expect(registry.isMounted("native-portal-a")).toBe(false);
    expect(registry.isMounted("native-portal-b")).toBe(false);
  });

  it("registers nothing while inactive", () => {
    const registry = getKernPortalRegistry();
    function Surface() {
      useKernPortalRegistration("native-portal-idle", false);
      return null;
    }
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(<Surface />) as TestTree;
    });
    expect(registry.isMounted("native-portal-idle")).toBe(false);
    rendererAct(() => tree.unmount());
  });

  it("issues scoped ids with a kern default target", () => {
    const first = nextKernPortalId();
    const second = nextKernPortalId();
    expect(first).toMatch(/^kern-portal-\d+$/);
    expect(first).not.toBe(second);
    expect(resolveKernPortalTarget({})).toBe("kern-portal-root");
    expect(resolveKernPortalTarget({ ownerProvided: "host" })).toBe("host");
  });
});

describe("PresenceGate (native)", () => {
  const SURFACE = "presence-surface";

  function countSurfaces(tree: TestTree): number {
    // Host elements only: the composite instance and its rendered host both
    // carry the props, so matching both would double-count one surface.
    return tree.root.findAll(
      (node) => typeof node.type === "string" && node.props?.testID === SURFACE,
    ).length;
  }

  it("suspends unmount until the surface reports its exit finished", () => {
    let finish: (() => void) | null = null;
    const renderGate = (open: boolean) => (
      <PresenceGate
        open={open}
        render={({ finishExit }) => {
          finish = finishExit;
          return <View testID={SURFACE}>body</View>;
        }}
      />
    );
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(renderGate(true)) as TestTree;
    });
    expect(countSurfaces(tree)).toBe(1);
    // Closing suspends: still in the tree for the exit animation.
    rendererAct(() => {
      tree.update(renderGate(false));
    });
    expect(countSurfaces(tree)).toBe(1);
    // Only the surface's own exit signal unmounts.
    rendererAct(() => {
      (finish as unknown as () => void)();
    });
    expect(countSurfaces(tree)).toBe(0);
    rendererAct(() => tree.unmount());
  });

  it("renders nothing when never opened", () => {
    let tree!: TestTree;
    rendererAct(() => {
      tree = createTree(
        <PresenceGate open={false}>
          <View testID={SURFACE}>body</View>
        </PresenceGate>,
      ) as TestTree;
    });
    expect(countSurfaces(tree)).toBe(0);
    rendererAct(() => tree.unmount());
  });
});

describe("describeAutofocus", () => {
  it("names the close stop when the policy renders one", () => {
    expect(describeAutofocus({ hasCloseControl: true })).toEqual({
      type: "focus-stop",
      index: 0,
    });
  });

  it("names the first stop of a single-stop surface", () => {
    expect(describeAutofocus({ hasCloseControl: false })).toEqual({
      type: "focus-stop",
      index: 0,
    });
  });
});

describe("useKernPress (native)", () => {
  it("reports a press on release over the target", () => {
    const onPress = vi.fn();
    const hook = probeHook(() => useKernPress({ onPress }));
    rendererAct(() => hook.current().onPressIn());
    expect(hook.current().pressed).toBe(true);
    rendererAct(() => hook.current().onPress());
    expect(hook.current().pressed).toBe(false);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("cancels on press-out with no press reported", () => {
    const onPress = vi.fn();
    const hook = probeHook(() => useKernPress({ onPress }));
    rendererAct(() => hook.current().onPressIn());
    rendererAct(() => hook.current().onPressOut());
    expect(hook.current().pressed).toBe(false);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("reports exactly once under the platform out-then-press order", () => {
    // `Pressable` fires `onPressOut` on EVERY release, including a successful
    // tap (`onPressIn` → `onPressOut` → `onPress`). The commit must survive
    // the cancel that precedes it, or no real tap ever reports.
    const onPress = vi.fn();
    const hook = probeHook(() => useKernPress({ onPress }));
    rendererAct(() => hook.current().onPressIn());
    rendererAct(() => hook.current().onPressOut());
    rendererAct(() => hook.current().onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(hook.current().pressed).toBe(false);
  });

  it("reports exactly once under the press-then-out order", () => {
    const onPress = vi.fn();
    const hook = probeHook(() => useKernPress({ onPress }));
    rendererAct(() => hook.current().onPressIn());
    rendererAct(() => hook.current().onPress());
    rendererAct(() => hook.current().onPressOut());
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(hook.current().pressed).toBe(false);
  });

  it("accepts no input when disabled", () => {
    const onPress = vi.fn();
    const hook = probeHook(() => useKernPress({ disabled: true, onPress }));
    rendererAct(() => hook.current().onPressIn());
    expect(hook.current().pressed).toBe(false);
    rendererAct(() => hook.current().onPress());
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("useDismissBranches (native)", () => {
  it("fires the system-back branch on a modal dismissible surface", () => {
    const hook = probeHook(() =>
      useDismissBranches({
        modal: true,
        dismissible: true,
        hasVisibleClose: true,
      }),
    );
    expect(hook.current().fires("system-back", true)).toBe(true);
    expect(hook.current().fires("system-back", false)).toBe(false);
    expect(hook.current().fires("outside-pointer", true)).toBe(true);
  });

  it("fires nothing dismissible-off", () => {
    const hook = probeHook(() =>
      useDismissBranches({
        modal: true,
        dismissible: false,
        hasVisibleClose: false,
      }),
    );
    expect(hook.current().fires("system-back", true)).toBe(false);
    expect(hook.current().fires("close", true)).toBe(false);
  });
});

describe("resolvePopoverOrigin (native)", () => {
  it("shares the kernel placement math with web", () => {
    expect(
      resolvePopoverOrigin(
        { x: 100, y: 100, width: 80, height: 40 },
        { width: 120, height: 60 },
        { placement: "top", offset: 8 },
      ),
    ).toEqual({ x: 80, y: 32 });
  });
});

describe("useKernDir (native)", () => {
  it("never returns undefined", () => {
    expect(probeHook(() => useKernDir()).current()).toBe("ltr");
    expect(probeHook(() => useKernDir({ defaultDir: "rtl" })).current()).toBe(
      "rtl",
    );
  });
});
