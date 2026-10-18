import { Button, ThemeToggle } from "@xoroh/kern";
import { Hero, SiteFooter, TopBar } from "@xoroh/kern/start";
import { Preview } from "../../components/preview/preview";

const TOP_BAR_ITEMS = [
  { to: "/projects", label: "Projects" },
  { to: "/docs", label: "Docs" },
  { to: "/showcase", label: "Showcase" },
] as const;

export function HeroDemo() {
  return (
    <Preview label="Hero — page opening with actions and art slots" span={3}>
      <Hero
        eyebrow="One foundation, two platforms"
        title="Build for what comes next."
        lede="A flexible opening for a product or project page. The host owns its actions and visual story."
        actions={
          <>
            <Button>Get started</Button>
            <Button variant="outlined">Explore the system</Button>
          </>
        }
        art={
          <div className="flex min-h-48 items-center justify-center rounded-(--sys-shape-corner-large) bg-(--sys-color-secondary-container) p-8 text-(--sys-color-on-secondary-container)">
            Optional artwork or live preview
          </div>
        }
      />
    </Preview>
  );
}

export function TopBarDemo() {
  return (
    <Preview
      label="TopBar — responsive navigation and host action slot"
      span={3}
    >
      <div className="w-full overflow-hidden rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline-variant)">
        <TopBar
          brand={
            <span>
              Kern<span className="text-(--sys-color-primary)">.</span>
            </span>
          }
          items={TOP_BAR_ITEMS}
          activePath="/docs/guides"
          actions={<ThemeToggle />}
        />
        <div className="flex min-h-32 items-center justify-center bg-(--sys-color-surface-container) text-sm text-(--sys-color-on-surface-variant)">
          Page content
        </div>
      </div>
    </Preview>
  );
}

export function SiteFooterDemo() {
  return (
    <Preview label="SiteFooter — data-driven link groups" span={3}>
      <SiteFooter
        brand={
          <span>
            Acme<span className="text-(--sys-color-primary)">.</span>
          </span>
        }
        summary="A small footer composition that adapts to the links your site has."
        groups={[
          {
            heading: "Product",
            links: [
              { to: "/components", label: "Components" },
              { to: "/docs/getting-started", label: "Get started" },
            ],
          },
          {
            heading: "Project",
            links: [
              { to: "/about", label: "About" },
              { href: "https://github.com/xoroh/kern", label: "GitHub" },
            ],
          },
        ]}
        legal="© Acme · MIT License"
        trailing="Built with Kern"
      />
    </Preview>
  );
}
