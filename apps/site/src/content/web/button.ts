import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "Buttons let people carry out an action with a single tap, click or key press.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Button",
    variants: [
      "variant: elevated · filled · tonal · outlined · text",
      "color: primary · danger",
      "size: xs · default · sm · md · xl · lg · icon",
      "shape: pill · rounded · square",
      "toggle: binary selection with round-to-square morph",
    ],
    // M3 tabulates buttons twice: "button (elevated)" at level 1 and
    // "buttons (filled, tonal, outlined)" at level 0. kern's `variant` axis
    // covers both rows, so `m3-elevation.ts` permits [0, 1] for this family.
    // The default variant is `filled`, which carries no elevation
    // token and rests at level 0; `elevated` is the one that lifts, and it is
    // recorded in Customization because the strip holds a single value.
    elevation: 0,
  },
  // LinkButton and FocusRing ship on this page's story (customization prose
  // covers both) but are NOT parts: the shared content-api attribution gives
  // every api row to every part, and Button's api names (variant/size/type…)
  // are not in a span wrapper's or an anchor's type — claiming them as parts
  // grows check-props stale rows. One component, one api array.
  parts: ["Button"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover", "focus", "focus / pressed", "disabled"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button when focused. Space activates on key-up, Enter on key-down.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the button. Disabled buttons are skipped in the tab order.",
    },
  ],
  aria: [
    'Every button exposes the `button` role — natively on `<button>`, explicitly as `role="link"` on the `href` anchor variant.',
    "A blocked button reports `aria-disabled`; a blocked link also drops `href` and leaves the tab order, following the ListItem convention.",
    "A loading button reports `aria-busy` alongside the disabled state, so assistive tech announces the wait.",
    'An icon-only button (`size="icon"`) must carry an `aria-label` — without visible text there is nothing to announce.',
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes, so a token-backed utility overrides the variant rather than fighting it.",
      "`variant`, `color`, `size` and `shape` are the four axes; all are optional and all have defaults. `block` stretches the button full width.",
      "`loading` swaps in the embedded progress indicator (`loadingValue` for determinate 0–1, `loaderStyle` for the indicator style), marks `aria-busy` and blocks interaction until it clears.",
      "`href` renders an anchor wearing the button treatment — that is `LinkButton`'s whole implementation, a bridge with a required `href` and no `asChild`. A blocked link drops `href`, leaves the tab order and reports `aria-disabled`.",
      "`icon` renders beside the label with the `gap-2` M3 spacing; `iconPosition` chooses the side. Placement is order, not margin — the pair is flex content with a `gap`, so RTL flips it with nothing to mirror.",
      "The cursor is part of the contract: `pointer` on every live button, `not-allowed` under `disabled` or `aria-disabled`. A busy or blocked control never shows the hand.",
      "Color comes from the system roles — `--sys-color-primary`, `--sys-color-on-primary` — so a theme changes every button at once.",
    ],
    notSupported: [
      "Height is not a prop. The five sizes map to fixed heights (`xs` compacts into the `sm` band, `xl` steps into `lg`), so a custom height needs `className` on the whole button. Every size keeps a minimum touch target through the extended hit area.",
      "Resting elevation is not a prop. `elevated` is the one variant that lifts, to `--sys-elevation-level1`; the other four sit on the surface and carry no token.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"elevated" | "filled" | "tonal" | "outlined" | "text"',
      default: '"filled"',
      note: 'M3\'s five color configurations. There is no sixth: an error action is `color="danger"` on any of the five.',
    },
    {
      name: "color",
      type: '"primary" | "danger"',
      default: '"filled"',
      note: "The error treatment, not a variant. `danger` re-paints the variant's structure in the error roles; `primary` adds no classes.",
    },
    {
      name: "size",
      type: '"xs" | "default" | "sm" | "md" | "xl" | "lg" | "icon"',
      default: '"default"',
      note: "`icon` is square and expects an icon plus an `aria-label`; a text label inside `icon` is a bug. Sizes step through the `kern.button.size` scale (`default` is the small step); icons come from the icon-size role, sized against the label.",
    },
    {
      name: "shape",
      type: '"pill" | "rounded" | "square"',
      default: '"pill"',
      note: "M3 round (`pill`, corner-full) or square, where each size resolves its corner from the shape scale; `rounded` is the Kern step-down corner. Pressed and selected morph toward square within that same scale.",
    },
    {
      name: "toggle",
      type: "boolean",
      default: "false",
      note: "Renders an M3 Expressive toggle: binary selection with round-to-square morph, per-variant selected colors, and `aria-pressed`. No toggle text button — `text` warns and renders unselected.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "Controlled selected state. Only meaningful with `toggle`.",
    },
    {
      name: "defaultPressed",
      type: "boolean",
      default: "false",
      note: "Initial selected state for the uncontrolled toggle case.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean) => void",
      note: "Fires when toggle selection changes.",
    },
    {
      name: "softDisabled",
      type: "boolean",
      default: "false",
      note: "Paints disabled but stays focusable for toolbar discoverability (W3C APG). Reports `aria-disabled`, keeps its tab stop.",
    },
    {
      name: "flipIcon",
      type: "boolean",
      default: "false",
      note: "Mirrors the icon in RTL. Opt in for directional glyphs only; symmetric icons must not flip.",
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
      note: 'Renders beside the label with the `gap-2` M3 spacing, hidden from assistive tech. An icon-only button is `size="icon"` plus an `aria-label`, not a text label.',
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
    {
      name: "disabled",
      type: "boolean | undefined",
      note: "Disabled treatment for either branch — button or anchor. On the link branch it drops `href`, leaves the tab order and reports `aria-disabled`; there is no native `disabled` on an `<a>` to lean on.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the root node in both branches. Opt-in only — no default. See `parity/testid-contract.md`.",
    },
    {
      name: "value",
      type: "undefined",
      note: "Absent by type on the link branch: button submission attributes have no meaning on an `<a>`. (Toggle state uses `pressed`; `value` stays the form value on the button branch.)",
    },
  ],
};
