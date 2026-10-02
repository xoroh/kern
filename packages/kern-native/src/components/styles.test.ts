import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes } from "@xoroh/kern-tokens";
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
      themes.kern.color.light.error,
    );
  });

  it("card variants", () => {
    expect(cardStyles("outlined")).toMatchObject({ borderWidth: 1 });
    expect(cardStyles("elevated").elevation).toBe(1);
    expect(cardStyles("filled").borderRadius).toBe(
      Number.parseFloat(themes.kern.radius.small),
    );
  });

  it("chip selection flips to black", () => {
    expect(chipStyles("filter", true).container.backgroundColor).toBe(
      themes.kern.color.light.primary,
    );
    expect(chipStyles("assist", false).container.backgroundColor).toBe(
      themes.kern.color.light.surfaceTonal,
    );
  });

  it("divider orientations", () => {
    expect(dividerStyles("horizontal")).toMatchObject({ height: 1 });
    expect(dividerStyles("vertical")).toMatchObject({ width: 1 });
  });

  it("field message error uses error role", () => {
    expect(fieldMessageStyles("error").color).toBe(
      themes.kern.color.light.error,
    );
  });

  it("input is 56dp with error border swap", () => {
    expect(inputStyles(false, false).minHeight).toBe(56);
    expect(inputStyles(true, false).borderColor).toBe(
      themes.kern.color.light.error,
    );
  });

  it("list items meet 56dp rows", () => {
    expect(listItemStyles().row.minHeight).toBe(56);
  });

  it("radio control is 20dp", () => {
    expect(radioStyles(false, false).control).toMatchObject({
      width: 20,
      height: 20,
    });
  });

  it("checkbox box is 18dp with the M3 extra-small shape", () => {
    expect(checkboxStyles(false, false, false).box).toMatchObject({
      width: 18,
      borderRadius: Number.parseFloat(themes.kern.radius["extra-small"]),
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
