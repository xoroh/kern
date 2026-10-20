import type { ComponentDoc } from "../types";

export const loader: ComponentDoc = {
  slug: "loader",
  name: "Loader",
  oneLiner:
    "Loaders say something is happening, in the space where it is happening.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Loader",
    variants: [],
    elevation: "surface",
  },
  parts: ["Loader"],
  // A spinner is a STATUS, not a control: it takes no focus and handles no
  // keys, so there is no keyboard contract to write. What it announces is
  // the aria contract below.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the loader's own classes, which is how its size and colour are set.",
      "It is a plain element, so it can sit inline with text or fill a container.",
    ],
    notSupported: [
      "The size is `size` (`sm`, `default`, `lg`), and `className` still wins for anything the scale does not cover.",
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
    {
      name: "size",
      type: '"sm" | "default" | "lg" | null | undefined',
      note: "Spinner size. Defaults to `default`.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible label announced while loading. Defaults to “Loading”.",
    },
  ],
  aria: [
    "A loader conveys state visually. Where the surrounding content already says what is loading, the loader should be `aria-hidden` so it is not announced as stray content.",
    "Where it is the only signal, the container needs `aria-busy` — the state is what matters to a screen reader, not the spinning.",
    "It takes no focus and has no name of its own.",
  ],
};
