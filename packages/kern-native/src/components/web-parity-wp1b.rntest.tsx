import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { act } from "react";
import { Text } from "react-native";
import { defaultScheme } from "../theme";
import { Banner, bannerStyles, SegmentedButton } from "./web-parity";

/**
 * WP1b P0 parity proofs: the segmented-button + banner native twins live
 * here (web-parity.tsx) and stay here — KEEP, not new-build. These tests
 * pin the contract each twin owes its web counterpart.
 */
describe("SegmentedButton native twin (P0 KEEP)", () => {
  const OPTIONS = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month", disabled: true },
  ];

  it("selects one segment exclusively (single mode)", async () => {
    let value = "";
    await render(
      <SegmentedButton
        options={OPTIONS}
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

  it("honours a controlled value", async () => {
    await render(<SegmentedButton options={OPTIONS} value="day" />);
    expect(screen.getByLabelText("Day").props.accessibilityState).toMatchObject(
      { selected: true },
    );
    expect(
      screen.getByLabelText("Week").props.accessibilityState,
    ).toMatchObject({ selected: false });
  });

  it("marks the selected segment with a check", async () => {
    await render(<SegmentedButton options={OPTIONS} value="day" />);
    expect(screen.getByLabelText("Day")).toBeTruthy();
    // The check is the selection carrier (M3), not a separate fill.
  });

  it("supports multi-select mode via plural props", async () => {
    let values: string[] = [];
    await render(
      <SegmentedButton
        options={OPTIONS}
        defaultValues={["day"]}
        onValuesChange={(next) => {
          values = next;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(values).toEqual(["day", "week"]);
  });

  it("does not activate disabled segments", async () => {
    let value = "";
    await render(
      <SegmentedButton
        options={OPTIONS}
        onValueChange={(next) => {
          value = next;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Month"));
    });
    expect(value).toBe("");
  });

  it("does not deselect on re-press in single mode (radio semantics)", async () => {
    const seen: string[] = [];
    await render(
      <SegmentedButton
        options={OPTIONS}
        defaultValue="day"
        onValueChange={(next) => {
          seen.push(next);
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Day"));
    });
    expect(seen).toEqual([]);
  });

  it("toggles a segment off in multi mode", async () => {
    let values: string[] = ["day", "week"];
    await render(
      <SegmentedButton
        options={OPTIONS}
        values={values}
        onValuesChange={(next) => {
          values = next;
        }}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(values).toEqual(["day"]);
  });

  it("carries selection on the check mark", async () => {
    await render(<SegmentedButton options={OPTIONS} value="day" />);
    // The selected segment renders the M3 check glyph beside the label;
    // unselected segments render label only.
    expect(
      within(screen.getByLabelText("Day")).getByText("\u2713"),
    ).toBeTruthy();
    expect(
      within(screen.getByLabelText("Week")).queryByText("\u2713"),
    ).toBeNull();
  });
});

describe("Banner native twin (P0 KEEP)", () => {
  // One render per test (see Chip note on overlapping act() scopes).
  for (const variant of ["info", "success", "warning", "error"] as const) {
    it(`renders title + body on the ${variant} tone fill`, async () => {
      await render(
        <Banner variant={variant} title="Heads up">
          Delays expected
        </Banner>,
      );
      expect(screen.getByText("Heads up")).toBeTruthy();
      expect(screen.getByText("Delays expected")).toBeTruthy();
    });
  }

  it("resolves fills from the scheme (tone registry, no raw hex)", async () => {
    const scheme = defaultScheme();
    expect(bannerStyles("warning", scheme).container.backgroundColor).toBe(
      scheme.color.warningContainer,
    );
    expect(bannerStyles("error", scheme).container.backgroundColor).toBe(
      scheme.color.errorContainer,
    );
  });

  it("dismisses through onDismiss with an accessible name", async () => {
    const onDismiss = jest.fn();
    await render(
      <Banner variant="info" title="Heads up" onDismiss={onDismiss}>
        Body
      </Banner>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss Heads up"));
    });
    expect(onDismiss).toHaveBeenCalled();
  });

  it("renders the trailing action slot", async () => {
    await render(
      <Banner
        variant="info"
        title="Heads up"
        action={<Text testID="banner-action">Undo</Text>}
      >
        Body
      </Banner>,
    );
    expect(screen.getByTestId("banner-action")).toBeTruthy();
  });

  it("stays hidden with open={false} (web visibility contract)", async () => {
    await render(
      <Banner variant="info" title="Heads up" open={false}>
        Body
      </Banner>,
    );
    expect(screen.queryByText("Heads up")).toBeNull();
  });

  it("dismiss drives onOpenChange(false) plus onDismiss", async () => {
    const onOpenChange = jest.fn();
    const onDismiss = jest.fn();
    await render(
      <Banner
        variant="info"
        title="Heads up"
        defaultOpen
        onOpenChange={onOpenChange}
        onDismiss={onDismiss}
      >
        Body
      </Banner>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Dismiss Heads up"));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onDismiss).toHaveBeenCalled();
    expect(screen.queryByText("Heads up")).toBeNull();
  });
});
