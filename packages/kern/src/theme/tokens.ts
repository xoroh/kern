// Hand-authored mirror of tokens.json until codegen is wired.
// Source of truth: ./tokens.json
export const tokens = {
  color: {
    background: "#0b0b0c",
    foreground: "#f5f5f4",
    accent: "#facc15",
  },
  radius: {
    md: "0.75rem",
  },
} as const;

export type KernTokens = typeof tokens;
