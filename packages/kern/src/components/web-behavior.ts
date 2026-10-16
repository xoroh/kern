/**
 * Web-only behavior — owned by `@xoroh/kern` (web), never Axis.
 *
 * These two definitions lived in `libs/kern-primitives` and were
 * deliberately NOT transferred: `isPressActivationKey` hardcodes DOM
 * `KeyboardEvent.key` values (web keyboard vocabulary) and
 * `VISUALLY_HIDDEN_STYLE` names CSS properties (`clip`,
 * `whiteSpace`) with no native meaning. They moved here verbatim
 * during the kern-primitives removal so web behavior is preserved
 * without keeping the deleted package alive.
 */

/** Which keyboard keys activate a pressable: Enter and Space only. */
export function isPressActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}

/**
 * The visually-hidden declaration for screen-reader-only content.
 * Fixed values, no tokens: hiding is geometry, never a visual decision.
 */
export const VISUALLY_HIDDEN_STYLE: Readonly<{
  position: "absolute";
  width: 1;
  height: 1;
  padding: 0;
  margin: -1;
  overflow: "hidden";
  clip: "rect(0, 0, 0, 0)";
  whiteSpace: "nowrap";
  borderWidth: 0;
}> = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};
