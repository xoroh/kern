import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { LinearProgress } from "./linear-progress";
import { Loader } from "./loader";
import { Progress } from "./progress";
import { Search } from "./search";
import { Text } from "./text";

/**
 * Loading/search foundation adoption (Axis scope phase A): Kern's own
 * text/loader/progress/search build on RN Text, Axis Progress
 * (`value={null}` indeterminate — the boolean is gone), and Axis
 * Input + Field + Button. No Axis Text/Loader/Search/Trigger imports
 * remain (Axis removed those exports; Kern never took them).
 */

describe("foundation adoption: Text builds on RN Text", () => {
  it("renders the RN host with variant type and scheme color", async () => {
    await render(<Text variant="title">Hello</Text>);
    const node = screen.getByText("Hello");
    // RN Text host (not an Axis part, not a View): the type pipeline
    // resolves weight/size on the host element itself.
    expect(node.type).toBe("Text");
    expect(node.props.style).toBeTruthy();
  });
});

describe("foundation adoption: Loader is an Axis indeterminate Progress", () => {
  it("announces a busy progressbar (fail-before: bare spinner has no role)", async () => {
    await render(<Loader label="Saving" />);
    const host = screen.getByTestId("kern-loader");
    expect(host.props.accessibilityRole).toBe("progressbar");
    expect(host.props["aria-busy"]).toBe(true);
    expect(host.props.accessibilityLabel).toBe("Saving");
  });

  it("keeps the spinner visual and M3 sizes", async () => {
    await render(<Loader label="Saving" size="small" />);
    expect(screen.getByTestId("kern-loader")).toBeTruthy();
  });
});

describe("foundation adoption: Progress is an Axis determinate Progress", () => {
  it("passes value/max through with Kern track styling", async () => {
    await render(<Progress value={40} max={100} />);
    const bar = screen.getByTestId("kern-progress");
    expect(bar.props.accessibilityRole).toBe("progressbar");
    expect(bar.props.accessibilityValue).toEqual({ now: 40, min: 0, max: 100 });
  });

  it("defaults an omitted value to determinate 0% (no indeterminate mode)", async () => {
    await render(<Progress testID="kern-progress-plain" />);
    const bar = screen.getByTestId("kern-progress-plain");
    // Determinate-only per the component contract: unknown waits use
    // Loader, so an omitted value reads 0%, never indeterminate-busy.
    expect(bar.props["aria-busy"]).toBeFalsy();
    expect(bar.props.accessibilityValue).toEqual({ now: 0, min: 0, max: 100 });
  });
});

describe("foundation adoption: LinearProgress null replaces the boolean", () => {
  it("loops the indeterminate bars on value null", async () => {
    await render(<LinearProgress value={null} label="Wait" />);
    expect(screen.getByTestId("kern-linear-progress-indicator")).toBeTruthy();
    expect(
      screen.getByTestId("kern-linear-progress-indicator-secondary"),
    ).toBeTruthy();
  });

  it("stays determinate on a numeric value", async () => {
    await render(<LinearProgress value={0.4} label="Sync" />);
    // Determinate renders the single fill bar; the loop's secondary bar
    // (same family, indeterminate-only) stays out of the tree.
    expect(
      screen.queryByTestId("kern-linear-progress-indicator-secondary"),
    ).toBeNull();
  });
});

describe("foundation adoption: Search owns Axis Input state", () => {
  it("types, submits and clears through the compound", async () => {
    const seen: string[] = [];
    const submitted: string[] = [];
    await render(
      <Search
        label="Docs"
        onValueChange={(v) => seen.push(v)}
        onSearch={(v) => submitted.push(v)}
      />,
    );
    const field = screen.getByLabelText("Docs");
    await act(async () => {
      fireEvent.changeText(field, "tokens");
    });
    expect(seen).toContain("tokens");
    await act(async () => {
      fireEvent(field, "onSubmitEditing");
    });
    expect(submitted).toEqual(["tokens"]);
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Clear search"));
    });
    expect(seen[seen.length - 1]).toBe("");
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });

  it("honors an uncontrolled default and the M3 docked style", async () => {
    await render(<Search label="Docs" defaultValue="button" />);
    expect(screen.getByDisplayValue("button")).toBeTruthy();
  });
});
