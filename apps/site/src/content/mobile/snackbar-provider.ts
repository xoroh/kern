import type { ComponentDoc } from "../types";

export const snackbar: ComponentDoc = {
  slug: "snackbar-provider",
  name: "Snackbar",
  oneLiner:
    "Snackbars confirm something happened, briefly, with an optional action to undo it.",
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces politely when it appears; the optional action reads as a button and double-tap runs it, then dismisses.",
    },
  ],
  customization: {
    supported: [
      "`add({ message, actionLabel, onAction, accessibilityLabel, duration })` queues one toast; the manager also offers `dismiss(id)` and `clear()`.",
      "`SnackbarViewport` takes `testID`, `style` (viewport container) and `limit` (max visible toasts); every queued toast paints with the M3 snackbar surface.",
      "`style` on the queued surface is the exported `snackbarStyles()` if you need the treatment without the component.",
    ],
    notSupported: [
      "There is no `intent` or `tone` variant. A snackbar is neutral confirmation.",
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
