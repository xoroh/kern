import { ShapeArt } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Shape art examples — the decorative shape compositions.
 *
 * NATIVE-ONLY export: `ShapeArt` ships in `@xoroh/kern-native` and has no web
 * counterpart to show, so the fence declares the package it imports from —
 * without that, the copyable export would resolve the fence's tags against
 * the web barrel, which exports no `ShapeArt`, and hand the reader a module
 * that cannot compile.
 *
 * The three arrangements are kern's own, and each piece is placed by
 * FRACTION of the composition size, so the mark holds at any size.
 */
export const SHAPE_ART_EXAMPLES: ExampleSpec[] = [
  {
    id: "shape-art-layouts",
    title: "Three arrangements, one mark",
    description:
      "The pieces are placed by fraction of the composition size, not by pixels, so the arrangement holds when it is scaled. It is decoration: it carries no content and nothing in it needs to be announced.",
    render: () => (
      <>
        <ShapeArt layout="scatter" size={120} />
        <ShapeArt layout="stack" size={120} />
        <ShapeArt layout="arch" size={120} />
      </>
    ),
    code: `<ShapeArt layout="scatter" size={120} />
<ShapeArt layout="stack" size={120} />
<ShapeArt layout="arch" size={120} />`,
    package: "@xoroh/kern-native",
  },
];
