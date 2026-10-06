import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "Buttons let people carry out an action with a single tap, click or key press.",
  features:
    "Reach for a button when the next step is an action the person intends to take: saving a form, sending a message, opening a dialog. Put one primary action on a screen and give it the primary variant; every lower-emphasis action takes tonal, outlined or ghost so the hierarchy reads at a glance. A button is not a link — if it moves to another place rather than doing something here, use an anchor. Destructive actions have no variant of their own: they are a filled button wearing the error roles, which keeps the action vocabulary at five instead of six.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "size: default · sm · icon",
    ],
    // M3 tabulates buttons twice: "button (elevated)" at level 1 and
    // "buttons (filled, tonal, outlined)" at level 0. kern's `variant` axis
    // covers both rows, so `m3-elevation.ts` permits [0, 1] for this family.
    // The default variant is `primary` (filled), which carries no elevation
    // token and rests at level 0; `elevated` is the one that lifts, and it is
    // recorded in Customization because the strip holds a single value.
    elevation: 0,
  },
  parts: ["Button"],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes, so a token-backed utility overrides the variant rather than fighting it.",
      "`variant` and `size` are the two axes; both are optional and both have defaults.",
      "Color comes from the system roles — `--md-sys-color-primary`, `--md-sys-color-on-primary` — so a theme changes every button at once.",
    ],
    notSupported: [
      "There is no `color` or `destructive` prop. An error action is expressed by the caller against `--md-sys-color-error` and `--md-sys-color-on-error`.",
      "There is no `radius` or `shape` prop. The corner is `--md-sys-shape-corner-full`; change it in the theme, not per button.",
      "Height is not a prop. The three sizes map to fixed heights, so a custom height needs `className` on the whole button.",
      "Resting elevation is not a prop. `elevated` is the one variant that lifts, to `--md-sys-elevation-level1`; the other four sit on the surface and carry no token.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"elevated" | "primary" | "tonal" | "outlined" | "ghost"',
      default: '"primary"',
      note: "M3's five color configurations. There is no sixth: an error action is the filled variant wearing the error roles.",
    },
    {
      name: "size",
      type: '"default" | "sm" | "icon"',
      default: '"default"',
      note: "`icon` is square and expects an icon plus an `aria-label`; a text label inside `icon` is a bug.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes, so it can override color and shape.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
      note: "Defaults to `button` rather than the browser's `submit`, so a button inside a form does not submit it by accident.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLButtonElement>",
      note: "Forwarded to the underlying `<button>`.",
    },
  ],
};
