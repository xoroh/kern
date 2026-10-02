import type { ComponentDoc } from "../types";

export const pageLoader: ComponentDoc = {
  slug: "page-loader",
  name: "Page loader",
  oneLiner:
    "Page loaders are the centred loading surface for a region that is still coming.",
  features:
    "Reach for a page loader when a region's content is not ready and the space should say so rather than sit blank: a route loading, a panel fetching, a report computing. It is centred in its region, which is the difference between it and a `Loader` that sits inline with what it reports on. For the branded full-screen boot moment there is `BootIndicator` instead — a page loader is for a part of the page, not for the app starting up. Keep the label about what is loading rather than that something is loading.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `PageLoader`; its in-region loading surface is `Loader`.
    nativePeer: "none",
    variants: [
      "size: FeedbackSize · tone: FeedbackTone · shapes: FeedbackShapeKind[]",
    ],
    elevation: "surface",
  },
  parts: ["PageLoader"],
  customization: {
    supported: [
      "`size` and `tone` come from the feedback scale, so a page loader matches the rest of the family rather than being sized ad hoc.",
      "`shapes` picks the heritage shape set, and `loaderStyle` picks the indicator — the branded look is data, not a hard-coded illustration.",
      "`tenantId` overrides the brand variant, and an unknown id fails loudly rather than silently falling back to something wrong.",
    ],
    notSupported: [
      "There is no `progress` or `value` prop. This is an indeterminate wait; a measured one is `Progress` or `LinearProgress`.",
      "There is no `fullscreen` prop. Full-screen boot is `BootIndicator`, and mixing the two would blur which one means what.",
      "There is no `overlay` prop. Covering content is the region's layout, not the loader's.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "What is loading. Prefer naming the thing over saying that something is.",
    },
    {
      name: "size",
      type: "FeedbackSize",
      note: "From the feedback scale, so the loader matches the rest of the family instead of being sized ad hoc.",
    },
    {
      name: "tone",
      type: "FeedbackTone",
      note: "From the feedback scale. The surface tone is the default; the inverse tone is the boot look.",
    },
    {
      name: "shapes",
      type: "readonly FeedbackShapeKind[]",
      note: "The heritage shape set the loader is drawn from. Data, not a hard-coded illustration.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "Which indicator to use within the surface.",
    },
    {
      name: "tenantId",
      type: "string",
      note: "Brand variant override. An unknown id FAILS LOUDLY rather than silently falling back — a wrong brand shown quietly is worse than an error.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the loader's own classes.",
    },
  ],
  aria: [
    "The surface announces what is loading through its label; the indicator itself is decoration beside that.",
    "The region should carry `aria-busy` while this is showing, so the state is what a screen reader reports.",
    "It takes no focus and does not announce itself on arrival — a loading state is not an event.",
  ],
};
