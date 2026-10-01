import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes } from "@xoroh/kern-theme";
import { kernFontFaces, useKernFonts } from "../fonts";
import { secondaryTabsStyles } from "./layouts";
import { navigationBarStyles } from "./navigation-bar";
import { drawerStyles } from "./navigation-drawer";
import { BottomSheet, bottomSheetStyles, EntitySheet } from "./sheets";
import { bootSplashStyles } from "./shell";
import { topAppBarStyles } from "./top-app-bar";
import { bannerStyles } from "./web-parity";

const LIGHT = themes.m3.color.light;
const radius = (role: keyof typeof themes.m3.radius) =>
  Number.parseFloat(themes.m3.radius[role]);

describe("native composition style maps", () => {
  it("navigation bar is 80dp with a full indicator pill", () => {
    const styles = navigationBarStyles();
    expect(styles.bar.height).toBe(80);
    expect(styles.indicator.borderRadius).toBe(radius("full"));
    expect(styles.indicator.minWidth).toBe(64);
  });

  it("drawer is 360dp on surfaceContainerLow", () => {
    expect(drawerStyles().drawer).toMatchObject({
      width: 360,
      backgroundColor: LIGHT.surfaceContainerLow,
    });
  });

  it("top app bar sizes follow the M3 mobile heights", () => {
    expect(topAppBarStyles("small").minHeight).toBe(64);
    expect(topAppBarStyles("center").minHeight).toBe(64);
    expect(topAppBarStyles("medium").minHeight).toBe(112);
    expect(topAppBarStyles("small").borderBottomColor).toBe(
      LIGHT.outlineVariant,
    );
  });

  it("bottom sheet respects the M3 50% cap on medium", () => {
    expect(bottomSheetStyles("medium").maxHeight).toBe("50%");
    expect(bottomSheetStyles("large").maxHeight).toBe("92%");
    expect(bottomSheetStyles("medium").borderTopLeftRadius).toBe(
      radius("extra-large"),
    );
  });

  it("secondary tab indicator is the secondary role", () => {
    expect(secondaryTabsStyles().indicator).toMatchObject({
      height: 2,
      backgroundColor: LIGHT.secondary,
    });
  });

  it("banner intents map onto status container roles", () => {
    expect(bannerStyles("info").container.backgroundColor).toBe(
      LIGHT.infoContainer,
    );
    expect(bannerStyles("error").container.backgroundColor).toBe(
      LIGHT.errorContainer,
    );
    expect(bannerStyles("error").title.color).toBe(LIGHT.onErrorContainer);
  });

  it("boot splash fills the screen on surface", () => {
    const styles = bootSplashStyles();
    expect(styles.root).toMatchObject({
      flex: 1,
      backgroundColor: LIGHT.surface,
    });
  });

  it("fonts expose the three Inter token faces", () => {
    expect(kernFontFaces).toEqual({
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semibold: "Inter_600SemiBold",
    });
  });

  it("composition modules expose components", () => {
    expect(typeof BottomSheet).toBe("function");
    expect(typeof EntitySheet).toBe("function");
    expect(typeof useKernFonts).toBe("function");
  });
});
