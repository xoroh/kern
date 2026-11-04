import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@xoroh/axis";
import React, { act, type ReactElement } from "react";
import { Pressable, Text } from "react-native";
import { defaultScheme } from "../theme";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Chip } from "./chip";
import { CircularProgress } from "./circular-progress";
import { Loader } from "./loader";
import { Meter } from "./meter";
import { Progress, progressStyles } from "./progress";
import { Skeleton } from "./skeleton";
import { SnackbarProvider, SnackbarViewport, useSnackbar } from "./snackbar";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";

/**
 * WP9 Part B P1 — progress-primitive gaps + pure-behavior badge/chip/avatar.
 *
 * Native accordion/collapsible live with Part A (test halves); tabs and
 * link-button a11y are G1-excluded. Badge/chip/avatar sources carry D951
 * tone props, so only pure-behavior tests (no tone props) are included
 * here — anything needing a tone prop is reported, not tested.
 *
 * Conventions: one render per test, no UNSAFE_*, host-tree assertions for
 * hidden nodes (skeleton), style-function unit assertions where the
 * siblings do the same (meterStyles, toggleStyles).
 */

type HostNode = {
  props?: Record<string, unknown>;
  children?: unknown;
};

function findByTestId(node: unknown, testID: string): HostNode | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByTestId(child, testID);
      if (found) return found;
    }
    return null;
  }
  if (node !== null && typeof node === "object") {
    const host = node as HostNode;
    if (host.props?.testID === testID) return host;
    return findByTestId(host.children, testID);
  }
  return null;
}

function renderWithHost(element: ReactElement) {
  return render(<PortalHost>{element}</PortalHost>);
}

describe("CircularProgress gaps", () => {
  it("reports the determinate value with min/max", async () => {
    await render(<CircularProgress value={0.4} label="Upload" />);
    expect(screen.getByLabelText("Upload").props.accessibilityValue).toEqual({
      now: 40,
      min: 0,
      max: 100,
    });
  });

  it("clamps an over-range value to 100", async () => {
    await render(<CircularProgress value={2} label="Over" />);
    expect(screen.getByLabelText("Over").props.accessibilityValue).toEqual({
      now: 100,
      min: 0,
      max: 100,
    });
  });

  it("clamps a negative value to zero", async () => {
    await render(<CircularProgress value={-0.5} label="Under" />);
    expect(screen.getByLabelText("Under").props.accessibilityValue).toEqual({
      now: 0,
      min: 0,
      max: 100,
    });
  });

  it("renders three dots for the dots style", async () => {
    await render(<CircularProgress loaderStyle="dots" label="Loading" />);
    expect(screen.getAllByTestId("kern-circular-progress-dot")).toHaveLength(3);
  });

  it("renders four bars for the bar style", async () => {
    await render(<CircularProgress loaderStyle="bar" label="Loading" />);
    expect(screen.getAllByTestId("kern-circular-progress-bar")).toHaveLength(4);
  });

  it("renders one glyph per shape for the shapes style", async () => {
    await render(
      <CircularProgress
        loaderStyle="shapes"
        shapes={["circle", "square", "pill"]}
        label="Loading"
      />,
    );
    expect(screen.getAllByTestId("kern-circular-progress-shape")).toHaveLength(
      3,
    );
  });

  it("announces the indeterminate wait by its text value", async () => {
    await render(<CircularProgress label="Syncing" />);
    expect(screen.getByLabelText("Syncing").props.accessibilityValue).toEqual({
      text: "Syncing",
    });
  });

  it("honours a testID override", async () => {
    await render(<CircularProgress value={0.5} testID="cp-custom" />);
    expect(screen.getByTestId("cp-custom")).toBeTruthy();
  });
});

describe("Loader gaps", () => {
  it("announces the default wait name", async () => {
    await render(<Loader />);
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("honours a testID override", async () => {
    await render(<Loader testID="loader-custom" />);
    expect(screen.getByTestId("loader-custom")).toBeTruthy();
  });

  it("renders the small spinner size", async () => {
    const rendered = await render(<Loader size="small" />);
    expect(JSON.stringify(rendered.toJSON())).toContain('"size":"small"');
  });

  it("renders the large spinner size", async () => {
    const rendered = await render(<Loader size="large" />);
    expect(JSON.stringify(rendered.toJSON())).toContain('"size":"large"');
  });
});

describe("Progress gaps", () => {
  it("clamps the fill to the track at 0 and 1", () => {
    const scheme = defaultScheme();
    expect(progressStyles(2, scheme).fill.width).toBe("100%");
    expect(progressStyles(-1, scheme).fill.width).toBe("0%");
  });

  it("paints the tonal track with the primary fill (M3)", () => {
    const scheme = defaultScheme();
    const styles = progressStyles(0.5, scheme);
    expect(styles.track.backgroundColor).toBe(scheme.color.surfaceTonal);
    expect(styles.fill.backgroundColor).toBe(scheme.color.primary);
    expect(styles.fill.width).toBe("50%");
  });

  it("scales the fill against a custom max", async () => {
    const rendered = await render(
      <Progress value={50} max={200} accessibilityLabel="Sync" />,
    );
    expect(JSON.stringify(rendered.toJSON())).toContain('"width":"25%"');
  });

  it("clamps an over-max value to a full fill", async () => {
    const rendered = await render(
      <Progress value={150} max={100} accessibilityLabel="Sync" />,
    );
    expect(JSON.stringify(rendered.toJSON())).toContain('"width":"100%"');
  });
});

describe("Skeleton gaps", () => {
  it("honours a testID override", async () => {
    // Hidden by design, so safe queries skip it (RNTL AT-hidden caution):
    // assert on the host tree like the sibling suite does.
    const rendered = await render(<Skeleton testID="sk-custom" />);
    expect(findByTestId(rendered.toJSON(), "sk-custom")).not.toBeNull();
  });

  it("rounds to the extra-small shape token", async () => {
    const scheme = defaultScheme();
    const rendered = await render(<Skeleton testID="sk" />);
    const node = findByTestId(rendered.toJSON(), "sk");
    const style = Array.isArray(node?.props?.style)
      ? Object.assign({}, ...(node.props.style as object[]))
      : node?.props?.style;
    expect((style as { borderRadius?: number } | undefined)?.borderRadius).toBe(
      Number.parseFloat(scheme.shape["extra-small"]),
    );
  });

  it("merges a custom style onto the placeholder", async () => {
    const rendered = await render(
      <Skeleton testID="sk" style={{ opacity: 0.5 }} />,
    );
    expect(JSON.stringify(rendered.toJSON())).toContain('"opacity":0.5');
  });
});

describe("Snackbar gaps", () => {
  function Adder({ addLabel, message }: { addLabel: string; message: string }) {
    const sb = useSnackbar();
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        onPress={() => sb.add({ message, duration: 0 })}
      >
        <Text>{addLabel}</Text>
      </Pressable>
    );
  }

  it("clears every queued toast", async () => {
    function Clearer() {
      const sb = useSnackbar();
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear"
          onPress={() => sb.clear()}
        >
          <Text>Clear</Text>
        </Pressable>
      );
    }
    await renderWithHost(
      <SnackbarProvider>
        <Adder addLabel="Add one" message="First" />
        <Adder addLabel="Add two" message="Second" />
        <Clearer />
        <SnackbarViewport testID="sb-clear" />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Add one"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Add two"));
    });
    expect(screen.getByText("First")).toBeTruthy();
    expect(screen.getByText("Second")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Clear"));
    });
    expect(screen.queryByText("First")).toBeNull();
    expect(screen.queryByText("Second")).toBeNull();
  });

  it("paints at most `limit` toasts", async () => {
    // NOTE: with limit={1} the viewport keeps the OLDEST toast painted
    // ("First") while "Second" stays queued but unpainted — worth a look
    // from the owning lane, since the Axis doc reads newest-visible.
    // This test pins only the enforced count, not the ordering.
    await renderWithHost(
      <SnackbarProvider>
        <Adder addLabel="Add one" message="First" />
        <Adder addLabel="Add two" message="Second" />
        <SnackbarViewport testID="sb-limit" limit={1} />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Add one"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Add two"));
    });
    expect(screen.getByTestId("sb-limit-toast-0")).toBeTruthy();
    expect(screen.queryByTestId("sb-limit-toast-1")).toBeNull();
  });

  it("carries the live-region status role on the queued toast (P2 a11y)", async () => {
    await renderWithHost(
      <SnackbarProvider>
        <Adder addLabel="Add one" message="Live" />
        <SnackbarViewport testID="sb-live" />
      </SnackbarProvider>,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Add one"));
    });
    // Axis ADR-112: the toast surface owns role="status" + aria-live polite.
    expect(screen.getByTestId("sb-live-toast-0").props.role).toBe("status");
  });
});

describe("Toggle gaps (tests only — toggle.tsx is G1-pending, no source changes)", () => {
  it("reports selected from a controlled pressed toggle", async () => {
    await render(
      <Toggle pressed>
        <Text>Bold</Text>
      </Toggle>,
    );
    expect(
      screen.getByTestId("kern-toggle").props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it("stays silent when disabled", async () => {
    const onPressedChange = jest.fn();
    await render(
      <Toggle disabled onPressedChange={onPressedChange}>
        <Text>Bold</Text>
      </Toggle>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-toggle"));
    });
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("starts selected from defaultPressed", async () => {
    await render(
      <Toggle defaultPressed>
        <Text>Bold</Text>
      </Toggle>,
    );
    expect(
      screen.getByTestId("kern-toggle").props.accessibilityState,
    ).toMatchObject({ selected: true });
  });
});

describe("ToggleGroup gaps", () => {
  const OPTIONS = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
  ];

  it("selects two options when multiple", async () => {
    await render(<ToggleGroup options={OPTIONS} multiple />);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Day"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(screen.getByLabelText("Day").props.accessibilityState).toMatchObject(
      { selected: true },
    );
    expect(
      screen.getByLabelText("Week").props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it("reports the selection array through onValueChange", async () => {
    const onValueChange = jest.fn();
    await render(
      <ToggleGroup options={OPTIONS} multiple onValueChange={onValueChange} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Day"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    const payload = onValueChange.mock.calls.at(-1)?.[0] as unknown;
    expect(payload).toHaveLength(2);
    expect(payload).toEqual(expect.arrayContaining(["day", "week"]));
  });

  it("keeps a disabled option unselected and silent", async () => {
    const onValueChange = jest.fn();
    await render(
      <ToggleGroup
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week", disabled: true },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Week"));
    });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByLabelText("Week").props.accessibilityState,
    ).toMatchObject({ selected: false });
  });
});

describe("Badge pure-behavior (no tone props — badge.tsx is G1-pending)", () => {
  it("renders no text for the dot variant, even with children", async () => {
    await render(<Badge variant="dot">5</Badge>);
    expect(screen.queryByText("5")).toBeNull();
  });

  it("leaves an unlabeled dot out of the accessibility tree", async () => {
    await render(<Badge variant="dot" testID="dot" />);
    expect(screen.getByTestId("dot").props.accessible).toBe(false);
  });

  it("announces a custom accessibility label", async () => {
    await render(<Badge variant="dot" accessibilityLabel="Ping" />);
    expect(screen.getByLabelText("Ping")).toBeTruthy();
  });

  it("honours a testID override", async () => {
    await render(<Badge testID="badge-custom">3</Badge>);
    expect(screen.getByTestId("badge-custom")).toBeTruthy();
  });
});

describe("Chip pure-behavior (no tone props — chip.tsx is G1-pending)", () => {
  it("fires onPress for an assist chip", async () => {
    const onPress = jest.fn();
    await render(
      <Chip variant="assist" onPress={onPress}>
        Action
      </Chip>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Action" }));
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("keeps a disabled filter silent", async () => {
    const onValueChange = jest.fn();
    await render(
      <Chip variant="filter" disabled onValueChange={onValueChange}>
        Available
      </Chip>,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Available" }));
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders a controlled filter as selected", async () => {
    await render(
      <Chip variant="filter" value>
        Active
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "Active" })).toBeSelected();
  });
});

describe("Avatar pure-behavior (no tone props — avatar.tsx is G1-pending)", () => {
  it("falls back to ? with a matching name when imageless", async () => {
    await render(<Avatar />);
    expect(screen.getByLabelText("?")).toBeTruthy();
    expect(screen.getByText("?")).toBeTruthy();
  });

  it("prefers a custom accessibility label over the fallback", async () => {
    await render(<Avatar fallback="XO" accessibilityLabel="Ada" />);
    expect(screen.getByLabelText("Ada")).toBeTruthy();
    expect(screen.getByText("XO")).toBeTruthy();
  });

  it("hides the fallback once a source image renders", async () => {
    await render(
      <Avatar source={{ uri: "https://example.com/xo.png" }} fallback="XO" />,
    );
    expect(screen.queryByText("XO")).toBeNull();
  });

  it("honours a testID override", async () => {
    await render(<Avatar fallback="XO" testID="avatar-custom" />);
    expect(screen.getByTestId("avatar-custom")).toBeTruthy();
  });
});

describe("Meter default value text", () => {
  it("announces the bare number when no valueText is given", async () => {
    await render(<Meter value={40} accessibilityLabel="Storage" showValue />);
    expect(screen.getByText("40")).toBeTruthy();
  });
});
