import { renderHook } from "@testing-library/react";
import { themeFromSeed, themes } from "@xoroh/kern-m3";
import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyKernTheme,
  COLOR_SCHEME_INIT,
  clearKernTheme,
  useColorScheme,
  useKernTheme,
} from "./web-theme";

describe("applyKernTheme", () => {
  it("writes vars onto the target", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark");
    expect(el.style.getPropertyValue("--sys-color-primary")).toBe(
      themes["material-3"].color.dark.primary,
    );
  });

  it("clears inline overrides", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "dark", "standard", "sharp");
    clearKernTheme(el);
    expect(el.style.getPropertyValue("--sys-color-primary")).toBe("");
    expect(el.dataset.kernTheme).toBeUndefined();
  });

  it("defaults to the standard motion scheme (no easing overrides)", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "light");
    expect(el.dataset.kernMotion).toBe("standard");
    expect(el.style.getPropertyValue("--sys-motion-easing-standard")).toBe("");
  });

  it("applies the expressive easing anchor and clears it", () => {
    const el = document.createElement("div");
    applyKernTheme(el, "light", "standard", "material-3", "expressive");
    expect(el.dataset.kernMotion).toBe("expressive");
    expect(el.style.getPropertyValue("--sys-motion-easing-standard")).not.toBe(
      "",
    );
    clearKernTheme(el);
    expect(el.style.getPropertyValue("--sys-motion-easing-standard")).toBe("");
    expect(el.dataset.kernMotion).toBeUndefined();
  });

  it("accepts a seed-generated custom theme as the variant", () => {
    const el = document.createElement("div");
    const theme = themeFromSeed("#6750a4", "seed-purple-test");
    applyKernTheme(el, "light", "standard", theme);
    expect(el.dataset.kernTheme).toBe("seed-purple-test");
    expect(el.style.getPropertyValue("--sys-color-primary")).toMatch(
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

describe("useColorScheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("defaults to system and resolves light when matchMedia is false", () => {
    const { result, unmount } = renderHook(() => useColorScheme());
    expect(result.current.mode).toBe("system");
    expect(result.current.resolved).toBe("light");
    unmount();
  });

  it("persists setMode to localStorage and documentElement", async () => {
    const { result, unmount } = renderHook(() => useColorScheme());
    await act(async () => {
      result.current.setMode("dark");
    });
    expect(result.current.mode).toBe("dark");
    expect(result.current.resolved).toBe("dark");
    expect(localStorage.getItem("kern-tokens-mode")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    await act(async () => {
      result.current.setMode("system");
    });
    expect(result.current.mode).toBe("system");
    expect(localStorage.getItem("kern-tokens-mode")).toBeNull();
    unmount();
  });

  it("toggles resolved appearance between light and dark", async () => {
    const { result, unmount } = renderHook(() => useColorScheme());
    await act(async () => {
      result.current.setMode("light");
    });
    expect(result.current.resolved).toBe("light");
    await act(async () => {
      result.current.toggle();
    });
    expect(result.current.resolved).toBe("dark");
    expect(result.current.mode).toBe("dark");
    await act(async () => {
      result.current.toggle();
    });
    expect(result.current.resolved).toBe("light");
    expect(result.current.mode).toBe("light");
    unmount();
    localStorage.removeItem("kern-tokens-mode");
  });

  it("exports COLOR_SCHEME_INIT script string", () => {
    expect(typeof COLOR_SCHEME_INIT).toBe("string");
    expect(COLOR_SCHEME_INIT).toContain("kern-tokens-mode");
    expect(COLOR_SCHEME_INIT).toContain("classList.toggle('dark'");
  });
});
