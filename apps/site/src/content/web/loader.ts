import type { ComponentDoc } from "../types";

export const loader: ComponentDoc = {
  slug: "loader",
  name: "Loader",
  oneLiner:
    "Loaders say something is happening, in the space where it is happening.",
  features:
    "Reach for a loader when work is underway and the person should see where: next to a button that is submitting, inside a card that is fetching, replacing content briefly. The advantage over a spinner in the middle of the screen is placement — a loader sits where the wait is, so there is no question about what is stuck. Keep it small and near the thing it reports on. If the wait is long and its length is knowable, that is progress; if the whole page is unavailable, that is a page loader.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Loader",
    variants: [],
    elevation: "surface",
  },
  parts: ["Loader"],
  customization: {
    supported: [
      "`className` is passed through and merged after the loader's own classes, which is how its size and colour are set.",
      "It is a plain element, so it can sit inline with text or fill a container.",
    ],
    notSupported: [
      "There is no `size` prop. The size is `className`, because the right size depends entirely on where it sits.",
      "There is no `variant` for ring versus dots versus bar. One look.",
      "There is no `label` prop. What is loading is the surrounding content's to say; a bare loader should be hidden from assistive tech.",
    ],
  },
  api: [
    {
      name: "className",
      type: "string",
      note: "Merged after the loader's own classes. This is where size and colour come from.",
    },
    {
      name: "aria-hidden",
      type: "boolean",
      note: "Set it when the loader is purely visual and the surrounding content already says what is happening.",
    },
  ],
  aria: [
    "A loader conveys state visually. Where the surrounding content already says what is loading, the loader should be `aria-hidden` so it is not announced as stray content.",
    "Where it is the only signal, the container needs `aria-busy` — the state is what matters to a screen reader, not the spinning.",
    "It takes no focus and has no name of its own.",
  ],
};
