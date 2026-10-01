import {
  Banner,
  BootSplash,
  ListItem,
  NavigationBar,
  type NavigationDestination,
  NavigationDrawer,
  SecondaryTabs,
  Snackbar,
  SupportingPane,
  Text,
  TopAppBar,
  TopAppBarAction,
} from "@xoroh/kern-native";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import {
  ShowcaseScroll,
  ShowcaseSection,
  ThemeSwitcher,
} from "./showcase-theme";

/**
 * The app shell screen: top app bar + drawer + bottom navigation bar + a
 * list-detail body, plus the live theme switcher. This is the shape an app
 * shell compiles against when only the seam props change.
 */

const DESTINATIONS: NavigationDestination[] = [
  { key: "board", label: "Board" },
  { key: "trips", label: "Trips" },
  { key: "fleet", label: "Fleet" },
  { key: "settings", label: "Settings" },
];

export function ShellScreen() {
  const [destination, setDestination] = useState("board");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState("open");
  const [snack, setSnack] = useState(false);
  const { width } = useWindowDimensions();
  const wide = width >= 600;

  const body = (
    <SecondaryTabs
      tabs={[
        {
          value: "open",
          label: "Open",
          content: (
            <View style={{ gap: 2 }}>
              <ListItem title="Trip 42" supporting="In progress" />
              <ListItem title="Trip 43" supporting="Assigned" />
              <ListItem title="Trip 44" supporting="Unassigned" />
            </View>
          ),
        },
        {
          value: "closed",
          label: "Closed",
          content: <Text>Nothing closed today.</Text>,
        },
      ]}
      value={tab}
      onValueChange={setTab}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar
        title={DESTINATIONS.find((d) => d.key === destination)?.label ?? "Kern"}
        size="small"
        leading={
          <TopAppBarAction
            label="Open navigation"
            onPress={() => setDrawerOpen(true)}
          >
            <Text variant="label">☰</Text>
          </TopAppBarAction>
        }
        trailing={
          <TopAppBarAction label="Assign trip" onPress={() => setSnack(true)}>
            <Text variant="label">＋</Text>
          </TopAppBarAction>
        }
      />

      {wide ? (
        <SupportingPane
          supporting={
            <View style={{ padding: 16, gap: 8 }}>
              <Text variant="title">Inspector</Text>
              <Text>Wide layouts keep a supporting pane beside the body.</Text>
            </View>
          }
          currentWidth={width}
        >
          {body}
        </SupportingPane>
      ) : (
        body
      )}

      <NavigationBar
        destinations={DESTINATIONS}
        value={destination}
        onValueChange={setDestination}
      />

      <NavigationDrawer
        open={drawerOpen}
        title="Kern"
        subtitle="Native showcase"
        destinations={DESTINATIONS}
        value={destination}
        onValueChange={setDestination}
        onDismiss={() => setDrawerOpen(false)}
        footer={
          <View style={{ padding: 16 }}>
            <Banner variant="info" title="M3 shell">
              One drawer, one navigation bar, never both.
            </Banner>
          </View>
        }
      />

      {snack ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 96 }}>
          <Snackbar
            visible
            message="Trip 44 assigned"
            actionLabel="Undo"
            onAction={() => setSnack(false)}
            onDismiss={() => setSnack(false)}
          />
        </View>
      ) : null}
    </View>
  );
}

export function ThemeScreen() {
  return (
    <ShowcaseScroll>
      <ShowcaseSection title="Theme">
        <ThemeSwitcher />
      </ShowcaseSection>
      <ShowcaseSection title="Boot">
        <View style={{ height: 220 }}>
          <BootSplash
            milestones="Auth|Organisation|Workspace"
            currentMilestone={1}
          />
        </View>
      </ShowcaseSection>
    </ShowcaseScroll>
  );
}
