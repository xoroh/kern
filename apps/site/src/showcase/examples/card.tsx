import { Button, Card } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Card examples — the three M3 container treatments on medium corners.
 */
export const CARD_EXAMPLES: ExampleSpec[] = [
  {
    id: "card-treatments",
    title: "The three treatments",
    description:
      "`filled` floats on surface-container-highest, `outlined` draws the outline-variant boundary, `elevated` lifts to level 1. All three sit on medium corners.",
    render: () => (
      <>
        <Card variant="filled" style={{ padding: 16 }}>
          Filled
        </Card>
        <Card variant="outlined" style={{ padding: 16 }}>
          Outlined
        </Card>
        <Card variant="elevated" style={{ padding: 16 }}>
          Elevated
        </Card>
      </>
    ),
    code: `<Card variant="filled">Filled</Card>
<Card variant="outlined">Outlined</Card>
<Card variant="elevated">Elevated</Card>`,
  },
  {
    id: "card-actions",
    title: "Content with actions",
    description:
      "The card owns the container; content and actions compose inside it. No action slots are built in.",
    render: () => (
      <Card variant="filled" style={{ padding: 16 }}>
        <p style={{ margin: 0 }}>Website relaunch</p>
        <p style={{ margin: "4px 0 12px" }}>Due Friday.</p>
        <Button variant="tonal">Open</Button>
      </Card>
    ),
    code: `<Card variant="filled">
  <p>Website relaunch</p>
  <Button variant="tonal">Open</Button>
</Card>`,
  },
];
