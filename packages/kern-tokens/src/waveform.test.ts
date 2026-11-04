import { describe, expect, it } from "vitest";
import { WAVEFORM_CIRCULAR, WAVEFORM_LINEAR } from "./waveform";

describe("waveform geometry (A-005, M3 Expressive token values)", () => {
  it("pins the linear wavy defaults to the compose token source", () => {
    expect(WAVEFORM_LINEAR).toEqual({
      amplitudeDp: 3.0,
      wavelengthDp: 40.0,
      trackThicknessDp: 4.0,
      containerHeightDp: 10.0,
      stopSizeDp: 4.0,
      trackActiveSpaceDp: 4.0,
      indeterminateWavelengthDp: 20.0,
    });
  });

  it("pins the circular wavy defaults to the compose token source", () => {
    expect(WAVEFORM_CIRCULAR).toEqual({
      amplitudeDp: 1.6,
      wavelengthDp: 15.0,
      trackThicknessDp: 4.0,
      containerSizeDp: 48.0,
      trackActiveSpaceDp: 4.0,
    });
  });

  it("keeps every value a finite non-negative number", () => {
    for (const table of [WAVEFORM_LINEAR, WAVEFORM_CIRCULAR]) {
      for (const value of Object.values(table)) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
