/**
 * The component-documentation registry.
 *
 * Adding a component to the site is adding one folder of content under
 * `content/web/` or `content/mobile/`. The route, the nav and the index come
 * from the generated manifest; the page's sections come from here. Nothing in
 * this file is edited when a component is added — the folders are discovered.
 *
 * Discovery is done twice, on purpose. The site uses `import.meta.glob` so a
 * new folder is live without a rebuild of the index, and
 * `scripts/check-docs.mjs` walks the same directories with `readdirSync`
 * because it runs in Node without Vite. Both must see the same set of files,
 * and the validator asserts that the export → family index is total: a family
 * that forgets one of its parts, or two families that claim the same export,
 * fail the gate rather than quietly rendering the wrong page.
 */
import type { ComponentDoc } from "./types";

export type Platform = "web" | "mobile";

type Modules = Record<string, Record<string, ComponentDoc>>;

const webModules = import.meta.glob("./web/*.ts", {
  eager: true,
}) as Modules;
const mobileModules = import.meta.glob("./mobile/*.ts", {
  eager: true,
}) as Modules;

function collect(modules: Modules): ComponentDoc[] {
  const docs: ComponentDoc[] = [];
  for (const key of Object.keys(modules).sort()) {
    for (const exported of Object.values(modules[key])) {
      docs.push(exported);
    }
  }
  return docs;
}

export const WEB_DOCS = collect(webModules);
export const MOBILE_DOCS = collect(mobileModules);

/** Every documented component, on both platforms. */
export const ALL_DOCS: ComponentDoc[] = [...WEB_DOCS, ...MOBILE_DOCS];

/** The platform-qualified page key, e.g. `"web/dialog"`. */
export function docKey(platform: Platform, doc: ComponentDoc): string {
  return `${platform}/${doc.slug}`;
}

const BY_KEY = new Map<string, ComponentDoc>();
for (const doc of WEB_DOCS) BY_KEY.set(docKey("web", doc), doc);
for (const doc of MOBILE_DOCS) BY_KEY.set(docKey("mobile", doc), doc);

export function getDoc(
  platform: Platform,
  slug: string,
): ComponentDoc | undefined {
  return BY_KEY.get(`${platform}/${slug}`);
}

/**
 * The export → family index. One entry per export name, so a page can be
 * reached by any of its parts and still render the family's page — which is
 * consistency rule 1: parts are documented on their parent's page.
 */
const BY_EXPORT = new Map<string, { platform: Platform; doc: ComponentDoc }>();
for (const [key, doc] of BY_KEY) {
  const platform = key.split("/")[0] as Platform;
  for (const part of doc.parts) {
    const slot = { platform, doc };
    const existing = BY_EXPORT.get(`${platform}:${part}`);
    if (existing && existing.doc.slug !== doc.slug) {
      // Two families claiming one export is a documentation defect, not a
      // rendering choice. The validator reports it; refusing to index it here
      // means the site cannot silently pick a winner.
      console.error(
        `content: export ${part} is claimed by both ${existing.doc.slug} and ${doc.slug}`,
      );
      continue;
    }
    BY_EXPORT.set(`${platform}:${part}`, slot);
  }
}

/** Resolve an export name (e.g. `DialogContent`) to the page that documents it. */
export function docForExport(
  platform: Platform,
  exportName: string,
): ComponentDoc | undefined {
  return BY_EXPORT.get(`${platform}:${exportName}`)?.doc;
}

/** Whether a slug has a page on a platform. */
export function hasDoc(platform: Platform, slug: string): boolean {
  return BY_KEY.has(`${platform}/${slug}`);
}
