import { MenuGroupList } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * MenuGroupList examples — actions under their headings.
 *
 * The groups are DATA, so the list is a declaration rather than markup, and
 * the same data feeds the inline menu screen and the menu sheet. A heading
 * is what makes a run of rows read as groups rather than as one long column
 * of text.
 */
export const MENU_GROUP_LIST_EXAMPLES: ExampleSpec[] = [
  {
    id: "menu-group-list-groups",
    title: "Actions under their headings",
    description:
      "An action carries its label and an optional supporting line, so the row is readable without its icon. The `key` is identity for tests and analytics — it is never shown and never announced.",
    render: () => (
      <MenuGroupList
        groups={[
          {
            heading: "Account",
            actions: [
              { key: "profile", label: "Profile" },
              { key: "sign-out", label: "Sign out" },
            ],
          },
          {
            heading: "Support",
            actions: [{ key: "help", label: "Help centre" }],
          },
        ]}
      />
    ),
    code: `<MenuGroupList
  groups={[
    {
      heading: "Account",
      actions: [
        { key: "profile", label: "Profile" },
        { key: "sign-out", label: "Sign out" },
      ],
    },
    {
      heading: "Support",
      actions: [{ key: "help", label: "Help centre" }],
    },
  ]}
/>`,
    package: "@xoroh/kern-native",
  },
];
