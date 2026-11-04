import type { ComponentDoc } from "../types";

export const pulseButton: ComponentDoc = {
  slug: "pulse-button",
  name: "Pulse button",
  oneLiner:
    "Pulse buttons keep a locked corner silhouette across every interaction state, replacing M3 corner morphing with a spring-driven scale pulse, radial state-layer bloom, and kinetic icon nudge.",
  meta: {
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "PulseButton",
    variants: [
      "variant: elevated · filled · tonal · outlined · text",
      "color: primary · danger",
      "size: xs · sm · default · md · xl · lg · 2xl · 3xl · icon",
      "shape: pill · rounded · square (locked across states)",
    ],
    elevation: "surface",
  },
  parts: ["PulseButton"],
  states: ["resting", "hover", "focus", "focus / pressed", "disabled"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the pulse button when focused. Space activates on key-up, Enter on key-down.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the button. Disabled buttons leave the tab order; soft-disabled buttons keep their tab stop.",
    },
  ],
  aria: [
    'Exposes the native `button` role on `<button>` and `role="link"` when rendered with `href`.',
    "Reports `aria-pressed` in `toggle` mode and `aria-busy` plus `aria-disabled` when `loading`.",
    "Honors `prefers-reduced-motion: reduce` by disabling scale and icon transforms while preserving state-layer opacity.",
  ],
  customization: {
    supported: [
      "Shares the exact same `variant`, `color`, `size`, `shape`, `toggle`, and `block` vocabulary as `Button` via `button-shared.ts`.",
      'Locks `border-radius` across rest, hover, active press, and toggle selection (`data-shape-stable="true"`).',
      '`onHaptic` fires with `"pressIn"` and `"pressOut"` on pointer press/release so hosts can trigger device haptics in sync with the spring pulse.',
    ],
    notSupported: [
      "Corner morphing is intentionally disabled on `PulseButton`. When you want M3 Expressive round-to-square press/toggle morphing, use `Button`.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"elevated" | "filled" | "tonal" | "outlined" | "text"',
      default: '"filled"',
      note: "M3's five emphasis treatments, shared with `Button`.",
    },
    {
      name: "color",
      type: '"primary" | "danger"',
      default: '"primary"',
      note: "Paints the chosen variant in primary or error roles.",
    },
    {
      name: "size",
      type: '"xs" | "sm" | "default" | "md" | "xl" | "lg" | "2xl" | "3xl" | "icon"',
      default: '"default"',
      note: "Steps through the `kern.button.size` M3 Expressive size ladder from `xs` (XS) to `3xl` (XL).",
    },
    {
      name: "shape",
      type: '"pill" | "rounded" | "square"',
      default: '"pill"',
      note: "Locked container silhouette (`pill`, `rounded`, or per-size `square`) that never morphs on press or toggle.",
    },
    {
      name: "toggle",
      type: "boolean",
      default: "false",
      note: "Binary toggle selection with per-variant selected colors and `aria-pressed`, keeping the corner radius fixed.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "Controlled selected state when `toggle` is enabled.",
    },
    {
      name: "defaultPressed",
      type: "boolean",
      default: "false",
      note: "Uncontrolled initial selected state when `toggle` is enabled.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean) => void",
      note: "Called when toggle selection flips.",
    },
    {
      name: "softDisabled",
      type: "boolean",
      default: "false",
      note: "Paints disabled treatment while remaining keyboard-focusable.",
    },
    {
      name: "flipIcon",
      type: "boolean",
      default: "false",
      note: "Mirrors directional icons horizontally in RTL.",
    },
    {
      name: "block",
      type: "boolean",
      default: "false",
      note: "Stretches the button to full container width.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      note: "Renders an inline M3 spinner, sets `aria-busy`, and blocks interaction.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Leading or trailing icon node that receives a subtle kinetic nudge on press.",
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      default: '"start"',
      note: "Places the icon before or after the label.",
    },
    {
      name: "onHaptic",
      type: '(phase: "pressIn" | "pressOut") => void',
      note: "Optional callback fired on pointer down/up for coordinating haptics with the spring pulse.",
    },
    {
      name: "href",
      type: "string",
      note: "Renders an anchor wearing the pulse button treatment.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Disables interaction and applies the M3 12%/38% disabled split.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant and motion classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLButtonElement>",
      note: "Forwarded to the underlying button element.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      note: "Native button type attribute.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Rendered as `data-testid` on the root element.",
    },
  ],
};
