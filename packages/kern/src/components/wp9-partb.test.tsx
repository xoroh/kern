import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./accordion";
import { CircularProgress } from "./circular-progress";
import { Collapsible } from "./collapsible";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";

/**
 * WP9 Part B P1 — disclosure + progress primitive gaps.
 *
 * Covers the states/variants the family suites miss, per M3 meanings:
 * disclosure.test.tsx pins single/multiple + collapsible toggle/disabled;
 * circular-progress.test.tsx pins determinate/dots/bar/reserved/unknown-tenant;
 * meter-progress-skeleton.test.tsx pins meter role, primary/secondary fills
 * and skeleton hidden-ness; toggle.test.tsx pins uncontrolled toggle +
 * exclusive group. Everything here is additive to those files.
 */

describe("Accordion gaps", () => {
  it("keeps a disabled item shut", async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Second</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Second body</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.queryByText("Second body")).not.toBeInTheDocument();
  });

  it("honours a controlled value", () => {
    render(
      <Accordion.Root value={["b"]}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Header>
            <Accordion.Trigger>Second</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Second body</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.queryByText("First body")).not.toBeInTheDocument();
    expect(screen.getByText("Second body")).toBeInTheDocument();
  });

  it("reports opened values through onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion.Root onValueChange={onValueChange}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(["a"]);
  });

  it("opens the defaultValue item without interaction", () => {
    render(
      <Accordion.Root defaultValue={["a"]}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>First</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>First body</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.getByText("First body")).toBeInTheDocument();
  });
});

describe("Collapsible gaps", () => {
  it("renders open from defaultOpen", () => {
    render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Shown content</Collapsible.Panel>
      </Collapsible.Root>,
    );
    expect(screen.getByText("Shown content")).toBeInTheDocument();
  });

  it("reports open changes from a controlled root", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible.Root open={false} onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Hidden content</Collapsible.Panel>
      </Collapsible.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls[0][0]).toBe(true);
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("marks the trigger expanded state", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Hidden content</Collapsible.Panel>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});

describe("CircularProgress gaps", () => {
  it("renders the shapes style (branded heritage trio)", () => {
    render(<CircularProgress loaderStyle="shapes" label="Loading" />);
    expect(
      document.querySelectorAll(".kern-circular-progress-shape"),
    ).toHaveLength(3);
  });

  it("clamps determinate values into 0–100", () => {
    render(<CircularProgress value={2} label="Over" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("clamps negative determinate values to zero", () => {
    render(<CircularProgress value={-0.5} label="Under" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("renders determinate progress even when a loader style is set (known progress ⇒ determinate)", () => {
    render(<CircularProgress value={0.5} loaderStyle="dots" label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
    expect(document.querySelector(".kern-circular-progress-dot")).toBeNull();
  });

  it("cycles four colors when fourColor is set", () => {
    render(<CircularProgress label="Loading" fourColor />);
    expect(
      document.querySelector("circle")?.getAttribute("class") ?? "",
    ).toContain("kern-circular-four-color");
  });

  it("sizes the determinate ring per size", () => {
    render(<CircularProgress value={0.5} size="sm" label="Small" />);
    const svg = document.querySelector("[data-testid='circular-progress'] svg");
    expect(svg?.getAttribute("class") ?? "").toContain("h-8");
  });
});

describe("Meter gaps", () => {
  it("announces the reading as a percent valuetext and fills proportionally", () => {
    // NOTE: Meter.Label / Meter.Value children of Meter.Root are silently
    // dropped by the Root wrapper (it renders its own Indicator as the only
    // child) — reported as an out-of-scope bug, not asserted here.
    render(<Meter.Root value={40} min={0} max={80} aria-label="Storage" />);
    const meter = screen.getByRole("meter");
    // Base UI formats the declared-range percentage for AT.
    expect(meter).toHaveAttribute("aria-valuetext", "50%");
    expect(
      document
        .querySelector("[data-slot='meter-indicator']")
        ?.getAttribute("style") ?? "",
    ).toContain("width: 50%");
  });

  it("exposes a custom declared range, not an assumed 0–100", () => {
    render(<Meter.Root value={5} min={4} max={6} aria-label="Pressure" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "5");
    expect(meter).toHaveAttribute("aria-valuemin", "4");
    expect(meter).toHaveAttribute("aria-valuemax", "6");
  });
});

describe("Progress gaps", () => {
  it("reports no numeric value while indeterminate (unknown task state)", () => {
    render(<Progress.Root value={null} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("announces the completion as a percent valuetext", () => {
    // NOTE: same swallowed-children gap as Meter.Root — see above.
    render(<Progress.Root value={30} aria-label="Upload" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "30%",
    );
  });

  it("exposes a custom min/max range", () => {
    render(<Progress.Root value={150} min={100} max={200} aria-label="Sync" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "100");
    expect(bar).toHaveAttribute("aria-valuemax", "200");
  });
});

describe("Skeleton gaps", () => {
  it("merges a custom className onto the tonal placeholder", () => {
    render(<Skeleton data-testid="sk" className="h-4 w-24" />);
    const sk = screen.getByTestId("sk");
    expect(sk.className).toContain("h-4");
    expect(sk.className).toContain("bg-(--sys-color-surface-tonal)");
  });

  it("keeps its slot marker for targeted queries", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("data-slot", "skeleton");
  });
});

describe("Toggle gaps (tests only — toggle.tsx is G1-pending, no source changes)", () => {
  it("starts pressed from defaultPressed", () => {
    render(
      <Toggle aria-label="Bold" defaultPressed>
        B
      </Toggle>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("stays unpressed and silent when disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("reports the next state from a controlled toggle", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" pressed onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledTimes(1);
    expect(onPressedChange.mock.calls[0][0]).toBe(false);
  });
});

describe("ToggleGroup gaps", () => {
  it("presses two items when multiple", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup.Root multiple>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Day" }));
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("reports the group value array through onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup.Root onValueChange={onValueChange}>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(["week"]);
  });

  it("keeps a disabled item unpressed", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup.Root>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week" disabled>
          Week
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Week" }));
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
