import { Search } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Search examples — a labelled search field with a clear control.
 *
 * It is a real `<form>`, so submitting is the browser's own behaviour and
 * `onSearch` needs no wiring. `onSubmit` and `onChange` are STRIPPED from the
 * props the component forwards: `onSearch` and `onValueChange` say what
 * happens, and two names for one thing is how a form ends up firing twice.
 *
 * WEB composition. The native search is a text field with the same two
 * callbacks; the mobile page carries its own live demo.
 */
export const SEARCH_EXAMPLES: ExampleSpec[] = [
  {
    id: "search-form",
    title: "A search landmark that submits on Enter",
    description:
      "The label names the field for assistive technology and the placeholder is separate, so the placeholder can change without the name changing with it.",
    render: () => (
      <div className="w-full max-w-sm">
        <Search
          label="Search projects"
          placeholder="Search projects"
          onSearch={() => {}}
        />
      </div>
    ),
    code: `<Search
  label="Search projects"
  placeholder="Search projects"
  onSearch={() => {}}
/>`,
  },
];
