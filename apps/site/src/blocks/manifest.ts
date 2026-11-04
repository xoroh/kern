/**
 * The block registry — composed sections, installable as a unit.
 *
 * A block is a real source file under `src/blocks/` composed ONLY from
 * shipped packages (`@xoroh/kern`, `@xoroh/kern/start`, `react`). No block
 * may import site chrome: the file a consumer installs must stand alone.
 * `check-blocks` enforces the shape below (names unique, files on disk,
 * categories from the fixed set, every registry dependency a real barrel
 * export); the CLI reads the same file to resolve `kern add <block>`.
 */
export type BlockCategory =
  | "Auth"
  | "Settings"
  | "Dashboard"
  | "Sidebar"
  | "Billing"
  | "Contacts"
  | "ListDetail";

export const BLOCK_CATEGORIES: readonly BlockCategory[] = [
  "Auth",
  "Settings",
  "Dashboard",
  "Sidebar",
  "Billing",
  "Contacts",
  "ListDetail",
];

export type BlockEntry = {
  /** Install name: `kern add <name>`. Lowercase, hyphenated, unique. */
  name: string;
  /** Human title for the catalog. */
  title: string;
  category: BlockCategory;
  /** One honest paragraph: what it composes and when to reach for it. */
  description: string;
  /** Root source file, relative to `apps/site/src/blocks/`. */
  file: string;
  /** Extra sibling files installed alongside the root (usually none). */
  files: string[];
  /** Kern barrel exports the block renders (checked against the barrel). */
  registryDependencies: string[];
  /** npm packages the block imports (checked against its imports). */
  dependencies: string[];
};

export const BLOCKS: BlockEntry[] = [
  {
    name: "settings-screen",
    title: "Settings screen",
    category: "Settings",
    description:
      "A settings page: labelled rows with supporting text and trailing controls, in a filled card. Reach for it when settings are rows of label plus control.",
    file: "settings-screen.tsx",
    files: [],
    registryDependencies: [
      "Card",
      "Separator",
      "Switch",
      "SettingsRow",
      "ThemeToggle",
    ],
    dependencies: [
      "@xoroh/kern",
      "@xoroh/kern/start",
      "@xoroh/kern-native",
      "react",
    ],
  },
  {
    name: "auth-form",
    title: "Sign-in form",
    category: "Auth",
    description:
      "A sign-in card: labelled email field with helper text, password input, submit action. Reach for it when sign-in is one card, not a page.",
    file: "auth-form.tsx",
    files: [],
    registryDependencies: ["Button", "Card", "Field", "Input"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "empty-search",
    title: "Empty search state",
    category: "Dashboard",
    description:
      "A no-results state: titled empty state with a clear-search action. Reach for it when a search or filter yields nothing.",
    file: "empty-search.tsx",
    files: [],
    registryDependencies: ["Button", "EmptyState"],
    dependencies: ["@xoroh/kern", "react"],
  },
  {
    name: "empty-states",
    title: "Empty states",
    category: "Dashboard",
    description:
      "The three zero-data placements: full page, card section and list row, each with a recovery action. Reach for it when an empty view needs its placement variant, not a new component.",
    file: "empty-states.tsx",
    files: [],
    registryDependencies: ["Button", "EmptyState", "LinkButton"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "billing",
    title: "Billing page",
    category: "Billing",
    description:
      "A billing page: Growth-plan slot with status pill plus a display-only invoice ledger. Reach for it when billing is plan display plus invoice history, never payment actions.",
    file: "billing.tsx",
    files: [],
    registryDependencies: ["BillingPage", "StatusPill"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "dashboard",
    title: "Dashboard page",
    category: "Dashboard",
    description:
      "A dashboard page: stat cards, activity feed and an ops queue table. Reach for it when the page is figures plus feed plus queue.",
    file: "dashboard.tsx",
    files: [],
    registryDependencies: ["DashboardPage", "StatusPill"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "signup",
    title: "Sign-up page",
    category: "Auth",
    description:
      "A sign-up page: name, email and password fields in a filled card with a submit action. Reach for it when sign-up is one card, not a flow.",
    file: "signup.tsx",
    files: [],
    registryDependencies: ["Card", "Field", "Input", "Button"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "otp",
    title: "One-time code",
    category: "Auth",
    description:
      "A one-time code card: six boxed inputs with a verify action that enables at full length. Reach for it for email/SMS code verification.",
    file: "otp.tsx",
    files: [],
    registryDependencies: ["Card", "InputOTP", "Button"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "invite",
    title: "Invite accept",
    category: "Auth",
    description:
      "A workspace invite accept flow: who invited you, which workspace and role, accept and decline. Reach for it when invites arrive out of band.",
    file: "invite.tsx",
    files: [],
    registryDependencies: ["InviteAccept", "Button"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "settings",
    title: "Settings page",
    category: "Settings",
    description:
      "A full settings page: profile, notification and preference preset sections in a sidebar layout. Reach for it when settings need sections, not rows.",
    file: "settings.tsx",
    files: [],
    registryDependencies: ["KernSettingsScreen"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "contacts",
    title: "Contacts directory",
    category: "Contacts",
    description:
      "A searchable contacts directory: inline search over grouped rows with an empty state. Reach for it when people are rows to find and pick.",
    file: "contacts.tsx",
    files: [],
    registryDependencies: ["ContactDirectory"],
    dependencies: ["@xoroh/kern", "@xoroh/kern-native", "react"],
  },
  {
    name: "list-detail",
    title: "List-detail queue",
    category: "ListDetail",
    description:
      "A searchable queue beside its detail pane: filter rows, pick one to read the thread. Reach for it when work is a list of things each with its own detail.",
    file: "list-detail.tsx",
    files: [],
    registryDependencies: [
      "ListDetail",
      "ListItem",
      "Search",
      "EmptyState",
      "Card",
      "StatusPill",
      "Button",
    ],
    dependencies: [
      "@xoroh/kern",
      "@xoroh/kern/start",
      "@xoroh/kern-native",
      "react",
    ],
  },
];
