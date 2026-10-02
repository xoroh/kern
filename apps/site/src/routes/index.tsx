import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/chrome/site-layout";
import { ComponentGallery } from "../components/home/component-gallery";
import { Hero } from "../components/home/hero";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <ComponentGallery />
    </SiteLayout>
  );
}
