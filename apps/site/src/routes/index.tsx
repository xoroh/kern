import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { CapabilityDemos } from "../components/home/capability-demos";
import { Hero } from "../components/home/hero";
import { HowItWorks } from "../components/home/how-it-works";
import { ReleaseNotes } from "../components/home/release-notes";
import { ShowcaseWall } from "../components/home/showcase-wall";
import { TrustBand } from "../components/home/trust-band";
import { pageMeta, SITE_JSON_LD } from "../systems/seo";

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
      />
      <Hero />
      <TrustBand />
      <CapabilityDemos />
      <HowItWorks />
      <ShowcaseWall />
      <ReleaseNotes />
    </SiteLayout>
  );
}
