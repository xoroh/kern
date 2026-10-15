import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import {
  resolveThemeDetails,
} from "@xoroh/kern-tokens";
import { themes } from "@xoroh/kern-material-3";
import { badgeStyles } from "./badge";
import { cardStyles } from "./card";
import { checkboxStyles } from "./checkbox";
import { chipStyles } from "./chip";
import { fieldMessageStyles } from "./field-message";
import { inputStyles } from "./input";
import { listItemStyles } from "./list-item";
import { radioStyles } from "./radio-group";
import { dividerStyles } from "./separator";
import { switchStyles } from "./switch";
import { textStyles } from "./text";

describe("native style maps", () => {
  it("badge dot is 6dp, count carries error fill", () => {
    expect(badgeStyles("dot").container).toMatchObject({ width: 6, height: 6 });
    expect(badgeStyles("count").container.backgroundColor).toBe(
      themes["material-3"].color.light.error,
    );
  });

  it("card variants", () => {
    expect(cardStyles("outlined")).toMatchObject({ borderWidth: 1 });
    expect(cardStyles("elevated").elevation).toBe(1);
    // M3 card shape is medium (12px), not small.
    expect(cardStyles("filled").borderRadius).toBe(
      Number.parseFloat(themes["material-3"].radius.medium),
    );
    expect(cardStyles("filled").backgroundColor).toBe(
      themes["material-3"].color.light.surfaceContainerHighest,
    );
    expect(cardStyles("elevated").backgroundColor).toBe(
      themes["material-3"].color.light.surfaceContainerLow,
    );
    // M3 outlined cards sit on surface, not the filled container.
    expect(cardStyles("outlined").backgroundColor).toBe(
      themes["material-3"].color.light.surface,
    );
  });

  it("chip selection fills secondary-container per M3", () => {
    expect(chipStyles("filter", true).container.backgroundColor).toBe(
      themes["material-3"].color.light.secondaryContainer,
    );
    expect(chipStyles("filter", true).label.color).toBe(
      themes["material-3"].color.light.onSecondaryContainer,
    );
    expect(chipStyles("filter", false).container.backgroundColor).toBe(
      "transparent",
    );
  });

  it("chip elevated raises assist to level1 (M3, ignored elsewhere)", () => {
    expect(
      chipStyles("assist", false, undefined, true).container.backgroundColor,
    ).toBe(themes["material-3"].color.light.surfaceContainerLow);
    expect(
      chipStyles("assist", false, undefined, true).container.elevation,
    ).toBe(1);
    expect(
      chipStyles("input", false, undefined, true).container.elevation,
    ).toBeUndefined();
  });

  it("divider orientations", () => {
    expect(dividerStyles("horizontal")).toMatchObject({ height: 1 });
    expect(dividerStyles("vertical")).toMatchObject({ width: 1 });
  });

  it("divider insets (M3: 16dp start, 16dp both sides)", () => {
    expect(dividerStyles("horizontal", undefined, "start")).toMatchObject({
      marginLeft: 16,
    });
    expect(dividerStyles("horizontal", undefined, "middle")).toMatchObject({
      marginLeft: 16,
      marginRight: 16,
    });
    expect(dividerStyles("vertical", undefined, "middle")).toMatchObject({
      marginTop: 16,
      marginBottom: 16,
    });
    expect(dividerStyles("horizontal", undefined, "none")).not.toHaveProperty(
      "marginLeft",
    );
  });

  it("field message error uses error role", () => {
    expect(fieldMessageStyles("error").color).toBe(
      themes["material-3"].color.light.error,
    );
  });

  it("input is 56dp with error border swap", () => {
    expect(inputStyles(false, false).minHeight).toBe(56);
    expect(inputStyles(true, false).borderColor).toBe(
      themes["material-3"].color.light.error,
    );
  });

  it("input filled uses surface-container-highest with top-only rounding", () => {
    const filled = inputStyles(false, false, undefined, false, "filled");
    expect(filled.backgroundColor).toBe(
      themes["material-3"].color.light.surfaceContainerHighest,
    );
    expect(filled.borderTopLeftRadius).toBe(4);
    expect(filled.borderBottomLeftRadius).toBe(0);
    const outlined = inputStyles(false, false, undefined, false, "outlined");
    expect(outlined.backgroundColor).toBe(themes["material-3"].color.light.surface);
    expect(outlined.borderBottomLeftRadius).toBe(4);
  });

  it("input disabled splits border 12% and text 38%", () => {
    const disabled = inputStyles(false, false, undefined, true, "outlined");
    expect(disabled.borderColor).toMatch(/1f$/i);
    expect(disabled.color).toMatch(/61$/i);
  });

  it("list items meet 56dp rows", () => {
    expect(listItemStyles().row.minHeight).toBe(56);
  });

  it("selected list items take the M3 highlight (secondary-container, 16dp)", () => {
    const scheme = resolveThemeDetails("light");
    expect(listItemStyles(scheme, true).row).toMatchObject({
      backgroundColor: scheme.color.secondaryContainer,
      borderRadius: 16,
    });
    expect(listItemStyles(scheme, true).title.color).toBe(
      scheme.color.onSecondaryContainer,
    );
    expect(listItemStyles(scheme, false).row.backgroundColor).toBeUndefined();
  });

  it("radio control is 20dp", () => {
    expect(radioStyles(false, false).control).toMatchObject({
      width: 20,
      height: 20,
    });
  });

  it("checkbox box is 18dp with the M3 2px shape", () => {
    expect(checkboxStyles(false, false, false).box).toMatchObject({
      width: 18,
      borderRadius: 2,
    });
  });

  it("switch track is 52x32 with growing thumb", () => {
    expect(switchStyles(false, false).track).toMatchObject({
      width: 52,
      height: 32,
    });
    expect(switchStyles(true, false).thumb.width).toBe(24);
    expect(switchStyles(false, false).thumb.width).toBe(16);
  });

  it("text scale steps up", () => {
    expect(textStyles("body").fontSize).toBe(14);
    expect(textStyles("headline").fontSize).toBe(24);
  });
});
