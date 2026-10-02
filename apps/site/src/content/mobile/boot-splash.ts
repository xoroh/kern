import type { ComponentDoc } from "../types";

export const bootSplash: ComponentDoc = {
  slug: "boot-splash",
  name: "Boot splash",
  oneLiner:
    "Boot splashes cover the first moment of an app, with your mark and optional milestone steps.",
  features:
    "Reach for a boot splash while the app is getting ready and there is nothing yet to show. It covers the boot and swaps to your content when `ready` turns true — one flag, no timing to manage. The design decision worth knowing is what it does NOT ship: kern has NO brand mark. `mark` is host-owned, so the logo is yours and the splash cannot quietly become someone else's brand. And rather than only a spinner, `milestones` shows named steps with `currentMilestone`, which turns an anonymous wait into a visible sequence.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only. There is no web boot splash — a web app has no native
    // launch moment to cover.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["BootSplash"],
  customization: {
    supported: [
      "`mark` is the brand mark — host-owned, since kern never ships one.",
      "`ready` swaps the splash for `children`, so the transition is one boolean.",
      "`milestones` and `currentMilestone` show named steps instead of a plain spinner.",
    ],
    notSupported: [
      "There is NO bundled brand mark. Kern ships no logo — `mark` is yours, and that is deliberate.",
      "There is no `duration` or auto-hide. The splash leaves when `ready` says so, not on a timer.",
      "There is no `background`/`image` prop. The mark and the steps are the surface.",
    ],
  },
  api: [
    {
      name: "mark",
      type: "ReactNode",
      note: "Host-owned brand mark. KERN NEVER SHIPS ONE — the logo is yours, so the splash cannot quietly become someone else's brand.",
    },
    {
      name: "ready",
      type: "boolean",
      note: "True while booting; false swaps to `children`. One flag, and no timer — the splash leaves when the app is ready, not when a duration expires.",
    },
    {
      name: "milestones / currentMilestone",
      type: "string / number",
      note: "Named steps instead of a plain spinner, which turns an anonymous wait into a visible sequence.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`milestones` are what make the boot SAY where it is rather than only showing motion — a spinner alone is an unmeasured wait with no description.",
    "The mark is decorative unless it is the only identity on screen; if the app has a name, say it in text.",
    "It swaps on `ready` rather than a timer, so the announced transition matches when the app is genuinely usable.",
  ],
};
