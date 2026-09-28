// Mirror of tokens.json (canonical color source).
// oklch = canonical (math, web output). srgb = compiled native output.
// Regenerate — do not hand-edit values.
export const tokens = {
  palettes: {
    neutral: {
      "50": { oklch: "oklch(98.5% 0 0)", srgb: "#fafafa" },
      "100": { oklch: "oklch(97.0% 0 0)", srgb: "#f5f5f5" },
      "200": { oklch: "oklch(92.2% 0 0)", srgb: "#e5e5e5" },
      "300": { oklch: "oklch(87.0% 0 0)", srgb: "#d4d4d4" },
      "400": { oklch: "oklch(71.5% 0 0)", srgb: "#a3a3a3" },
      "500": { oklch: "oklch(55.6% 0 0)", srgb: "#737373" },
      "600": { oklch: "oklch(43.9% 0 0)", srgb: "#525252" },
      "700": { oklch: "oklch(37.1% 0 0)", srgb: "#404040" },
      "800": { oklch: "oklch(26.9% 0 0)", srgb: "#262626" },
      "900": { oklch: "oklch(20.5% 0 0)", srgb: "#171717" },
      "950": { oklch: "oklch(14.5% 0 0)", srgb: "#0a0a0a" },
    },
    blue: {
      "100": { oklch: "oklch(93.2% 0.032 255.6)", srgb: "#dbeafe" },
      "400": { oklch: "oklch(71.4% 0.143 254.6)", srgb: "#60a5fa" },
      "600": { oklch: "oklch(54.6% 0.215 262.9)", srgb: "#2563eb" },
      "900": { oklch: "oklch(37.9% 0.138 265.5)", srgb: "#1e3a8a" },
      "950": { oklch: "oklch(28.2% 0.087 267.9)", srgb: "#172554" },
    },
    red: {
      "400": { oklch: "oklch(71.1% 0.166 22.2)", srgb: "#f87171" },
      "600": { oklch: "oklch(57.7% 0.215 27.3)", srgb: "#dc2626" },
    },
    green: {
      "600": { oklch: "oklch(62.7% 0.170 149.2)", srgb: "#16a34a" },
    },
    amber: {
      "400": { oklch: "oklch(86.1% 0.173 91.9)", srgb: "#facc15" },
      "700": { oklch: "oklch(55.4% 0.121 66.4)", srgb: "#a16207" },
    },
  },
  base: {
    background: { oklch: "oklch(15.0% 0.002 286.1)", srgb: "#0b0b0c" },
    foreground: { oklch: "oklch(97.0% 0.001 106.4)", srgb: "#f5f5f4" },
    black: { oklch: "oklch(0.0% 0 0)", srgb: "#000000" },
    white: { oklch: "oklch(100.0% 0 0)", srgb: "#ffffff" },
  },
} as const;

export type KernTokens = typeof tokens;
