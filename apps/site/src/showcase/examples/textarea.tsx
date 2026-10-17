import { Textarea } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Textarea examples — multi-line input with a name.
 *
 * A placeholder is not a name: the accessible label is what remains when
 * the user starts typing. Props mirror the registry demo.
 */
export const TEXTAREA_EXAMPLES: ExampleSpec[] = [
  {
    id: "textarea-message",
    title: "Room for the whole story",
    description:
      "Placeholder hints, the label names. One prop is the difference between a field that introduces itself and one that goes anonymous mid-sentence.",
    render: () => (
      <div className="w-full max-w-sm">
        <Textarea placeholder="Tell us what happened…" aria-label="Message" />
      </div>
    ),
    code: `<Textarea placeholder="Tell us what happened…" aria-label="Message" />`,
  },
];
