/**
 * `@xoroh/kern-primitives` — the un-styled behaviour kernel.
 *
 * ## What belongs here
 *
 * Behaviour that both renderers must implement identically, and that carries no
 * visual decision: controllable state, overlay modality, roving focus, the
 * collection/selection model. `check:primitives` enforces that nothing here
 * reaches for a token.
 *
 * ## The boundary, and why it is a graph rule
 *
 * This package may not import `@xoroh/kern-tokens` or `@xoroh/kern-native`. That
 * is the whole point — a primitive that reads a colour has made a visual
 * decision, and the same source cannot then be the shared kernel for a second
 * renderer.
 *
 * The gate resolves the **transitive** import closure rather than grepping
 * files, and that is not a stylistic preference. During the `SheetSurface` split
 * a theme-coupled helper was placed in `utils/overlay-styles.ts`, which
 * `SheetSurface` already imported. The file being extracted was clean; its
 * dependency graph was not:
 *
 *     sheet-surface  ->  overlay-styles  ->  kern-tokens
 *
 * A per-file grep passes that. A graph walk does not. The gate is written to
 * catch the graph, because the graph is the property.
 *
 * ## Order of extraction
 *
 * 1. this package + the gate, proven by an injected violation
 * 2. `useControllableState` — 21 consumers. It existed as two byte-identical
 *    copies, one per renderer; both now point here.
 * 3. the `SheetSurface` file split (done, `a835466`)
 * 4. surfaces, modality, roving focus, collection/selection
 *
 * Step 1 is this file. The rest follows.
 */

export {
  isSelected,
  normalizeSelection,
  type Selection,
  type SelectionMode,
  toggleSelection,
  useSelection,
} from "./selection";
export { type StateAction, useControllableState } from "./useControllableState";
