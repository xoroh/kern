import { render, screen } from "@testing-library/react-native";
import { BRAND_TRIO } from "@xoroh/kern-m3";
import { defaultScheme } from "../theme";
import { MilestoneTrio, milestoneStepStyles } from "./milestone-trio";

const STEPS = ["Auth", "Organisation", "Workspace"] as const;

describe("MilestoneTrio", () => {
  it("renders every step label", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={0} />);
    for (const step of STEPS) {
      expect(screen.getByText(step)).toBeTruthy();
    }
  });

  it("announces the current position as a progressbar", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={0} />);
    expect(screen.getByLabelText("Loading step 1 of 3")).toBeTruthy();
  });

  it("advances the announced step with progress", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={2} />);
    expect(screen.getByLabelText("Loading step 3 of 3")).toBeTruthy();
  });

  it("clamps the announced step at the end", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={9} />);
    // The label never reads past the last step.
    expect(screen.getByLabelText("Loading step 3 of 3")).toBeTruthy();
  });

  it("shows the loader on the current step and shapes elsewhere", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={1} />);
    // Done (index 0) and todo (index 2) are static shapes; the current step
    // is the pulsing loader, hidden from queries by design.
    expect(screen.getAllByTestId("kern-shape")).toHaveLength(2);
    expect(
      screen.getByTestId("kern-circular-progress", {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it("cycles the brand trio past three steps", async () => {
    expect(BRAND_TRIO).toHaveLength(3);
    await render(
      <MilestoneTrio
        steps={["One", "Two", "Three", "Four", "Five"]}
        progress={0}
      />,
    );
    for (const step of ["One", "Two", "Three", "Four", "Five"]) {
      expect(screen.getByText(step)).toBeTruthy();
    }
    // Current is the loader; the other four are cycled trio shapes.
    expect(screen.getAllByTestId("kern-shape")).toHaveLength(4);
  });

  it("respects a custom testID", async () => {
    await render(<MilestoneTrio steps={STEPS} progress={0} testID="trio" />);
    expect(screen.getByTestId("trio")).toBeTruthy();
  });
});

describe("milestoneStepStyles", () => {
  it("dims the todo step and quiets its label", () => {
    const scheme = defaultScheme();
    const todo = milestoneStepStyles("todo", scheme);
    expect(todo.glyph.opacity).toBe(0.25);
    expect(todo.label.color).toBe(scheme.color.onSurfaceVariant);
  });

  it("fills done and current steps with the surface label", () => {
    const scheme = defaultScheme();
    for (const state of ["done", "current"] as const) {
      const metrics = milestoneStepStyles(state, scheme);
      expect(metrics.glyph.opacity).toBe(1);
      expect(metrics.label.color).toBe(scheme.color.onSurface);
    }
  });
});
