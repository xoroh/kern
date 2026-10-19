---
"@xoroh/kern": minor
"@xoroh/kern-native": minor
"@xoroh/kern-cli": patch
"@xoroh/kern-mcp": patch
---

Port UseColorScheme and ThemeToggle from kern-pending (PR 1).

- **`useColorScheme()`**: cross-platform hook returning user preference mode (`"light" | "dark" | "system"`), active appearance (`resolved`: `"light" | "dark"`), `setMode`, and `toggle`. Backed by `useKernTheme()`.
- **`COLOR_SCHEME_INIT`** & **`COLOR_SCHEME_STORAGE_KEY`**: First-paint theme script and storage key (`kern-tokens-mode`) exported for SSR / <head> injection to eliminate appearance flash.
- **`ThemeToggle`**: First-class core component on Web and Native. Built on `IconButton` toggle form with M3 state layers, 48dp minimum touch target, and destination-named accessible labels ("Switch to light" while dark, "Switch to dark" while light). Supports both zero-config uncontrolled usage and controlled `mode`/`onToggle` host props.
