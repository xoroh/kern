import { MenuScreen } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Menu screen examples — the inline list of grouped destinations.
 *
 * NOT a menu and NOT a dialog: it is page content, so it takes no scrim, no
 * focus trap and no `aria-modal`. The example has to show that difference,
 * which is why there is no trigger here and no way to dismiss it — there is
 * nothing to dismiss.
 *
 * WEB composition. The native menu screen is a React Native scroll view with
 * the same grouped data; the mobile page carries its own live demo.
 */
export const MENU_SCREEN_EXAMPLES: ExampleSpec[] = [
  {
    id: "menu-screen-destinations",
    title: "A settings page, not a menu",
    description:
      "The screen is a list of lists: `label` names the whole thing and each headed group is named by its heading. There is no selection state — a list that marks where you ARE is a navigation component's job.",
    render: () => (
      <MenuScreen
        label="Settings"
        groups={[
          {
            heading: "Account",
            actions: [
              { key: "profile", label: "Profile" },
              { key: "signout", label: "Sign out", destructive: true },
            ],
          },
        ]}
      />
    ),
    code: `<MenuScreen
  label="Settings"
  groups={[
    {
      heading: "Account",
      actions: [
        { key: "profile", label: "Profile" },
        { key: "signout", label: "Sign out", destructive: true },
      ],
    },
  ]}
/>`,
  },
];
