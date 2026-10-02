import type { ComponentDoc } from "../types";

export const avatar: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  oneLiner:
    "Avatars show who something belongs to, as an image or as initials.",
  features:
    "Reach for an avatar when identity is the thing being conveyed: the author of a comment, the owner of a record, the members of a team. The fallback matters as much as the image — many people have no image, and an empty circle is worse than initials. Size it to the density of what it sits in; a 56-pixel face in a dense table row is a face that pushes the data aside. Do not use an avatar as a button's only content without a label, and do not rely on it to identify someone to a screen reader.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Avatar",
    // No variant axis. The size axis is dimensions, not treatment.
    variants: ["size: sm · default · lg"],
    elevation: "surface",
  },
  parts: ["Avatar", "AvatarRoot", "AvatarImage", "AvatarFallback"],
  anatomy: [
    {
      name: "AvatarRoot",
      role: "The frame. Owns the size and clips whatever is inside to the avatar's shape.",
    },
    {
      name: "AvatarImage",
      role: "The photograph. Renders only once the image has actually loaded.",
    },
    {
      name: "AvatarFallback",
      role: "What shows when there is no image or it has not loaded — initials, an icon, a colour. Without it the avatar is an empty circle.",
    },
    { name: "Avatar", role: "The namespace object: Root, Image and Fallback." },
  ],
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
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      note: "One of three fixed dimensions. Note the names are `sm`, `default` and `lg` — not `medium` or `large`.",
    },
    {
      name: "src",
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
  ],
  aria: [
    "The avatar is decorative when the person's name is already next to it, and should be hidden from assistive tech in that case — otherwise the name is announced twice.",
    "When the avatar is the only identifier, it needs a name of its own; the image cannot carry one.",
    "`AvatarFallback` content is what a screen reader reaches when there is no image, so initials there are read rather than skipped.",
  ],
};
