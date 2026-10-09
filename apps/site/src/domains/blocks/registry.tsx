/**
 * The block registry — entry data → a live render + its real source.
 *
 * `BLOCKS` (manifest) is the install contract; this module is the site's
 * view of it: each entry wired to its live component and its source text
 * (`?raw`, so the Code tab cannot drift from the file `kern add` vendors).
 * A manifest entry with no wiring here renders its card with the install
 * command and says the preview is not wired — never a silent gap.
 */
import type { ReactNode } from "react";
import { AuthForm } from "../../blocks/auth-form";
import authFormSource from "../../blocks/auth-form.tsx?raw";
import { EmptySearch } from "../../blocks/empty-search";
import emptySearchSource from "../../blocks/empty-search.tsx?raw";
import type { BlockEntry } from "../../blocks/manifest";
import { BLOCKS } from "../../blocks/manifest";
import { SettingsScreen } from "../../blocks/settings-screen";
import settingsScreenSource from "../../blocks/settings-screen.tsx?raw";

export type BlockView = {
  entry: BlockEntry;
  render: () => ReactNode;
  code: string;
};

const RENDERS: Record<string, () => ReactNode> = {
  "settings-screen": () => <SettingsScreen />,
  "auth-form": () => <AuthForm />,
  "empty-search": () => <EmptySearch query="invoices" onClear={() => {}} />,
};

const SOURCES: Record<string, string> = {
  "settings-screen": settingsScreenSource,
  "auth-form": authFormSource,
  "empty-search": emptySearchSource,
};

export const BLOCK_VIEWS: BlockView[] = BLOCKS.map((entry) => ({
  entry,
  render: RENDERS[entry.name] ?? (() => null),
  code: SOURCES[entry.name] ?? "",
}));

export function blockView(name: string): BlockView | undefined {
  return BLOCK_VIEWS.find((view) => view.entry.name === name);
}

/** The shell command that installs a block (Mode 1). */
export function installCommand(name: string): string {
  return `kern add ${name}`;
}
