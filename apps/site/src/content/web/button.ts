import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "Buttons let people carry out an action with a single tap, click or key press.",
  features:
    'Reach for a button when the next step is an action the person intends to take: saving a form, sending a message, opening a dialog. Put one primary action on a screen and give it the primary variant; every lower-emphasis action takes tonal, outlined or ghost so the hierarchy reads at a glance. A button is not a link — if it moves to another place rather than doing something here, use an anchor, or `LinkButton` when the destination should wear the button treatment. Destructive actions have no variant of their own: `color="danger"` re-paints the five variants in the error roles, which keeps the action vocabulary at five instead of six. A busy button keeps its label and reports it: `loading` swaps in the progress indicator and blocks interaction until it clears. Binary choices get `toggle`: the button morphs round to square when selected, swaps to its emphasis pair, and reports `aria-pressed`.',
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/buttons",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "color: primary · danger",
      "size: xs · default · sm · md · xl · lg · icon",
      "shape: pill · rounded · square",
      "toggle: binary selection with round-to-square morph",
    ],
    // M3 tabulates buttons twice: "button (elevated)" at level 1 and
    // "buttons (filled, tonal, outlined)" at level 0. kern's `variant` axis
    // covers both rows, so `m3-elevation.ts` permits [0, 1] for this family.
    // The default variant is `primary` (filled), which carries no elevation
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
  usage: {
    do: [
      "Use filled for important, final actions that complete a flow — Save, Join now, Confirm. It has the most visual impact after the FAB.",
      "Use tonal where a lower-priority button needs slightly more emphasis than an outline gives — `Next` in an onboarding flow.",
      "Use outlined for important actions that aren't the primary one on the screen.",
      "Use text for the lowest-priority actions, especially when presenting multiple options.",
      "Use elevated only when the button needs visual separation from a patterned background — never by default, to prevent shadow creep.",
      'Use `color="danger"` for destructive actions (delete, discard, remove).',
      "Use toggle for binary selections like Save or Favorite — outlined icon unselected, filled icon selected.",
      "Keep toggle labels a similar length in both states so the layout holds.",
      "Use sentence case, 1–3 words, on a single line that never truncates.",
      "Place the icon leading (it flips automatically in RTL); use one icon, never two.",
    ],
    dont: [
      "Don't use a button to navigate — if it moves to another place, use an anchor or `LinkButton`.",
      "Don't stack multiple filled buttons — demote the rest to tonal or outlined.",
      'Don\'t put a text label inside `size="icon"` — icon-only means icon plus `aria-label`.',
      "Don't reach for elevated first — it is a filled tonal with a shadow, reserved for separation cases.",
      "Don't clutter with too many buttons — move low-priority actions to menus or icon buttons.",
      "Don't fix the width narrower than the label or stretch to long flat bars.",
      "Don't vertically stack icon above label or ungroup icon from label.",
      "Don't use toggle text buttons — there is no selected text treatment.",
      "Don't underline text buttons — hyperlinked body text carries links.",
    ],
  },
  tokens: [
    {
      element: "Filled container",
      state: "resting",
      token: "comp.filled-button.container.color",
      value: "--sys-color-primary",
    },
    {
      element: "Filled label",
      state: "resting",
      token: "comp.filled-button.label-text.color",
      value: "--sys-color-on-primary",
    },
    {
      element: "Tonal container",
      state: "resting",
      token: "comp.filled-tonal-button.container.color",
      value: "--sys-color-secondary-container",
    },
    {
      element: "Elevated container",
      state: "resting",
      token: "comp.elevated-button.container.color",
      value: "--sys-color-surface-container-low",
    },
    {
      element: "Elevated container",
      state: "hover",
      token: "sys.elevation.level2",
      value: "level2 (lifts from level1)",
    },
    {
      element: "Outlined border",
      state: "resting",
      token: "comp.outlined-button.outline.color",
      value: "--sys-color-outline",
    },
    {
      element: "Outlined border",
      state: "focus",
      token: "comp.outlined-button.focus.outline.color",
      value: "--sys-color-primary",
    },
    {
      element: "State layer",
      state: "hover",
      token: "sys.state.hover-state-layer-opacity",
      value: "8%",
    },
    {
      element: "State layer",
      state: "focus / pressed",
      token: "sys.state.focus-state-layer-opacity",
      value: "12%",
    },
    {
      element: "Label",
      state: "resting",
      token: "sys.typescale.label-large",
      value: "14px / 20px, 500, 0.1px",
    },
    {
      element: "Container",
      state: "resting",
      token: "sys.shape.corner-full",
      value: "9999px",
    },
    {
      element: "Disabled label",
      state: "disabled",
      token: "comp.button.disabled.label-text.opacity",
      value: "on-surface 38%",
    },
    {
      element: "Disabled container",
      state: "disabled",
      token: "comp.button.disabled.container.opacity",
      value: "on-surface 12%",
    },
  ],
  faq: [
    {
      q: "When do I use ghost vs outlined?",
      a: "Ghost for the lowest-emphasis inline actions (dialog secondary actions, inline list actions). Outlined where a visible boundary helps scanning — grouped actions, forms, toolbars.",
    },
    {
      q: "How does `loading` differ from `disabled`?",
      a: "`loading` shows the progress indicator and reports `aria-busy` while blocking interaction like `disabled`. Use it when the action is in flight; use `disabled` when the action is unavailable.",
    },
    {
      q: "Why does `elevated` lift on hover but `primary` doesn't rest elevated?",
      a: "Per M3: elevated rests at level1 and lifts to level2 on hover; filled rests at level0 and lifts to level1 on hover. The resting shadow is the variant's identity — only hover adds lift.",
    },
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
      type: '"elevated" | "primary" | "tonal" | "outlined" | "ghost"',
      default: '"primary"',
      note: 'M3\'s five color configurations. `filled` and `text` are accepted as aliases for `primary` and `ghost`. There is no sixth: an error action is `color="danger"` on any of the five.',
    },
    {
      name: "color",
      type: '"primary" | "danger"',
      default: '"primary"',
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
      note: "Renders an M3 Expressive toggle: binary selection with round-to-square morph, per-variant selected colors, and `aria-pressed`. No toggle text button — `ghost` warns and renders unselected.",
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
  ],
};
