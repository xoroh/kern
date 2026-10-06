/**
 * R2 taxonomy, re-homed (T1): one taxonomy — `scaffolds/` (app frames),
 * `blocks/` (top-app-bar, search, status), `panes/` (content splits),
 * `navigation/` (rail/drawer). Ported from the platform fork's R2 series,
 * mapped onto this tree: `src/start/` carries the four layers as modules
 * (plus `link` and `top-app-bar`), components stay in `src/components/`.
 *
 * This pins the barrel: the four taxonomy modules must stay importable
 * from `@xoroh/kern/start`. A layer that stops being exported fails here.
 */
import { describe, expect, it } from "vitest";
import * as blocks from "./blocks";
import * as navigation from "./navigation";
import * as panes from "./panes";
import * as scaffolds from "./scaffolds";

describe("start taxonomy barrel", () => {
  it("exports blocks, navigation, panes, and scaffolds", () => {
    for (const [name, mod] of Object.entries({
      blocks,
      navigation,
      panes,
      scaffolds,
    })) {
      expect(Object.keys(mod).length, name).toBeGreaterThan(0);
    }
  });

  it("exports the TopAppBar size foundation map", async () => {
    const { TOP_APP_BAR_SIZE_TO_KERN_SIZE } = await import("./top-app-bar");
    expect(TOP_APP_BAR_SIZE_TO_KERN_SIZE).toEqual({
      small: "sm",
      medium: "md",
      large: "lg",
    });
  });
});
