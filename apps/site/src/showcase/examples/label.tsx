import { Input, Label } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Label examples — the text that names a control.
 *
 * A visible label is not decoration: it is how anyone who cannot see the
 * placeholder, or who has already typed past it, knows what the control is
 * for. `htmlFor` is what makes it a name rather than a caption.
 */
export const LABEL_EXAMPLES: ExampleSpec[] = [
  {
    id: "label-naming",
    title: "A label is a name, not a caption",
    description:
      "`htmlFor` points at the control's id, and that association is what makes the label name something. A label with no association is text sitting near a box.",
    render: () => (
      <div className="flex w-full max-w-xs flex-col gap-1">
        <Label htmlFor="kern-label-example">Email address</Label>
        <Input
          id="kern-label-example"
          type="email"
          placeholder="you@example.com"
        />
      </div>
    ),
    code: `<Label htmlFor="kern-label-example">Email address</Label>
<Input id="kern-label-example" type="email" placeholder="you@example.com" />`,
  },
];
