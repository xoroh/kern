import { Button, ButtonGroup } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Button group examples — the joined row.
 *
 * The group is LAYOUT: it is a `role="group"` wrapper that takes no focus and
 * answers no key. The buttons inside it are the tab stops. So the example has
 * to show the join — connected (one control) against standard (individuals) —
 * because that is the only decision the group makes.
 *
 * WEB composition. The native button group is a React Native view with the
 * same two variants; the mobile page carries its own live demo.
 */
export const BUTTON_GROUP_EXAMPLES: ExampleSpec[] = [
  {
    id: "button-group-joined-row",
    title: "Two ways to sit side by side",
    description:
      "`connected` joins the buttons into one control — the expressive successor to the segmented button. `standard` spaces them as individuals. Either way the children keep their own `variant`, so the group decides the join and the buttons decide the emphasis.",
    render: () => (
      <div className="flex flex-col items-start gap-4">
        <ButtonGroup variant="connected" aria-label="Text style">
          <Button variant="outlined">Bold</Button>
          <Button variant="outlined">Italic</Button>
        </ButtonGroup>
        <ButtonGroup variant="standard" aria-label="Text style">
          <Button variant="outlined">Bold</Button>
          <Button variant="outlined">Italic</Button>
        </ButtonGroup>
      </div>
    ),
    code: `<ButtonGroup variant="connected" aria-label="Text style">
  <Button variant="outlined">Bold</Button>
  <Button variant="outlined">Italic</Button>
</ButtonGroup>`,
  },
];
