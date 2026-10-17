import { Chip } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Chip examples — compact actions, choices and filters.
 *
 * The variant names the job: `assist` acts, `suggestion` offers,
 * `filter` toggles membership. Props mirror the registry demo.
 */
export const CHIP_EXAMPLES: ExampleSpec[] = [
  {
    id: "chip-actions",
    title: "Act, or take a suggestion",
    description:
      "An assist chip does the obvious thing; a suggestion chip offers the next one. Same frame, different intent — the variant is the difference.",
    render: () => (
      <>
        <Chip>Assist chip</Chip>
        <Chip variant="suggestion">Suggestion</Chip>
      </>
    ),
    code: `<Chip>Assist chip</Chip>
<Chip variant="suggestion">Suggestion</Chip>`,
  },
  {
    id: "chip-filter",
    title: "Filters toggle; one starts selected",
    description:
      "Filter chips are the multi-select face: each one holds its own membership. `defaultValue` preselects without taking the control away.",
    render: () => (
      <>
        <Chip variant="filter" defaultValue>
          All
        </Chip>
        <Chip variant="filter">Unread</Chip>
        <Chip variant="filter">Starred</Chip>
      </>
    ),
    code: `<Chip variant="filter" defaultValue>All</Chip>
<Chip variant="filter">Unread</Chip>
<Chip variant="filter">Starred</Chip>`,
  },
];
