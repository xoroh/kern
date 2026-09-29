import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { AspectRatio } from "./aspect-ratio";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Calendar } from "./calendar";
import { EmptyState } from "./empty-state";
import { Fab } from "./fab";
import { Loader } from "./loader";
import { Menubar } from "./menubar";
import { NavigationMenu } from "./navigation-menu";
import { Progress } from "./progress";
import { Search } from "./search";
import { Skeleton } from "./skeleton";
import { Slider } from "./slider";
import { Table } from "./table";
import { Tabs } from "./tabs";
import { Text } from "./text";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";
import { Toolbar } from "./toolbar";

describe("native Tabs render", () => {
  it("switches panels", async () => {
    await render(
      <Tabs
        tabs={[
          { value: "one", label: "One", content: <Text>First</Text> },
          { value: "two", label: "Two", content: <Text>Second</Text> },
        ]}
      />,
    );
    expect(screen.getByText("First")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Two"));
    });
    expect(screen.getByText("Second")).toBeTruthy();
  });
});

describe("native Toggle render", () => {
  it("toggles selected state", async () => {
    await render(<Toggle accessibilityLabel="Mute">M</Toggle>);
    const toggle = screen.getByLabelText("Mute");
    expect(toggle.props.accessibilityState.selected).toBe(false);
    await act(async () => {
      fireEvent.press(toggle);
    });
    expect(
      screen.getByLabelText("Mute").props.accessibilityState.selected,
    ).toBe(true);
  });
});

describe("native ToggleGroup render", () => {
  it("selects one option", async () => {
    await render(
      <ToggleGroup
        options={[
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Right"));
    });
    expect(
      screen.getByLabelText("Right").props.accessibilityState.selected,
    ).toBe(true);
    expect(
      screen.getByLabelText("Left").props.accessibilityState.selected,
    ).toBe(false);
  });
});

describe("native Menubar render", () => {
  it("opens a menu and selects an item", async () => {
    let chosen = "";
    await render(
      <Menubar
        menus={[
          {
            label: "File",
            items: [{ label: "New", onSelect: () => (chosen = "new") }],
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("File"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("New"));
    });
    expect(chosen).toBe("new");
  });
});

describe("native NavigationMenu render", () => {
  it("activates a link", async () => {
    let pressed = 0;
    await render(
      <NavigationMenu items={[{ label: "Docs", onPress: () => pressed++ }]} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Docs"));
    });
    expect(pressed).toBe(1);
  });
});

describe("native Toolbar render", () => {
  it("fires actions", async () => {
    let pressed = 0;
    await render(
      <Toolbar actions={[{ label: "Bold", onPress: () => pressed++ }]} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Bold"));
    });
    expect(pressed).toBe(1);
  });
});

describe("native ButtonGroup render", () => {
  it("lays out buttons together", async () => {
    await render(
      <ButtonGroup>
        <Button onPress={() => {}}>One</Button>
        <Button onPress={() => {}}>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByTestId("kern-button-group")).toBeTruthy();
    expect(screen.getByRole("button", { name: "One" })).toBeTruthy();
  });
});

describe("native Fab render", () => {
  it("fires onPress", async () => {
    let pressed = 0;
    await render(
      <Fab label="Create" onPress={() => pressed++}>
        +
      </Fab>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Create"));
    });
    expect(pressed).toBe(1);
  });
});

describe("native Search render", () => {
  it("types and clears", async () => {
    const seen: string[] = [];
    await render(<Search label="Docs" onValueChange={(v) => seen.push(v)} />);
    await act(async () => {
      fireEvent.changeText(screen.getByLabelText("Docs"), "tokens");
    });
    expect(seen).toContain("tokens");
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Clear search"));
    });
    expect(seen[seen.length - 1]).toBe("");
  });
});

describe("native AspectRatio render", () => {
  it("renders children", async () => {
    await render(
      <AspectRatio ratio={16 / 9}>
        <Text>Video</Text>
      </AspectRatio>,
    );
    expect(screen.getByText("Video")).toBeTruthy();
  });
});

describe("native Avatar render", () => {
  it("shows the fallback", async () => {
    await render(<Avatar fallback="AK" />);
    expect(screen.getByText("AK")).toBeTruthy();
  });
});

describe("native Calendar render", () => {
  it("picks a day", async () => {
    const seen: Date[] = [];
    await render(
      <Calendar
        defaultValue={new Date(2026, 8, 1)}
        onValueChange={(d) => seen.push(d)}
      />,
    );
    await act(async () => {
      fireEvent.press(
        screen.getByLabelText(new Date(2026, 8, 15).toDateString()),
      );
    });
    expect(seen).toHaveLength(1);
    expect(seen[0].getDate()).toBe(15);
  });
});

describe("native EmptyState render", () => {
  it("renders title and action", async () => {
    let pressed = 0;
    await render(
      <EmptyState
        title="No results"
        description="Try again."
        action={<Button onPress={() => pressed++}>Retry</Button>}
      />,
    );
    expect(screen.getByText("No results")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Retry" }));
    });
    expect(pressed).toBe(1);
  });
});

describe("native Loader render", () => {
  it("announces its label", async () => {
    await render(<Loader label="Saving" />);
    expect(screen.getByLabelText("Saving")).toBeTruthy();
  });
});

describe("native Progress render", () => {
  it("exposes its value", async () => {
    await render(<Progress value={40} max={100} />);
    const bar = screen.getByTestId("kern-progress");
    expect(bar.props.accessibilityValue).toEqual({ now: 40, min: 0, max: 100 });
  });
});

describe("native Skeleton render", () => {
  it("renders a placeholder hidden from assistive tech", async () => {
    await render(<Skeleton />);
    const skeleton = screen.getByTestId("kern-skeleton", {
      includeHiddenElements: true,
    });
    expect(skeleton.props.accessibilityElementsHidden).toBe(true);
  });
});

describe("native Slider render", () => {
  it("steps with accessibility actions", async () => {
    await render(<Slider defaultValue={30} accessibilityLabel="Volume" />);
    const slider = screen.getByLabelText("Volume");
    expect(slider.props.accessibilityValue.now).toBe(30);
    await act(async () => {
      fireEvent(slider, "onAccessibilityAction", {
        nativeEvent: { actionName: "increment" },
      });
    });
    expect(screen.getByLabelText("Volume").props.accessibilityValue.now).toBe(
      31,
    );
  });
});

describe("native Table render", () => {
  it("renders headers and cells", async () => {
    await render(
      <Table
        columns={[
          { key: "item", title: "Item" },
          { key: "qty", title: "Qty" },
        ]}
        rows={[{ item: "Apples", qty: "4" }]}
      />,
    );
    expect(screen.getByText("Item")).toBeTruthy();
    expect(screen.getByText("Apples")).toBeTruthy();
  });
});
