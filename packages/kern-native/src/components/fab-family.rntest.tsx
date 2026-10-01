/**
 * Native behaviour suite for the FAB / overflow-action family, tranche 2 of P2b-3.
 *
 * Same two-kind split as tranche 3: parity-contract blocks are cross-renderer,
 * the rest document behaviour the contract deliberately does not pin because the
 * two renderers legitimately differ.
 *
 * These components exist natively because RN owns the behaviour outright — there
 * is no Base UI to compose on. That is the bar every row here had to clear: build
 * a row only if the behaviour is something kern decides, not something a platform
 * primitive already decides.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act, createRef } from "react";
import { ExtendedFab, type NativeExtendedFabHandle } from "./extended-fab";
import { FabMenu, type NativeFabMenuAction } from "./fab-menu";
import { SplitButton } from "./split-button";
import { Text } from "./text";

/**
 * Every role the rendered tree actually exposes.
 *
 * `getByRole("menu")` does NOT work on this floor — verified against the
 * SHIPPED `Menu` component, which returns null the same way, so it is an RNTL
 * limitation rather than a defect in the components under test. A test that
 * cannot see the surface it is asserting on is worse than no test, so the menu
 * assertions below read the tree directly. This is the same probe the dialog
 * role fix uses (dialog.rntest.tsx), kept deliberately in both places because
 * each file has to stand alone.
 */
function rolesInTree(): string[] {
  const roles: string[] = [];
  const walk = (node: unknown): void => {
    if (node === null || typeof node !== "object") {
      return;
    }
    const candidate = node as {
      props?: Record<string, unknown>;
      children?: unknown[];
    };
    const props = candidate.props ?? {};
    const role = props.accessibilityRole;
    if (typeof role === "string") {
      roles.push(role);
    }
    for (const child of candidate.children ?? []) {
      walk(child);
    }
  };
  walk(screen.toJSON() as unknown);
  return roles;
}

/** True when a menu surface with at least one item is on screen. */
function menuIsOpen(): boolean {
  return rolesInTree().includes("menu");
}

describe("extended FAB (native)", () => {
  it("shows the label beside the icon when expanded", async () => {
    await render(
      <ExtendedFab icon={<Text>x</Text>} label="Compose" testID="efab" />,
    );
    expect(screen.getByText("Compose")).toBeTruthy();
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
  });

  // The M3 behaviour the component exists for. Without this the extended FAB is
  // just a button with a wider hit box.
  it("collapses to the icon alone but keeps announcing its name", async () => {
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        testID="efab"
      />,
    );
    await act(async () => {
      handle.current?.collapse();
    });
    expect(screen.queryByText("Compose")).toBeNull();
    // The visible label is gone; the accessible name must NOT be, or the FAB
    // announces as an unlabelled button.
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
  });

  it("reports a collapse exactly once for two calls in the same direction", async () => {
    const calls: boolean[] = [];
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab
        ref={handle}
        icon={<Text>x</Text>}
        label="Compose"
        onCollapsedChange={(next: boolean) => calls.push(next)}
      />,
    );
    await act(async () => {
      handle.current?.collapse();
      handle.current?.collapse();
    });
    expect(calls).toEqual([true]);
  });

  it("toggles back and forth", async () => {
    const handle = createRef<NativeExtendedFabHandle>();
    await render(
      <ExtendedFab ref={handle} icon={<Text>x</Text>} label="Compose" />,
    );
    await act(async () => {
      handle.current?.toggle();
    });
    expect(screen.queryByText("Compose")).toBeNull();
    await act(async () => {
      handle.current?.toggle();
    });
    expect(screen.getByText("Compose")).toBeTruthy();
  });

  it("obeys a controlled collapsed prop", async () => {
    await render(
      <ExtendedFab
        icon={<Text>x</Text>}
        label="Compose"
        collapsed
        testID="efab"
      />,
    );
    expect(screen.queryByText("Compose")).toBeNull();
    expect(screen.getByTestId("efab").props.accessibilityLabel).toBe("Compose");
  });

  it("fires the host action and never the collapse handle when disabled", async () => {
    let pressed = 0;
    await render(
      <ExtendedFab
        icon={<Text>x</Text>}
        label="Compose"
        disabled
        onPress={() => {
          pressed += 1;
        }}
      />,
    );
    const fab = screen.getByTestId("kern-extended-fab");
    // A disabled Pressable has its `onPress` stripped by RNTL, so the press is
    // refused at the platform boundary rather than by a kern guard — the
    // stronger guarantee. Assert both facts.
    expect(fab.props.onPress).toBeUndefined();
    expect(fab.props.accessibilityState?.disabled).toBe(true);
    expect(pressed).toBe(0);
    // Disabled must not also collapse it: a dead FAB that changes shape reads as
    // a state change the user cannot act on.
    expect(screen.getByText("Compose")).toBeTruthy();
  });
});

describe("FAB menu (native)", () => {
  let selectedNew = 0;
  let selectedEdit = 0;
  const ACTIONS: NativeFabMenuAction[] = [
    {
      key: "new",
      label: "New",
      onSelect: () => {
        selectedNew += 1;
      },
    },
    {
      key: "edit",
      label: "Edit",
      onSelect: () => {
        selectedEdit += 1;
      },
    },
  ];

  it("starts closed and announces the first action as its name", async () => {
    await render(
      <FabMenu icon={<Text>+</Text>} actions={ACTIONS} testID="fm" />,
    );
    expect(menuIsOpen()).toBe(false);
    expect(screen.getByTestId("fm").props.accessibilityState.expanded).toBe(
      false,
    );
    // M3/ARIA: an unnamed menu trigger is an unreachable menu. The name defaults
    // to the first action, which is the one most likely to be wanted.
    expect(screen.getByTestId("fm").props.accessibilityLabel).toBe("New");
  });

  it("opens on press and closes on select", async () => {
    selectedNew = 0;
    selectedEdit = 0;
    await render(<FabMenu icon={<Text>+</Text>} actions={ACTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    expect(menuIsOpen()).toBe(true);
    expect(
      screen.getByTestId("kern-fab-menu").props.accessibilityState.expanded,
    ).toBe(true);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Edit"));
    });
    // Only the chosen action fires — a menu that runs every `onSelect` would be
    // indistinguishable from a broken one.
    expect(selectedEdit).toBe(1);
    expect(selectedNew).toBe(0);
    // Select-then-dismiss: the host must never have to close it by hand.
    expect(menuIsOpen()).toBe(false);
  });

  it("swaps the trigger icon while open", async () => {
    await render(
      <FabMenu
        icon={<Text>plus</Text>}
        openIcon={<Text>close</Text>}
        actions={ACTIONS}
      />,
    );
    expect(screen.getByText("plus")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    expect(screen.getByText("close")).toBeTruthy();
  });

  it("lets menuLabel override the trigger name", async () => {
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        actions={ACTIONS}
        menuLabel="More actions"
        testID="fm"
      />,
    );
    expect(screen.getByTestId("fm").props.accessibilityLabel).toBe(
      "More actions",
    );
  });

  it("renders an empty menu without a trigger to press into nothing", async () => {
    await render(<FabMenu icon={<Text>+</Text>} actions={[]} testID="fm" />);
    expect(screen.getByTestId("fm")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId("fm"));
    });
    // A trigger that opens an empty box is worse than no trigger: it looks live
    // and does nothing.
    expect(menuIsOpen()).toBe(false);
  });

  it("announces a disabled action as disabled and refuses to select it", async () => {
    let selected = "";
    await render(
      <FabMenu
        icon={<Text>+</Text>}
        // Named explicitly: the trigger otherwise defaults to the FIRST ACTION's
        // label, so a one-action menu has two nodes called "New" — which is the
        // documented default, not a bug, and the reason this query is scoped.
        label="File actions"
        actions={[
          {
            key: "new",
            label: "New",
            disabled: true,
            onSelect: () => {
              selected = "new";
            },
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-fab-menu"));
    });
    const item = screen.getByLabelText("New");
    expect(item.props.accessibilityState?.disabled).toBe(true);
    // Disabled means unreachable: the state is announced AND the press does not
    // land. A greyed row that still fires is worse than one that looks dead.
    expect(item.props.onPress).toBeUndefined();
    expect(selected).toBe("");
  });
});

describe("split button (native)", () => {
  const ACTIONS = [{ key: "save", label: "Save as" }];

  it("names two controls, not one", async () => {
    await render(<SplitButton label="Save" actions={ACTIONS} testID="sb" />);
    // Two tab stops is the entire reason the component exists: one element with
    // two hit regions can be announced as neither control.
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save more" })).toBeTruthy();
  });

  // The separation is the component's reason to exist; if the primary opened the
  // menu it would be a plain menu button.
  it("the primary action does not open the menu", async () => {
    let clicked = 0;
    await render(
      <SplitButton
        label="Save"
        actions={ACTIONS}
        onClick={() => {
          clicked += 1;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save" }));
    });
    expect(clicked).toBe(1);
    expect(menuIsOpen()).toBe(false);
  });

  it("the overflow half opens the menu and a select dismisses it", async () => {
    let selected = "";
    await render(
      <SplitButton
        label="Save"
        actions={[
          {
            key: "save",
            label: "Save as",
            onSelect: () => {
              selected = "save";
            },
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    expect(menuIsOpen()).toBe(true);
    expect(
      screen.getByTestId("kern-split-button-overflow").props.accessibilityState
        .expanded,
    ).toBe(true);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Save as"));
    });
    expect(selected).toBe("save");
    expect(menuIsOpen()).toBe(false);
  });

  it("renders no overflow half for an empty action list", async () => {
    await render(<SplitButton label="Save" actions={[]} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Save more" })).toBeNull();
  });

  it("disables both halves together", async () => {
    let clicked = 0;
    await render(
      <SplitButton
        label="Save"
        actions={ACTIONS}
        disabled
        onClick={() => {
          clicked += 1;
        }}
      />,
    );
    // A split button whose overflow is live while its primary is dead is a trap.
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save" }));
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    expect(clicked).toBe(0);
    expect(menuIsOpen()).toBe(false);
  });

  it("lets menuLabel name the overflow half", async () => {
    await render(
      <SplitButton label="Save" actions={ACTIONS} menuLabel="More" />,
    );
    expect(screen.getByRole("button", { name: "More" })).toBeTruthy();
  });
});
