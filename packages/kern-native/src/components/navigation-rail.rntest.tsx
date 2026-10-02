import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import { NavigationRail } from "./navigation-rail";

/**
 * Native navigation RAIL — the vertical navigation surface.
 *
 * Behaviour-test-first, and mutation-proved: the two failure modes below are
 * invisible in a screenshot. A rail that renders the right pixels but never
 * reports which destination is current is indistinguishable from a working one
 * to a sighted user, and useless to everyone else.
 *
 * The `mode` distinction is the substance of the GM ruling: a rail collapsed to
 * icons and a rail EXPANDED to show labels are the same family, and the
 * persistent/expanded presentation is what a `sidebar` actually is. So it is
 * `mode` on ONE component, not a second component.
 */

const destinations = [
  { key: "home", label: "Home" },
  { key: "inbox", label: "Inbox" },
  { key: "settings", label: "Settings", disabled: true },
];

describe("NavigationRail", () => {
  it("reports exactly one destination as current", async () => {
    await render(
      <NavigationRail
        destinations={destinations}
        value="inbox"
        onValueChange={() => {}}
      />,
    );
    const states = destinations.map(
      (d) => screen.getByLabelText(d.label).props.accessibilityState.selected,
    );
    // One selected stop, never zero and never two — the same roving-model
    // obligation the carousel and time-picker already prove.
    expect(states.filter(Boolean)).toHaveLength(1);
    expect(states[1]).toBe(true);
  });

  it("moves the current destination on activation", async () => {
    const onValueChange = jest.fn();
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Inbox"));
    });
    expect(onValueChange).toHaveBeenCalledWith("inbox");
  });

  it("does not activate a disabled destination", async () => {
    const onValueChange = jest.fn();
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Settings"));
    });
    // A disabled destination that still fires is worse than one that is merely
    // greyed: the user is told it is unavailable and it goes anyway.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByLabelText("Settings").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("keeps the destination nameable when collapsed", async () => {
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={() => {}}
      />,
    );
    // Collapsed is the default: the label stays in the ACCESSIBLE NAME even
    // when it is not painted, because an icon-only rail whose buttons cannot be
    // named is unusable with a screen reader.
    expect(screen.getByLabelText("Home")).toBeTruthy();
  });

  it("paints each label when expanded", async () => {
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={() => {}}
        mode="expanded"
      />,
    );
    // Expanded paints the label as well as naming the destination. This is a
    // SEPARATE test rather than an `unmount()` between two renders: a manual
    // unmount leaks into later tests in this file, which is how the two
    // assertions below it were failing for reasons that had nothing to do with
    // the rail.
    expect(screen.getByText("Home")).toBeTruthy();
  });

  it("exposes a navigation landmark", async () => {
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={() => {}}
        accessibilityLabel="Primary"
      />,
    );
    // The region is named, so a screen-reader user can tell this rail from any
    // other list of controls.
    expect(screen.getByLabelText("Primary")).toBeTruthy();
  });

  it("renders a header slot above the destinations", async () => {
    await render(
      <NavigationRail
        destinations={destinations}
        value="home"
        onValueChange={() => {}}
        header={<RNText>Workspace</RNText>}
        mode="expanded"
      />,
    );
    // The persistent/expanded presentation is what a sidebar is, and a sidebar
    // carries a heading above its list.
    expect(screen.getByText("Workspace")).toBeTruthy();
  });
});
