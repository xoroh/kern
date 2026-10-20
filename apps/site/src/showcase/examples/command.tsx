import { Command } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Command examples — the type-to-filter palette.
 *
 * The rows are DATA on the root (`options`), and the list renders the same
 * set: the filter matches a row's label plus any extra `keywords`, so a
 * palette is a list of options rather than a list of markup.
 */
export const COMMAND_EXAMPLES: ExampleSpec[] = [
  {
    id: "command-palette",
    title: "A palette that filters as you type",
    description:
      "The rows live in `options` on the root, so the set that gets filtered is the set that gets rendered. `shortcut` puts the hint in the row's trailing slot.",
    render: () => (
      <Command.Root
        options={[
          { value: "new", label: "New project", shortcut: "⌘N" },
          { value: "settings", label: "Settings", shortcut: "⌘," },
        ]}
      >
        <Command.Input placeholder="Type a command" />
        <Command.Content>
          <Command.List>
            <Command.Empty>No matching command.</Command.Empty>
            <Command.Item value="new" shortcut="⌘N">
              New project
            </Command.Item>
            <Command.Item value="settings" shortcut="⌘,">
              Settings
            </Command.Item>
          </Command.List>
        </Command.Content>
      </Command.Root>
    ),
    code: `<Command.Root
  options={[
    { value: "new", label: "New project", shortcut: "⌘N" },
    { value: "settings", label: "Settings", shortcut: "⌘," },
  ]}
>
  <Command.Input placeholder="Type a command" />
  <Command.Content>
    <Command.List>
      <Command.Empty>No matching command.</Command.Empty>
      <Command.Item value="new" shortcut="⌘N">New project</Command.Item>
      <Command.Item value="settings" shortcut="⌘,">Settings</Command.Item>
    </Command.List>
  </Command.Content>
</Command.Root>`,
  },
];
