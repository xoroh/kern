import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { KernThemeProvider } from "../theme";
import { FilterChipRow, ListDetail, Pane, SecondaryTabs } from "./layouts";
import { ActionSheet, MenuScreen, MenuSheet } from "./menus";
import { NavigationBar, NavigationBarItem } from "./navigation-bar";
import { NavigationDrawer } from "./navigation-drawer";
import {
  BottomSheet,
  BottomSheetPicker,
  DockSheet,
  EntitySheet,
} from "./sheets";
import { Banner, Command, CountrySelect, SegmentedButton } from "./web-parity";

const DESTINATIONS = [
  { key: "home", label: "Home" },
  { key: "jobs", label: "Jobs" },
  { key: "profile", label: "Profile" },
];

describe("native NavigationBar render", () => {
  it("reports the pressed destination", async () => {
    let next = "home";
    await render(
      <NavigationBar
        destinations={DESTINATIONS}
        value={next}
        onValueChange={(key) => {
          next = key;
        }}
      />,
    );
    expect(screen.getByLabelText("Home")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Jobs"));
    });
    expect(next).toBe("jobs");
  });

  it("drawer rows expose selection state", async () => {
    await render(
      <NavigationBarItem label="Home" selected icon={<Text>⌂</Text>} />,
    );
    expect(
      screen.getByLabelText("Home").props.accessibilityState.selected,
    ).toBe(true);
  });
});

describe("native NavigationDrawer render", () => {
  it("renders destinations and selects one", async () => {
    let next = "home";
    await render(
      <NavigationDrawer
        open
        title="Kern"
        subtitle="Showcase"
        destinations={DESTINATIONS}
        value="home"
        onValueChange={(key) => {
          next = key;
        }}
      />,
    );
    expect(screen.getByText("Kern")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Profile"));
    });
    expect(next).toBe("profile");
  });
});

describe("native sheets render", () => {
  it("BottomSheet shows its title", async () => {
    await render(
      <BottomSheet open title="Filter">
        <Text>Body</Text>
      </BottomSheet>,
    );
    expect(screen.getByText("Filter")).toBeTruthy();
  });

  it("DockSheet is absent when closed", async () => {
    await render(
      <DockSheet open={false}>
        <Text>Hidden</Text>
      </DockSheet>,
    );
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  it("picker marks the selected option", async () => {
    let picked = "a";
    await render(
      <BottomSheetPicker
        open
        title="Sort"
        value="b"
        options={[
          { value: "a", label: "Newest" },
          { value: "b", label: "Oldest" },
        ]}
        onSelect={(value) => {
          picked = value;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Newest"));
    });
    expect(picked).toBe("a");
  });

  it("entity sheet lists fields", async () => {
    await render(
      <EntitySheet
        open
        title="Trip 42"
        supporting="In progress"
        fields={[{ label: "Driver", value: "Amara", data: true }]}
      />,
    );
    expect(screen.getByText("Trip 42")).toBeTruthy();
    expect(screen.getByText("Amara")).toBeTruthy();
  });
});

describe("native menu render", () => {
  it("MenuScreen groups actions", async () => {
    await render(
      <MenuScreen
        groups={[
          {
            heading: "Account",
            actions: [
              { key: "sign-out", label: "Sign out", destructive: true },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText("Account")).toBeTruthy();
    expect(screen.getByText("Sign out")).toBeTruthy();
  });

  it("MenuSheet and ActionSheet stay hidden until opened", async () => {
    await render(
      <MenuSheet
        open={false}
        title="Options"
        groups={[{ actions: [{ key: "a", label: "Alpha" }] }]}
      />,
    );
    expect(screen.queryByText("Alpha")).toBeNull();
    await render(
      <ActionSheet
        open
        title="Create"
        actions={[{ key: "trip", label: "New trip" }]}
      />,
    );
    expect(screen.getByText("New trip")).toBeTruthy();
  });

  it("ActionSheet renders host slots", async () => {
    await render(
      <ActionSheet open title="Apps">
        <Text>Host tile</Text>
      </ActionSheet>,
    );
    expect(screen.getByText("Host tile")).toBeTruthy();
  });
});

describe("native layout render", () => {
  it("FilterChipRow toggles chips", async () => {
    let values: string[] = [];
    await render(
      <FilterChipRow
        options={[
          { value: "open", label: "Open" },
          { value: "done", label: "Done" },
        ]}
        onValueChange={(next) => {
          values = next;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Open"));
    });
    expect(values).toEqual(["open"]);
  });

  it("SecondaryTabs switches panels", async () => {
    let value = "one";
    await render(
      <SecondaryTabs
        tabs={[
          { value: "one", label: "One", content: <Text>First</Text> },
          { value: "two", label: "Two", content: <Text>Second</Text> },
        ]}
        onValueChange={(next) => {
          value = next;
        }}
      />,
    );
    expect(screen.getByText("First")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Two"));
    });
    expect(value).toBe("two");
  });

  it("Pane and ListDetail render", async () => {
    await render(
      <KernThemeProvider defaultMode="light">
        <Pane testID="pane">
          <Text>Inside</Text>
        </Pane>
        <ListDetail
          list={<Text>List</Text>}
          detail={<Text>Detail</Text>}
          showingDetail
          onBack={() => {}}
        />
      </KernThemeProvider>,
    );
    expect(screen.getByText("Inside")).toBeTruthy();
    expect(screen.getByText("Detail")).toBeTruthy();
  });
});

describe("native web-parity render", () => {
  it("Command filters actions", async () => {
    await render(
      <Command
        open
        title="Search"
        query="dr"
        actions={[
          { key: "a", label: "Drive", group: "Trips" },
          { key: "b", label: "Billing" },
        ]}
      />,
    );
    expect(screen.getByText("Drive")).toBeTruthy();
    expect(screen.queryByText("Billing")).toBeNull();
  });

  it("SegmentedButton selects one segment", async () => {
    let value = "";
    await render(
      <SegmentedButton
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
        onValueChange={(next) => {
          value = next;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(value).toBe("week");
  });

  it("CountrySelect renders the chosen country", async () => {
    await render(
      <CountrySelect
        options={[{ code: "NL", label: "Netherlands", dial: "+31" }]}
        value="NL"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByText("Netherlands")).toBeTruthy();
  });

  it("Banner renders its title and body", async () => {
    await render(
      <Banner variant="warning" title="Heads up">
        Delays expected
      </Banner>,
    );
    expect(screen.getByText("Heads up")).toBeTruthy();
    expect(screen.getByText("Delays expected")).toBeTruthy();
  });
});
