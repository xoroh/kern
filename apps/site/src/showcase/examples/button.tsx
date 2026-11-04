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
      "Material 3's five, and no more. `elevated`, `filled`, `tonal`, `outlined`, `text` — the axis is emphasis, and it is closed.",
    render: () => (
      <>
        <Button variant="elevated">Elevated</Button>
        <Button variant="filled">Filled</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </>
    ),
    code: `<Button variant="elevated">Elevated</Button>
<Button variant="filled">Filled</Button>
<Button variant="tonal">Tonal</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>`,
  },
  {
    id: "sizes",
    title: "Size is a separate axis",
    description:
      "Sizing is not emphasis. The M3 Expressive ladder spans `sm` (XS), `default` (S), `md` (M), `2xl` (L), and `3xl` (XL), plus `icon` for square icon-only actions.",
    render: () => (
      <>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="md">Medium</Button>
        <Button size="2xl">Large</Button>
        <Button size="icon" aria-label="Add">
          <Icon name="add" />
        </Button>
      </>
    ),
    code: `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="md">Medium</Button>
<Button size="2xl">Large</Button>
<Button size="icon" aria-label="Add"><Icon name="add" /></Button>`,
  },
  {
    id: "error-actions",
    title: 'Destructive actions via color="danger", not a destructive variant',
    description:
      'There is no `variant="destructive"` — the library rejects it. Destructive intent is orthogonal to emphasis and uses `color="danger"` across any variant.',
    render: () => (
      <>
        <Button color="danger">Delete project</Button>
        <Button variant="tonal" color="danger">
          Remove member
        </Button>
        <Button variant="outlined" color="danger">
          Discard draft
        </Button>
      </>
    ),
    code: `<Button color="danger">Delete project</Button>
<Button variant="tonal" color="danger">Remove member</Button>
<Button variant="outlined" color="danger">Discard draft</Button>`,
  },
];
