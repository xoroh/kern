/**
 * R2 callback lexicon guard (re-homed): state callbacks obey the lexicon,
 * action callbacks stay on the allowlist.
 *
 * The lexicon:
 * - Selection/value state: `value` + `defaultValue?` + `onValueChange?`.
 *   The R2-era per-component aliases (`index`, `page`, `selected`,
 *   `pressed`-as-value, `collapsed`, `expanded`, `visible`, …) were removed:
 *   no backward compatibility is kept, so an old alias prop is now a type
 *   error, and this guard fails any reintroduction as unregistered.
 * - Overlay visibility: `open` + `defaultOpen?` + `onOpenChange?`.
 * - Action callbacks (`onSelect`, `onSearch`, `onCountryChange`, `onClose`,
 *   `onDismiss`, platform `onPress`/`onClick`) are NOT state and are never
 *   renamed — they live on the allowlist below.
 * - Base UI passthroughs (`onValueChange` with `eventDetails`) are canonical
 *   by construction.
 *
 * Shape guard, not a behavior test: a new `on*Change` prop that is neither
 * canonical, a registered alias, nor an allowlisted action fails with the
 * file named. Comments are stripped first, so prose cannot satisfy it.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Every state pair uses canonical names (`value`/`onValueChange`,
 * `open`/`onOpenChange`); deprecated aliases are listed per file below. */

/**
 * Deprecated aliases, each mapped to the file-relative scope they may appear
 * in plus the canonical partner that must accompany them. Format:
 * "relative/path.tsx:aliasProp" -> ["canonicalPartner", ...allOfThese].
 *
 * Only non-alias entries remain (canonical button/link-button toggle state,
 * the sheet dismiss action, internal parity helpers). Reintroduced aliases
 * fail as unregistered — there is no backward-compat alias inventory.
 */
const REGISTERED_ALIASES: Record<string, string[]> = {
  // Button toggle state uses `pressed` (not `value` — that name is the form
  // value on buttons), so `onPressedChange` is canonical here, not an alias.
  // Native mirrors the same contract.
  "packages/kern/src/components/button.tsx:onPressedChange": ["pressed"],
  "packages/kern-native/src/components/button.tsx:onPressedChange": ["pressed"],
  "packages/kern/src/components/pulse-button.tsx:onPressedChange": ["pressed"],
  "packages/kern-native/src/components/pulse-button.tsx:onPressedChange": [
    "pressed",
  ],
  // Toggle-form controls use `pressed` (not `value`), so `onPressedChange`
  // is canonical here, not an alias.
  "packages/kern/src/components/icon-button.tsx:onPressedChange": ["pressed"],
  "packages/kern-native/src/components/icon-button.tsx:onPressedChange": [
    "pressed",
  ],
  "packages/kern-native/src/components/toggle.tsx:onPressedChange": ["pressed"],
  "packages/kern/src/components/sheet-family.tsx:onClose": [
    "open",
    "onOpenChange",
  ],
  // Binary-state controls use Base UI `checked` names (api-consistency.md
  // §0), so `onCheckedChange` is canonical here, not an alias.
  "packages/kern-native/src/components/switch.tsx:onCheckedChange": ["checked"],
  "packages/kern-native/src/components/checkbox.tsx:onCheckedChange": [
    "checked",
  ],
  "packages/kern-native/src/components/link-button.tsx:onPressedChange": [
    "pressed",
  ],
  "packages/kern-native/src/components/web-parity.tsx:onQueryChange": [
    "value",
    "onValueChange",
  ],
  "packages/kern-native/src/components/web-parity.tsx:onValuesChange": [
    "values",
    "onValuesChange",
  ],
  // `onValueCommitted` fires alongside the canonical pair: blur after typing,
  // stepper/scrub release after stepping. It never stands without `value`,
  // so it registers here rather than as an alias.
  "packages/kern-native/src/components/number-field.tsx:onValueCommitted": [
    "value",
  ],
  // WP2a overlay/picker state pairs: each is a second value-channel beside
  // the canonical `value`/`open` (an overlay carries open-state, a snap
  // index, AND a tab id; a picker carries an option value, a date, AND a
  // time), so collapsing them onto one `value` would collide. Partners
  // accompany each: the controlled prop plus its default.
  "packages/kern/src/components/kern-overlay.tsx:onSnapIndexChange": [
    "snapIndex",
  ],
  "packages/kern-native/src/components/kern-overlay.tsx:onSnapIndexChange": [
    "snapIndex",
  ],
  "packages/kern/src/components/kern-overlay.tsx:onActiveTabChange": [
    "activeTab",
  ],
  "packages/kern-native/src/components/kern-overlay.tsx:onActiveTabChange": [
    "activeTab",
  ],
  "packages/kern/src/components/kern-picker.tsx:onDateChange": ["dateValue"],
  "packages/kern-native/src/components/kern-picker.tsx:onDateChange": [
    "dateValue",
  ],
  "packages/kern/src/components/kern-picker.tsx:onTimeChange": ["timeValue"],
  "packages/kern-native/src/components/kern-picker.tsx:onTimeChange": [
    "timeValue",
  ],
  "packages/kern/src/components/kern-picker.tsx:onMultiSelect": ["multiple"],
  "packages/kern-native/src/components/kern-picker.tsx:onMultiSelect": [
    "multiple",
  ],
  // WP1a list/table/search state pairs: each is a second value-channel beside
  // the canonical `value` (a table carries sort, page, AND selection; a list
  // carries selection AND expansion; a search block carries a query), so
  // collapsing them onto one `value` would collide. Partners accompany each:
  // the controlled prop plus its default.
  "packages/kern/src/components/list.tsx:onSelectedChange": [
    "selectedIds",
    "defaultSelectedIds",
  ],
  "packages/kern-native/src/components/list.tsx:onSelectedChange": [
    "selectedIds",
    "defaultSelectedIds",
  ],
  "packages/kern/src/components/list.tsx:onExpandedChange": [
    "expandedIds",
    "defaultExpandedIds",
  ],
  "packages/kern-native/src/components/list.tsx:onExpandedChange": [
    "expandedIds",
    "defaultExpandedIds",
  ],
  "packages/kern/src/components/data-table.tsx:onSortChange": [
    "sortKey",
    "defaultSortKey",
  ],
  "packages/kern-native/src/components/data-table.tsx:onSortChange": [
    "sortKey",
    "defaultSortKey",
  ],
  "packages/kern/src/components/data-table.tsx:onPageChange": [
    "page",
    "defaultPage",
  ],
  "packages/kern-native/src/components/data-table.tsx:onPageChange": [
    "page",
    "defaultPage",
  ],
  "packages/kern/src/components/data-table.tsx:onSelectedChange": [
    "selectedIds",
    "defaultSelectedIds",
  ],
  "packages/kern-native/src/components/data-table.tsx:onSelectedChange": [
    "selectedIds",
    "defaultSelectedIds",
  ],
  "packages/kern/src/components/search-view.tsx:onQueryChange": [
    "query",
    "defaultQuery",
  ],
  "packages/kern-native/src/components/search-view.tsx:onQueryChange": [
    "query",
    "defaultQuery",
  ],
  "packages/kern/src/components/list-with-search-and-filters.tsx:onQueryChange":
    ["query", "defaultQuery"],
  "packages/kern-native/src/components/list-with-search-and-filters.tsx:onQueryChange":
    ["query", "defaultQuery"],
  // WP2b settings/contact/composer state pairs: each is a second
  // value-channel beside the canonical `value`/`open` (a settings row
  // carries a switch, a segment set, AND a select; a composer carries
  // text, a mode, a schedule, AND an OOO flag; a directory carries a
  // query; an invite carries a role AND a note), so collapsing them onto
  // one `value` would collide. Partners accompany each: the controlled
  // prop plus its default.
  "packages/kern/src/components/kern-settings.tsx:onCheckedChange": [
    "checked",
    "defaultChecked",
  ],
  "packages/kern-native/src/components/kern-settings.tsx:onCheckedChange": [
    "checked",
    "defaultChecked",
  ],
  "packages/kern/src/components/kern-settings.tsx:onSegmentedChange": [
    "segmentedValue",
    "defaultSegmentedValue",
  ],
  "packages/kern-native/src/components/kern-settings.tsx:onSegmentedChange": [
    "segmentedValue",
    "defaultSegmentedValue",
  ],
  "packages/kern/src/components/kern-settings.tsx:onSelectChange": [
    "selectValue",
    "defaultSelectValue",
  ],
  "packages/kern-native/src/components/kern-settings.tsx:onSelectChange": [
    "selectValue",
    "defaultSelectValue",
  ],
  "packages/kern/src/components/kern-contact.tsx:onQueryChange": [
    "query",
    "defaultQuery",
  ],
  "packages/kern-native/src/components/kern-contact.tsx:onQueryChange": [
    "query",
    "defaultQuery",
  ],
  "packages/kern/src/components/kern-composer.tsx:onModeChange": [
    "mode",
    "defaultMode",
  ],
  "packages/kern-native/src/components/kern-composer.tsx:onModeChange": [
    "mode",
    "defaultMode",
  ],
  "packages/kern/src/components/kern-composer.tsx:onScheduledChange": [
    "scheduledFor",
    "defaultScheduledFor",
  ],
  "packages/kern-native/src/components/kern-composer.tsx:onScheduledChange": [
    "scheduledFor",
    "defaultScheduledFor",
  ],
  "packages/kern/src/components/kern-composer.tsx:onOutOfOfficeChange": [
    "outOfOffice",
    "defaultOutOfOffice",
  ],
  "packages/kern-native/src/components/kern-composer.tsx:onOutOfOfficeChange": [
    "outOfOffice",
    "defaultOutOfOffice",
  ],
  "packages/kern/src/components/kern-composer.tsx:onRoleChange": [
    "roleValue",
    "defaultRoleValue",
  ],
  "packages/kern-native/src/components/kern-composer.tsx:onRoleChange": [
    "roleValue",
    "defaultRoleValue",
  ],
  "packages/kern/src/components/kern-composer.tsx:onMessageChange": [
    "messageValue",
    "defaultMessageValue",
  ],
  "packages/kern-native/src/components/kern-composer.tsx:onMessageChange": [
    "messageValue",
    "defaultMessageValue",
  ],
};

/** Action callbacks: state-free by definition, never renamed. */
const ACTION_ALLOWLIST = new Set([
  "onSelect",
  "onSearch",
  "onCountryChange",
  "onClose",
  "onDismiss",
  "onPress",
  "onClick",
  "onError",
  "onComplete",
  "onBack",
  "onConfirm",
  "onCancel",
  "onAction",
  "onToggle",
  // WP1a list/table/search event notifications: state-free by definition, never
  // renamed. `onRowPress`/`onHaptic`/`onOpenFilters`/`onExport`/
  // `onSavedViewSelect` are fire-and-forget events (cf. `onPress`/`onSelect`/
  // `onClose`); `onFiltersChange` is a derived-model notification whose state
  // lives in the controlled `FilterDef[]` (each facet carries canonical
  // `value`/`defaultValue`/`onValueChange`), so it owns no channel itself.
  "onRowPress",
  "onHaptic",
  "onOpenFilters",
  "onExport",
  "onFiltersChange",
  "onSavedViewSelect",
  // WP2b settings/contact/composer event notifications: state-free by
  // definition, never renamed. `onSend`/`onCannedSelect`/`onDismissReply`/
  // `onSaveDraft`/`onDiscardDraft`/`onRemoveAttachment` (composer),
  // `onAccept`/`onDecline` (invite), `onCopy`/`onRevoke`/`onScopeSelect`
  // (share row) are fire-and-forget events (cf. `onPress`/`onSelect`/
  // `onClose`): the state they touch lives in a controlled pair beside
  // them (text/mode/schedule/role/message), so they own no channel.
  "onSend",
  "onCannedSelect",
  "onDismissReply",
  "onSaveDraft",
  "onDiscardDraft",
  "onRemoveAttachment",
  "onAccept",
  "onDecline",
  "onCopy",
  "onRevoke",
  "onScopeSelect",
]);

async function tsxFiles(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "parity") continue;
      await tsxFiles(full, out);
    } else if (
      /\.tsx$/.test(entry.name) &&
      !/\.test\.tsx$/.test(entry.name) &&
      !/\.rntest\.tsx$/.test(entry.name)
    ) {
      out.push(full);
    }
  }
  return out;
}

describe("callback lexicon", () => {
  it("every on*Change/on* state callback is canonical, registered, or action", async () => {
    const offenders: string[] = [];
    const repoRoot = join(HERE, "..", "..", "..");
    for (const pkg of ["packages/kern/src", "packages/kern-native/src"]) {
      for (const full of await tsxFiles(join(repoRoot, pkg))) {
        const rel = full.slice(repoRoot.length + 1);
        const raw = await readFile(full, "utf8");
        const source = raw
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|[^:])\/\/.*$/gm, "$1");
        const props = new Set(
          [...source.matchAll(/(\bon[A-Z]\w*)\?:/g)].map((m) => m[1]),
        );
        // Plain `value`/`open` without `?` (e.g. destructured params) still
        // count as present for the partner check.
        const has = (name: string) =>
          props.has(name) || new RegExp(`\\b${name}\\b`).test(source);
        for (const prop of props) {
          if (ACTION_ALLOWLIST.has(prop)) continue;
          if (prop === "onValueChange") {
            if (!has("value")) offenders.push(`${rel}:${prop} without value`);
            continue;
          }
          if (prop === "onOpenChange") {
            if (!has("open")) offenders.push(`${rel}:${prop} without open`);
            continue;
          }
          const key = `${rel}:${prop}`;
          const partners = REGISTERED_ALIASES[key];
          if (!partners) {
            offenders.push(`${rel}:${prop} unregistered`);
            continue;
          }
          for (const p of partners) {
            if (!has(p)) offenders.push(`${rel}:${prop} missing ${p}`);
          }
        }
      }
    }
    expect(offenders.join("\n")).toBe("");
  });
});
