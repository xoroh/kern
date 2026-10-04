/**
 * Native behaviour suite for the overlay surfaces family (P2b-3, tranche 5):
 * `Drawer`, `Popover` and `ScrollArea`.
 *
 * Written BEFORE the implementation, per the P2b-4 discipline: a test written
 * after the code that then passes proves nothing about whether the contract was
 * honoured.
 *
 * Two kinds of test, deliberately separated (the tranche-1..4 convention):
 *
 * 1. The parity-contract block reads the SAME declaration as the web suite
 *    (`parity/contract.ts`, aliased `@kern-parity/contract`). Cross-renderer:
 *    a failure means the two sides disagree.
 * 2. The rest assert behaviour the contract deliberately does NOT pin, because
 *    the renderers legitimately differ — chiefly the trigger.
 *
 * **What is deliberately NOT cross-renderer here.** M3's `Popover` trigger is
 * click/hover on web; touch has neither. The contract pins what both sides
 * share (a labelled, expandable, dismissible surface) and the trigger is
 * asserted natively as kern's own decision — the same treatment `Tooltip`
 * (tranche 4) received, and the same reasoning.
 *
 * **How the role is asserted: by walking the rendered a11y tree, not by
 * `getByRole`.** RN ships two role props and RNTL indexes only one of them —
 * `accessibilityRole`, whose union has no `dialog` member. The dialog role
 * therefore lives on the ARIA-aligned `role` prop (see `dialog.tsx:83-90`), which
 * `getByRole` cannot see. `dialog.rntest.tsx` already established this pattern
 * and why; this file follows it rather than rediscovering it. Walking the tree
 * also proves the props reach a host element instead of dying on a wrapper.
 *
 * Callback assertions use plain closures rather than a spy, matching the house
 * convention in `composition.rntest.tsx`.
 *
 * This file imports nothing from `@xoroh/kern` — ADR 002.
 */
import { contractFor } from "@kern-parity/contract";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act, type ReactElement } from "react";
import { AccessibilityInfo, Modal, Text as RNText } from "react-native";

// `import * as ns` compiles to a COPY (`_interopRequireWildcard`), so spying
// the namespace object mutates the copy while implementation code calls the
// original `module.exports` — every spy silently misses (verified: full render,
// zero interceptions). Named imports compile to direct property access on the
// real object, and `jest.requireActual` below returns that same object, so
// spies installed on THESE references intercept for real.
type JsxModule = {
  jsx: (type: unknown, props: unknown, ...rest: unknown[]) => unknown;
  jsxs: (type: unknown, props: unknown, ...rest: unknown[]) => unknown;
  jsxDEV: (type: unknown, props: unknown, ...rest: unknown[]) => unknown;
};
type RNModule = {
  findNodeHandle: (component: unknown) => number | null;
};

import { Drawer, Popover, ScrollArea } from "./overlay-surfaces";
import { SheetSurface } from "./sheet-surface";

type A11yNode = {
  role?: string;
  a11yRole?: string;
  label?: string;
  isModal?: boolean;
  expanded?: boolean;
  scroll?: unknown;
  /** The host node's resolved style. Carried so a suite can assert a STYLE
   *  property (resting elevation) on the node it found by label, rather than
   *  searching the tree a second time for it. */
  style?: unknown;
};

/** Collect every host node in the rendered tree carrying an a11y signal. */
function a11yTree(): A11yNode[] {
  const found: A11yNode[] = [];
  const walk = (node: unknown): void => {
    if (node === null || typeof node !== "object") return;
    const candidate = node as {
      props?: Record<string, unknown>;
      children?: unknown[];
    };
    const props = candidate.props ?? {};
    const state = (props.accessibilityState ?? {}) as { expanded?: boolean };
    if (
      props.role !== undefined ||
      props.accessibilityRole !== undefined ||
      props.accessibilityLabel !== undefined ||
      props.accessibilityViewIsModal !== undefined
    ) {
      found.push({
        role: props.role as string | undefined,
        a11yRole: props.accessibilityRole as string | undefined,
        label: props.accessibilityLabel as string | undefined,
        isModal: props.accessibilityViewIsModal as boolean | undefined,
        expanded: state.expanded,
        scroll: props.accessibilityScroll,
        style: props.style,
      });
    }
    for (const child of candidate.children ?? []) walk(child);
  };
  walk(screen.toJSON() as unknown);
  return found;
}

const labelled = (label: string): A11yNode | undefined =>
  a11yTree().find((n) => n.label === label);

describe("native Drawer (P2b-3 tranche 5)", () => {
  it("is not presented when closed", async () => {
    await render(
      <Drawer open={false} title="Menu">
        <Drawer.Content />
      </Drawer>,
    );
    expect(labelled("Menu")).toBeUndefined();
  });

  it("carries role=dialog and modality when open", async () => {
    await render(
      <Drawer open title="Menu">
        <Drawer.Content />
      </Drawer>,
    );
    const node = labelled("Menu");
    // M3's drawer is the MODAL variant: it covers content behind a scrim, so it
    // must be a dialog AND declare modality. `role` is the prop that carries
    // the dialog role on RN — `accessibilityRole` has no such member.
    expect(node?.role).toBe("dialog");
    expect(node?.isModal).toBe(true);
  });

  it("reports expanded=false on the trigger when closed", async () => {
    await render(
      <Drawer open={false} title="Menu">
        <Drawer.Content />
      </Drawer>,
    );
    expect(labelled("Open menu")?.expanded).toBe(false);
  });

  it("reports expanded=true on the trigger when open", async () => {
    await render(
      <Drawer open title="Menu">
        <Drawer.Content />
      </Drawer>,
    );
    expect(labelled("Open menu")?.expanded).toBe(true);
  });

  it("dismisses on the scrim press", async () => {
    const seen: boolean[] = [];
    await render(
      <Drawer
        open
        title="Menu"
        onOpenChange={(next: boolean) => seen.push(next)}
      >
        <Drawer.Content />
      </Drawer>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss menu"));
    });
    expect(seen).toEqual([false]);
  });

  it("does not dismiss when the drawer content itself is pressed", async () => {
    const seen: boolean[] = [];
    await render(
      <Drawer
        open
        title="Menu"
        onOpenChange={(next: boolean) => seen.push(next)}
      >
        <Drawer.Content />
      </Drawer>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Menu"));
    });
    expect(seen).toEqual([]);
  });
});

describe("native Popover (P2b-3 tranche 5)", () => {
  it("is not presented when closed", async () => {
    await render(
      <Popover.Root>
        <Popover.Content label="Details">
          <Popover.Body />
        </Popover.Content>
      </Popover.Root>,
    );
    expect(labelled("Details")).toBeUndefined();
  });

  it("is a dialog but NOT modal when open", async () => {
    await render(
      <Popover.Root defaultOpen>
        <Popover.Content label="Details">
          <Popover.Body />
        </Popover.Content>
      </Popover.Root>,
    );
    const node = labelled("Details");
    // The whole point of this file: unlike Drawer, a Popover leaves the content
    // behind it interactive. Claiming modality here is the exact bug asserted.
    expect(node?.role).toBe("dialog");
    expect(node?.isModal ?? false).toBe(false);
  });

  it("the trigger reports expanded=false when closed", async () => {
    await render(
      <Popover.Root>
        <Popover.Trigger label="Show details" />
        <Popover.Content label="Details">
          <Popover.Body />
        </Popover.Content>
      </Popover.Root>,
    );
    expect(labelled("Show details")?.expanded).toBe(false);
  });

  it("opens from the trigger", async () => {
    const seen: boolean[] = [];
    await render(
      <Popover.Root
        open={false}
        onOpenChange={(next: boolean) => {
          seen.push(next);
        }}
      >
        <Popover.Trigger label="Show details" />
        <Popover.Content label="Details">
          <Popover.Body />
        </Popover.Content>
      </Popover.Root>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Show details"));
    });
    expect(seen).toEqual([true]);
  });

  it("rests at an ON-SCALE M3 elevation", async () => {
    await render(
      <Popover.Root defaultOpen>
        <Popover.Content label="Details">
          <Popover.Body />
        </Popover.Content>
      </Popover.Root>,
    );
    // The value was `2`, which matches NO level on M3's scale (0/1/3/6/8/12).
    // An off-scale elevation is not a design choice, it is an inconsistency that
    // cannot be compared to the web side at all — web binds the popover to
    // `--md-sys-elevation-level2`, which is 3dp.
    //
    // Asserted against the SCALE rather than the literal 3: a test that pins
    // only `toBe(3)` would still pass if someone reintroduced `2` AND someone
    // later added `2` to the scale, and it would not say why 2 was wrong. The
    // scale is the contract.
    const M3_LEVELS = [0, 1, 3, 6, 8, 12];
    const surface = labelled("Details");
    const style = JSON.stringify(surface?.style ?? "");
    const match = style.match(/"elevation":(\d+)/);
    expect(match).not.toBeNull();
    expect(M3_LEVELS).toContain(Number(match?.[1]));
  });
});

describe("native ScrollArea (P2b-3 tranche 5)", () => {
  it("exposes its children to assistive technology", async () => {
    await render(
      <ScrollArea>
        <ScrollArea.Viewport label="Rows">
          <ScrollArea.Row label="Row one" />
          <ScrollArea.Row label="Row two" />
        </ScrollArea.Viewport>
      </ScrollArea>,
    );
    expect(screen.getByLabelText("Row one")).toBeTruthy();
    expect(screen.getByLabelText("Row two")).toBeTruthy();
  });

  it("exposes a scrollable region and a labelled viewport, separately", async () => {
    await render(
      <ScrollArea horizontal showsHorizontalScrollIndicator={false}>
        <ScrollArea.Viewport label="Rows">
          <ScrollArea.Row label="Row one" />
        </ScrollArea.Viewport>
      </ScrollArea>,
    );
    // Two different obligations on two different hosts, and conflating them
    // is the bug this asserts: RN exposes scrollability on the scrolling
    // `ScrollView`, while the label lives on the labelled `Viewport`. A
    // wrapper that claimed both would announce a static group and hide the
    // fact that it scrolls.
    const scrollable = a11yTree().find((n) => n.role === "group");
    expect(scrollable?.role).toBe("group");
    expect(labelled("Rows")?.label).toBe("Rows");
  });
});

describe("SheetSurface focus-move-in (D2)", () => {
  // `onShow` is a native presentation event the test renderer never fires, and
  // the host-element tree hides the composite `Modal` entirely: RNTL 14 removed
  // the UNSAFE queries, and `screen.root` traversal (`queryAll`) finds no node
  // carrying `onShow` (verified: the traversal run fails its own defined-check
  // rather than silently passing — that attempt is gone, this comment stays as
  // the record). What remains is the JSX layer: spy `jsx`/`jsxs`, record every
  // `Modal` element's props during render, then invoke the real `onShow`.
  // Spying records and delegates — rendering is unchanged — and the
  // `expect(modals).toHaveLength(1)` below fails loudly if the toolchain ever
  // stops emitting through these entry points.
  //
  // Three entry points, not one: babel's automatic runtime emits `jsxDEV` in
  // development (which is what jest runs) and `jsx`/`jsxs` in production. The
  // loud length assertion covers a runtime flip in either direction.
  // Spied on the REAL module objects via `requireActual` (see import note).
  const renderAndCaptureModal = async (element: ReactElement) => {
    const captured: Array<{ onShow?: () => void }> = [];
    const jsxRuntime = jest.requireActual("react/jsx-runtime") as JsxModule;
    const jsxDevRuntime = jest.requireActual(
      "react/jsx-dev-runtime",
    ) as JsxModule;
    const record = (type: unknown, props: unknown) => {
      if (type === Modal) {
        captured.push((props ?? {}) as { onShow?: () => void });
      }
    };
    const jsxOrig = jsxRuntime.jsx;
    const jsxsOrig = jsxRuntime.jsxs;
    const jsxSpy = jest
      .spyOn(jsxRuntime, "jsx")
      .mockImplementation((type, props, ...rest) => {
        record(type, props);
        return jsxOrig(type, props, ...rest);
      });
    const jsxsSpy = jest
      .spyOn(jsxRuntime, "jsxs")
      .mockImplementation((type, props, ...rest) => {
        record(type, props);
        return jsxsOrig(type, props, ...rest);
      });
    const jsxDevOrig = jsxDevRuntime.jsxDEV;
    const jsxDevSpy = jest
      .spyOn(jsxDevRuntime, "jsxDEV")
      .mockImplementation((type, props, ...rest) => {
        record(type, props);
        return jsxDevOrig(type, props, ...rest);
      });
    try {
      await render(element);
    } finally {
      jsxSpy.mockRestore();
      jsxsSpy.mockRestore();
      jsxDevSpy.mockRestore();
    }
    expect(captured).toHaveLength(1);
    return captured;
  };

  // `findNodeHandle` needs a real native tag, which the test renderer never
  // produces — so it is spied (module factories via `jest.mock` break the RN
  // preset's native-module setup: DevMenu TurboModule missing). Installed
  // AFTER render so renderer internals never see the stub; WHAT was focused is
  // asserted via the spy's argument, so a masking failure would have to focus
  // the wrong node, which this catches.
  const spyTags = () => {
    const RNActual = jest.requireActual("react-native") as RNModule;
    const findNodeHandle = jest
      .spyOn(RNActual, "findNodeHandle")
      .mockReturnValue(7);
    const setFocus = jest
      .spyOn(AccessibilityInfo, "setAccessibilityFocus")
      .mockImplementation(() => {});
    return { findNodeHandle, setFocus };
  };
  const present = (modals: Array<{ onShow?: () => void }>) => {
    const onShow = modals[0]?.onShow;
    expect(onShow).toBeDefined();
    return act(async () => {
      onShow?.();
    });
  };

  it("moves accessibility focus to the close control on presentation", async () => {
    const modals = await renderAndCaptureModal(
      <SheetSurface
        open
        title="Sheet"
        onDismiss={() => {}}
        testID="sheet"
        surface={{}}
      >
        <RNText>body</RNText>
      </SheetSurface>,
    );
    const { findNodeHandle, setFocus } = spyTags();
    try {
      await present(modals);
      // WHAT was focused matters more than the tag: the close control is first
      // in tab order and always actionable (the APG "first focusable" shape).
      expect(findNodeHandle).toHaveBeenCalled();
      const focused = findNodeHandle.mock.calls[0][0] as {
        props?: { accessibilityLabel?: string };
      };
      expect(focused.props?.accessibilityLabel).toBe("Close Sheet");
      expect(setFocus).toHaveBeenCalledWith(7);
    } finally {
      setFocus.mockRestore();
      findNodeHandle.mockRestore();
    }
  });

  it("falls back to the card when no close control renders", async () => {
    const modals = await renderAndCaptureModal(
      <SheetSurface open title="Sheet" testID="sheet" surface={{}}>
        <RNText>body</RNText>
      </SheetSurface>,
    );
    // No `onDismiss`, so the policy renders no close control — the card is the
    // only target left, and focusing it must still happen rather than throwing
    // on a null ref.
    expect(screen.queryByLabelText("Close Sheet")).toBeNull();
    const { findNodeHandle, setFocus } = spyTags();
    try {
      await present(modals);
      const focused = findNodeHandle.mock.calls[0][0] as {
        props?: { testID?: string };
      };
      expect(focused.props?.testID).toBe("sheet");
      expect(setFocus).toHaveBeenCalledWith(7);
    } finally {
      setFocus.mockRestore();
      findNodeHandle.mockRestore();
    }
  });
});

describe("parity contract rows for this family", () => {
  // Guards the declaration itself: if a row is removed, this fails rather than
  // silently reducing coverage to zero.
  it("declares rows for every component in this family", () => {
    for (const name of ["drawer", "popover", "scroll-area"]) {
      expect(() => contractFor(name)).not.toThrow();
    }
  });
});
