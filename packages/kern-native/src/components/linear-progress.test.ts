import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { themes } from "@xoroh/kern-m3";
import { defaultScheme } from "../theme";
import {
  LINEAR_FOUR_COLOR_DURATION_MS,
  LINEAR_FOUR_COLOR_INPUT_RANGE,
  LINEAR_INDETERMINATE_BARS,
  LINEAR_INDETERMINATE_DURATION_MS,
  LINEAR_WAVE_GEOMETRY,
  linearBufferStyles,
  linearFourColorStops,
  linearProgressStyles,
} from "./linear-progress";

describe("linearProgressStyles (back-compat)", () => {
  it("keeps the { track, fill } shape with a 4dp track", () => {
    const styles = linearProgressStyles(0.4);
    expect(Object.keys(styles).sort()).toEqual(["fill", "track"]);
    expect(styles.track.height).toBe(4);
    expect(styles.track.width).toBe("100%");
    expect(styles.fill).toMatchObject({ height: 4, width: "40%" });
  });

  it("clamps the fill to the 0–1 range", () => {
    expect(linearProgressStyles(1.8).fill.width).toBe("100%");
    expect(linearProgressStyles(-0.5).fill.width).toBe("0%");
  });
});

describe("wavy indicator geometry (web parity)", () => {
  it("matches the platform wave geometry: 3dp amplitude, 40dp wavelength", () => {
    expect(LINEAR_WAVE_GEOMETRY.amplitudeDp).toBe(3);
    expect(LINEAR_WAVE_GEOMETRY.wavelengthDp).toBe(40);
  });

  it("matches the web SVG: 40x12 viewBox, M0 6 Q 10 0 20 6 T 40 6 path, 4px stroke", () => {
    expect(LINEAR_WAVE_GEOMETRY.viewBox).toBe("0 0 40 12");
    expect(LINEAR_WAVE_GEOMETRY.path).toBe("M0 6 Q 10 0 20 6 T 40 6");
    expect(LINEAR_WAVE_GEOMETRY.strokeWidth).toBe(4);
  });
});

describe("indeterminate loop (web parity)", () => {
  it("runs the two bars on a 2s linear cycle", () => {
    expect(LINEAR_INDETERMINATE_DURATION_MS).toBe(2000);
    expect(LINEAR_INDETERMINATE_BARS.length).toBe(2);
  });

  it("translates the web keyframes to left/width percentages", () => {
    // Web `kern-linear-indeterminate`: translateX(-100%/35%/240%) scaleX(0.45).
    expect(LINEAR_INDETERMINATE_BARS[0].width).toBe("45%");
    expect([...LINEAR_INDETERMINATE_BARS[0].leftRange]).toEqual([
      "-100%",
      "35%",
      "240%",
    ]);
    // Web `kern-linear-indeterminate-secondary`: translateX(-150%/0%/200%) scaleX(0.3).
    expect(LINEAR_INDETERMINATE_BARS[1].width).toBe("30%");
    expect([...LINEAR_INDETERMINATE_BARS[1].leftRange]).toEqual([
      "-150%",
      "0%",
      "200%",
    ]);
    for (const bar of LINEAR_INDETERMINATE_BARS) {
      expect([...bar.inputRange]).toEqual([0, 0.5, 1]);
    }
  });

  it("cycles four colors over 8s in web keyframe order", () => {
    expect(LINEAR_FOUR_COLOR_DURATION_MS).toBe(8000);
    expect([...LINEAR_FOUR_COLOR_INPUT_RANGE]).toEqual([0, 0.25, 0.5, 0.75, 1]);
    const light = themes["material-3"].color.light;
    expect(linearFourColorStops(defaultScheme())).toEqual([
      light.primary,
      light.primaryContainer,
      light.tertiary,
      light.tertiaryContainer,
    ]);
  });
});

describe("linearBufferStyles", () => {
  it("renders the buffer wash behind the bar at 24% primary", () => {
    const { buffer } = linearBufferStyles(0.8, defaultScheme());
    expect(buffer.width).toBe("80%");
    expect(buffer.backgroundColor).toBe(
      themes["material-3"].color.light.primary,
    );
    expect(buffer.opacity).toBe(0.24);
    expect(buffer.position).toBe("absolute");
  });

  it("clamps the buffer level to the 0–1 range", () => {
    expect(linearBufferStyles(2).buffer.width).toBe("100%");
    expect(linearBufferStyles(-1).buffer.width).toBe("0%");
  });
});
