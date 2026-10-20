/**
 * Live mobile previews, rendered through react-native-web.
 *
 * Every demo here mounts the real `@xoroh/kern-native` component inside the
 * phone frame. A component with no preview is listed in `PREVIEW_REASONS`
 * with an explicit reason — never a silent omission (S2.3).
 */

import { PortalHost } from "@xoroh/axis";
import { Icon } from "@xoroh/kern-icons";
import {
  AppShell,
  AspectRatio,
  Autocomplete,
  Avatar,
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  Chip,
  CircularProgress,
  Combobox,
  Command,
  ContrastToggle,
  CountrySelect,
  EmptyState,
  ErrorBoundary,
  ExtendedFab,
  Fab,
  FabMenu,
  FieldMessage,
  Fieldset,
  FieldsetItem,
  FieldsetLegend,
  Form,
  IconButton,
  IconButtonTarget,
  Input,
  InputOTP,
  Kbd,
  KernPressable,
  Label,
  LinearProgress,
  LinkButton,
  ListItem,
  Loader,
  LoadingButton,
  LoadingIndicator,
  Meter,
  NavigationRail,
  NumberField,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  RadioGroupItem,
  RichTooltip,
  ScrollArea,
  Search,
  SegmentedButton,
  Separator,
  SettingsRow,
  Skeleton,
  Slider,
  SnackbarProvider,
  SnackbarViewport,
  Split,
  SplitButton,
  StateLayer,
  StatusBar,
  Switch,
  Text,
  Textarea,
  ThemeToggle,
  TimePicker,
  Toggle,
  ToggleGroup,
  Tooltip,
  useKernScheme,
  useSnackbar,
} from "@xoroh/kern-native";
import { View } from "react-native";
import {
  PhoneGrid,
  PhonePreview,
  PhoneRow,
  PhoneStack,
} from "../../components/preview/phone";

export type MobileDemo = () => React.ReactElement;

/**
 * The renderer environment these previews run in.
 *
 * react-native-web's `Animated` fallback path calls
 * `global.cancelAnimationFrame(...)` and `global.requestAnimationFrame(...)`
 * — Node-isms a browser does not define. Every indeterminate animation in
 * kern-native (the `CircularProgress` and `LoadingIndicator` rings) goes
 * through that path, so without a `global` the animation throws
 * `ReferenceError: global is not defined` on its first loop and takes the
 * whole page down with it.
 *
 * The fix lives in `vite.config.ts` (`define: { global: "globalThis" }`),
 * at the bundler's seam, where it repairs EVERY page that runs a kern-native
 * animation - not only this one. The shim stays here as well for the paths
 * that reach the renderer outside the bundle, and it is idempotent: if the
 * bundle already defined `global`, this one stands aside.
 */
const rendererScope = globalThis as typeof globalThis & { global?: unknown };
if (rendererScope.global === undefined) {
  rendererScope.global = globalThis;
}

export function NativeButtonDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="variant: elevated · filled · tonal · outlined · text">
        <PhoneRow>
          <Button variant="elevated">Elevated</Button>
          <Button variant="filled">Filled</Button>
          <Button variant="tonal">Tonal</Button>
        </PhoneRow>
        <PhoneRow>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="size: xs · default · sm · xl · icon">
        <PhoneRow>
          <Button size="xs">XS</Button>
          <Button size="default">Default</Button>
          <Button size="sm">Small</Button>
        </PhoneRow>
        <PhoneRow>
          <Button size="xl">XL</Button>
          <Button size="icon" accessibilityLabel="Search">
            <Text>+</Text>
          </Button>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="color: danger">
        <PhoneRow>
          <Button variant="filled" color="danger">
            Delete
          </Button>
          <Button variant="outlined" color="danger">
            Discard
          </Button>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="state: disabled · loading">
        <PhoneRow>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
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
          <Chip variant="filter" defaultValue>
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
    <>
      <PhonePreview label="Fab — size: default · small · medium · large">
        <PhoneRow>
          <Fab label="Compose" size="default">
            <Text>Compose</Text>
          </Fab>
          <Fab label="Compose" size="medium">
            <Text>Compose</Text>
          </Fab>
          <Fab label="Compose" size="large">
            <Text>Compose</Text>
          </Fab>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="Fab — color: primary · secondary · tertiary · fills">
        <PhoneRow>
          <Fab label="Compose" color="primary">
            <Text>Compose</Text>
          </Fab>
          <Fab label="Compose" color="secondary">
            <Text>Compose</Text>
          </Fab>
          <Fab label="Compose" color="primary-fill">
            <Text>Compose</Text>
          </Fab>
        </PhoneRow>
      </PhonePreview>
    </>
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
  function QueueTrigger() {
    const snackbar = useSnackbar();
    return (
      <Button
        variant="tonal"
        onPress={() =>
          snackbar.add({
            message: "Build queued",
            actionLabel: "View",
            duration: 0,
          })
        }
      >
        Queue snackbar
      </Button>
    );
  }
  return (
    <PhonePreview label="SnackbarProvider — the queue; SnackbarViewport paints it">
      <SnackbarProvider>
        <QueueTrigger />
        <SnackbarViewport />
      </SnackbarProvider>
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

export function NativeMeterDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="Meter — labelled reading">
        <Meter
          value={6}
          max={8}
          label="Storage"
          showValue
          accessibilityLabel="Storage"
        />
      </PhonePreview>
      <PhonePreview label="Meter — indeterminate">
        <Meter label="Syncing" accessibilityLabel="Syncing" />
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativePaginationDemo() {
  return (
    <PhonePreview label="Pagination — windowed pages">
      <Pagination count={10} defaultValue={4} />
    </PhonePreview>
  );
}

export function NativeNumberFieldDemo() {
  return (
    <PhonePreview label="NumberField — stepper input">
      <NumberField
        defaultValue={2}
        min={0}
        max={10}
        accessibilityLabel="Quantity"
      />
    </PhonePreview>
  );
}

export function NativeTooltipDemo() {
  return (
    <PhonePreview label="Tooltip — supplementary hint">
      <Tooltip label="Save" hint="Saves your draft">
        <Text>Save</Text>
      </Tooltip>
    </PhonePreview>
  );
}

export function NativeTimePickerDemo() {
  return (
    <PhonePreview label="TimePicker — normalised value">
      <TimePicker
        defaultValue={{ hours: 9, minutes: 30 }}
        accessibilityLabel="Alarm time"
      />
    </PhonePreview>
  );
}

export function NativePopoverDemo() {
  return (
    <PhonePreview label="Popover — anchored surface">
      <Popover.Root defaultOpen>
        <Popover.Trigger label="Details">
          <Text>Details</Text>
        </Popover.Trigger>
        <Popover.Content label="Details">
          <Popover.Body>
            <Text>Keyboard shortcuts for this screen.</Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Root>
    </PhonePreview>
  );
}

export function NativeScrollAreaDemo() {
  return (
    <PhonePreview label="ScrollArea — labelled region">
      <ScrollArea style={{ maxHeight: 120 }}>
        <Text>First row</Text>
        <Text>Second row</Text>
        <Text>Third row</Text>
        <Text>Fourth row</Text>
        <Text>Fifth row</Text>
        <Text>Sixth row</Text>
      </ScrollArea>
    </PhonePreview>
  );
}

export function NativeIconButtonDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="IconButton — variant: standard · filled · tonal · outlined">
        <PhoneRow>
          <IconButton label="Add" variant="standard">
            <Text>+</Text>
          </IconButton>
          <IconButton label="Add" variant="filled">
            <Text>+</Text>
          </IconButton>
          <IconButton label="Add" variant="tonal">
            <Text>+</Text>
          </IconButton>
          <IconButton label="Add" variant="outlined">
            <Text>+</Text>
          </IconButton>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="IconButtonTarget — guaranteed 48dp target">
        <IconButtonTarget>
          <IconButton label="Add" variant="filled">
            <Text>+</Text>
          </IconButton>
        </IconButtonTarget>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeInputOTPDemo() {
  return (
    <PhonePreview label="InputOTP — one box per position">
      <InputOTP length={4} defaultValue="12" accessibilityLabel="Code" />
    </PhonePreview>
  );
}

export function NativeAutocompleteDemo() {
  return (
    <PhonePreview label="Autocomplete — suggestion commit">
      <Autocomplete
        suggestions={[
          { value: "apple", label: "Apple" },
          { value: "apricot", label: "Apricot" },
        ]}
        defaultValue="Ap"
        accessibilityLabel="Fruit"
      />
    </PhonePreview>
  );
}

export function NativeCarouselDemo() {
  return (
    <PhonePreview label="Carousel — indexed slides">
      <Carousel
        items={[
          {
            value: "one",
            accessibilityLabel: "Slide one",
            content: <Text>One</Text>,
          },
          {
            value: "two",
            accessibilityLabel: "Slide two",
            content: <Text>Two</Text>,
          },
        ]}
        accessibilityLabel="Highlights"
      />
    </PhonePreview>
  );
}

export function NativeCheckboxGroupDemo() {
  return (
    <PhonePreview label="CheckboxGroup — multi-select">
      <CheckboxGroup defaultValue={["cheese"]} accessibilityLabel="Toppings">
        <CheckboxGroupItem value="cheese">Cheese</CheckboxGroupItem>
        <CheckboxGroupItem value="salami">Salami</CheckboxGroupItem>
      </CheckboxGroup>
    </PhonePreview>
  );
}

export function NativeThemeToggleDemo() {
  return (
    <PhonePreview label="ThemeToggle — destination-named action">
      <ThemeToggle mode="dark" onToggle={() => {}} />
    </PhonePreview>
  );
}

export function NativeContrastToggleDemo() {
  return (
    <PhonePreview label="ContrastToggle — destination-named action">
      <ContrastToggle contrast="standard" onToggle={() => {}} />
    </PhonePreview>
  );
}

/* ------------------------------------------------------------------------- *
 * The families that shipped with neither a preview nor a stated reason.
 *
 * Every demo below mounts the REAL `@xoroh/kern-native` component with its
 * real props — nothing here is a mock-up of a component that exists
 * somewhere else. The three families whose whole surface IS a modal
 * (Drawer, SheetSurface, ActionSheet) carry a reason in `PREVIEW_REASONS`
 * instead: a modal presented over a host screen has no honest preview
 * inside a phone frame, because the frame is not the host.
 * ------------------------------------------------------------------------- */

export function NativeKbdDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="Kbd — a key as text">
        <PhoneRow>
          <Kbd>Esc</Kbd>
          <Kbd>Tab</Kbd>
          <Kbd>Enter</Kbd>
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="Kbd — a chord, composed by the caller">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Kbd>Ctrl</Kbd>
          <Text variant="label">+</Text>
          <Kbd>K</Kbd>
        </View>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeFieldsetDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="Fieldset — the group is named by its legend">
        <Fieldset>
          <FieldsetLegend>Delivery</FieldsetLegend>
          <FieldsetItem>
            <RadioGroup defaultValue="standard" accessibilityLabel="Delivery">
              <RadioGroupItem value="standard">Standard</RadioGroupItem>
              <RadioGroupItem value="express">Express</RadioGroupItem>
            </RadioGroup>
          </FieldsetItem>
        </Fieldset>
      </PhonePreview>
      <PhonePreview label="Fieldset — disabled dims the group and every row in it">
        <Fieldset disabled>
          <FieldsetLegend>Billing</FieldsetLegend>
          <FieldsetItem>
            <Text variant="body">Card details are locked</Text>
          </FieldsetItem>
        </Fieldset>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeSplitDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="Split — two equal columns, hairline between">
        <View style={{ height: 96 }}>
          <Split>
            <View style={{ padding: 12 }}>
              <Text variant="label">Inbox</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text variant="label">Sent</Text>
            </View>
          </Split>
        </View>
      </PhonePreview>
      <PhonePreview label="Split — three equal columns">
        <View style={{ height: 96 }}>
          <Split columns={3}>
            <View style={{ padding: 12 }}>
              <Text variant="label">One</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text variant="label">Two</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text variant="label">Three</Text>
            </View>
          </Split>
        </View>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeSplitButtonDemo() {
  return (
    <PhonePreview label="SplitButton — the primary action, then its overflow">
      <SplitButton
        label="Save"
        actions={[
          { key: "duplicate", label: "Duplicate" },
          { key: "move", label: "Move to folder", separated: true },
          { key: "delete", label: "Delete", disabled: true },
        ]}
      />
    </PhonePreview>
  );
}

export function NativeSettingsRowDemo() {
  return (
    <PhonePreview label="SettingsRow — label, supporting text, trailing control">
      <View style={{ gap: 8 }}>
        <SettingsRow
          label="Notifications"
          supporting="Alerts for mentions and replies"
          trailing={<Switch defaultValue />}
        />
        <SettingsRow label="Dark theme" trailing={<Switch />} />
      </View>
    </PhonePreview>
  );
}

export function NativeStatusBarDemo() {
  return (
    <PhonePreview label="StatusBar — leading, centred status, trailing">
      <StatusBar
        leading={<Text variant="label">12:00</Text>}
        trailing={<Text variant="label">LTE</Text>}
      >
        Syncing
      </StatusBar>
    </PhonePreview>
  );
}

/** A screen that fails to render — the reason `ErrorBoundary` exists. */
function FailingPanel(): React.ReactElement {
  throw new Error("Could not load the project");
}

/** The same screen, loaded. */
function LoadedPanel(): React.ReactElement {
  return <Text variant="body">Project loaded</Text>;
}

export function NativeErrorBoundaryDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="ErrorBoundary — a thrown render is caught, not blanked">
        <ErrorBoundary>
          <FailingPanel />
        </ErrorBoundary>
      </PhonePreview>
      <PhonePreview label="ErrorBoundary — children render when nothing throws">
        <ErrorBoundary>
          <LoadedPanel />
        </ErrorBoundary>
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeFormDemo() {
  return (
    <PhonePreview label="Form — the container that collects values and reports validity">
      <Form onFormSubmit={() => {}} validationMode="onSubmit">
        <Label>Email address</Label>
        <Input placeholder="you@example.com" />
        <Button variant="filled">Submit</Button>
      </Form>
    </PhonePreview>
  );
}

export function NativeLoadingIndicatorDemo() {
  return (
    <PhoneStack>
      <PhonePreview label="LoadingIndicator — size: small · default · large">
        <PhoneRow>
          <LoadingIndicator size="sm" />
          <LoadingIndicator />
          <LoadingIndicator size="lg" />
        </PhoneRow>
      </PhonePreview>
      <PhonePreview label="LoadingIndicator — the status region carries the name">
        <LoadingIndicator label="Syncing" showLabel />
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeKernPressableDemo() {
  function PressableSample() {
    const scheme = useKernScheme();
    return (
      <PhoneRow>
        <KernPressable
          accessibilityLabel="Add item"
          onPress={() => {}}
          style={{
            backgroundColor: scheme.color.secondaryContainer,
            borderRadius: 12,
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <Icon
            name="add"
            size={20}
            color={scheme.color.onSecondaryContainer}
          />
        </KernPressable>
      </PhoneRow>
    );
  }
  return (
    <PhonePreview label="KernPressable — a 48dp target around your own content">
      <PressableSample />
    </PhonePreview>
  );
}

/** The rail's destinations, with their glyphs in the rail's ink roles. */
function railDestinations(scheme: ReturnType<typeof useKernScheme>) {
  const ink = (selected: boolean) =>
    selected
      ? scheme.color.onSecondaryContainer
      : scheme.color.onSurfaceVariant;
  return [
    {
      key: "home",
      label: "Home",
      icon: <Icon name="home" color={ink(true)} />,
    },
    {
      key: "search",
      label: "Search",
      icon: <Icon name="search" color={ink(false)} />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Icon name="settings" color={ink(false)} />,
    },
  ];
}

export function NativeNavigationRailDemo() {
  function RailSample({ mode }: { mode: "collapsed" | "expanded" }) {
    const scheme = useKernScheme();
    return (
      <View style={{ height: 180, alignItems: "flex-start" }}>
        <NavigationRail
          destinations={railDestinations(scheme)}
          value="home"
          onValueChange={() => {}}
          mode={mode}
        />
      </View>
    );
  }
  return (
    <PhoneStack>
      <PhonePreview label="NavigationRail — collapsed: icons only, names kept">
        <RailSample mode="collapsed" />
      </PhonePreview>
      <PhonePreview label="NavigationRail — expanded: the persistent sidebar">
        <RailSample mode="expanded" />
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeLinkButtonDemo() {
  return (
    <PhonePreview label="LinkButton — the button treatment on a navigation control">
      <View style={{ gap: 12 }}>
        <LinkButton href="https://kern.xoroh.org" variant="filled">
          Read the docs
        </LinkButton>
        <LinkButton href="https://kern.xoroh.org" variant="text">
          Release notes
        </LinkButton>
      </View>
    </PhonePreview>
  );
}

export function NativeStateLayerDemo() {
  function StateLayerSample() {
    const scheme = useKernScheme();
    const surface = {
      position: "relative",
      overflow: "hidden",
      borderRadius: 12,
      backgroundColor: scheme.color.secondaryContainer,
      paddingVertical: 16,
      paddingHorizontal: 16,
    } as const;
    const ink = scheme.color.onSecondaryContainer;
    return (
      <PhoneRow>
        <View style={surface}>
          <Text variant="label" style={{ color: ink }}>
            Resting
          </Text>
        </View>
        <View style={surface}>
          <Text variant="label" style={{ color: ink }}>
            Pressed
          </Text>
          <StateLayer ink={ink} radius={12} visible />
        </View>
      </PhoneRow>
    );
  }
  return (
    <PhonePreview label="StateLayer — the pressed wash, painted in the content colour">
      <StateLayerSample />
    </PhonePreview>
  );
}

export function NativeComboboxDemo() {
  return (
    <PhonePreview label="Combobox — the trigger opens a filterable option list">
      <Combobox
        options={[
          { value: "de", label: "Germany" },
          { value: "fr", label: "France" },
          { value: "nl", label: "Netherlands" },
        ]}
        placeholder="Choose a country"
        accessibilityLabel="Country"
      />
    </PhonePreview>
  );
}

export function NativeAppShellDemo() {
  function ShellSample() {
    const scheme = useKernScheme();
    return (
      <View style={{ height: 300 }}>
        <AppShell
          header={
            <Text variant="title" style={{ color: scheme.color.onSurface }}>
              Kern
            </Text>
          }
          navigation={
            <NavigationRail
              destinations={railDestinations(scheme)}
              value="home"
              onValueChange={() => {}}
            />
          }
          body={
            <View style={{ padding: 12 }}>
              <Text variant="body">The body region</Text>
            </View>
          }
          footer={
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              The footer region
            </Text>
          }
        />
      </View>
    );
  }
  return (
    <PhonePreview label="AppShell — header, side navigation, body, footer">
      <ShellSample />
    </PhonePreview>
  );
}

export function NativeExtendedFabDemo() {
  function ExtendedFabSample({ collapsed }: { collapsed: boolean }) {
    const scheme = useKernScheme();
    return (
      <PhoneRow>
        <ExtendedFab
          label="Compose"
          icon={<Icon name="edit" color={scheme.color.onPrimaryContainer} />}
          defaultValue={collapsed}
        />
      </PhoneRow>
    );
  }
  return (
    <PhoneStack>
      <PhonePreview label="ExtendedFab — the labelled primary action">
        <ExtendedFabSample collapsed={false} />
      </PhonePreview>
      <PhonePreview label="ExtendedFab — collapsed to its icon; the label stays the name">
        <ExtendedFabSample collapsed />
      </PhonePreview>
    </PhoneStack>
  );
}

export function NativeFabMenuDemo() {
  function FabMenuSample() {
    const scheme = useKernScheme();
    return (
      <PhoneRow>
        <FabMenu
          label="Actions"
          icon={<Icon name="add" color={scheme.color.onPrimaryContainer} />}
          actions={[
            { key: "create", label: "Create", onSelect: () => {} },
            { key: "upload", label: "Upload", onSelect: () => {} },
            {
              key: "archive",
              label: "Archive",
              disabled: true,
              separated: true,
            },
          ]}
        />
      </PhoneRow>
    );
  }
  return (
    <PhonePreview label="FabMenu — one trigger, a menu of actions behind it">
      <FabMenuSample />
    </PhonePreview>
  );
}

export function NativeRichTooltipDemo() {
  function RichTooltipSample() {
    const scheme = useKernScheme();
    return (
      // The rich surface paints through an Axis `PortalHost`. The site mounts
      // one at the app root, which would float the surface off the phone
      // frame; hosting it here is what an app does anyway — the portal paints
      // into the nearest host above it, so this one keeps the surface in the
      // frame, where the reader can see it.
      <PortalHost>
        <RichTooltip
          label="Sync status"
          title="Sync is on"
          text="Drafts upload in the background while you work."
          actions={[{ label: "Learn more", onPress: () => {} }]}
          defaultOpen
          placement="bottom"
        >
          <Text variant="body" style={{ color: scheme.color.onSurface }}>
            Sync status
          </Text>
        </RichTooltip>
      </PortalHost>
    );
  }
  return (
    <PhonePreview label="RichTooltip — subhead, supporting text, plain-text actions">
      <RichTooltipSample />
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
    "Full-screen boot surface. It owns the whole viewport by contract, so mounting it inside a phone frame would render it at the wrong scale and hide the frame it is meant to replace. Shown on the /docs/getting-started mobile quickstart instead, at full bleed.",
  MilestoneTrio:
    "Animated shape-art milestone sequence driven by a frame clock. It has no static resting state, so any preview would be a frozen frame that misrepresents it. Exercises the same `CircularProgress` shapes style the previews above do render.",
  SuccessTransform:
    "A timed success animation with no static state, for the same reason as MilestoneTrio.",
  ShapeArt:
    "Pure shape-art animation surface with no static state; the concrete animated consumers are listed above.",
  Shape:
    "The static shape primitive is internal to the shape-art surfaces above; on its own it renders an unstyled primitive with no consumer-facing contract.",
  MenuScreen:
    "Full-screen menu destination; presented modally over a host screen, and in isolation there is no host to present over.",
  MenuSheet:
    "Modal sheet over a host screen; in isolation there is no host to present over.",
  MenuGroupList:
    "Group list rendered inside MenuSheet, same host-screen reason.",
  BottomSheet:
    "Modal sheet over a host screen; in isolation there is no host to present over.",
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
    "Full-screen drawer over a host screen; in isolation there is no host to present over.",
  NavigationMenu:
    "Platform menu surface with no static open state in the RNW renderer.",
  Menubar:
    "Desktop-pattern menu bar with no native counterpart in a phone frame; the native Menu preview covers the same contract.",
  Menu: "Context menu surface whose open state is gesture-driven; RNW has no equivalent long-press, so any preview would be a fabricated interaction.",
  ContextMenu: "Same gesture-driven open state as Menu.",
  Dialog:
    "Modal dialog over a host screen; in isolation there is no host to present over.",
  AlertDialog: "Modal confirmation over a host screen, same reason.",
  Collapsible:
    "Disclosure region; its open state is toggled by its own trigger, and the trigger composition is a platform convention this frame cannot supply.",
  Accordion: "Same disclosure-composition reason as Collapsible.",
  Tabs: "Tab strip with platform-specific layout rules; rendered in the /docs/getting-started mobile quickstart against a real screen.",
  Select:
    "Modal option list over a host screen; in isolation there is no host to present over.",
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
    "Tables do not exist as a native pattern; this is the documented web-parity counterpart and is covered on /components?platform=web.",
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
  Drawer:
    "M3 modal drawer over a host screen. It wraps a React Native `Modal`, which react-native-web renders as a full-viewport overlay, so inside the phone frame it would cover the frame itself and hide the host screen it presents over — and there is no host screen in the frame to present it over.",
  SheetSurface:
    "The shared Modal + scrim primitive the sheet family hosts in. It is a React Native `Modal`, which react-native-web renders as a full-viewport overlay rather than a surface inside the phone frame, so a preview would show the sheet covering the whole page instead of the frame. The sheets it powers (MenuSheet, BottomSheet, SnapSheet, DockSheet, EntitySheet) carry the same reason.",
  ActionSheet:
    "Modal action sheet over a host screen; in isolation there is no host to present over.",
};

/** Every native export, mapped to a live preview. */
const byExport: Record<string, MobileDemo> = {
  AppShell: NativeAppShellDemo,
  Avatar: NativeAvatarDemo,
  Autocomplete: NativeAutocompleteDemo,
  Badge: NativeBadgeDemo,
  Button: NativeButtonDemo,
  ButtonGroup: NativeButtonGroupDemo,
  Card: NativeCardDemo,
  Carousel: NativeCarouselDemo,
  CheckboxGroup: NativeCheckboxGroupDemo,
  CheckboxGroupItem: NativeCheckboxGroupDemo,
  AspectRatio: NativeAspectRatioDemo,
  Banner: NativeBannerDemo,
  Checkbox: NativeCheckboxDemo,
  Chip: NativeChipDemo,
  Combobox: NativeComboboxDemo,
  ContrastToggle: NativeContrastToggleDemo,
  CountrySelect: NativeCountrySelectDemo,
  CircularProgress: NativeCircularProgressDemo,
  Command: NativeCommandDemo,
  EmptyState: NativeEmptyStateDemo,
  ErrorBoundary: NativeErrorBoundaryDemo,
  ExtendedFab: NativeExtendedFabDemo,
  Fab: NativeFabDemo,
  FabMenu: NativeFabMenuDemo,
  FieldMessage: NativeFieldMessageDemo,
  Fieldset: NativeFieldsetDemo,
  FieldsetItem: NativeFieldsetDemo,
  FieldsetLegend: NativeFieldsetDemo,
  Form: NativeFormDemo,
  IconButton: NativeIconButtonDemo,
  IconButtonTarget: NativeIconButtonDemo,
  Input: NativeInputDemo,
  InputOTP: NativeInputOTPDemo,
  Kbd: NativeKbdDemo,
  KernPressable: NativeKernPressableDemo,
  Label: NativeLabelDemo,
  LinearProgress: NativeLinearProgressDemo,
  LinkButton: NativeLinkButtonDemo,
  ListItem: NativeListItemDemo,
  LoadingButton: NativeLoadingButtonDemo,
  Loader: NativeLoaderDemo,
  LoadingIndicator: NativeLoadingIndicatorDemo,
  Meter: NativeMeterDemo,
  NavigationRail: NativeNavigationRailDemo,
  NumberField: NativeNumberFieldDemo,
  Pagination: NativePaginationDemo,
  Popover: NativePopoverDemo,
  Progress: NativeProgressDemo,
  RadioGroup: NativeRadioGroupDemo,
  RadioGroupItem: NativeRadioGroupDemo,
  RichTooltip: NativeRichTooltipDemo,
  ScrollArea: NativeScrollAreaDemo,
  Search: NativeSearchDemo,
  SegmentedButton: NativeSegmentedButtonDemo,
  SettingsRow: NativeSettingsRowDemo,
  Snackbar: NativeSnackbarDemo,
  // The provider and its viewport are one surface: the queue lives in the
  // provider, the viewport paints it. Same demo, both export names.
  SnackbarProvider: NativeSnackbarDemo,
  SnackbarViewport: NativeSnackbarDemo,
  Separator: NativeSeparatorDemo,
  Skeleton: NativeSkeletonDemo,
  Slider: NativeSliderDemo,
  Split: NativeSplitDemo,
  SplitButton: NativeSplitButtonDemo,
  StateLayer: NativeStateLayerDemo,
  StatusBar: NativeStatusBarDemo,
  Switch: NativeSwitchDemo,
  Text: NativeTextDemo,
  Textarea: NativeTextareaDemo,
  ThemeToggle: NativeThemeToggleDemo,
  TimePicker: NativeTimePickerDemo,
  Toggle: NativeToggleDemo,
  ToggleGroup: NativeToggleGroupDemo,
  Tooltip: NativeTooltipDemo,
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
