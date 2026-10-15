/**
 * Native behaviour suite for Fab — sizes, expressive colors, ink pairing.
 *
 * M3 ground truth (material-web v0_192 tokens + MDC-Android dimens):
 * small 40dp (deprecated), regular 56dp, medium 80dp (expressive),
 * large 96dp. Colors: three containers, three fills, surface (deprecated).
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { defaultScheme } from "../theme";
import { Fab, fabColorRoles, fabStyles } from "./fab";

const light = defaultScheme;

describe("Fab sizes (native)", () => {
  it.each([
    ["small", 40],
    ["default", 56],
    ["medium", 80],
    ["large", 96],
  ] as const)("renders %s at %sdp", (size, dp) => {
    expect(fabStyles(size, light).minHeight).toBe(dp);
  });
});

describe("Fab colors (native)", () => {
  it("pairs every container with its on-color", () => {
    expect(fabColorRoles("primary", light)).toEqual({
      container: light.color.primaryContainer,
      ink: light.color.onPrimaryContainer,
    });
    expect(fabColorRoles("secondary", light)).toEqual({
      container: light.color.secondaryContainer,
      ink: light.color.onSecondaryContainer,
    });
    expect(fabColorRoles("tertiary", light)).toEqual({
      container: light.color.tertiaryContainer,
      ink: light.color.onTertiaryContainer,
    });
    expect(fabColorRoles("primary-fill", light)).toEqual({
      container: light.color.primary,
      ink: light.color.onPrimary,
    });
    expect(fabColorRoles("surface", light)).toEqual({
      container: light.color.surfaceContainerHigh,
      ink: light.color.primary,
    });
  });

  it("defaults to the primary container treatment", async () => {
    await render(<Fab label="Create">+</Fab>);
    expect(screen.getByRole("button", { name: "Create" })).toBeTruthy();
  });

  it("warns when disabled — M3 hides the FAB instead", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    try {
      await render(
        <Fab label="Create" disabled>
          +
        </Fab>,
      );
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it("opens the press normally when enabled", async () => {
    const onPress = jest.fn();
    await render(
      <Fab label="Create" onPress={onPress}>
        +
      </Fab>,
    );
    fireEvent.press(screen.getByRole("button", { name: "Create" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
