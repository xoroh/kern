import { useCallback, useEffect, useState } from "react";
import m3 from "./themes/m3.json";

export type Mode = "light" | "dark";
export type Contrast = "standard" | "medium" | "high";
export type ThemeVariant = "m3" | "sharp";

type RoleTable = Record<string, string>;

const baseRoles = m3.color as { light: RoleTable; dark: RoleTable };
const contrastOverlays =
  (m3 as { contrast?: Record<string, RoleTable> }).contrast ?? {};

/** Sharp variant deltas over a resolved scheme. Radius ships via CSS. */
const VARIANT_DELTAS: Record<ThemeVariant, Partial<RoleTable>> = {
  m3: {},
  sharp: { onSurface: "#111111" },
};

export function varName(role: string): string {
  const kebab = role.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();
  return `--md-sys-color-${kebab}`;
}

/** Resolve role → value for a mode, contrast, and variant. */
export function resolveTheme(
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeVariant = "m3",
): RoleTable {
  const base = { ...baseRoles[mode] };
  if (contrast !== "standard") {
    const overlay = contrastOverlays[`${mode}-${contrast}`] ?? {};
    Object.assign(base, overlay);
  }
  Object.assign(base, VARIANT_DELTAS[variant]);
  return base;
}

/** Write a resolved scheme onto an element as inline vars. */
export function applyKernTheme(
  target: HTMLElement,
  mode: Mode = "light",
  contrast: Contrast = "standard",
  variant: ThemeVariant = "m3",
): void {
  const scheme = resolveTheme(mode, contrast, variant);
  for (const [role, value] of Object.entries(scheme)) {
    target.style.setProperty(varName(role), value);
  }
}

function systemMode(): Mode {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

const STORAGE_KEY = "kern-theme-mode";

/** Theme state: persisted preference → OS default → `.dark` class. */
export function useKernTheme() {
  const [mode, setModeState] = useState<Mode>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // storage unavailable (SSR, private mode) — fall through to OS default
    }
    return systemMode();
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore persistence failures
    }
  }, [mode]);

  const setMode = useCallback((next: Mode) => setModeState(next), []);
  const toggle = useCallback(
    () => setModeState((m) => (m === "dark" ? "light" : "dark")),
    [],
  );

  return { mode, setMode, toggle };
}
