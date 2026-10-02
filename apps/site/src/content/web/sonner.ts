import type { ComponentDoc } from "../types";

export const sonner: ComponentDoc = {
  slug: "sonner",
  name: "Sonner",
  oneLiner:
    "Sonner raises transient messages with an intent — it worked, watch out, here is a problem — and an optional action.",
  features:
    "Reach for sonner when the outcome has a tone the person needs to register: a build failed, a payment went through, a change needs attention. It is a snackbar with an opinion — the same transient, non-interrupting behaviour, plus an intent that colours it and drives the leading icon. Use `promise` for something asynchronous and it swaps the message for you when the work resolves or rejects, which is the case that otherwise needs three hand-written states. Reach for a plain snackbar when there is nothing to distinguish; reach for a dialog when someone must act before continuing.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Sonner`. Its transient feedback is `Snackbar`, which has
    // no intent axis. Recorded in docs/parity-contract.md as a real coverage
    // asymmetry rather than disguised by pointing at Snackbar.
    nativePeer: "none",
    // The intent axis — info, success, warning, error. See Deviations: it is
    // backed by kern's status roles, not by M3's.
    variants: ["intent: info · success · warning · error"],
    // kern's own decision. M3's component elevation table names no sonner. The
    // surface ships `--md-sys-elevation-level2` and the choice is registered
    // as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "Sonner",
    "SonnerProvider",
    "SonnerViewport",
    "SonnerList",
    "SonnerRoot",
    "SonnerTitle",
    "SonnerDescription",
    "SonnerAction",
    "SonnerClose",
    // `createSonnerManager` is public API but NOT a component — the registry is
    // component-only by design. It is documented under /docs/api instead of
    // being claimed as a part here.
  ],
  deviations: [
    {
      id: "K2",
      spec: "Material 3 defines one semantic feedback pair — error, on-error, error-container, on-error-container. It has no success, warning or info colour roles at all.",
      kern: "Sonner takes four intents — info, success, warning and error — backed by kern's twelve status roles.",
      why: "Tone is the whole reason to reach for sonner rather than a snackbar. A system with only 'error' cannot say 'it worked' or 'watch out', which are the two outcomes people most often need to distinguish. The status roles are registered as K2 in the role inventory, so the extension is a declared addition to the role space rather than a silent fork of it. This is the same deviation Banner carries; it shows up here because Sonner's intent axis is built on it.",
    },
    {
      id: "K6",
      spec: "M3's component elevation table names no sonner and no toast. Menus and tooltips are tabulated at level 2, dialogs at level 3, and no row describes transient feedback.",
      kern: "The sonner surface rests at elevation level 2.",
      why: "A message has to clear the content it sits over without reaching dialog height. Level 2 places it with the other transient overlays, matching `Snackbar`. Registered as K6 in the elevation inventory so the level is a recorded decision rather than a value in a stylesheet.",
    },
  ],
  anatomy: [
    // `createSonnerManager` is the factory this family is wired with. It is
    // public API but not a component, so it is documented under /docs/api
    // rather than listed as an anatomical part.
    {
      name: "SonnerProvider",
      role: "Mounts the manager into the tree. Takes the `toastManager` from `createSonnerManager` — see the API reference.",
    },
    { name: "SonnerViewport", role: "Where messages appear on screen." },
    { name: "SonnerList", role: "The stack of currently visible messages." },
    {
      name: "SonnerRoot",
      role: "One message. Carries the `intent` that gives it its tone.",
    },
    { name: "SonnerTitle", role: "The headline." },
    { name: "SonnerDescription", role: "The supporting line." },
    { name: "SonnerAction", role: "The single action offered." },
    { name: "SonnerClose", role: "Dismisses it early." },
    { name: "Sonner", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "`intent` picks the tone, and drives both the leading icon slot and the accent border role.",
      "The surface is the inverse surface, with an accent bar along one edge — so the tone is legible even in monochrome, not only through colour.",
    ],
    notSupported: [
      "There is no `variant` prop alongside `intent`. The intent IS the axis; a second one would split the same meaning.",
      "There is no `position` prop on the surface. Where messages appear is the viewport's business.",
      "There is no `dismissible` boolean. A message with no close control would need a timeout, and a message nobody can clear is a trap.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "intent",
      type: '"info" | "success" | "warning" | "error"',
      note: "On `SonnerRoot`, and implied by the `info`/`success`/`warning`/`error` methods on the API. Drives the icon slot and the accent role — see Deviations.",
    },
    {
      name: "timeout",
      type: "number",
      note: "Milliseconds before auto-dismiss. `0` keeps it on screen until it is dismissed deliberately, which is the right value for anything that needs reading.",
    },
    {
      name: "action",
      type: "{ label: string; onClick: () => void }",
      note: "One action, on the message. `label` is what is shown; the button's own name follows it.",
    },
    {
      name: "show",
      type: "(message: SonnerMessage) => string",
      note: "Raises a message and returns its id, so it can be dismissed later. The generic form of the intent-specific methods.",
    },
    {
      name: "promise",
      type: "(promise, { loading, success, error }) => Promise",
      note: "Raises the loading message and swaps it for the success or error one when the promise settles. Returns the original promise, so it composes with the call it wraps. This is the case that otherwise needs three hand-written states.",
    },
    {
      name: "dismiss",
      type: "(id?: string) => void",
      note: "Dismisses one message by id, or all of them when called with nothing.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    "A message announces itself when it appears, so an outcome reaches someone who is not looking at it.",
    "It does not move focus — transient feedback stays non-interrupting, and the content behind it remains operable.",
    "The action and the close control are real buttons with their own names, reachable by keyboard while the message is up.",
    "Because it dismisses itself, it must never carry information that is only available there. `timeout: 0` keeps it up when the text genuinely needs reading.",
  ],
};
