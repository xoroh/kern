import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  ButtonGroup,
  CsvExportButton,
  ExtendedFab,
  Fab,
  FabMenu,
  IconButton,
  LinkButton,
  LoadingButton,
  PulseButton,
  SegmentedButton,
  SplitButton,
  ThemeToggle,
  Toggle,
  ToggleGroup,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  CategoryShowcaseShell,
  ExpressiveSizeLadderStage,
  InteractivePlaygroundStage,
  ShapeVsPulseComparisonStage,
  ShowcaseSection,
  SplitThemeAndPlatformFrame,
  StateMatrixStage,
} from "../../components/showcase-kit";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL_LG,
  T_SMALL_TITLE,
} from "../../domains/shared/systems/type-scale";
import {
  FOCUS_RING,
  INK,
  INK_SOFT,
  STAGE,
  STRIP,
  TRANSITION,
} from "../../domains/shared/systems/ui";
import { familyHref } from "../../systems/tier-nav";

export const Route = createFileRoute("/core/buttons")({
  head: () =>
    routeHead(
      "M3 Expressive Buttons Showcase",
      "Flagship interactive showcase for every Material 3 Expressive button in Kern: Button, PulseButton, IconButton, SplitButton, ButtonGroup, SegmentedButton, FAB, ExtendedFAB, FabMenu, LoadingButton, LinkButton, Toggle, ToggleGroup, and CsvExportButton.",
    ),
  component: ButtonsFlagshipShowcase,
});

const BUTTON_FAMILY_CATALOG = [
  {
    slug: "button",
    name: "Button",
    role: "5 M3 variants, 5 colors, 9 size keys, active press corner morph, pill ↔ square toggle.",
  },
  {
    slug: "pulse-button",
    name: "PulseButton",
    role: "Shape-locked silhouette (data-shape-stable=true) with fast-spatial spring scale pulse and radial bloom.",
  },
  {
    slug: "icon-button",
    name: "IconButton",
    role: "4 variants (standard/filled/tonal/outlined), 3 widths (narrow/default/wide), selectedIcon swap, 48dp hit target.",
  },
  {
    slug: "split-button",
    name: "SplitButton",
    role: "Primary action + menu trigger with filled/tonal/outlined variants, 6 sizes, and 180° chevron rotation.",
  },
  {
    slug: "button-group",
    name: "ButtonGroup",
    role: "Connected (joined inner corners) and standard (8dp gap) group container for Button, PulseButton, IconButton, Toggle.",
  },
  {
    slug: "segmented-button",
    name: "SegmentedButton",
    role: "Single or multi-select M3 segmented strip with density -3..0 and animated selection checkmark.",
  },
  {
    slug: "fab",
    name: "Fab",
    role: "Floating action button across 4 sizes (40/56/80/96dp) and 7 container/expressive-fill color pairs.",
  },
  {
    slug: "extended-fab",
    name: "ExtendedFab",
    role: "Label + icon floating action button with imperative collapse()/expand() handle and size ladder.",
  },
  {
    slug: "fab-menu",
    name: "FabMenu",
    role: "M3 Expressive speed-dial menu morphing the trigger into a close button with up to 6 staggered actions.",
  },
  {
    slug: "loading-button",
    name: "LoadingButton",
    role: "Async action button keeping its exact footprint while rendering indeterminate or determinate progress.",
  },
  {
    slug: "link-button",
    name: "LinkButton",
    role: "Navigation anchor styled with the full M3 button variant/size/shape contract.",
  },
  {
    slug: "toggle",
    name: "Toggle",
    role: "Two-state pressable button with aria-pressed and M3 selected container roles.",
  },
  {
    slug: "toggle-group",
    name: "ToggleGroup",
    role: "Single or multiple selection toolbar built over Toggle primitives.",
  },
  {
    slug: "csv-export-button",
    name: "CsvExportButton",
    role: "RFC-4180 CSV builder + one-click download/share action button.",
  },
] as const;

function ButtonsFlagshipShowcase() {
  const [extCollapsed, setExtCollapsed] = useState(false);
  const [segVal, setSegVal] = useState<string>("day");
  const [csvFeedback, setCsvFeedback] = useState<string>("");

  return (
    <CategoryShowcaseShell
      kicker="M3 Expressive · Flagship Category Showcase"
      title="Buttons & Expressive Actions"
      subtitle="Every Material 3 Expressive button primitive and composite in Kern — from corner-morphing Button and shape-locked PulseButton to IconButton, SplitButton, ButtonGroup, SegmentedButton, and the FAB family. 100% token-driven across Web and React Native."
      stats={[
        { label: "Button family exports", value: "14 components" },
        { label: "M3 Expressive sizes", value: "XS (32) → XL (136px)" },
        { label: "Baseline height token", value: "40px (space-500)" },
        { label: "Spring physics source", value: "@xoroh/kern-tokens" },
      ]}
      sections={[
        { id: "playground", label: "Interactive Playground", badge: "Live" },
        {
          id: "shape-vs-pulse",
          label: "Corner Morph vs Pulse Lock",
          badge: "New",
        },
        { id: "size-ladder", label: "Size Ladder (XS–XL)", badge: "5 rungs" },
        { id: "state-matrix", label: "5×5 Variant & State Matrix" },
        { id: "groups-and-split", label: "Groups, Split & Segmented" },
        { id: "fab-family", label: "FAB, ExtendedFAB & FabMenu" },
        { id: "async-and-utilities", label: "Loading, Link & Export" },
        { id: "parity-and-catalog", label: "Web / Native Parity & Catalog" },
      ]}
    >
      <ShowcaseSection
        id="playground"
        kicker="01 · Interactive Workbench"
        title="Live Button, PulseButton & IconButton Playground"
        description="Switch between M3 Expressive Button (active press corner morph), PulseButton (locked border-radius + fast-spatial spring scale pulse), and IconButton across all variants, colors, sizes, shapes, and surface containers."
      >
        <InteractivePlaygroundStage />
      </ShowcaseSection>

      <ShowcaseSection
        id="shape-vs-pulse"
        kicker="02 · Motion & Silhouette Architecture (D1024 C1 & C4)"
        title="Shape-Morphing Button vs Shape-Stable PulseButton"
        description="Both components consume the shared button-shared.ts variant/color/size tables and @xoroh/kern-tokens spring physics. Choose Button when you want M3 Expressive corner morphing on press and toggle; choose PulseButton when surrounding layout geometry requires a locked silhouette."
      >
        <ShapeVsPulseComparisonStage />
      </ShowcaseSection>

      <ShowcaseSection
        id="size-ladder"
        kicker="03 · M3 Expressive Size Ladder (D1024 C2 & C3)"
        title="Five Expressive Rungs from XS (32px) to XL (136px)"
        description="All 7 --comp-*-container-height tokens resolve to 40px (--sys-spacing-space-500) at the default S rung, scaling cleanly from compact toolbars up to hero call-to-action surfaces."
      >
        <ExpressiveSizeLadderStage />
      </ShowcaseSection>

      <ShowcaseSection
        id="state-matrix"
        kicker="04 · Emphasis × Semantic Color × Interaction States"
        title="Complete 5-Variant × 5-Color × State Matrix"
        description="Inspect every variant (filled, tonal, elevated, outlined, text) across all five semantic color roles (primary, secondary, tertiary, danger, warning) and interaction states."
      >
        <StateMatrixStage />
      </ShowcaseSection>

      <ShowcaseSection
        id="groups-and-split"
        kicker="05 · Connected Layouts & Compound Triggers"
        title="ButtonGroup, SplitButton, SegmentedButton & ToggleGroup"
        description="Connected button groups collapse inner corners across Button, PulseButton, IconButton, and Toggle children. SplitButton pairs a primary action with a menu trigger across filled, tonal, and outlined variants and six sizes, rotating its chevron 180° when open."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${STAGE} flex flex-col gap-5 p-6`}>
            <h3
              id="showcase-button-group"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              ButtonGroup — Connected &amp; Standard (Button + PulseButton +
              IconButton)
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonGroup>
                <Button variant="tonal">Day</Button>
                <Button variant="tonal">Week</Button>
                <Button variant="tonal">Month</Button>
              </ButtonGroup>
              <ButtonGroup>
                <PulseButton variant="outlined">Cut</PulseButton>
                <PulseButton variant="outlined">Copy</PulseButton>
                <PulseButton variant="outlined">Paste</PulseButton>
              </ButtonGroup>
              <ButtonGroup variant="standard">
                <IconButton
                  label="Align left"
                  variant="tonal"
                  icon={<Icon name="add" />}
                />
                <IconButton
                  label="Align center"
                  variant="tonal"
                  icon={<Icon name="edit" />}
                />
              </ButtonGroup>
            </div>
          </div>

          <div className={`${STAGE} flex flex-col gap-5 p-6`}>
            <h3
              id="showcase-split-button"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              SplitButton — Variants (filled · tonal · outlined) &amp; Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <SplitButton
                label="Deploy"
                variant="filled"
                icon={<Icon name="bolt" />}
                actions={[
                  { key: "staging", label: "Deploy to staging" },
                  { key: "canary", label: "Canary rollout (10%)" },
                  { key: "prod", label: "Force production", separated: true },
                ]}
              />
              <SplitButton
                label="Schedule"
                variant="tonal"
                size="md"
                actions={[
                  { key: "1h", label: "In 1 hour" },
                  { key: "tomorrow", label: "Tomorrow 09:00" },
                ]}
              />
              <SplitButton
                label="Export"
                variant="outlined"
                size="sm"
                actions={[
                  { key: "csv", label: "Export CSV" },
                  { key: "json", label: "Export JSON" },
                ]}
              />
            </div>
          </div>

          <div className={`${STAGE} flex flex-col gap-5 p-6`}>
            <h3
              id="showcase-segmented-button"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              SegmentedButton — Density &amp; Checkmark Selection
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <SegmentedButton.Root
                aria-label="Calendar view"
                value={[segVal]}
                onValueChange={(next: string[]) => {
                  if (next[0]) setSegVal(next[0]);
                }}
              >
                <SegmentedButton.Item value="day">Day</SegmentedButton.Item>
                <SegmentedButton.Item value="week">Week</SegmentedButton.Item>
                <SegmentedButton.Item value="month">Month</SegmentedButton.Item>
              </SegmentedButton.Root>
              <SegmentedButton.Root
                aria-label="Compact density"
                defaultValue={["list"]}
              >
                <SegmentedButton.Item value="list" size="sm">
                  List
                </SegmentedButton.Item>
                <SegmentedButton.Item value="grid" size="sm">
                  Grid
                </SegmentedButton.Item>
              </SegmentedButton.Root>
            </div>
          </div>

          <div className={`${STAGE} flex flex-col gap-5 p-6`}>
            <h3
              id="showcase-toggle-group"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              Toggle &amp; ToggleGroup — Formatting &amp; Filter Strips
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Toggle defaultPressed aria-label="Pin item">
                Pinned
              </Toggle>
              <ToggleGroup.Root defaultValue={["bold"]} aria-label="Formatting">
                <ToggleGroup.Item value="bold" aria-label="Bold">
                  Bold
                </ToggleGroup.Item>
                <ToggleGroup.Item value="italic" aria-label="Italic">
                  Italic
                </ToggleGroup.Item>
                <ToggleGroup.Item value="underline" aria-label="Underline">
                  Underline
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="fab-family"
        kicker="06 · Floating Action Surfaces"
        title="FAB, ExtendedFAB & Speed-Dial FabMenu"
        description="M3 Expressive floating action buttons across small (40dp, 12px radius), default (56dp, 16px radius), medium (80dp, 20px radius), and large (96dp, 28px radius), seven color pairs, collapsible ExtendedFab, and speed-dial FabMenu."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={`${STAGE} flex flex-col gap-4 p-6`}>
            <h3
              id="showcase-fab-sizes"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              Fab — Sizes &amp; Expressive Fills
            </h3>
            <div className="flex flex-wrap items-end gap-3">
              <Fab size="sm" color="surface" aria-label="Small FAB">
                <Icon name="add" />
              </Fab>
              <Fab color="primary" aria-label="Default FAB">
                <Icon name="edit" />
              </Fab>
              <Fab size="md" color="secondary-fill" aria-label="Medium FAB">
                <Icon name="bolt" />
              </Fab>
              <Fab size="large" color="tertiary-fill" aria-label="Large FAB">
                <Icon name="favorite" />
              </Fab>
            </div>
          </div>

          <div className={`${STAGE} flex flex-col gap-4 p-6`}>
            <div className="flex items-center justify-between gap-2">
              <h3
                id="showcase-extended-fab"
                className={`m-0 ${T_SMALL_TITLE} ${INK}`}
              >
                ExtendedFab — Collapsible
              </h3>
              <button
                type="button"
                onClick={() => setExtCollapsed((c) => !c)}
                className={`inline-flex min-h-8 cursor-pointer items-center rounded-(--sys-shape-corner-full) border-0 bg-(--sys-color-surface-container-highest) px-3 ${T_BODY_SM} ${INK} ${TRANSITION} ${FOCUS_RING}`}
              >
                {extCollapsed ? "Expand label" : "Collapse to FAB"}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 py-2">
              <ExtendedFab
                label="New message"
                icon={<Icon name="edit" />}
                value={extCollapsed}
                onValueChange={setExtCollapsed}
              />
              <ExtendedFab
                label="Quick route"
                color="secondary"
                icon={<Icon name="bolt" />}
              />
            </div>
          </div>

          <div className={`${STAGE} flex flex-col gap-4 p-6`}>
            <h3
              id="showcase-fab-menu"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              FabMenu — Speed Dial (2–6 items)
            </h3>
            <div className="flex items-center gap-4 py-2">
              <FabMenu
                label="Create item"
                icon={<Icon name="add" />}
                actions={[
                  { key: "doc", label: "New document", onSelect: () => {} },
                  {
                    key: "sheet",
                    label: "New spreadsheet",
                    onSelect: () => {},
                  },
                  { key: "upload", label: "Upload file", onSelect: () => {} },
                ]}
              />
              <span className={`${T_BODY_SM} ${INK_SOFT}`}>
                Click the FAB to fan out speed-dial actions
              </span>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="async-and-utilities"
        kicker="07 · Async Feedback, Navigation & Data Export"
        title="LoadingButton, LinkButton, CsvExportButton & ThemeToggle"
        description="Specialized button compositions built on the shared Button primitive: non-resizing async progress (indeterminate ring, determinate arc, or expressive dots), semantic navigation links, RFC-4180 CSV export, and theme switching."
      >
        <div className={`${STAGE} grid grid-cols-1 gap-6 p-6 md:grid-cols-2`}>
          <div className="flex flex-col gap-3">
            <h3
              id="showcase-loading-buttons"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              LoadingButton — Indeterminate, Determinate &amp; Dots
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <LoadingButton loading>Saving...</LoadingButton>
              <LoadingButton loading value={0.68} variant="tonal">
                Uploading 68%
              </LoadingButton>
              <LoadingButton loading loaderStyle="dots" variant="outlined">
                Syncing
              </LoadingButton>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3
              id="showcase-link-and-csv"
              className={`m-0 ${T_SMALL_TITLE} ${INK}`}
            >
              LinkButton, CsvExportButton &amp; ThemeToggle
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton href="/core/button" variant="tonal">
                Open Button docs
              </LinkButton>
              <CsvExportButton
                filename="kern-buttons.csv"
                columns={[
                  { key: "component", title: "Component" },
                  { key: "height", title: "Default Height" },
                ]}
                rows={[
                  { component: "Button", height: "40px" },
                  { component: "PulseButton", height: "40px" },
                ]}
                onExport={(_csv, file) =>
                  setCsvFeedback(`Exported ${file} (2 rows)`)
                }
              />
              <ThemeToggle />
            </div>
            {csvFeedback ? (
              <span className={`${T_CODE} ${INK_SOFT}`}>{csvFeedback}</span>
            ) : null}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="parity-and-catalog"
        kicker="08 · Cross-Platform Parity & Reference Catalog"
        title="Web & React Native Parity + All 14 Button Pages"
        description="Every button family component maintains Web (@xoroh/kern) and React Native (@xoroh/kern-native) parity. Jump directly to any individual component reference page below."
      >
        <SplitThemeAndPlatformFrame />

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {BUTTON_FAMILY_CATALOG.map((item) => (
            <a
              key={item.slug}
              href={familyHref(item.slug)}
              className={`${STRIP} flex flex-col justify-between gap-2 p-4 no-underline hover:bg-(--sys-color-surface-container-high) ${TRANSITION} ${FOCUS_RING}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`${T_LABEL_LG} ${INK}`}>{item.name}</span>
                <span className={`${T_CODE} text-(--sys-color-primary)`}>
                  {familyHref(item.slug)} →
                </span>
              </div>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{item.role}</p>
            </a>
          ))}
        </div>
      </ShowcaseSection>
    </CategoryShowcaseShell>
  );
}
