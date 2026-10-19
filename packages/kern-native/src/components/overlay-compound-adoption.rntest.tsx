import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Modal, Pressable } from "react-native";
import { Dialog } from "./dialog";
import { Menu } from "./menu";
import {
  OverlayModalityProvider,
  useAnyModalOpen,
} from "./overlay-surfaces";
import { Select } from "./select";
import { Text } from "./text";
import { Tooltip } from "./tooltip";

/**
 * Overlay-compound adoption (Axis #57 + #60): Kern's Menu, Select and
 * Tooltip present through Axis `OverlayRoot` + `OverlayPortal` parts
 * instead of wrapping RN `Modal` directly, and Axis-driven overlays join
 * the ONE shared modality stack `useAnyModalOpen` reads.
 *
 * Tooltip is deliberately NOT on OverlayRoot (a non-modal hint must never
 * trap touches): it adopts the `TooltipRoot` + `TooltipPortal` structure
 * with Kern's M3 focus trigger and geometry intact.
 *
 * Host note (Axis limitation at the vendored SHA, see the lane report):
 * with a root `PortalHost` mounted, the family compounds (`MenuRoot`,
 * `SelectRoot`, ...) paint EMPTY layers — their disclosure contexts do not
 * cross the portal render boundary (only raw `Overlay*` parts re-provide
 * theirs; no Axis test covers compound+host). So the compounds below render
 * with no host in the tree and `OverlayPortal` falls back inline, which is
 * the documented behaviour. Mounting the root host (site + mobile roots)
 * waits for the Axis fix lane (#73, "portals all anchored popups to
 * PortalHost"); these tests are written host-agnostic so they keep passing
 * when the host lands — no component change needed, the Portal parts are
 * already in the tree.
 */

type JsxModule = {
  jsx: (...args: Array<unknown>) => unknown;
  jsxs: (...args: Array<unknown>) => unknown;
  jsxDEV: (...args: Array<unknown>) => unknown;
};

/** Count rendered RN `Modal` hosts via the jsx runtimes (jest runs dev). */
async function countModals(element: React.ReactElement): Promise<number> {
  let count = 0;
  const jsxRuntime = jest.requireActual("react/jsx-runtime") as JsxModule;
  const jsxDevRuntime = jest.requireActual(
    "react/jsx-dev-runtime",
  ) as JsxModule;
  const record = (type: unknown) => {
    if (type === Modal) count += 1;
  };
  const jsxOrig = jsxRuntime.jsx;
  const jsxsOrig = jsxRuntime.jsxs;
  const jsxDevOrig = jsxDevRuntime.jsxDEV;
  const spies = [
    jest.spyOn(jsxRuntime, "jsx").mockImplementation((type, ...rest) => {
      record(type);
      return (jsxOrig as (...a: Array<unknown>) => unknown)(type, ...rest);
    }),
    jest.spyOn(jsxRuntime, "jsxs").mockImplementation((type, ...rest) => {
      record(type);
      return (jsxsOrig as (...a: Array<unknown>) => unknown)(type, ...rest);
    }),
    jest
      .spyOn(jsxDevRuntime, "jsxDEV")
      .mockImplementation((type, ...rest) => {
        record(type);
        return (jsxDevOrig as (...a: Array<unknown>) => unknown)(
          type,
          ...rest,
        );
      }),
  ];
  try {
    await render(element);
  } finally {
    for (const spy of spies) spy.mockRestore();
  }
  return count;
}

describe("overlay-compound adoption: no direct Modal wrapping", () => {
  it("control: the helper sees a Modal-based overlay (Dialog still wraps one)", async () => {
    const modals = await countModals(
      <Dialog title="Still modal" open>
        <Text>body</Text>
      </Dialog>,
    );
    // Proves the counter is load-bearing: a Modal host cannot hide from it.
    expect(modals).toBeGreaterThan(0);
  });

  it("Menu presents without an RN Modal host", async () => {
    const modals = await countModals(
      <Menu
        triggerLabel="File"
        trigger={<Text>Open menu</Text>}
        items={[{ label: "New" }]}
      />,
    );
    expect(modals).toBe(0);
  });

  it("Select presents without an RN Modal host", async () => {
    const modals = await countModals(
      <Select
        accessibilityLabel="Plan"
        options={[{ value: "free", label: "Free" }]}
      />,
    );
    expect(modals).toBe(0);
  });

  it("Tooltip presents without an RN Modal host", async () => {
    const modals = await countModals(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    expect(modals).toBe(0);
  });
});

describe("overlay-compound adoption: OverlayPortal presentation", () => {
  it("Menu opens its items through the compound and dismisses on scrim", async () => {
    let dismissed = 0;
    await render(
      <Menu
        triggerLabel="File"
        trigger={<Text>Open menu</Text>}
        items={[{ label: "New", onSelect: () => {} }]}
        onDismiss={() => {
          dismissed += 1;
        }}
      />,
    );
    expect(screen.queryByLabelText("New")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("File"));
    });
    expect(screen.getByLabelText("New")).toBeTruthy();
    // The scrim is a real dismissal path (the pre-migration scrim was a
    // bare View with no press handler, so this never fired).
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss menu"));
    });
    expect(dismissed).toBe(1);
    expect(screen.queryByLabelText("New")).toBeNull();
  });

  it("Select opens its options through the compound and dismisses on scrim", async () => {
    let dismissed = 0;
    await render(
      <Select
        accessibilityLabel="Plan"
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
        onDismiss={() => {
          dismissed += 1;
        }}
      />,
    );
    expect(screen.queryByLabelText("Pro")).toBeNull();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Plan"));
    });
    expect(screen.getByLabelText("Pro")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss select"));
    });
    expect(dismissed).toBe(1);
    expect(screen.queryByLabelText("Pro")).toBeNull();
  });

  it("Select reports dismissal only when nothing was chosen (pick vs bail-out)", async () => {
    let chosen = "";
    let dismissed = 0;
    await render(
      <Select
        accessibilityLabel="Plan"
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
        onValueChange={(v) => {
          chosen = v;
        }}
        onDismiss={() => {
          dismissed += 1;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Plan"));
    });
    // Choosing is not a dismissal: the docs promise `onDismiss` separates
    // closing from choosing ("a dismissed select has NOT changed").
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Pro"));
    });
    expect(chosen).toBe("pro");
    expect(dismissed).toBe(0);
  });

  it("Menu item selection fires onSelect then onDismiss, then closes", async () => {
    const calls: Array<string> = [];
    await render(
      <Menu
        triggerLabel="File"
        trigger={<Text>Open menu</Text>}
        items={[
          {
            label: "New",
            onSelect: () => {
              calls.push("select");
            },
          },
        ]}
        onDismiss={() => {
          calls.push("dismiss");
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("File"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("New"));
    });
    expect(calls).toEqual(["select", "dismiss"]);
    expect(screen.queryByLabelText("New")).toBeNull();
  });
});

describe("overlay-compound adoption: one shared modality stack", () => {
  it("an Axis-driven Menu marks useAnyModalOpen while open", async () => {
    function Probe() {
      const modalOpen = useAnyModalOpen();
      return (
        <Pressable accessibilityLabel={modalOpen ? "modal-open" : "modal-closed"}>
          <Text>probe</Text>
        </Pressable>
      );
    }
    await render(
      <OverlayModalityProvider>
        <Probe />
        <Menu
          triggerLabel="File"
          trigger={<Text>Open menu</Text>}
          items={[{ label: "New" }]}
        />
      </OverlayModalityProvider>,
    );
    expect(screen.getByLabelText("modal-closed")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("File"));
    });
    // Before the stack unification the Axis overlay registered in Axis's
    // own shared registry while `useAnyModalOpen` read Kern's — so an open
    // Axis menu left the background interactive.
    expect(screen.getByLabelText("modal-open")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss menu"));
    });
    expect(screen.getByLabelText("modal-closed")).toBeTruthy();
  });
});

describe("overlay-compound adoption: Tooltip keeps its M3 contract", () => {
  it("opens on focus, carries the hint, stays inert and modal-free", async () => {
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>,
    );
    const trigger = screen.getByLabelText("Save");
    expect(trigger.props.accessibilityHint).toContain("Saves your draft");
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
    await act(async () => {
      fireEvent(trigger, "onFocus");
    });
    const content = screen.getByTestId("kern-tooltip-content");
    expect(content).toBeTruthy();
    // Inert: a supplementary label never takes a touch.
    expect(content.props.pointerEvents).toBe("none");
    await act(async () => {
      fireEvent(trigger, "onBlur");
    });
    expect(screen.queryByTestId("kern-tooltip-content")).toBeNull();
  });
});
