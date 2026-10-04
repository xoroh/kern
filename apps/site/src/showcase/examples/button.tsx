import { Button } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import type { ExampleSpec } from "../example";

/**
 * Button examples — the representative page for the Example tier.
 *
 * Button is the right component to scaffold with: its variant axis is the one
 * the library settled after a real migration (five Material 3 variants, and
 * `variant="destructive"` explicitly REJECTED), so the examples carry
 * information the type alone does not.
 */
export const BUTTON_EXAMPLES: ExampleSpec[] = [
  {
    id: "variants",
    title: "The five variants",
    description:
      "Material 3's five, and no more. `elevated`, `primary`, `tonal`, `outlined`, `ghost` — the axis is emphasis, and it is closed.",
    render: () => (
      <>
        <Button variant="elevated">Elevated</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    ),
    code: `<Button variant="elevated">Elevated</Button>
<Button variant="primary">Primary</Button>
<Button variant="tonal">Tonal</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="ghost">Ghost</Button>`,
  },
  {
    id: "sizes",
    title: "Size is a separate axis",
    description:
      "Sizing is not emphasis. `default`, `sm` and `icon` change the box, never which variant you are looking at.",
    render: () => (
      <>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="icon" aria-label="Add">
          <Icon name="add" />
        </Button>
      </>
    ),
    code: `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="icon" aria-label="Add"><Icon name="add" /></Button>`,
  },
  {
    id: "error-actions",
    title: "Destructive actions, without a destructive variant",
    description:
      'There is no `variant="destructive"` — the library rejects it. An irreversible action is a button painted with the error roles, which is why this is a class and not a variant.',
    render: () => (
      <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
        Delete project
      </Button>
    ),
    code: `<Button
  className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90"
>
  Delete project
</Button>`,
  },
];
