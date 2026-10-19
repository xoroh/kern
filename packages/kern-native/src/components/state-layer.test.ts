import { describe, expect, it } from "vitest";
import { STATE_LAYER_OPACITIES } from "@xoroh/kern-tokens";
import {
  DISABLED_CONTENT_OPACITY,
  stateLayerColor,
  stateLayerStyle,
  withAlpha,
} from "./state-layer";

describe("state-layer", () => {
  it("reads the pressed wash from the DTCG token, not a literal", () => {
    expect(STATE_LAYER_OPACITIES.press).toBe(0.1);
    expect(stateLayerColor("#1b1b1f")).toBe("#1b1b1f1a");
  });

  it("fills its host and clips to the container radius", () => {
    const style = stateLayerStyle("#1b1b1f", 16);
    expect(style).toMatchObject({
      position: "absolute",
      top: 0,
      left: 0,
      backgroundColor: "#1b1b1f1a",
      borderRadius: 16,
    });
  });

  it("exposes the disabled wash from the same token block", () => {
    expect(DISABLED_CONTENT_OPACITY).toBe(STATE_LAYER_OPACITIES.disabled);
    expect(DISABLED_CONTENT_OPACITY).toBe(0.38);
    expect(withAlpha("#1b1b1f", DISABLED_CONTENT_OPACITY)).toBe("#1b1b1f61");
  });

  it("passes non-hex colors through untouched", () => {
    expect(withAlpha("transparent", 0.1)).toBe("transparent");
  });
});
