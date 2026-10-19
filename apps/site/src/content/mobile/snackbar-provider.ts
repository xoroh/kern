import type { ComponentDoc } from "../types";

export const snackbar: ComponentDoc = {
  slug: "snackbar-provider",
  name: "Snackbar",
  oneLiner:
    "Snackbars confirm something happened, briefly, with an optional action to undo it.",
  features:
    "Reach for a snackbar when the result of an action needs confirming and nothing more: a message sent, a setting saved, an item removed. It appears over the content, it says one thing, and it goes away. The optional action is what makes it useful rather than decorative — undo, retry, view — but keep it to one, and keep the action reversible, because a snackbar that disappears is a poor place for a decision. One current API (ADR-020, no compat alias): queue toasts with `useSnackbar()` under a `SnackbarProvider`, paint them with `SnackbarViewport`. There is no single-shot `visible`/`message` component.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart name, checked in the web inventory. The APIs
    // differ by platform (web compound parts vs native Axis-backed queue);
    // the parity contract records the split, it is not a gap.
    nativePeer: "Snackbar",
    variants: [],
    elevation: 3,
  },
  parts: ["SnackbarProvider", "SnackbarViewport"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces politely when it appears; the optional action reads as a button and double-tap runs it, then dismisses.",
    },
  ],
  usage: {
    do: [
      "Confirm exactly one thing — sent, saved, removed — then get out of the way.",
      "Offer at most one reversible action (undo, retry, view); the action fires `onAction` and dismisses in one press.",
      "Wrap the screen (or the app) in one `SnackbarProvider`, render one `SnackbarViewport` where toasts paint, and call `useSnackbar().add()` from anywhere under the provider.",
    ],
    dont: [
      "Don't put decisions in a snackbar — a transient surface is a poor place for a choice; that is a dialog.",
      "Don't stack snackbars without bound — pass `limit` to the viewport, or none of them reads.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "theme.color.inverseSurface",
      value: "inverseSurface, level 3 (elevation 6, iOS quartet)",
    },
    {
      element: "Message",
      state: "resting",
      token: "theme.color.inverseOnSurface",
      value: "inverseOnSurface",
    },
    {
      element: "Action",
      state: "resting",
      token: "theme.color.inversePrimary",
      value: "inversePrimary label button, minHeight 48",
    },
  ],
  faq: [
    {
      q: "Snackbar or dialog?",
      a: "Low importance with an optional reversible action and auto-dismiss means snackbar; a required decision that blocks means dialog. Blocking never belongs in a transient.",
    },
    {
      q: "How long does a toast stay?",
      a: "`duration` per toast, default 4000ms; `0` or less disables auto-dismiss. `dismiss(id)` and `clear()` end them early.",
    },
  ],
  deviations: [
    {
      id: "K11",
      spec: "M3's component elevation table names no snackbar. It tabulates menus and tooltips at level 2 and dialogs at level 3, but no row describes a transient confirmation.",
      kern: "The snackbar rests at elevation level 3 with the iOS shadow quartet — with the other interrupting overlays. Registered as K11 in the kern deviations registry — review-m3 ruled this resting elevation a kern choice, not a transcription of M3, so the citation is the registry rather than a spec row.",
      why: "A confirmation has to clear the content it sits over. Level 3 places it with dialogs rather than one level below the web token; the old style value sat a full level lower, the defect the elevation-parity gate now guards.",
    },
  ],
  customization: {
    supported: [
      "`add({ message, actionLabel, onAction, accessibilityLabel, duration })` queues one toast; the manager also offers `dismiss(id)` and `clear()`.",
      "`SnackbarViewport` takes `testID`, `style` (viewport container) and `limit` (max visible toasts); every queued toast paints with the M3 snackbar surface.",
      "`style` on the queued surface is the exported `snackbarStyles()` if you need the treatment without the component.",
    ],
    notSupported: [
      "There is no `intent` or `tone` variant. A snackbar is neutral confirmation; a status with tone is `Sonner` or `Banner`.",
      "There is no single-shot `visible`/`message` component. Queue via `useSnackbar()` — one current API.",
      "There is one action at most. `actionLabel`/`onAction` are a single pair, not a list.",
    ],
  },
  api: [
    {
      name: "add",
      type: "(options: SnackbarOptions) => string",
      note: "Queues a toast; returns its id for targeted dismissal. `message` is required; `actionLabel`/`onAction` add one optional action; `duration` defaults to 4000ms, `0` disables auto-dismiss.",
    },
    {
      name: "dismiss",
      type: "(id: string) => void",
      note: "Dismisses one queued toast. Unknown ids are a no-op.",
    },
    {
      name: "clear",
      type: "() => void",
      note: "Dismisses every queued toast.",
    },
    {
      name: "limit",
      type: "number",
      note: "On `SnackbarViewport`: max visible toasts; older ones stay queued but unpainted. No limit by default.",
    },
    {
      name: "testID",
      type: "string",
      note: "On `SnackbarViewport`: forwarded to the container; each queued toast reads `<testID>-<id>`.",
    },
  ],
  aria: [
    "`message` is required and is the whole announcement; the surface is brief and so is what it says.",
    "The action is a real pressable with a `label`, so undo is operable and not only visible.",
    "It appears over content and disappears, so anything it offers must be reversible or repeatable — a decision that vanishes is one some people will never get to make.",
  ],
};
