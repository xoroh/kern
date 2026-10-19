import { Separator } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Separator examples — the line between two things, with a role.
 *
 * A separator is not a border: it renders `separator` semantics, so
 * assistive tech announces the division a sighted reader sees. Props
 * mirror the registry demo.
 */
export const SEPARATOR_EXAMPLES: ExampleSpec[] = [
  {
    id: "separator-section",
    title: "Above, a line, below",
    description:
      "Two regions, one announced boundary. The class sizes it; the component supplies the meaning.",
    render: () => (
      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <span>Above</span>
        <Separator className="w-full" />
        <span>Below</span>
      </div>
    ),
    code: `<span>Above</span>
<Separator className="w-full" />
<span>Below</span>`,
  },
];
