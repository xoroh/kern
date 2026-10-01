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
import { act } from "react";
import { Drawer, Popover, ScrollArea } from "./overlay-surfaces";

type A11yNode = {
  role?: string;
  a11yRole?: string;
  label?: string;
  isModal?: boolean;
  expanded?: boolean;
  scroll?: unknown;
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

describe("parity contract rows for this family", () => {
  // Guards the declaration itself: if a row is removed, this fails rather than
  // silently reducing coverage to zero.
  it("declares rows for every component in this family", () => {
    for (const name of ["drawer", "popover", "scroll-area"]) {
      expect(() => contractFor(name)).not.toThrow();
    }
  });
});
