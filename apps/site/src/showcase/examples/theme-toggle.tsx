import { ThemeToggle } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * ThemeToggle examples — one action that switches the scheme.
 *
 * The button always names the DESTINATION ("Switch to dark" while the page
 * is light), which is what M3's accessibility guidance asks for: the name
 * says where the press goes, not where the page already is.
 */
export const THEME_TOGGLE_EXAMPLES: ExampleSpec[] = [
  {
    id: "theme-toggle-uncontrolled",
    title: "One button, no props",
    description:
      "With no props the toggle reads and writes the global scheme itself, so it drops into a page that has no theme state of its own.",
    render: () => <ThemeToggle />,
    code: `<ThemeToggle />`,
  },
  {
    id: "theme-toggle-controlled",
    title: "The host owns the mode",
    description:
      "`mode` and `onToggle` make it a controlled control: the host decides what light and dark mean, and the button only reports that the press happened.",
    render: () => <ThemeToggle mode="light" onToggle={() => {}} />,
    code: `<ThemeToggle mode="light" onToggle={() => {}} />`,
  },
];
