import { Search } from "@xoroh/kern";
import type { ConfiguratorSpec, ConfigValues } from "../configurator";

/**
 * Search configurator — the twenty-eighth Part-4 configurator (move #31),
 * first submit-and-clear form. One genuine knob: `query` (the starting
 * query — empty, one word, or several; a preset visibly fills the input
 * AND summons the clear button, so one knob drives two stage effects).
 * Everything else the component doc leaves open is app wiring or fixed
 * text: `onSearch`/`onValueChange` are callbacks, `label`/`placeholder`
 * are strings (no text control kind exists), and `onSubmit`/`onChange`
 * are STRIPPED from the form props the type otherwise passes through —
 * passing the usual form handlers will not typecheck, which is the
 * fence's teaching, not a knob. There is no `results` prop: search finds,
 * what it finds is the page's business. The stage remounts by key on the
 * knob so it cannot drift from the fence.
 */
function queryOf(v: ConfigValues): string {
  if (v.query === "tokens") return "tokens";
  if (v.query === "phrase") return "tokens for buttons";
  return "";
}

function rootPropsOf(v: ConfigValues): string {
  const query = queryOf(v);
  return `${query !== "" ? ` defaultValue="${query}"` : ""} label="Docs" onSearch={onSearch}`;
}

export const SEARCH_CONFIGURATOR: ConfiguratorSpec = {
  id: "search-knobs",
  title: "Configure the search",
  description:
    "Starting query, empty or prefilled. A prefilled stage shows the input filled and the clear button present — clearing empties the input, submitting (Enter) hands the query to onSearch. The knob describes the next mount (the stage remounts by key): typing in the live input does not flip it back, so a typed stage with an untouched knob is by design.",
  controls: [
    {
      kind: "select",
      name: "query",
      label: "Query (initial state)",
      options: ["none", "tokens", "phrase"],
      default: "none",
    },
  ],
  render: (v) => (
    <Search
      key={queryOf(v) === "" ? "empty" : queryOf(v)}
      label="Docs"
      defaultValue={queryOf(v) === "" ? undefined : queryOf(v)}
      onSearch={() => {}}
    />
  ),
  code: (v) =>
    `<Search${rootPropsOf(v)} />\n\n// onSearch receives the query on submit (Enter).\n// onSubmit/onChange do NOT exist here — they are stripped from the form\n// props on purpose; wire onSearch and onValueChange instead.`,
};
