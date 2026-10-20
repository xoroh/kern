import { Button, NavigationDrawer } from "@xoroh/kern";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * The live demo: the drawer is CONTROLLED, so the open state is the host's.
 * The trigger is a plain button and the drawer's `onOpenChange` reports the
 * state back — one variable, one source of truth.
 */
function NavigationDrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <NavigationDrawer
        open={open}
        onOpenChange={setOpen}
        title="Kern"
        defaultValue="home"
        destinations={[
          { key: "home", label: "Home" },
          { key: "search", label: "Search" },
          { key: "library", label: "Library" },
        ]}
      />
    </>
  );
}

/**
 * Navigation drawer examples — the MODAL destination list.
 *
 * Two behaviours the component owns rather than leaving to the primitive:
 * choosing a destination CLOSES the drawer (a modal drawer that survives the
 * choice that dismissed its reason for being open is a trap), and the panel
 * announces itself as modal so the page behind it is not read as reachable.
 *
 * WEB composition. The native drawer is a React Native `Modal` with the same
 * destination data; the mobile page carries its own live demo.
 */
export const NAVIGATION_DRAWER_EXAMPLES: ExampleSpec[] = [
  {
    id: "navigation-drawer-modal-destinations",
    title: "A destination list that closes when you pick one",
    description:
      "The open state is the host's — `open` and `onOpenChange` are one pair. Choosing a destination reports the selection and closes the drawer in the same step.",
    render: () => <NavigationDrawerDemo />,
    // The copyable form. `open` is the host's state, so a copy starts closed;
    // flip `open` to true, or wire it to your own.
    code: `<NavigationDrawer
  open={false}
  onOpenChange={() => {}}
  title="Kern"
  defaultValue="home"
  destinations={[
    { key: "home", label: "Home" },
    { key: "search", label: "Search" },
    { key: "library", label: "Library" },
  ]}
/>`,
  },
];
