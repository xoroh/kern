import type { ComponentDoc } from "../types";

export const avatar: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  oneLiner:
    "Avatars show who something belongs to, as an image or as initials.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Avatar",
    // No variant axis. The size axis is dimensions, not treatment.
    variants: ["size: sm · default · lg"],
    elevation: "surface",
  },
  parts: ["Avatar", "AvatarRoot", "AvatarImage", "AvatarFallback"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // Presentational BY CONSTRUCTION: the avatar is a frame with an image and a
  // fallback. It takes no focus, handles no key and exposes no state of its
  // own. A host that makes an avatar a link owns that link's contract — the
  // avatar does not bring one with it. So there is no keyboard contract to
  // write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "`size` on the root selects one of the three dimensions, so a row of avatars lines up without the caller measuring anything.",
      "The frame is a full round corner, so any image is clipped to the same shape.",
    ],
    notSupported: [
      "There is no `shape` prop. Avatars are circular; a square portrait is the root's `className`.",
      "There is no `color` or `status` prop. An online indicator is a separate element positioned by the caller, not part of the avatar.",
      "There is no `fallbackText` prop that generates initials for you. The fallback's content is the caller's, which is also where the localisation of initials belongs.",
    ],
  },
  api: [
    {
      name: "size",
      for: ["AvatarRoot"],
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      note: "One of three fixed dimensions. Note the names are `sm`, `default` and `lg` — not `medium` or `large`.",
    },
    {
      name: "src",
      for: ["AvatarImage"],
      type: "string",
      note: "On `AvatarImage`: the image URL. It renders only once loaded, so a slow or missing image falls through to the fallback rather than flashing a broken frame.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `AvatarFallback`: what shows instead of the image. Supply it always — an avatar with no fallback is an empty circle for anyone without a photo.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLSpanElement>",
      note: "Forwarded to the underlying root.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `AvatarRootState` on the root, `AvatarImageState` on the image, `AvatarFallbackState` on the fallback.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "keepMounted",
      for: ["AvatarImage"],
      type: "boolean | undefined",
      note: 'Whether the image stays mounted and loads in place instead of preloading. For `loading="lazy"` and optimized image components.',
    },
    {
      name: "onLoadingStatusChange",
      for: ["AvatarImage"],
      type: "((status: ImageLoadingStatus) => void) | undefined",
      note: "Fires when the image loading status changes. Where the fallback handoff observes without owning state.",
    },
    {
      name: "delay",
      for: ["AvatarFallback"],
      type: "number | undefined",
      note: "Milliseconds to wait before showing the fallback. Hides the flash on fast loads.",
    },
  ],
  aria: [
    "The avatar is decorative when the person's name is already next to it, and should be hidden from assistive tech in that case — otherwise the name is announced twice.",
    "When the avatar is the only identifier, it needs a name of its own; the image cannot carry one.",
    "`AvatarFallback` content is what a screen reader reaches when there is no image, so initials there are read rather than skipped.",
  ],
};
