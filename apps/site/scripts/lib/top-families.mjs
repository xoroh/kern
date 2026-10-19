/**
 * The top-20 depth bar (013/D-DOCS-DEPTH): full pages for the twenty families
 * users land on most, thin-but-correct pages everywhere else.
 *
 * A family is "top" by slug — the same slug on both renderers, because the
 * family page (`/components/m3/<name>`) carries both tabs and the bar
 * applies to each. Shared by check-docs (the gate: every top family carries
 * the full section set on web AND native) and by convention docs (the bar
 * stated in prose). One list, two readers, so the two can never disagree
 * about which families are held to it.
 *
 * FULL means: usage (do + don't), token table, keyboard contract,
 * screen-reader notes (in `aria`), FAQ, and the API table. Anatomy is NOT
 * in the bar — single-part families have nothing to decompose, and an
 * anatomy invented for the gate would be the fabrication class the grammar
 * exists to prevent.
 */

/** The twenty families held to full pages. Sorted, so the gate pins order. */
export const TOP_FAMILIES = [
  "button",
  "card",
  "checkbox",
  "chip",
  "dialog",
  "fab",
  "input",
  "list-item",
  "menu",
  "navigation-bar",
  "search",
  "segmented-button",
  "select",
  "sheet",
  "slider",
  "snackbar",
  "switch",
  "tabs",
  "tooltip",
  "top-app-bar",
];
