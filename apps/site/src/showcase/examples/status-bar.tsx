import { StatusBar } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Status bar examples — the summary strip.
 *
 * NATIVE-ONLY export: `StatusBar` ships in `@xoroh/kern-native` and the web
 * counterpart is a block in the `@xoroh/kern/start` catalog, not this
 * component. So the fence declares the package it imports from — without
 * that, the copyable export would resolve the fence's tags against the web
 * barrel, which exports no `StatusBar`, and hand the reader a module that
 * cannot compile.
 *
 * The strip is a labelled summary landmark: a leading slot, the centered
 * status, a trailing slot. It takes no focus and handles no key, so the
 * example is about the three slots and the name.
 */
export const STATUS_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "status-bar-summary-strip",
    title: "One status, with room either side of it",
    description:
      'The centered child is the status; `leading` and `trailing` are the indicator and action slots. `accessibilityLabel` names the landmark — it defaults to "Status", which is a fact rather than a name wherever the strip means something more specific.',
    package: "@xoroh/kern-native",
    render: () => (
      <StatusBar
        accessibilityLabel="Sync status"
        leading={<span aria-hidden="true">◔</span>}
        trailing={<span aria-hidden="true">⋯</span>}
      >
        Synced
      </StatusBar>
    ),
    code: `<StatusBar
  accessibilityLabel="Sync status"
  leading={<span aria-hidden="true">◔</span>}
  trailing={<span aria-hidden="true">⋯</span>}
>
  Synced
</StatusBar>`,
  },
];
