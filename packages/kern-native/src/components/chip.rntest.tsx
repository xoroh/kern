import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { defaultScheme } from "../theme";
import { Chip, chipStyles } from "./chip";

describe("Chip", () => {
  // One render per test: sequential renders in a single test create
  // overlapping act() scopes and corrupt query bindings.
  for (const variant of ["assist", "filter", "input", "suggestion"] as const) {
    it(`renders the M3 ${variant} kind (P3 chip-4-types)`, async () => {
      await render(
        <Chip variant={variant} testID={`chip-${variant}`}>
          {variant}
        </Chip>,
      );
      expect(screen.getByTestId(`chip-${variant}`)).toBeTruthy();
    });
  }

  it("toggles an uncontrolled filter and reports the next state", async () => {
    const onValueChange = jest.fn();
    await render(
      <Chip variant="filter" defaultValue={false} onValueChange={onValueChange}>
        Available
      </Chip>,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-chip"));
    });
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("paints a selected filter in secondary-container (M3)", async () => {
    const scheme = defaultScheme();
    expect(chipStyles("filter", true, scheme).container.backgroundColor).toBe(
      scheme.color.secondaryContainer,
    );
  });

  it("fills the tone container when a tone is set (KernStatus, CL-010)", async () => {
    const scheme = defaultScheme();
    const styles = chipStyles("assist", false, scheme, false, "warning");
    expect(styles.container.backgroundColor).toBe(
      scheme.color.warningContainer,
    );
    expect(styles.label.color).toBe(scheme.color.onWarningContainer);
    expect(styles.container.borderWidth).toBe(0);
  });
});
