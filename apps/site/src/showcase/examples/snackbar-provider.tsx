import {
  Button,
  SnackbarProvider,
  SnackbarViewport,
  useSnackbar,
} from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Snackbar provider examples — the queue and the viewport that paints it.
 *
 * NATIVE-ONLY shape: the native snackbar is a provider plus a viewport, and
 * the fence declares the package it imports from — without that, the copyable
 * export would resolve the fence's tags against the web barrel, which has no
 * native-only `SnackbarProvider`, and hand the reader a module that cannot
 * compile.
 */
function SnackbarQueue() {
  const snackbar = useSnackbar();
  return (
    <>
      <Button
        variant="tonal"
        onPress={() => snackbar.add({ message: "Saved" })}
      >
        Show snackbar
      </Button>
      <SnackbarViewport />
    </>
  );
}

export const SNACKBAR_PROVIDER_EXAMPLES: ExampleSpec[] = [
  {
    id: "snackbar-provider-queue",
    title: "One provider, one queue, one viewport",
    description:
      "The provider owns the queue and the viewport paints it, so a message queued from anywhere under the provider shows in one place. Queueing goes through `useSnackbar()` — a hook, so the snippet shows the pair that has to be there and the call that fills it.",
    render: () => (
      <SnackbarProvider>
        <SnackbarQueue />
      </SnackbarProvider>
    ),
    code: `<SnackbarProvider>
  <SnackbarViewport />
</SnackbarProvider>`,
    package: "@xoroh/kern-native",
  },
];
