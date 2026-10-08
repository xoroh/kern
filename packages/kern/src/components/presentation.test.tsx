/**
 * Renderer-side proofs for the presentation hosts: each host binds a kernel
 * model to DOM mechanics, and each test drives the MECHANICS (Tab, pointer,
 * mount), never the kernel in isolation — the kernel has its own suite.
 */
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  getKernPortalRegistry,
  KernFocusTrap,
  KernPortal,
  PresenceGate,
  resolvePopoverOrigin,
  Slotted,
  useDismissBranches,
  useKernDir,
  useKernPress,
  VisuallyHidden,
} from "./presentation";

describe("VisuallyHidden", () => {
  it("renders announced content with the kernel hiding geometry", () => {
    render(<VisuallyHidden testID="vh">Close</VisuallyHidden>);
    const node = screen.getByTestId("vh");
    expect(node).toHaveTextContent("Close");
    expect(node.style.position).toBe("absolute");
    expect(node.style.width).toBe("1px");
    expect(node.style.overflow).toBe("hidden");
  });

  it("merges a consumer style with the consumer winning per key", () => {
    render(
      <VisuallyHidden testID="vh2" style={{ color: "red" }}>
        Close
      </VisuallyHidden>,
    );
    const node = screen.getByTestId("vh2") as HTMLElement;
    expect(node.style.color).toBe("red");
    expect(node.style.position).toBe("absolute");
  });
});

describe("Slotted", () => {
  it("merges part props into the consumer element via the slot kernel", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    render(
      <Slotted
        asChild={<button type="button">Go</button>}
        className="part"
        onClick={() => seen.push("part")}
      />,
    );
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveClass("part");
    await user.click(button);
    expect(seen).toEqual(["part"]);
  });

  it("chains consumer handlers after the part's", async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    const consumer = (
      <button type="button" onClick={() => seen.push("consumer")}>
        Go
      </button>
    );
    render(<Slotted asChild={consumer} onClick={() => seen.push("part")} />);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(seen).toEqual(["part", "consumer"]);
  });
});

describe("KernPortal", () => {
  it("paints children and tracks the mount in the owned registry", () => {
    const registry = getKernPortalRegistry();
    const { unmount } = render(
      <KernPortal id="test-owned-portal">
        <div data-testid="portaled">hello</div>
      </KernPortal>,
    );
    expect(screen.getByTestId("portaled")).toHaveTextContent("hello");
    expect(registry.isMounted("test-owned-portal")).toBe(true);
    unmount();
    expect(registry.isMounted("test-owned-portal")).toBe(false);
  });

  it("keeps sibling owned portals distinct in one shared host", () => {
    // Two overlays portal into the same host element; the mount key (overlay
    // id) is what keeps React from mismatching one subtree for the other.
    const registry = getKernPortalRegistry();
    const { unmount } = render(
      <>
        <KernPortal id="owned-sibling-a">
          <div data-testid="owned-sibling-a">alpha</div>
        </KernPortal>
        <KernPortal id="owned-sibling-b">
          <div data-testid="owned-sibling-b">beta</div>
        </KernPortal>
      </>,
    );
    expect(screen.getByTestId("owned-sibling-a")).toHaveTextContent("alpha");
    expect(screen.getByTestId("owned-sibling-b")).toHaveTextContent("beta");
    expect(registry.order()).toEqual(
      expect.arrayContaining(["owned-sibling-a", "owned-sibling-b"]),
    );
    unmount();
    expect(registry.isMounted("owned-sibling-a")).toBe(false);
    expect(registry.isMounted("owned-sibling-b")).toBe(false);
  });
});

describe("PresenceGate", () => {
  it("suspends unmount until the surface reports its exit finished", () => {
    let finish: (() => void) | null = null;
    const { rerender } = render(
      <PresenceGate
        open
        render={({ finishExit }) => {
          finish = finishExit;
          return <div data-testid="surface">body</div>;
        }}
      />,
    );
    expect(screen.getByTestId("surface")).toBeInTheDocument();
    // Closing suspends: still in the tree, available for the exit animation.
    rerender(
      <PresenceGate
        open={false}
        render={({ finishExit }) => {
          finish = finishExit;
          return <div data-testid="surface">body</div>;
        }}
      />,
    );
    expect(screen.getByTestId("surface")).toBeInTheDocument();
    // Only the surface's own exit signal unmounts.
    act(() => {
      (finish as unknown as () => void)();
    });
    expect(screen.queryByTestId("surface")).not.toBeInTheDocument();
  });

  it("renders nothing when never opened", () => {
    render(
      <PresenceGate open={false}>
        <div data-testid="never">body</div>
      </PresenceGate>,
    );
    expect(screen.queryByTestId("never")).not.toBeInTheDocument();
  });
});

describe("KernFocusTrap", () => {
  function Trap() {
    return (
      <KernFocusTrap>
        <button type="button">First</button>
        <button type="button">Second</button>
        <button type="button">Third</button>
      </KernFocusTrap>
    );
  }

  it("moves focus into the first stop on mount", () => {
    render(<Trap />);
    expect(document.activeElement).toHaveTextContent("First");
  });

  it("loops Tab from the last stop to the first", () => {
    render(<Trap />);
    const third = screen.getByRole("button", { name: "Third" });
    third.focus();
    fireEvent.keyDown(third, { key: "Tab" });
    expect(document.activeElement).toHaveTextContent("First");
  });

  it("loops Shift+Tab from the first stop to the last", () => {
    render(<Trap />);
    const first = screen.getByRole("button", { name: "First" });
    first.focus();
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toHaveTextContent("Third");
  });

  it("jumps Home and End", () => {
    render(<Trap />);
    const second = screen.getByRole("button", { name: "Second" });
    second.focus();
    fireEvent.keyDown(second, { key: "End" });
    expect(document.activeElement).toHaveTextContent("Third");
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Home" });
    expect(document.activeElement).toHaveTextContent("First");
  });
});

describe("useKernPress", () => {
  it("reports a press on pointer release over the target", () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => useKernPress({ onPress }));
    act(() => result.current.onPointerDown());
    expect(result.current.pressed).toBe(true);
    act(() => result.current.onPointerUp());
    expect(result.current.pressed).toBe(false);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("cancels when the pointer leaves", () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => useKernPress({ onPress }));
    act(() => result.current.onPointerDown());
    act(() => result.current.onPointerLeave());
    expect(result.current.pressed).toBe(false);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("activates Enter on key down and Space on key up", () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => useKernPress({ onPress }));
    act(() =>
      result.current.onKeyDown({
        key: "Enter",
        preventDefault: () => {},
      } as never),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
    act(() =>
      result.current.onKeyDown({
        key: " ",
        preventDefault: () => {},
      } as never),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
    act(() => result.current.onKeyUp({ key: " " } as never));
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});

describe("useDismissBranches", () => {
  it("fires declared branches while open and nothing while closed", () => {
    const { result } = renderHook(() =>
      useDismissBranches({
        modal: true,
        dismissible: true,
        hasVisibleClose: true,
      }),
    );
    expect(result.current.fires("escape", true)).toBe(true);
    expect(result.current.fires("escape", false)).toBe(false);
    expect(result.current.branches["outside-pointer"]).toBe(true);
  });

  it("declares no outside branches on a non-modal surface", () => {
    const { result } = renderHook(() =>
      useDismissBranches({
        modal: false,
        dismissible: true,
        hasVisibleClose: true,
      }),
    );
    expect(result.current.fires("outside-pointer", true)).toBe(false);
    expect(result.current.fires("close", true)).toBe(true);
  });
});

describe("resolvePopoverOrigin", () => {
  it("places below the anchor and clamps into the viewport", () => {
    expect(
      resolvePopoverOrigin(
        { x: 100, y: 100, width: 80, height: 40 },
        { width: 120, height: 60 },
      ),
    ).toEqual({ x: 80, y: 140 });
    expect(
      resolvePopoverOrigin(
        { x: 350, y: 350, width: 40, height: 40 },
        { width: 120, height: 60 },
        { viewport: { width: 400, height: 400 } },
      ),
    ).toEqual({ x: 280, y: 340 });
  });
});

describe("useKernDir", () => {
  it("resolves explicit, host default, then ltr", () => {
    expect(renderHook(() => useKernDir({ dir: "rtl" })).result.current).toBe(
      "rtl",
    );
    expect(
      renderHook(() => useKernDir({ defaultDir: "rtl" })).result.current,
    ).toBe("rtl");
    expect(renderHook(() => useKernDir()).result.current).toBe("ltr");
  });
});
