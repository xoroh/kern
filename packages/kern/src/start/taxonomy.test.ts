/**
 * R2 taxonomy, re-homed (T1): one taxonomy — `scaffolds/` (app frames),
 * `blocks/` (top-app-bar, search, status), `marketing/` (hero, top bar,
 * footer), `panes/` (content splits), and `navigation/` (rail/drawer).
 * `src/start/` carries these composition layers as modules (plus `link` and
 * `top-app-bar`); components stay in `src/components/`.
 *
 * This pins the barrel: the four taxonomy modules must stay importable
 * from `@xoroh/kern/start`. A layer that stops being exported fails here.
 */
import { describe, expect, it } from "vitest";
import * as blocks from "./blocks";
import * as marketing from "./marketing";
import * as navigation from "./navigation";
import * as panes from "./panes";
import * as scaffolds from "./scaffolds";

describe("start taxonomy barrel", () => {
  it("exports the composition layers", () => {
    for (const [name, mod] of Object.entries({
      blocks,
      marketing,
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
