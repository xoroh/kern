import type { ComponentDoc } from "../types";

export const scrollArea: ComponentDoc = {
  slug: "scroll-area",
  name: "Scroll area",
  oneLiner:
    "Scroll areas give a fixed region its own scrollbar, so the page does not scroll away from under the content.",
  features:
    "Reach for a scroll area when a region must stay a certain height while its content runs long: a sidebar, a code panel, a log. The point is that the scrollbar belongs to the region rather than to the page, so the shell around it stays put. Keep the region's height fixed by its surroundings rather than by a magic number where you can. If the whole page should scroll, let the page scroll — a nested scroll region inside a scrolling page is a fight over the wheel.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `ScrollArea`. Platform scrolling is handled by the
    // host's own scroll containers, so this surface has no counterpart.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: [
    "ScrollArea",
    "ScrollAreaRoot",
    "ScrollAreaViewport",
    "ScrollAreaScrollbar",
  ],
  anatomy: [
    {
      name: "ScrollAreaRoot",
      role: "The region. Owns the overflow behaviour and the scrollbar's relationship to it.",
    },
    {
      name: "ScrollAreaViewport",
      role: "The scrolling content. What overflows this is what the scrollbar moves through.",
    },
    {
      name: "ScrollAreaScrollbar",
      role: "The scrollbar itself, drawn against the region rather than the window.",
    },
    {
      name: "ScrollArea",
      role: "The namespace object: Root, Viewport and Scrollbar.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The scrollbar is styled independently of the viewport, so a thin overlay scrollbar does not have to mean thin content padding.",
      "Height and width come from the region's own layout rather than from a prop.",
    ],
    notSupported: [
      "There is no `orientation` prop. Which axis scrolls follows from the content and the region's dimensions.",
      "There is no `scrollbarVisibility` prop. Whether the scrollbar is always drawn or only while scrolling is the scrollbar's `className`.",
      "There is no `type` prop for overlay versus persistent. That is styling on `ScrollAreaScrollbar`, not a component switch.",
    ],
  },
  api: [
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `ScrollAreaViewport`: the content that overflows.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLDivElement>",
      note: "Forwarded to the underlying element. Each part forwards to its own.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `ScrollAreaRootState` on the region, `ScrollAreaViewportState` on the viewport.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
    {
      name: "overflowEdgeThreshold",
      for: ["ScrollAreaRoot"],
      type: "number | Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number; }> | undefined",
      note: "Pixels to scroll past an edge before the overflow attributes apply. One number for all edges, or per-edge.",
    },
  ],
  aria: [
    "The viewport is a real scroll container, so it is keyboard-scrollable when focused and announces its overflow state.",
    "The scrollbar is decorative next to that behaviour — the region's own scrolling is what assistive tech acts on.",
    "Label the region when it is one of several scroll areas on a page, so they are distinguishable.",
    "A nested scroll region inside a scrolling page makes the wheel ambiguous. Prefer one or the other.",
  ],
};
