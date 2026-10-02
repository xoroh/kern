import type { ComponentDoc } from "../types";

export const snackbar: ComponentDoc = {
  slug: "snackbar",
  name: "Snackbar",
  oneLiner:
    "Snackbars confirm something happened, briefly, without interrupting what someone is doing.",
  features:
    "Reach for a snackbar when an action completed and the person does not need to do anything about it: a message sent, a setting saved, a file deleted with an undo available. It appears, waits, and leaves. Keep the text to one line and offer at most one action — a snackbar with a decision in it is a dialog that arrived in the wrong shape. If the information has to be read, that is a banner; if it has to be acted on before continuing, that is a dialog.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Snackbar",
    // No variant axis. The inverse-surface treatment is the whole look.
    variants: [],
    // kern's own decision. M3's component elevation table does not name a
    // snackbar. The surface ships `--md-sys-elevation-level2` and the choice is
    // registered as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Snackbar",
    "SnackbarProvider",
    "SnackbarViewport",
    "SnackbarList",
    "SnackbarRoot",
    "SnackbarTitle",
    "SnackbarDescription",
    "SnackbarAction",
    "SnackbarClose",
  ],
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table names no snackbar. It tabulates menus and tooltips at level 2 and dialogs at level 3, but no row describes a transient confirmation.",
      kern: "The snackbar rests at elevation level 2, on the inverse surface.",
      why: "A confirmation has to clear the content it sits over without competing with a dialog above it. Level 2 places it with the other transient overlays. The level is registered as K6 in the elevation inventory so the choice is a recorded decision rather than a value sitting in a stylesheet.",
    },
  ],
  anatomy: [
    {
      name: "SnackbarProvider",
      role: "Holds the queue. Mount once, near the root, so a snackbar can be raised from anywhere.",
    },
    {
      name: "SnackbarViewport",
      role: "Where snackbars appear on screen.",
    },
    {
      name: "SnackbarList",
      role: "The stack of currently visible snackbars.",
    },
    {
      name: "SnackbarRoot",
      role: "One snackbar. Owns its lifetime.",
    },
    { name: "SnackbarTitle", role: "The confirmation line." },
    {
      name: "SnackbarDescription",
      role: "A supporting line, when one is needed.",
    },
    {
      name: "SnackbarAction",
      role: "The one thing someone can do about it — usually undo.",
    },
    { name: "SnackbarClose", role: "Dismisses it early." },
    { name: "Snackbar", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The inverse surface — `--md-sys-color-inverse-surface` on `--md-sys-color-inverse-on-surface` — is what makes it read as floating above the page rather than part of it.",
      "Round corners and height are system tokens, so a theme moves every snackbar at once.",
    ],
    notSupported: [
      "There is no `variant`, `tone` or `intent` prop. A snackbar is a neutral confirmation; if the tone matters, that is `Sonner`, which has an intent axis.",
      "There is no `position` prop on the snackbar itself. Where it appears is the viewport's business.",
      "There is no `duration` prop on the component. How long it stays is the queue's, not the surface's.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility on `SnackbarRoot`. Omit to let the queue manage it.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires when it appears and when it goes, whether by timeout or by being dismissed.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "onClick",
      type: "() => void",
      note: "On `SnackbarAction`: the single thing to do about it. One action only — a snackbar with a choice in it is a dialog in the wrong shape.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On the action or the close control.",
    },
  ],
  aria: [
    "The snackbar announces itself when it appears, so a confirmation reaches someone who is not looking at it.",
    "It does not move focus — that is what makes it non-interrupting. Content behind it stays operable.",
    "The action is a real button with its own name, reachable by keyboard while the snackbar is up.",
    "It dismisses on its own, so it must never carry information that is only available there.",
  ],
};
