import { applyKernTheme, Button, type Mode, type ThemeId } from "@xoroh/kern";
import { AppShell } from "@xoroh/kern/start";
import { useState } from "react";

/**
 * First themed screen. The preset picker switches the whole app between the
 * shipped presets — kern (default), sharp, brand, and the demo tenant — plus
 * the light/dark mode axis. `applyKernTheme` writes the resolved role + shape
 * tables onto the document root as CSS variables, so every Kern component
 * repaints with no prop drilling.
 */
const PRESETS = [
  "kern",
  "sharp",
  "brand",
  "demo",
] as const satisfies readonly ThemeId[];
const MODES = ["light", "dark"] as const satisfies readonly Mode[];

export function App() {
  const [preset, setPreset] = useState<ThemeId>("kern");
  const [mode, setMode] = useState<Mode>("light");

  function apply(nextPreset: ThemeId, nextMode: Mode): void {
    setPreset(nextPreset);
    setMode(nextMode);
    applyKernTheme(document.documentElement, nextMode, "standard", nextPreset);
  }

  return (
    <AppShell>
      <div
        style={{
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 640,
        }}
      >
        <h1 style={{ margin: 0 }}>Kern starter</h1>
        <p style={{ margin: 0 }}>
          Preset: {preset} · Mode: {mode}. Every preset below resolves against
          the same token tables the docs describe — switching is override data,
          never a second role table.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <Button
              key={p}
              variant={p === preset ? "primary" : "outlined"}
              onClick={() => apply(p, mode)}
            >
              {p}
            </Button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {MODES.map((m) => (
            <Button
              key={m}
              variant={m === mode ? "tonal" : "ghost"}
              onClick={() => apply(preset, m)}
            >
              {m}
            </Button>
          ))}
        </div>
        <Button
          variant="primary"
          onClick={() => apply("brand", mode === "light" ? "dark" : "light")}
        >
          Continue
        </Button>
      </div>
    </AppShell>
  );
}
