import { describe, expect, it } from "bun:test";
import {
  loadStudioState,
  STUDIO_DEFAULTS,
  type StudioState,
  saveStudioState,
  searchToState,
  stateToSearch,
  stateToStudioSearch,
  studioSearchToState,
} from "./studio-state";

const CUSTOM: StudioState = {
  seed: "#112233",
  preset: "sharp",
  dark: true,
  contrast: "high",
  radius: 1.5,
};

describe("studio state URL round-trip", () => {
  it("round-trips a fully custom state", () => {
    const search = stateToSearch(CUSTOM);
    expect(searchToState(search)).toEqual(CUSTOM);
  });

  it("round-trips the default state as an empty query", () => {
    expect(stateToSearch(STUDIO_DEFAULTS)).toBe("");
    expect(searchToState("")).toEqual(STUDIO_DEFAULTS);
    expect(searchToState("?")).toEqual(STUDIO_DEFAULTS);
  });

  it("omits default keys so the common theme shares clean", () => {
    const params = stateToStudioSearch({ ...STUDIO_DEFAULTS, dark: true });
    expect(params).toEqual({ dark: "1" });
  });

  it("normalises seed case and clamps radius", () => {
    const s = studioSearchToState({
      seed: "#AABBCC",
      radius: "3",
    });
    expect(s.seed).toBe("#aabbcc");
    expect(s.radius).toBe(2);
    const low = studioSearchToState({ radius: "0.1" });
    expect(low.radius).toBe(0.5);
  });

  it("falls back per key on invalid values, never rejects the state", () => {
    const s = studioSearchToState({
      seed: "nope",
      preset: "bad preset!",
      contrast: "extreme" as never,
      radius: "NaN",
      dark: "1",
    });
    expect(s.seed).toBe(STUDIO_DEFAULTS.seed);
    expect(s.preset).toBe(STUDIO_DEFAULTS.preset);
    expect(s.contrast).toBe(STUDIO_DEFAULTS.contrast);
    expect(s.radius).toBe(STUDIO_DEFAULTS.radius);
    expect(s.dark).toBe(true);
  });

  it("accepts session tenant preset ids", () => {
    const s = studioSearchToState({ preset: "tenant-acme-1" });
    expect(s.preset).toBe("tenant-acme-1");
  });
});

describe("studio state persistence", () => {
  it("survives a save/load cycle", () => {
    let stored: string | null = null;
    saveStudioState(CUSTOM, (v) => {
      stored = v;
    });
    const back = loadStudioState(STUDIO_DEFAULTS, () => stored);
    expect(back).toEqual(CUSTOM);
  });

  it("returns defaults for corrupt storage instead of throwing", () => {
    expect(loadStudioState(STUDIO_DEFAULTS, () => "{not json")).toEqual(
      STUDIO_DEFAULTS,
    );
    expect(loadStudioState(STUDIO_DEFAULTS, () => null)).toEqual(
      STUDIO_DEFAULTS,
    );
  });

  it("validates stored values the same way query values are validated", () => {
    const back = loadStudioState(
      STUDIO_DEFAULTS,
      () => '{"seed":"zzz","radius":"9","preset":"kern"}',
    );
    expect(back.seed).toBe(STUDIO_DEFAULTS.seed);
    expect(back.radius).toBe(2);
    expect(back.preset).toBe("kern");
  });

  it("is SSR-safe with no storage available", () => {
    expect(loadStudioState(STUDIO_DEFAULTS, null)).toEqual(STUDIO_DEFAULTS);
    expect(() => saveStudioState(CUSTOM, null)).not.toThrow();
  });
});
