import { Snackbar } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Snackbar examples — transient messaging with an action and a dismiss.
 *
 * Self-contained by necessity: the surface consumes its provider, so the
 * example mounts `Snackbar.Provider` itself — the same arrangement the
 * registry demo uses, without which the render throws. Props mirror that
 * demo.
 */
export const SNACKBAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "snackbar-build",
    title: "A queued build, with somewhere to go",
    description:
      "Title, description, one action, one close. The toast object is the whole message; the parts decide which of it shows where.",
    render: () => (
      <Snackbar.Provider>
        <div className="w-full max-w-sm">
          <Snackbar.Root
            toast={{
              id: "build-queued",
              title: "Build queued",
              description: "We will email you when it finishes.",
            }}
          >
            <div className="flex min-w-0 flex-col">
              <Snackbar.Title />
              <Snackbar.Description />
            </div>
            <Snackbar.Action onClick={() => {}}>View</Snackbar.Action>
            <Snackbar.Close />
          </Snackbar.Root>
        </div>
      </Snackbar.Provider>
    ),
    code: `<Snackbar.Provider>
  <Snackbar.Root
    toast={{
      id: "build-queued",
      title: "Build queued",
      description: "We will email you when it finishes.",
    }}
  >
    <Snackbar.Title />
    <Snackbar.Description />
    <Snackbar.Action onClick={() => {}}>View</Snackbar.Action>
    <Snackbar.Close />
  </Snackbar.Root>
</Snackbar.Provider>`,
  },
];
