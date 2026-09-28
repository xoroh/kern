import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { applyKernTheme, resolveTheme, useKernTheme, varName } from "./theme";

describe("resolveTheme", () => {
  it("resolves light roles from ramp values", () => {
    const scheme = resolveTheme("light");
    expect(scheme.primary).toBe("#000000");
    expect(scheme.secondary).toBe("#2563eb");
    expect(scheme.surfaceTonal).toBe("#efefef");
  });

  it("mirrors assignments in dark", () => {
    const scheme = resolveTheme("dark");
    expect(scheme.primary).toBe("#ffffff");
    expect(scheme.surface).toBe("#000000");
  });

  it("layers contrast overlays over base", () => {
    expect(resolveTheme("light", "medium").outline).toBe("#545454");
    expect(resolveTheme("light").outline).toBe("#d4d4d4");
    expect(resolveTheme("dark", "high").outline).toBe("#ffffff");
  });

  it("applies sharp deltas", () => {
    expect(resolveTheme("light", "standard", "sharp").onSurface).toBe(
      "#111111",
    );
    expect(resolveTheme("light").onSurface).toBe("#262626");
  });

  it("names vars per M3", () => {
    expect(varName("onSurface")).toBe("--md-sys-color-on-surface");
  });
});

describe("applyKernTheme", () => {
  it("writes vars onto the target", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark");
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toBe("#ffffff");
  });
});

describe("useKernTheme", () => {
  it("toggles mode and the dark class", async () => {
    const { result } = renderHook(() => useKernTheme());
    expect(result.current.mode).toBe("light");
    await act(async () => {
      result.current.toggle();
    });
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
