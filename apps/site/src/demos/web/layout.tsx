/**
 * Live demos: disclosure, navigation, overlays, and data display.
 */
import {
  Accordion,
  Button,
  Collapsible,
  Command,
  ContextMenu,
  Dialog,
  Drawer,
  Menu,
  Meter,
  NavigationMenu,
  Pagination,
  Popover,
  PreviewCard,
  Progress,
  ScrollArea,
  SegmentedButton,
  Select,
  Sheet,
  Table,
  Tabs,
  Toolbar,
  Tooltip,
} from "@xoroh/kern";
import { Preview, PreviewStack, Row } from "../../components/preview/preview";

export function AccordionDemo() {
  return (
    <Preview
      label="Accordion — Root · Item · Header · Trigger · Panel"
      span={3}
    >
      <div className="w-full max-w-sm">
        <Accordion.Root>
          {[
            [
              "What is Kern?",
              "An open-source design system following Material Design 3.",
            ],
            [
              "Which platforms?",
              "Web (@xoroh/kern) and React Native (@xoroh/kern-native).",
            ],
            ["What licence?", "Apache-2.0."],
          ].map(([question, answer]) => (
            <Accordion.Item key={question} value={question}>
              <Accordion.Header>
                <Accordion.Trigger>{question}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>{answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </Preview>
  );
}

export function CollapsibleDemo() {
  return (
    <Preview label="Collapsible — single show/hide region" span={3}>
      <div className="w-full max-w-sm">
        <Collapsible.Root>
          <Collapsible.Trigger>What is included?</Collapsible.Trigger>
          <Collapsible.Panel>
            <p className="m-0 text-sm">
              Tokens, components, theme presets and a CLI scaffold.
            </p>
          </Collapsible.Panel>
        </Collapsible.Root>
      </div>
    </Preview>
  );
}

export function TabsDemo() {
  return (
    <Preview label="Tabs — Root · List · Tab · Panel" span={3}>
      <div className="w-full max-w-md">
        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="api">API</Tabs.Tab>
            <Tabs.Tab value="changelog">Changelog</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">
            Every component ships with tokens and states.
          </Tabs.Panel>
          <Tabs.Panel value="api">
            Props are typed; variants are a discriminated union.
          </Tabs.Panel>
          <Tabs.Panel value="changelog">
            Semantic versioning, per-package changesets.
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </Preview>
  );
}

/**
 * SegmentedButton — coded against the S1.2 ruling: the group owns exclusivity
 * (`multiple={false}`, selection behaviour), an item reports its own pressed
 * state. The `variants` axis web shipped earlier is being realigned to this
 * meaning in Stage 2b (kern-lead), so the demo documents selection behaviour.
 */
export function SegmentedButtonDemo() {
  return (
    <PreviewStack>
      <Preview label="exclusive — one segment pressed at a time" span={3}>
        <SegmentedButton.Root defaultValue={["day"]} aria-label="Range">
          <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
          <SegmentedButton.Item value="week">Week</SegmentedButton.Item>
          <SegmentedButton.Item value="month">Month</SegmentedButton.Item>
        </SegmentedButton.Root>
      </Preview>
      <Preview label="with a disabled segment" span={3}>
        <SegmentedButton.Root defaultValue={["list"]} aria-label="View">
          <SegmentedButton.Item value="list">List</SegmentedButton.Item>
          <SegmentedButton.Item value="grid">Grid</SegmentedButton.Item>
          <SegmentedButton.Item value="board" disabled>
            Board
          </SegmentedButton.Item>
        </SegmentedButton.Root>
      </Preview>
    </PreviewStack>
  );
}

export function MenuDemo() {
  return (
    <Preview label="Menu — open it" span={3}>
      <div className="w-full max-w-xs">
        <Menu.Root>
          <Menu.Trigger>
            <Button variant="tonal">Account menu</Button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.GroupLabel>Account</Menu.GroupLabel>
            <Menu.Item>Profile</Menu.Item>
            <Menu.Item>Billing</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Sign out</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </div>
    </Preview>
  );
}

export function ContextMenuDemo() {
  return (
    <Preview label="ContextMenu — right-click the area" span={3}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-(--md-sys-shape-corner-small) border border-dashed border-(--md-sys-color-outline-variant) text-sm text-(--md-sys-color-on-surface-variant)">
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Cut</ContextMenu.Item>
          <ContextMenu.Item>Copy</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Paste</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </Preview>
  );
}

export function NavigationMenuDemo() {
  return (
    <Preview label="NavigationMenu" span={3}>
      <div className="w-full max-w-md">
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="/components/web">
                  Web components
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/components/mobile">
                  Mobile components
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </Preview>
  );
}

export function ToolbarDemo() {
  return (
    <Preview label="Toolbar — Root · Group · Button · Separator" span={3}>
      <Toolbar.Root aria-label="Text formatting">
        <Toolbar.Group>
          <Toolbar.Button aria-label="Bold">B</Toolbar.Button>
          <Toolbar.Button aria-label="Italic">I</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Button aria-label="Align left">≡</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>
    </Preview>
  );
}

const COMMANDS = [
  { value: "new", label: "New project", shortcut: "\u2318N" },
  { value: "settings", label: "Settings", shortcut: "\u2318," },
  { value: "delete", label: "Delete project", disabled: true },
];

export function CommandDemo() {
  return (
    <Preview label="Command — filter the list" span={3}>
      <div className="w-full max-w-sm">
        <Command.Root options={COMMANDS}>
          <Command.Input placeholder="Type a command" />
          <Command.Content>
            <Command.List>
              <Command.Empty>No matching command.</Command.Empty>
              <Command.GroupLabel>Navigation</Command.GroupLabel>
              <Command.Item value="new" shortcut="⌘N">
                New project
              </Command.Item>
              <Command.Item value="settings" shortcut="⌘,">
                Settings
              </Command.Item>
              <Command.Separator />
              <Command.GroupLabel>Danger</Command.GroupLabel>
              <Command.Item value="delete" disabled>
                Delete project
              </Command.Item>
            </Command.List>
          </Command.Content>
        </Command.Root>
      </div>
    </Preview>
  );
}

export function DialogDemo() {
  return (
    <Preview label="Dialog — open it" span={3}>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="tonal">Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete this project?</Dialog.Title>
          <Dialog.Description>
            This removes the project and its build history. It cannot be undone.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button className="bg-(--md-sys-color-error) text-(--md-sys-color-on-error) hover:bg-(--md-sys-color-error)/90">
                Delete
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Preview>
  );
}

export function DrawerDemo() {
  return (
    <Preview label="Drawer — bottom-anchored, open it" span={3}>
      <Drawer.Root>
        <Drawer.Trigger>
          <Button variant="tonal">Open drawer</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Share this project</Drawer.Title>
          <Drawer.Description>
            Anyone with the link can view the read-only build.
          </Drawer.Description>
          <div className="mt-6 flex justify-end">
            <Drawer.Close>
              <Button variant="tonal">Done</Button>
            </Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </Preview>
  );
}

export function SheetDemo() {
  return (
    <Preview label="Sheet — side: right · side: left" span={3}>
      <Row>
        <Sheet.Root>
          <Sheet.Trigger>
            <Button variant="tonal">Right sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="right">
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Narrow the result set.</Sheet.Description>
          </Sheet.Content>
        </Sheet.Root>
        <Sheet.Root>
          <Sheet.Trigger>
            <Button variant="tonal">Left sheet</Button>
          </Sheet.Trigger>
          <Sheet.Content side="left">
            <Sheet.Title>Navigation</Sheet.Title>
            <Sheet.Description>Move between projects.</Sheet.Description>
          </Sheet.Content>
        </Sheet.Root>
      </Row>
    </Preview>
  );
}

export function PopoverDemo() {
  return (
    <Preview label="Popover — anchored, non-modal" span={3}>
      <div className="w-full max-w-xs">
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="tonal">Open popover</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Keyboard shortcut</Popover.Title>
            <Popover.Description>
              Press ⌘K anywhere to open the command menu.
            </Popover.Description>
          </Popover.Content>
        </Popover.Root>
      </div>
    </Preview>
  );
}

export function PreviewCardDemo() {
  return (
    <Preview label="PreviewCard — hover the trigger" span={3}>
      <div className="w-full max-w-xs">
        <PreviewCard.Root>
          <PreviewCard.Trigger>
            <Button variant="ghost">@xoroh</Button>
          </PreviewCard.Trigger>
          <PreviewCard.Content>
            <p className="m-0 text-sm">
              The open-source design system following Material Design 3.
            </p>
          </PreviewCard.Content>
        </PreviewCard.Root>
      </div>
    </Preview>
  );
}

export function TooltipDemo() {
  return (
    <Preview label="Tooltip — hover or focus" span={3}>
      <div className="w-full max-w-xs">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button variant="tonal">Deploy</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>Deploy the current build</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </Preview>
  );
}

export function SelectDemo() {
  return (
    <Preview label="Select — open the trigger" span={3}>
      <div className="w-full max-w-xs">
        <Select.Root>
          <Select.Trigger aria-label="Region">
            <Select.Value placeholder="Choose a region" />
          </Select.Trigger>
          <Select.Content>
            <Select.GroupLabel>Europe</Select.GroupLabel>
            <Select.Item value="eu-west">
              <Select.ItemText>eu-west-1</Select.ItemText>
            </Select.Item>
            <Select.Item value="eu-central">
              <Select.ItemText>eu-central-1</Select.ItemText>
            </Select.Item>
            <Select.Separator />
            <Select.GroupLabel>Americas</Select.GroupLabel>
            <Select.Item value="us-east">
              <Select.ItemText>us-east-1</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </Preview>
  );
}

export function ProgressDemo() {
  return (
    <Preview label="Progress — determinate, with label and value" span={3}>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Progress.Root value={60}>
          <Progress.Label>Uploading</Progress.Label>
          <Progress.Value />
        </Progress.Root>
        <Progress.Root value={25}>
          <Progress.Label>Indexing</Progress.Label>
          <Progress.Value />
        </Progress.Root>
      </div>
    </Preview>
  );
}

export function MeterDemo() {
  return (
    <Preview label="Meter — static scalar" span={3}>
      <div className="w-full max-w-sm">
        <Meter.Root value={0.4}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value />
        </Meter.Root>
      </div>
    </Preview>
  );
}

export function PaginationDemo() {
  return (
    <Preview label="Pagination — sliding window with gaps" span={3}>
      <Pagination count={24} defaultPage={12} aria-label="Pagination" />
    </Preview>
  );
}

export function ScrollAreaDemo() {
  const ROWS = Array.from({ length: 20 }, (_, i) => ({
    id: `row-${i + 1}`,
    n: i + 1,
  }));
  return (
    <Preview label="ScrollArea — clipped vertical overflow" span={3}>
      <ScrollArea.Root className="h-40 w-full max-w-xs rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)">
        <ScrollArea.Viewport className="h-full p-4">
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {Array.from({ length: 20 }, (_, index) => (
              // The row's own ordinal is a stable identity for a fixed, never-
              // reordered list, and it is already in hand — so no index key.
              <li key={`scroll-row-${ROWS[index].id}`}>
                Scrollable row {ROWS[index].n}
              </li>
            ))}
          </ul>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Preview>
  );
}

export function TableDemo() {
  return (
    <Preview label="Table" span={3}>
      <div className="w-full max-w-lg">
        <Table.Root>
          <Table.Caption>Recent deploys</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.Header>Service</Table.Header>
              <Table.Header>Status</Table.Header>
              <Table.Header>Duration</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>site</Table.Cell>
              <Table.Cell>Live</Table.Cell>
              <Table.Cell>42s</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>api</Table.Cell>
              <Table.Cell>Live</Table.Cell>
              <Table.Cell>1m 12s</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    </Preview>
  );
}
