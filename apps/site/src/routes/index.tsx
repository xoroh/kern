import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/home/hero";
import {
  ComponentProof,
  GetStartedBand,
  PaletteBand,
} from "../components/home/sections";
import { SiteLayout } from "../domains/shared/chrome/site-layout";
import { pageMeta, SITE_JSON_LD } from "../domains/shared/systems/seo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta("Kern by Xoroh") }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* Part 8 SEO: machine-readable site identity. Rendered in body —
          JSON-LD is valid there and crawlers read it; a head export would
          need router head plumbing for one static block. */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SITE_JSON_LD is static generated metadata, never user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
      />
      <Hero />
      <ComponentProof />
      <PaletteBand />
      <GetStartedBand />
    </SiteLayout>
  );
}
