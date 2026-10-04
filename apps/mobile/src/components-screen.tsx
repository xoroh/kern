import {
  ActionSheet,
  Avatar,
  Badge,
  Banner,
  BottomSheet,
  BottomSheetPicker,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Command,
  CountrySelect,
  EmptyState,
  Fab,
  FieldMessage,
  FieldRoot,
  FilterChipRow,
  Input,
  LinearProgress,
  ListDetail,
  ListItem,
  MilestoneTrio,
  Pane,
  RadioGroup,
  RadioGroupItem,
  SecondaryTabs,
  SegmentedButton,
  ShapeArt,
  Slider,
  Snackbar,
  SuccessTransform,
  Switch,
  Tabs,
  Text,
  Textarea,
  ToggleGroup,
  Toolbar,
  useKernScheme,
} from "@xoroh/kern-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { View } from "react-native";

import { ShowcaseScroll, ShowcaseSection } from "./showcase-theme";

/**
 * The component gallery. Every public primitive and composition block gets a
 * live row, so the showcase is real inventory rather than a mock — this is
 * what the site's mobile section mirrors.
 */

function Row({ children }: { children: ReactNode }) {
  return <View style={{ gap: 8 }}>{children}</View>;
}

export function ComponentsScreen() {
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);
  const [create, setCreate] = useState(false);
  const [command, setCommand] = useState(false);
  const [snack, setSnack] = useState(false);
  const [country, setCountry] = useState("NL");
  const [segment, setSegment] = useState("day");
  const [toggle, setToggle] = useState<string | string[]>(["wifi"]);
  const [checked, setChecked] = useState(false);
  const [push, setPush] = useState(false);
  const [radio, setRadio] = useState("standard");
  const [slider, setSlider] = useState(0.4);
  const [tab, setTab] = useState("all");

  return (
    <ShowcaseScroll>
      <ShowcaseSection title="Actions">
        <Row>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Button onPress={() => setSnack(true)}>Primary</Button>
            <Button variant="tonal">Tonal</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Fab onPress={() => setCreate(true)}>+</Fab>
          </View>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection title="Selection">
        <Row>
          <SegmentedButton
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={segment}
            onValueChange={setSegment}
          />
          <ToggleGroup
            multiple
            options={[
              { value: "wifi", label: "Wi-Fi" },
              { value: "data", label: "Data" },
            ]}
            value={toggle}
            onValueChange={setToggle}
          />
          <FilterChipRow
            options={[
              { value: "open", label: "Open" },
              { value: "held", label: "Held" },
              { value: "done", label: "Done" },
            ]}
            defaultValue={["open"]}
          />
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Chip variant="assist">Assist</Chip>
            <Chip variant="filter">Filter</Chip>
            <Chip variant="suggestion">Suggestion</Chip>
          </View>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection title="Inputs">
        <Row>
          <FieldRoot label="Email" description="Work address">
            <Input placeholder="you@example.com" />
          </FieldRoot>
          <FieldRoot label="Notes" error="Required">
            <Textarea placeholder="Anything the operator should know" />
          </FieldRoot>
          <CountrySelect
            options={[
              { code: "NL", label: "Netherlands", dial: "+31" },
              { code: "DE", label: "Germany", dial: "+49" },
              { code: "BE", label: "Belgium", dial: "+32" },
            ]}
            value={country}
            onValueChange={setCountry}
          />
          <FieldMessage>Verified</FieldMessage>
          <FieldMessage variant="error">That address bounced</FieldMessage>
          <Checkbox
            value={checked}
            onValueChange={setChecked}
            label="Send updates"
          />
          <Switch
            value={push}
            onValueChange={setPush}
            accessibilityLabel="Push notifications"
          />
          <RadioGroup value={radio} onValueChange={setRadio}>
            <RadioGroupItem value="standard">Standard</RadioGroupItem>
            <RadioGroupItem value="express">Express</RadioGroupItem>
          </RadioGroup>
          <Slider value={slider} onValueChange={setSlider} />
        </Row>
      </ShowcaseSection>

      <ShowcaseSection title="Surfaces">
        <Row>
          <Card>
            <Text variant="title">Card</Text>
            <Text>Card groups sit on the canvas — white on gray.</Text>
          </Card>
          <Pane variant="canvas">
            <Text variant="label">Pane (canvas)</Text>
          </Pane>
          <Banner variant="info" title="Heads up">
            Sheets cap at half the viewport by default.
          </Banner>
          <Banner variant="error" title="Denied" onDismiss={() => {}}>
            This trip could not be assigned.
          </Banner>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Avatar fallback="AR" accessibilityLabel="Amara Reyes" />
            <Badge>12</Badge>
            <Badge variant="dot" />
          </View>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection title="Feedback">
        <Row>
          <LinearProgress value={0.6} />
          <View style={{ flexDirection: "row", gap: 16 }}>
            <CircularProgress size="md" />
            <MilestoneTrio steps={["Auth", "Org", "Workspace"]} progress={1} />
          </View>
          <SuccessTransform state="success" />
          <ShapeArt size={96} />
          <EmptyState
            title="Nothing scheduled"
            description="New jobs will appear here."
          />
        </Row>
      </ShowcaseSection>

      <ShowcaseSection title="Navigation">
        <SecondaryTabs
          tabs={[
            { value: "all", label: "All", content: <Text>All jobs</Text> },
            {
              value: "active",
              label: "Active",
              content: <Text>Active jobs</Text>,
            },
          ]}
          value={tab}
          onValueChange={setTab}
        />
        <Tabs
          tabs={[
            { value: "a", label: "Feed", content: <Text>Feed body</Text> },
            { value: "b", label: "Map", content: <Text>Map body</Text> },
          ]}
        />
        <Toolbar
          actions={[
            { label: "Sort", onPress: () => setPicker(true) },
            { label: "Search", onPress: () => setCommand(true) },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="List detail">
        <ListDetail
          list={
            <View>
              <ListItem title="Trip 42" supporting="In progress" />
              <ListItem title="Trip 43" supporting="Assigned" />
            </View>
          }
          detail={<Text>Trip detail pane</Text>}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Overlays">
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Button variant="tonal" onPress={() => setSheet(true)}>
            Bottom sheet
          </Button>
          <Button variant="tonal" onPress={() => setPicker(true)}>
            Picker
          </Button>
          <Button variant="tonal" onPress={() => setCreate(true)}>
            Create
          </Button>
          <Button variant="tonal" onPress={() => setCommand(true)}>
            Command
          </Button>
        </View>
      </ShowcaseSection>

      <BottomSheet
        open={sheet}
        title="Filter"
        onDismiss={() => setSheet(false)}
      >
        <Text>Sheet body</Text>
      </BottomSheet>

      <BottomSheetPicker
        open={picker}
        title="Sort by"
        value="newest"
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "price", label: "Price" },
        ]}
        onSelect={() => {}}
        onDismiss={() => setPicker(false)}
      />

      {create ? (
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <ActionSheet
            open
            title="Create"
            actions={[
              { key: "trip", label: "New trip" },
              { key: "shift", label: "New shift" },
            ]}
            onDismiss={() => setCreate(false)}
          />
        </View>
      ) : null}

      {command ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 96 }}>
          <Command
            open
            title="Search"
            onDismiss={() => setCommand(false)}
            actions={[
              { key: "a", label: "Open trip board", group: "Go" },
              { key: "b", label: "Open settings", group: "Go" },
              { key: "c", label: "Toggle dark mode", group: "Actions" },
            ]}
          />
        </View>
      ) : null}

      {snack ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
          <Snackbar
            visible
            message="Trip assigned"
            actionLabel="Undo"
            onAction={() => setSnack(false)}
            onDismiss={() => setSnack(false)}
          />
        </View>
      ) : null}
    </ShowcaseScroll>
  );
}

/** Kept for parity with the section scaffold's colour needs. */
export function GalleryBackdrop() {
  const scheme = useKernScheme();
  return <View style={{ flex: 1, backgroundColor: scheme.color.surface }} />;
}
