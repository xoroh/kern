import { renderHook } from "@testing-library/react";
import { themeFromSeed, themes } from "@xoroh/kern-tokens";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { applyKernTheme, clearKernTheme, useKernTheme } from "./web-theme";

describe("applyKernTheme", () => {
  it("writes vars onto the target", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark");
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toBe(
      themes.kern.color.dark.primary,
    );
  });

  it("clears inline overrides", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark", "standard", "sharp");
    clearKernTheme(el);
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toBe("");
    expect(el.dataset.kernTheme).toBeUndefined();
  });

  it("defaults to the standard motion scheme (no easing overrides)", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "light");
    expect(el.dataset.kernMotion).toBe("standard");
    expect(el.style.getPropertyValue("--md-sys-motion-easing-standard")).toBe(
      "",
    );
  });

  it("applies the expressive easing anchor and clears it", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "light", "standard", "kern", "expressive");
    expect(el.dataset.kernMotion).toBe("expressive");
    expect(
      el.style.getPropertyValue("--md-sys-motion-easing-standard"),
    ).not.toBe("");
    clearKernTheme(el);
    expect(el.style.getPropertyValue("--md-sys-motion-easing-standard")).toBe(
      "",
    );
    expect(el.dataset.kernMotion).toBeUndefined();
  });

  it("accepts a seed-generated custom theme as the variant", () => {
    const el = document.createElement("div");
    const theme = themeFromSeed("#6750a4", "seed-purple-test");
    applyKernTheme(el, "light", "standard", theme);
    expect(el.dataset.kernTheme).toBe("seed-purple-test");
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toMatch(
      /^#[0-9a-f]{6}$/i,
    );
  });
});

describe("useKernTheme", () => {
  it("restores an explicit saved preference after mounting", () => {
    localStorage.setItem("kern-tokens-mode", "dark");
    const { result, unmount } = renderHook(() => useKernTheme());
    expect(result.current.mode).toBe("dark");
    unmount();
    localStorage.removeItem("kern-tokens-mode");
  });

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
