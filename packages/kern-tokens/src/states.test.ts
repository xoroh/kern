import { describe, expect, it } from "vitest";
import { STATE_LAYER_OPACITIES } from "./states";
import { tokens } from "./tokens";

const percent = (value: number) => `${Math.round(value * 100)}%`;

describe("STATE_LAYER_OPACITIES", () => {
  it("matches the canonical tokens.json states block exactly", () => {
    const states = tokens.states as Record<string, string>;
    expect(percent(STATE_LAYER_OPACITIES.hover)).toBe(states["hover-opacity"]);
    expect(percent(STATE_LAYER_OPACITIES.focus)).toBe(states["focus-opacity"]);
    expect(percent(STATE_LAYER_OPACITIES.press)).toBe(states["press-opacity"]);
    expect(percent(STATE_LAYER_OPACITIES.drag)).toBe(states["drag-opacity"]);
    expect(percent(STATE_LAYER_OPACITIES.disabled)).toBe(
      states["disabled-opacity"],
    );
  });

  it("ships the material-web v0.192 canonical values", () => {
    expect(STATE_LAYER_OPACITIES).toEqual({
      hover: 0.08,
      focus: 0.12,
      press: 0.12,
      drag: 0.16,
      disabled: 0.38,
    });
  });
});
