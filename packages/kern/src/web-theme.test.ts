import { renderHook } from "@testing-library/react";
import { themes } from "@xoroh/kern-tokens";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { applyKernTheme, clearKernTheme, useKernTheme } from "./web-theme";

describe("applyKernTheme", () => {
  it("writes vars onto the target", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark");
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toBe(
      themes.m3.color.dark.primary,
    );
  });

  it("clears inline overrides", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark", "standard", "sharp");
    clearKernTheme(el);
    expect(el.style.getPropertyValue("--md-sys-color-primary")).toBe("");
    expect(el.dataset.kernTheme).toBeUndefined();
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
