import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "Buttons let people carry out an action with a single tap, click or key press.",
  features:
    "Reach for a button when the next step is an action the person intends to take: saving a form, sending a message, opening a dialog. Put one primary action on a screen and give it the primary variant; every lower-emphasis action takes tonal, outlined or ghost so the hierarchy reads at a glance. A button is not a link — if it moves to another place rather than doing something here, use an anchor. Destructive actions have no variant of their own: they are a filled button wearing the error roles, which keeps the action vocabulary at five instead of six.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "size: default · sm · icon",
    ],
    // M3 assigns filled, tonal and outlined buttons to level 0 and the
    // elevated button to level 1. kern ships no elevation token on the first
    // three, and `m3-elevation.ts` calls a component that carries no token
    // `null` — "surface". So the strip says surface, which is what renders,
    // and the one variant that does lift is recorded in Customization rather
    // than in the strip, which holds one value.
    elevation: "surface",
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
