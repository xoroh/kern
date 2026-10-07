import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "Buttons let people carry out an action with a single tap, click or key press.",
  features:
    "Reach for a button when the next step is an action the person intends to take: saving a form, sending a message, opening a dialog. Put one primary action on a screen and give it the primary variant; every lower-emphasis action takes tonal, outlined or ghost so the hierarchy reads at a glance. A button is not a link — if it moves to another place rather than doing something here, use an anchor, or `LinkButton` when the destination should wear the button treatment. Destructive actions have no variant of their own: `color=\"danger\"` re-paints the five variants in the error roles, which keeps the action vocabulary at five instead of six. A busy button keeps its label and reports it: `loading` swaps in the progress indicator and blocks interaction until it clears.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "color: primary · danger",
      "size: xs · default · sm · xl · icon",
      "shape: pill · rounded · square",
    ],
    // M3 tabulates buttons twice: "button (elevated)" at level 1 and
    // "buttons (filled, tonal, outlined)" at level 0. kern's `variant` axis
    // covers both rows, so `m3-elevation.ts` permits [0, 1] for this family.
    // The default variant is `primary` (filled), which carries no elevation
    // token and rests at level 0; `elevated` is the one that lifts, and it is
    // recorded in Customization because the strip holds a single value.
    elevation: 0,
  },
  parts: ["Button", "LinkButton", "FocusRing"],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes, so a token-backed utility overrides the variant rather than fighting it.",
      "`variant`, `color`, `size` and `shape` are the four axes; all are optional and all have defaults. `block` stretches the button full width.",
      "`loading` swaps in the embedded progress indicator (`loadingValue` for determinate 0–1, `loaderStyle` for the indicator style), marks `aria-busy` and blocks interaction until it clears.",
      "`href` renders an anchor wearing the button treatment — that is `LinkButton`'s whole implementation, a bridge with a required `href` and no `asChild`. A blocked link drops `href`, leaves the tab order and reports `aria-disabled`.",
      "`icon` renders beside the label with the `gap-2` M3 spacing; `iconPosition` chooses the side. Placement is order, not margin — the pair is flex content with a `gap`, so RTL flips it with nothing to mirror.",
      "The cursor is part of the contract: `pointer` on every live button, `not-allowed` under `disabled` or `aria-disabled`. A busy or blocked control never shows the hand.",
      "Color comes from the system roles — `--md-sys-color-primary`, `--md-sys-color-on-primary` — so a theme changes every button at once.",
    ],
    notSupported: [
      "Height is not a prop. The five sizes map to fixed heights (`xs` compacts into the `sm` band, `xl` steps into `lg`), so a custom height needs `className` on the whole button. Every size keeps a minimum touch target through the extended hit area.",
      "Resting elevation is not a prop. `elevated` is the one variant that lifts, to `--md-sys-elevation-level1`; the other four sit on the surface and carry no token.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"elevated" | "primary" | "tonal" | "outlined" | "ghost"',
      default: '"primary"',
      note: "M3's five color configurations. `filled` and `text` are accepted as aliases for `primary` and `ghost`. There is no sixth: an error action is `color=\"danger\"` on any of the five.",
    },
    {
      name: "color",
      type: '"primary" | "danger"',
      default: '"primary"',
      note: "The error treatment, not a variant. `danger` re-paints the variant's structure in the error roles; `primary` adds no classes.",
    },
    {
      name: "size",
      type: '"xs" | "default" | "sm" | "xl" | "icon"',
      default: '"default"',
      note: "`icon` is square and expects an icon plus an `aria-label`; a text label inside `icon` is a bug. `xs` compacts into the `sm` metrics band, `xl` steps into `lg`.",
    },
    {
      name: "shape",
      type: '"pill" | "rounded" | "square"',
      default: '"pill"',
      note: "The corner role: the M3 full pill, the stepped-down large corner, or none. The theme still owns the radii — this only selects the role.",
    },
    {
      name: "block",
      type: "boolean",
      default: "false",
      note: "Full-width button. Still a button, not a layout primitive — one per row is the honest use.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      note: "Shows the embedded progress indicator, reports `aria-busy` and blocks interaction like `disabled` does.",
    },
    {
      name: "loadingValue",
      type: "number",
      note: "0–1 determinate progress while loading. Omit for the indeterminate loop.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "Style of the embedded indicator. Defaults to the M3 ring.",
    },
    {
      name: "href",
      type: "string",
      note: "Renders an anchor wearing the button treatment instead of a `<button>`. `LinkButton` is this branch with a required `href`.",
    },
    {
      name: "target",
      type: "HTMLAnchorElement['target']",
      note: "Anchor target. Only rendered when `href` is set — a button has no browsing context to open.",
    },
    {
      name: "rel",
      type: "string",
      note: "Anchor relationship list. Only rendered when `href` is set.",
    },
    {
      name: "download",
      type: "HTMLAnchorElement['download']",
      note: "Download hint. Only rendered when `href` is set.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Renders beside the label with the `gap-2` M3 spacing, hidden from assistive tech. An icon-only button is `size=\"icon\"` plus an `aria-label`, not a text label.",
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      default: '"start"',
      note: "Which side of the label the icon renders on. Order, not margin, so RTL flips the pair automatically.",
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
      note: "Defaults to `button` rather than the browser's `submit`, so a button inside a form does not submit it by accident. Never reaches the anchor — links submit nothing.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLButtonElement | HTMLAnchorElement>",
      note: "Forwarded to the underlying `<button>`, or the `<a>` when `href` is set.",
    },
  ],
};
