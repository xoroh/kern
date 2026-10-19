import type { ComponentDoc } from "../types";

export const previewCard: ComponentDoc = {
  slug: "preview-card",
  name: "Preview card",
  oneLiner:
    "Preview cards show a richer look at a link's destination before anyone commits to going there.",
  features:
    "Reach for a preview card when a link leads somewhere worth seeing first: a profile, a document, a product. It fills the gap between a bare link and navigating away — the title and a summary appear beside the trigger, so someone can decide without losing their place. Keep it to what would change the decision to click. It is not a tooltip, which explains a control, and not a popover, which holds controls. If the preview needs to be acted on, that is a popover wearing a different hat.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `PreviewCard`. There is no counterpart surface; the
    // nearest native behaviour is a `BottomSheetPicker`, which is a different
    // surface on a different edge. Recorded in docs/parity-contract.md as a
    // real coverage asymmetry.
    nativePeer: "none",
    // No variant axis. One treatment.
    variants: [],
    // kern's own decision. M3's component elevation table names no preview
    // card. The surface ships `--sys-elevation-level2` and the choice is
    // registered as K6. See Deviations.
    elevation: 2,
  },
  parts: [
    "PreviewCard",
    "PreviewCardRoot",
    "PreviewCardTrigger",
    "PreviewCardContent",
  ],
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table names no preview card. It tabulates rich tooltips at level 2 and menus at level 2, but a tooltip names a control and a menu lists actions — neither describes a preview of a destination.",
      kern: "The preview surface rests at elevation level 2.",
      why: "The card floats above the page beside its trigger, so it needs the same lift as the other anchored overlays at that height. Borrowing the rich-tooltip row would assert that M3 described this surface, which it does not. Registered as K6 in the elevation inventory so the level is a recorded decision.",
    },
  ],
  anatomy: [
    {
      name: "PreviewCardRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "PreviewCardTrigger",
      role: "The link or control the preview describes. Hovering or focusing it opens the card.",
    },
    {
      name: "PreviewCardContent",
      role: "The preview surface. Portals to the end of the document and positions itself against its trigger.",
    },
    {
      name: "PreviewCard",
      role: "The namespace object: Root, Trigger and Content.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The surface is `--sys-color-surface` with an outline and a level-2 lift, so it reads as hovering beside its trigger rather than sitting in the page.",
      "What goes inside `PreviewCardContent` is entirely the caller's — the component supplies the surface and the behaviour, not the layout of the preview.",
    ],
    notSupported: [
      "There is no `title` or `description` prop. The content is yours to compose; this is a surface with timing, not a fixed card.",
      "There is no `placement` or `side` prop. The card is positioned against its trigger.",
      "There is no `delay` prop. The open timing is the primitive's.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "open",
      for: ["PreviewCardRoot"],
      type: "boolean",
      note: "Controlled open state on `PreviewCardRoot`. Omit for uncontrolled — the usual case, since a preview is driven by hover and focus.",
    },
    {
      name: "onOpenChange",
      for: ["PreviewCardRoot"],
      type: "(open: boolean) => void",
      note: "Fires on every open and close, including Escape.",
    },
    {
      name: "className",
      for: ["PreviewCardTrigger", "PreviewCardContent"],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `PreviewCardContent`: whatever the preview shows. The component does not impose a layout on it.",
    },
    {
      name: "defaultOpen",
      for: ["PreviewCardRoot"],
      type: "boolean | undefined",
      note: "Whether the preview starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["PreviewCardRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "actionsRef",
      for: ["PreviewCardRoot"],
      type: "RefObject<PreviewCardRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the preview; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "handle",
      for: ["PreviewCardRoot", "PreviewCardTrigger"],
      type: "PreviewCardHandle<unknown> | undefined",
      note: "Associates the preview with a trigger: set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "triggerId",
      for: ["PreviewCardRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the preview answers to. For controlled previews (`open` set); uncontrolled previews need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["PreviewCardRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the preview answers to, for an initially open preview (`defaultOpen` set).",
    },
    {
      name: "payload",
      for: ["PreviewCardTrigger"],
      type: "unknown",
      note: "Data handed to the preview when this trigger opens it.",
    },
    {
      name: "delay",
      for: ["PreviewCardTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before the hovered preview opens.",
    },
    {
      name: "closeDelay",
      for: ["PreviewCardTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing the preview.",
    },
    {
      name: "render",
      for: ["PreviewCardTrigger", "PreviewCardContent"],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "style",
      for: ["PreviewCardTrigger", "PreviewCardContent"],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `PreviewCardTriggerState` on the trigger, `PreviewCardPopupState` on the card.",
    },
  ],
  aria: [
    "The trigger is described by the card's content, so the preview is announced with the link rather than as loose text.",
    "The card opens on keyboard focus as well as hover, so a keyboard user gets the same preview a pointer user does.",
    "Escape dismisses it without moving focus.",
    "A preview is supplementary — it must never be the only place information appears, because it vanishes, and it is unreachable on touch until the trigger is focused.",
  ],
};
