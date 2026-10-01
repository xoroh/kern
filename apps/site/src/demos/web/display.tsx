/**
 * Live demos: display, actions, and containment components.
 *
 * Every export named in the manifest is rendered here as real markup with its
 * real variants and states. Nothing is described in prose instead of shown.
 */
import {
  Avatar,
  Badge,
  Banner,
  BootIndicator,
  Button,
  ButtonGroup,
  Card,
  Chip,
  CircularProgress,
  EmptyState,
  Fab,
  Kbd,
  Label,
  LinearProgress,
  ListItem,
  Loader,
  LoadingButton,
  PageLoader,
  Separator,
  Skeleton,
  Text,
} from "@xoroh/kern";
import {
  Preview,
  PreviewGrid,
  PreviewStack,
  Row,
} from "../../components/preview/preview";

const Gear = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5m7.43-2.53a7.9 7.9 0 0 0 0-1.94l2.05-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7 7 0 0 0-1.67-.97l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.7 7.7 0 0 0-1.67.97l-2.39-.96a.5.5 0 0 0-.6.22L2.4 8.81a.5.5 0 0 0 .12.64l2.05 1.58a8 8 0 0 0 0 1.94l-2.05 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.52.4 1.08.72 1.67.97l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7 7 0 0 0 1.67-.97l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64Z" />
  </svg>
);

const Plus = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2Z" />
  </svg>
);

export function ButtonDemo() {
  return (
    <PreviewStack>
      <Preview label="variant — primary · tonal · ghost · destructive" span={3}>
        <Row>
          <Button>Primary</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </Row>
      </Preview>
      <Preview label="size — default · sm · icon" span={3}>
        <Row>
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" aria-label="Settings">
            <Gear />
          </Button>
        </Row>
      </Preview>
      <Preview label="state — disabled" span={3}>
        <Row>
          <Button disabled>Disabled</Button>
          <Button variant="tonal" disabled>
            Disabled tonal
          </Button>
        </Row>
      </Preview>
    </PreviewStack>
  );
}

export function ButtonGroupDemo() {
  return (
    <PreviewStack>
      <Preview label="orientation — horizontal" span={3}>
        <ButtonGroup>
          <Button variant="tonal">Left</Button>
          <Button variant="tonal">Middle</Button>
          <Button variant="tonal">Right</Button>
        </ButtonGroup>
      </Preview>
      <Preview label="orientation — vertical" span={3}>
        <ButtonGroup orientation="vertical">
          <Button variant="tonal">Top</Button>
          <Button variant="tonal">Bottom</Button>
        </ButtonGroup>
      </Preview>
    </PreviewStack>
  );
}

export function FabDemo() {
  return (
    <PreviewStack>
      <Preview label="variant — primary · tonal" span={3}>
        <Row>
          <Fab>
            <Plus />
            Compose
          </Fab>
          <Fab variant="tonal">
            <Plus />
            Compose
          </Fab>
        </Row>
      </Preview>
      <Preview label="size — default · sm · icon" span={3}>
        <Row>
          <Fab size="sm">Small</Fab>
          <Fab size="icon" aria-label="Add">
            <Plus />
          </Fab>
        </Row>
      </Preview>
    </PreviewStack>
  );
}

export function LoadingButtonDemo() {
  return (
    <Preview label="loading — embedded progress, interaction blocked" span={3}>
      <Row>
        <LoadingButton loading>Save</LoadingButton>
        <LoadingButton loading value={0.6} variant="tonal">
          Uploading
        </LoadingButton>
        <LoadingButton>Save</LoadingButton>
      </Row>
    </Preview>
  );
}

export function TextDemo() {
  return (
    <Preview label="variant — body · label · title · headline" span={3}>
      <div className="flex w-full flex-col items-start gap-2 text-left">
        <Text variant="headline">Headline small</Text>
        <Text variant="title">Title large</Text>
        <Text variant="label">Label large</Text>
        <Text variant="body">Body medium — the M3 default.</Text>
      </div>
    </Preview>
  );
}

export function BadgeDemo() {
  return (
    <Preview label="variant — count · dot">
      <Row>
        <Badge>7</Badge>
        <Badge aria-label="3 unread">3</Badge>
        <Badge variant="dot" aria-label="New activity" />
      </Row>
    </Preview>
  );
}

export function ChipDemo() {
  return (
    <PreviewStack>
      <Preview label="variant — assist · suggestion" span={3}>
        <Row>
          <Chip>Assist chip</Chip>
          <Chip variant="suggestion">Suggestion</Chip>
        </Row>
      </Preview>
      <Preview label="variant — filter (click a chip to toggle)" span={3}>
        <Row>
          <Chip variant="filter" defaultSelected>
            All
          </Chip>
          <Chip variant="filter">Unread</Chip>
          <Chip variant="filter">Starred</Chip>
        </Row>
      </Preview>
      <Preview label="state — disabled">
        <Chip disabled>Disabled</Chip>
      </Preview>
    </PreviewStack>
  );
}

export function CardDemo() {
  return (
    <PreviewGrid>
      {(["filled", "outlined", "elevated"] as const).map((variant) => (
        <Preview key={variant} label={`variant — ${variant}`}>
          <Card variant={variant} className="w-full max-w-56 p-6 text-left">
            <p className="m-0 font-medium">Card content</p>
            <p className="m-0 mt-1 text-sm text-(--md-sys-color-on-surface-variant)">
              Cards group related content.
            </p>
          </Card>
        </Preview>
      ))}
    </PreviewGrid>
  );
}

export function AvatarDemo() {
  return (
    <PreviewGrid>
      {(["sm", "default", "lg"] as const).map((size) => (
        <Preview key={size} label={`size — ${size}`}>
          <Avatar.Root size={size}>
            <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
          </Avatar.Root>
        </Preview>
      ))}
      <Preview label="Avatar.Image + Avatar.Fallback" span={3}>
        <Avatar.Root size="lg">
          <Avatar.Image
            src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%23475569'/%3E%3Ccircle cx='28' cy='22' r='9' fill='%23a5b4fc'/%3E%3Cpath d='M10 56a18 18 0 0 1 36 0Z' fill='%23a5b4fc'/%3E%3C/svg%3E"
            alt="Portrait"
          />
          <Avatar.Fallback delay={0}>KO</Avatar.Fallback>
        </Avatar.Root>
      </Preview>
    </PreviewGrid>
  );
}

export function KbdDemo() {
  return (
    <Preview label="Kbd — semantic key markup">
      <Row>
        <span className="flex items-center gap-1 text-sm">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd>
        </span>
      </Row>
    </Preview>
  );
}

export function LabelDemo() {
  return (
    <Preview label="Label">
      <Label className="text-sm font-medium">Email address</Label>
    </Preview>
  );
}

export function SeparatorDemo() {
  return (
    <Preview label="Separator" span={3}>
      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <span className="text-sm">Above</span>
        <Separator className="w-full" />
        <span className="text-sm">Below</span>
      </div>
    </Preview>
  );
}

export function SkeletonDemo() {
  return (
    <Preview label="Skeleton" span={3}>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Preview>
  );
}

export function ListItemDemo() {
  return (
    <Preview label="headline · supporting · leading · trailing" span={3}>
      <ul className="w-full max-w-sm divide-y divide-(--md-sys-color-outline-variant)">
        <ListItem
          headline="Inbox"
          supporting="12 unread"
          leading={
            <Avatar.Root size="sm">
              <Avatar.Fallback delay={0}>IN</Avatar.Fallback>
            </Avatar.Root>
          }
          trailing={<Badge>12</Badge>}
        />
        <ListItem
          headline="Sent"
          supporting="Last 7 days"
          leading={
            <Avatar.Root size="sm">
              <Avatar.Fallback delay={0}>SE</Avatar.Fallback>
            </Avatar.Root>
          }
        />
      </ul>
    </Preview>
  );
}

export function EmptyStateDemo() {
  return (
    <PreviewStack>
      <Preview label="with visual, description and action" span={3}>
        <EmptyState
          visual={<Gear className="size-8" />}
          title="No messages yet"
          description="Compose a message and it will show up here."
          action={<Button variant="tonal">Compose</Button>}
        />
      </Preview>
      <Preview label="title only" span={3}>
        <EmptyState title="Nothing to review" />
      </Preview>
    </PreviewStack>
  );
}

export function BannerDemo() {
  return (
    <PreviewStack>
      <Preview label="variant — info · success · warning · error" span={3}>
        <div className="flex w-full max-w-lg flex-col gap-2">
          {(["info", "success", "warning", "error"] as const).map((variant) => (
            <Banner key={variant} variant={variant}>
              A {variant} banner carries one message.
            </Banner>
          ))}
        </div>
      </Preview>
      <Preview label="dismissible" span={3}>
        <div className="w-full max-w-lg">
          <Banner variant="warning" onDismiss={() => {}}>
            Dismissible banners pass onDismiss.
          </Banner>
        </div>
      </Preview>
    </PreviewStack>
  );
}

export function LoaderDemo() {
  return (
    <Preview label="size — sm · default · lg">
      <Row>
        <Loader size="sm" label="Loading" />
        <Loader label="Loading" />
        <Loader size="lg" label="Loading" />
      </Row>
    </Preview>
  );
}

export function LinearProgressDemo() {
  return (
    <PreviewStack>
      <Preview label="value 0.25" span={3}>
        <div className="w-full max-w-sm">
          <LinearProgress value={0.25} label="Uploading" />
        </div>
      </Preview>
      <Preview label="value 0.75" span={3}>
        <div className="w-full max-w-sm">
          <LinearProgress value={0.75} label="Almost done" />
        </div>
      </Preview>
    </PreviewStack>
  );
}

export function CircularProgressDemo() {
  return (
    <PreviewStack>
      <Preview label="determinate — value 0.75" span={3}>
        <Row>
          <CircularProgress value={0.75} label="75 percent" />
        </Row>
      </Preview>
      <Preview label="indeterminate — omit value" span={3}>
        <Row>
          <CircularProgress label="Loading" />
        </Row>
      </Preview>
    </PreviewStack>
  );
}

export function PageLoaderDemo() {
  return (
    <Preview label="PageLoader — centred in-content loading surface" span={3}>
      <div className="h-64 w-full overflow-hidden rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)">
        <PageLoader label="Loading components" className="min-h-64" />
      </div>
    </Preview>
  );
}

export function BootIndicatorDemo() {
  return (
    <Preview label="BootIndicator — tone surface · tone inverse" span={3}>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-56 overflow-hidden rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant)">
          <BootIndicator signature="Xoroh" className="min-h-56" />
        </div>
        <div className="h-56 overflow-hidden rounded-(--md-sys-shape-corner-small)">
          <BootIndicator tone="inverse" className="min-h-56" />
        </div>
      </div>
    </Preview>
  );
}
