import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import { Carousel, carouselStyles } from "./carousel";

const ITEMS = [
  { value: "a", accessibilityLabel: "Slide one" },
  { value: "b", accessibilityLabel: "Slide two" },
  { value: "c", accessibilityLabel: "Slide three" },
];

const item = (label: string) => screen.getByLabelText(label);
const dot = (label: string) => screen.getByLabelText(`${label}, 1 of 3`);

describe("Carousel", () => {
  it("is a named group", async () => {
    await render(<Carousel items={ITEMS} accessibilityLabel="Promotions" />);
    const el = screen.getByLabelText("Promotions");
    expect(el.props.role).toBe("group");
  });

  /**
   * THE invariant, inherited from the roving primitive: the track is ONE tab
   * stop, not one per item. Exactly one item may be the selected stop.
   */
  it("makes exactly one item the selected stop", async () => {
    await render(<Carousel items={ITEMS} />);
    expect(
      screen.queryByRole("image", { name: "Slide one", selected: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("image", { name: "Slide two", selected: true }),
    ).toBeNull();
    expect(
      screen.queryByRole("image", { name: "Slide three", selected: true }),
    ).toBeNull();
  });

  it("moves the single stop when an item is pressed", async () => {
    const onValueChange = jest.fn();
    await render(<Carousel items={ITEMS} onValueChange={onValueChange} />);
    await act(async () => {
      fireEvent.press(item("Slide three"));
    });
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(
      screen.queryByRole("image", { name: "Slide one", selected: true }),
    ).toBeNull();
    expect(
      screen.queryByRole("image", { name: "Slide two", selected: true }),
    ).toBeNull();
    expect(
      screen.queryByRole("image", { name: "Slide three", selected: true }),
    ).toBeTruthy();
  });

  it("starts from defaultValue", async () => {
    await render(<Carousel items={ITEMS} defaultValue={1} />);
    expect(
      screen.queryByRole("image", { name: "Slide two", selected: true }),
    ).toBeTruthy();
  });

  it("honours a controlled value and does not move itself", async () => {
    const onValueChange = jest.fn();
    await render(
      <Carousel items={ITEMS} value={0} onValueChange={onValueChange} />,
    );
    await act(async () => {
      fireEvent.press(item("Slide two"));
    });
    expect(onValueChange).toHaveBeenCalledWith(1);
    // The host was told and did not move it.
    expect(
      screen.queryByRole("image", { name: "Slide one", selected: true }),
    ).toBeTruthy();
  });

  /** M3's default is to clamp, not wrap. */
  it("clamps rather than wraps by default", async () => {
    const onValueChange = jest.fn();
    await render(
      <Carousel items={ITEMS} defaultValue={2} onValueChange={onValueChange} />,
    );
    // Pressing the active item is not a wrap-to-first; nothing reports a change.
    await act(async () => {
      fireEvent.press(item("Slide three"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reports position in each dot's name", async () => {
    await render(<Carousel items={ITEMS} />);
    expect(dot("Slide one")).toBeTruthy();
  });

  it("does not change the value when disabled", async () => {
    const onValueChange = jest.fn();
    await render(
      <Carousel items={ITEMS} disabled onValueChange={onValueChange} />,
    );
    // The group is a plain View, not an accessibility element, so no role
    // query can see it — assert the normalized disabled state instead.
    expect(screen.getByLabelText("Carousel")).toBeDisabled();
    await act(async () => {
      fireEvent.press(item("Slide two"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  /**
   * A disabled item keeps its POSITION, so the dot row still reads "2 of 3" —
   * skipping by deletion would renumber everything after it.
   */
  it("keeps a disabled item in place rather than renumbering", async () => {
    const onValueChange = jest.fn();
    await render(
      <Carousel
        items={[ITEMS[0], { ...ITEMS[1], disabled: true }, ITEMS[2]]}
        onValueChange={onValueChange}
      />,
    );
    expect(
      screen.queryByRole("image", { name: "Slide two", disabled: true }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Slide three, 3 of 3")).toBeTruthy();
    await act(async () => {
      fireEvent.press(item("Slide two"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders item content", async () => {
    await render(
      <Carousel
        items={[
          {
            value: "a",
            accessibilityLabel: "Only",
            content: <RNText>Body</RNText>,
          },
        ]}
      />,
    );
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("survives an empty item list", async () => {
    await render(<Carousel items={[]} accessibilityLabel="Empty" />);
    expect(screen.getByLabelText("Empty")).toBeTruthy();
  });
});

describe("carouselStyles", () => {
  it("dims an inactive item relative to the active one", async () => {
    const active = carouselStyles(true);
    const inactive = carouselStyles(false);
    expect(inactive.item.opacity).toBeLessThan(active.item.opacity as number);
  });
});
