import { Split } from "@xoroh/kern";
import { T_BODY_SM } from "../../domains/shared/systems/type-scale";
import type { ExampleSpec } from "../example";

/**
 * Split examples — an N-column layout named as one region.
 *
 * The dividers are a hairline GAP over an outline-variant container
 * background, so the background shows through between the columns; a border
 * on each child would put a leading border on the first column and a
 * trailing one on the last, at every column count.
 */
export const SPLIT_EXAMPLES: ExampleSpec[] = [
  {
    id: "split-two-columns",
    title: "Two equal columns, one named region",
    description:
      "`columns` declares the intended shape and `label` names the region, so a screen-reader user can be told what they are entering before they enter it. Every column is an equal share.",
    render: () => (
      <Split columns={2} label="Message list and message">
        <div className={`p-4 ${T_BODY_SM}`}>List</div>
        <div className={`p-4 ${T_BODY_SM}`}>Detail</div>
      </Split>
    ),
    // type-scale-exempt: the class names below are EXAMPLE CODE shown to
    // the reader, not rendered typography. A consumer's own class names are
    // theirs to choose; the rule governs what OUR pages paint.
    code: `<Split columns={2} label="Message list and message">
  <div className="p-4 text-sm">List</div>
  <div className="p-4 text-sm">Detail</div>
</Split>`,
  },
];
