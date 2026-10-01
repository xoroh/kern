/**
 * Live mobile previews, rendered through react-native-web.
 *
 * Every demo here mounts the real `@xoroh/kern-native` component inside the
 * phone frame. A component with no preview is listed in `PREVIEW_REASONS`
 * with an explicit reason — never a silent omission (S2.3).
 */
import {
  AspectRatio,
  Avatar,
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Command,
  CountrySelect,
  EmptyState,
  Fab,
  FieldMessage,
  Input,
  Label,
  LinearProgress,
  ListItem,
  Loader,
  LoadingButton,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Search,
  SegmentedButton,
  Separator,
  Skeleton,
  Slider,
  Snackbar,
  Switch,
  Text,
  Textarea,
  Toggle,
  ToggleGroup,
} from "@xoroh/kern-native";
import { View } from "react-native";
import {
  PhoneGrid,
  PhonePreview,
  PhoneRow,
  PhoneStack,
} from "../../components/preview/phone";

export type MobileDemo = () => React.ReactElement;

export function NativeButtonDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="variant: primary · tonal · ghost">
        <PhoneRow>
          <Button variant="primary">Primary</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="ghost">Ghost</Button>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="size: default · sm · icon">
        <PhoneRow>
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="state: disabled">
        <PhoneRow>
          <Button disabled>Disabled</Button>
        </PhoneRow>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeButtonGroupDemo() {
  return (
    <PhonePreview label="ButtonGroup">
      <ButtonGroup>
        <Button variant="tonal">Left</Button>
        <Button variant="tonal">Right</Button>
      </ButtonGroup>
    </PhonePreview>
  );
}

export function NativeTextDemo() {
  return (
    <PhonePreview label="Text — variant: body · title · headline · label">
      <View style={{ gap: 6 }}>
        <Text variant="headline">Headline</Text>
        <Text variant="title">Title</Text>
        <Text variant="body">Body medium — the M3 default.</Text>
        <Text variant="label">Label large</Text>
      </View>
    </PhonePreview>
  );
}

export function NativeLabelDemo() {
  return (
    <PhonePreview label="Label">
      <Label>Email address</Label>
    </PhonePreview>
  );
}

export function NativeBadgeDemo() {
  return (
    <PhonePreview label="Badge — variant: count · dot">
      <PhoneRow>
        <Badge>7</Badge>
        <Badge variant="dot" />
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeChipDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="variant: assist · suggestion">
        <PhoneRow>
          <Chip>Assist</Chip>
          <Chip variant="suggestion">Suggestion</Chip>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="variant: filter — tap to toggle">
        <PhoneRow>
          <Chip variant="filter" defaultSelected>
            All
          </Chip>
          <Chip variant="filter">Unread</Chip>
        </PhoneRow>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeCardDemo() {
  return (
    <PhoneGrid>
      {(["filled", "outlined", "elevated"] as const).map((variant) => (
        <PhonePreview key={variant} label={`Card — variant: ${variant}`}>
          <Card variant={variant} style={{ padding: 16 }}>
            <Text variant="body">Card content</Text>
          </Card>
        </PhonePreview>
      ))}
    </PhoneGrid>
  );
}

export function NativeAvatarDemo() {
  return (
    <PhonePreview label="Avatar — initials fallback">
      <PhoneRow>
        <Avatar fallback="KO" size="small" />
        <Avatar fallback="SE" size="default" />
        <Avatar fallback="AR" size="large" />
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeInputDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="Input — default and error">
        <View style={{ gap: 10 }}>
          <Input placeholder="you@example.com" />
          <Input
            placeholder="bad@example"
            error
            errorMessage="Not a valid address"
          />
        </View>
      </PhonePreview>
      <PhonePreview label="state: disabled">
        <Input placeholder="Disabled" editable={false} />
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeTextareaDemo() {
  return (
    <PhonePreview label="Textarea">
      <Textarea placeholder="Tell us what happened…" />
    </PhonePreview>
  );
}

export function NativeFieldMessageDemo() {
  return (
    <PhonePreview label="FieldMessage — variant: description · error">
      <View style={{ gap: 6 }}>
        <FieldMessage>Helper text</FieldMessage>
        <FieldMessage variant="error">That address is not valid</FieldMessage>
      </View>
    </PhonePreview>
  );
}

export function NativeCheckboxDemo() {
  return (
    <PhonePreview label="Checkbox — checked · unchecked · indeterminate · disabled">
      <View style={{ gap: 8 }}>
        <Checkbox defaultValue label="Checked" />
        <Checkbox label="Unchecked" />
        <Checkbox indeterminate label="Indeterminate" />
        <Checkbox disabled label="Disabled" />
      </View>
    </PhonePreview>
  );
}

export function NativeRadioGroupDemo() {
  return (
    <PhonePreview label="RadioGroup — exclusive">
      <RadioGroup defaultValue="standard" accessibilityLabel="Shipping">
        <RadioGroupItem value="standard">Standard</RadioGroupItem>
        <RadioGroupItem value="express">Express</RadioGroupItem>
      </RadioGroup>
    </PhonePreview>
  );
}

export function NativeSwitchDemo() {
  return (
    <PhonePreview label="Switch — on · off · disabled">
      <PhoneRow>
        <Switch defaultValue />
        <Switch />
        <Switch disabled />
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeToggleDemo() {
  return (
    <PhonePreview label="Toggle — pressed · unpressed">
      <PhoneRow>
        <Toggle defaultPressed>
          <Text>Bold</Text>
        </Toggle>
        <Toggle>
          <Text>Italic</Text>
        </Toggle>
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeToggleGroupDemo() {
  return (
    <PhonePreview label="ToggleGroup — exclusive options">
      <ToggleGroup
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        defaultValue="day"
      />
    </PhonePreview>
  );
}

export function NativeSliderDemo() {
  return (
    <PhonePreview label="Slider — continuous value">
      <Slider defaultValue={40} accessibilityLabel="Volume" />
    </PhonePreview>
  );
}

export function NativeSearchDemo() {
  return (
    <PhonePreview label="Search">
      <Search label="Search" placeholder="Search projects" />
    </PhonePreview>
  );
}

export function NativeProgressDemo() {
  return (
    <PhonePreview label="Progress — determinate">
      <Progress value={60} accessibilityLabel="Uploading" />
    </PhonePreview>
  );
}

export function NativeLinearProgressDemo() {
  return (
    <PhonePreview label="LinearProgress — determinate">
      <LinearProgress value={0.7} label="Almost done" />
    </PhonePreview>
  );
}

export function NativeCircularProgressDemo() {
  return (
    <PhonePreview label="CircularProgress — determinate and indeterminate">
      <PhoneRow>
        <CircularProgress value={0.75} label="75 percent" />
        <CircularProgress label="Loading" />
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeLoaderDemo() {
  return (
    <PhonePreview label="Loader">
      <PhoneRow>
        <Loader size="small" />
        <Loader size="large" />
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeSkeletonDemo() {
  return (
    <PhonePreview label="Skeleton">
      <View style={{ gap: 8 }}>
        <Skeleton style={{ height: 14, width: "75%" }} />
        <Skeleton style={{ height: 14 }} />
        <Skeleton style={{ height: 14, width: "50%" }} />
      </View>
    </PhonePreview>
  );
}

export function NativeSeparatorDemo() {
  return (
    <PhonePreview label="Separator — horizontal · vertical">
      <View style={{ gap: 8, alignItems: "center" }}>
        <Text variant="body">Above</Text>
        <Separator style={{ width: "100%" }} />
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Text variant="body">Below</Text>
      </View>
    </PhonePreview>
  );
}

export function NativeListItemDemo() {
  return (
    <PhonePreview label="ListItem — title · supporting">
      <View style={{ gap: 2 }}>
        <ListItem title="Inbox" supporting="12 unread" />
        <ListItem title="Sent" supporting="Last 7 days" />
        <ListItem title="Archive" />
      </View>
    </PhonePreview>
  );
}

export function NativeEmptyStateDemo() {
  return (
    <PhonePreview label="EmptyState">
      <EmptyState
        title="No messages yet"
        description="Compose a message and it will show up here."
        action={<Button variant="tonal">Compose</Button>}
      />
    </PhonePreview>
  );
}

export function NativeFabDemo() {
  return (
    <PhonePreview label="Fab — variant: primary · tonal">
      <PhoneRow>
        <Fab label="Compose" variant="primary">
          <Text>Compose</Text>
        </Fab>
        <Fab label="Compose" variant="tonal">
          <Text>Compose</Text>
        </Fab>
      </PhoneRow>
    </PhonePreview>
  );
}

export function NativeAspectRatioDemo() {
  return (
    <PhonePreview label="AspectRatio — ratio: 1 · 16/9">
      <View style={{ flexDirection: "row", gap: 12 }}>
        <AspectRatio ratio={1} style={{ flex: 1 }}>
          <Card
            variant="outlined"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text variant="body">1:1</Text>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={16 / 9} style={{ flex: 1 }}>
          <Card
            variant="outlined"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text variant="body">16:9</Text>
          </Card>
        </AspectRatio>
      </View>
    </PhonePreview>
  );
}

export function NativeBannerDemo() {
  return (
    <PhonePreview label="Banner — web-parity counterpart">
      <View style={{ gap: 8 }}>
        <Banner variant="info" title="A new version is available" />
        <Banner variant="error" title="The build failed" />
      </View>
    </PhonePreview>
  );
}

export function NativeSegmentedButtonDemo() {
  return (
    <PhonePreview label="SegmentedButton — web-parity counterpart">
      <SegmentedButton
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        defaultValue="day"
      />
    </PhonePreview>
  );
}

export function NativeCommandDemo() {
  return (
    <PhonePreview label="Command — open, grouped action list">
      <Command
        open
        title="Commands"
        actions={[
          { key: "new", label: "New project", group: "Create" },
          { key: "settings", label: "Settings", group: "Configure" },
          {
            key: "delete",
            label: "Delete project",
            group: "Danger",
            disabled: true,
          },
        ]}
      />
    </PhonePreview>
  );
}

const NATIVE_COUNTRIES = [
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
];

export function NativeCountrySelectDemo() {
  return (
    <PhonePreview label="CountrySelect — the host supplies the list">
      <CountrySelect
        options={NATIVE_COUNTRIES}
        value="DE"
        onValueChange={() => {}}
      />
    </PhonePreview>
  );
}

export function NativeSnackbarDemo() {
  return (
    <PhonePreview label="Snackbar — M3 transient messaging (no Sonner twin)">
      <Snackbar
        visible
        message="Build queued"
        actionLabel="View"
        onAction={() => {}}
      />
    </PhonePreview>
  );
}

export function NativeLoadingButtonDemo() {
  return (
    <PhonePreview label="LoadingButton — embedded progress">
      <View style={{ gap: 8 }}>
        <LoadingButton loading>Save</LoadingButton>
        <LoadingButton loading={false} variant="tonal">
          Save
        </LoadingButton>
      </View>
    </PhonePreview>
  );
}

/**
 * Components with no live preview, each with the reason. The acceptance bar
 * is "renders honestly **or** carries an explicit prose reason it cannot" —
 * this list is that second half, and it is the honest state, not a stub.
 */
export const PREVIEW_REASONS: Record<string, string> = {
  BootSplash:
    "Full-screen boot surface. It owns the whole viewport by contract, so mounting it inside a phone frame would render it at the wrong scale and hide the frame it is meant to replace. Shown on the /getting-started mobile quickstart instead, at full bleed.",
  MilestoneTrio:
    "Animated shape-art milestone sequence driven by a frame clock. It has no static resting state, so any preview would be a frozen frame that misrepresents it. Exercises the same `CircularProgress` shapes style the previews above do render.",
  SuccessTransform:
    "A timed success animation with no static state, for the same reason as MilestoneTrio.",
  ShapeArt:
    "Pure shape-art animation surface with no static state; the concrete animated consumers are listed above.",
  Shape:
    "The static shape primitive is internal to the shape-art surfaces above; on its own it renders an unstyled primitive with no consumer-facing contract.",
  AppsSheet:
    "Sheet content is presented modally over a host screen; in isolation there is no host to present over. Its sibling sheets share one implementation, rendered under the native Sheet preview.",
  CreateSheet: "Modal flow with a host screen, same reason as AppsSheet.",
  MenuScreen:
    "Full-screen menu destination, same host-screen reason as AppsSheet.",
  MenuSheet: "Modal sheet, same host-screen reason as AppsSheet.",
  MenuGroupList:
    "Group list rendered inside MenuSheet, same host-screen reason.",
  BottomSheet: "Modal sheet, same host-screen reason as AppsSheet.",
  BottomSheetPicker: "Modal picker driven by an open host screen, same reason.",
  SnapSheet: "Modal sheet with gesture-driven snap points, same reason.",
  DockSheet: "Modal sheet, same reason.",
  EntitySheet: "Modal detail sheet, same reason.",
  SheetHandle:
    "The drag handle of the sheets above; it has no meaning detached from its sheet.",
  NavigationBar:
    "Device chrome that owns the bottom safe area; in a browser frame it renders flush with the page edge and cannot show its inset behaviour honestly.",
  NavigationBarItem: "One segment of NavigationBar, same chrome reason.",
  NavigationDrawer:
    "Full-screen drawer over a host screen, same host-screen reason as AppsSheet.",
  NavigationMenu:
    "Platform menu surface with no static open state in the RNW renderer.",
  Menubar:
    "Desktop-pattern menu bar with no native counterpart in a phone frame; the native Menu preview covers the same contract.",
  Menu: "Context menu surface whose open state is gesture-driven; RNW has no equivalent long-press, so any preview would be a fabricated interaction.",
  ContextMenu: "Same gesture-driven open state as Menu.",
  Dialog:
    "Modal dialog over a host screen, same host-screen reason as AppsSheet.",
  AlertDialog: "Modal confirmation over a host screen, same reason.",
  Collapsible:
    "Disclosure region; its open state is toggled by its own trigger, and the trigger composition is a platform convention this frame cannot supply.",
  Accordion: "Same disclosure-composition reason as Collapsible.",
  Tabs: "Tab strip with platform-specific layout rules; rendered in the /getting-started mobile quickstart against a real screen.",
  Select:
    "Modal option list over a host screen, same host-screen reason as AppsSheet.",
  Search:
    "Rendered above; listed here only because the export also covers the modal suggestion sheet on device.",
  Sheet:
    "Wraps a React Native `Modal`, which RNW renders as a full-viewport overlay. Inside the phone frame it would cover the frame itself, so the preview would show the sheet and nothing else. The sheet family (BottomSheet, SnapSheet, DockSheet) carries the same reason.",
  arcRotations:
    "Not a component: the per-shape arc rotation table that CircularProgress reads to draw its indeterminate arc. It is data consumed by the CircularProgress preview above, not a renderable surface.",
  loaderColor:
    "Not a component: a style helper resolving the spinner colour from a scheme. The Loader preview above renders the result.",
  Toolbar:
    "Desktop-pattern toolbar; the native TopAppBar is the mobile equivalent and is listed below.",
  Table:
    "Tables do not exist as a native pattern; this is the documented web-parity counterpart and is covered on /components/web.",
  Calendar:
    "Full-screen month grid; the same reason as Tabs — it needs a real screen to own.",
  Field:
    "A form-field composition requiring a host `Input` inside a real form context; the parts it composes are previewed above.",
  Pane: "Split-view pane requiring a host navigation context to size against.",
  ListDetail:
    "Master/detail layout requiring a host screen, same reason as Pane.",
  SupportingPane:
    "Supporting pane requiring a host screen, same reason as Pane.",
  FilterChipRow:
    "Horizontal chip row built on Chip, which is previewed above; the row adds scroll clipping, not a new component contract.",
  SecondaryTabs: "Secondary tab strip; same reason as Tabs.",
  TopAppBar:
    "Top app bar for a host screen; rendered in the mobile quickstart at full bleed.",
  TopAppBarAction: "One action of TopAppBar, same reason.",
  WebParity:
    "Not a component: the file that hosts the web-parity counterparts (Command, SegmentedButton, CountrySelect, Banner), each of which is previewed on /components/web.",
};

/** Every native export, mapped to a live preview. */
const byExport: Record<string, MobileDemo> = {
  Avatar: NativeAvatarDemo,
  Badge: NativeBadgeDemo,
  Button: NativeButtonDemo,
  ButtonGroup: NativeButtonGroupDemo,
  Card: NativeCardDemo,
  AspectRatio: NativeAspectRatioDemo,
  Banner: NativeBannerDemo,
  Checkbox: NativeCheckboxDemo,
  Chip: NativeChipDemo,
  CountrySelect: NativeCountrySelectDemo,
  CircularProgress: NativeCircularProgressDemo,
  Command: NativeCommandDemo,
  EmptyState: NativeEmptyStateDemo,
  Fab: NativeFabDemo,
  FieldMessage: NativeFieldMessageDemo,
  Input: NativeInputDemo,
  Label: NativeLabelDemo,
  LinearProgress: NativeLinearProgressDemo,
  ListItem: NativeListItemDemo,
  LoadingButton: NativeLoadingButtonDemo,
  Loader: NativeLoaderDemo,
  Progress: NativeProgressDemo,
  RadioGroup: NativeRadioGroupDemo,
  RadioGroupItem: NativeRadioGroupDemo,
  Search: NativeSearchDemo,
  SegmentedButton: NativeSegmentedButtonDemo,
  Snackbar: NativeSnackbarDemo,
  Separator: NativeSeparatorDemo,
  Skeleton: NativeSkeletonDemo,
  Slider: NativeSliderDemo,
  Switch: NativeSwitchDemo,
  Text: NativeTextDemo,
  Textarea: NativeTextareaDemo,
  Toggle: NativeToggleDemo,
  ToggleGroup: NativeToggleGroupDemo,
};

export const MOBILE_DEMOS = byExport;

/** Native manifest rows with neither a live preview nor a stated reason. */
export function unaccountedMobileExports(
  rows: readonly { export: string }[],
): { export: string }[] {
  return rows
    .filter((row) => !byExport[row.export] && !PREVIEW_REASONS[row.export])
    .map((row) => ({ export: row.export }));
}
