import { BottomAppBar, Button } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * BottomAppBar examples — the compact-screen action dock: host actions
 * leading, the FAB trailing. Fewer than three destinations, so this is
 * an action dock, never navigation.
 */
export const BOTTOM_APP_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "bottom-app-bar",
    title: "Actions leading, FAB trailing",
    description:
      "The bar docks host controls and positions the FAB — actions plus a FAB alone is this component.",
    render: () => (
      <div className="w-full max-w-xl">
        <BottomAppBar
          label="Trip actions"
          actions={
            <>
              <Button variant="text">Share</Button>
              <Button variant="text">Call</Button>
            </>
          }
          fab={<Button variant="filled">Book</Button>}
        />
      </div>
    ),
    code: `<BottomAppBar
  label="Trip actions"
  actions={<><Button variant="text">Share</Button>…</>}
  fab={<Button variant="filled">Book</Button>}
/>`,
  },
];
