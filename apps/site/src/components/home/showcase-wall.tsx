/**
 * Showcase wall — real things built with kern, and only those.
 *
 * Three consumers exist today: the Expo mobile app (apps/mobile on
 * @xoroh/kern-native), this site itself (apps/site on @xoroh/kern plus the
 * /start scaffold), and the start scaffold as a product
 * (@xoroh/kern/start). Each card names what it consumes and links somewhere
 * the claim can be checked. No mocks, no concept shots, no "imagine an app
 * here" — the honest-placeholder rule from the showcase route applies to the
 * wall advertising it.
 */
import { Kicker } from "../chrome/kicker";
import {
  T_BODY,
  T_BODY_SM,
  T_CODE,
  T_LABEL_LG,
  T_SECTION,
  T_SMALL_TITLE,
} from "../../systems/type-scale";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";

const CONSUMERS: {
  id: string;
  title: string;
  body: string;
  packages: string[];
  href: string;
  cta: string;
}[] = [
  {
    id: "consumer-expo-app",
    title: "The Expo app",
    body: "A go-anywhere mobile app in apps/mobile. Native components take onPress instead of onClick and resolve the same theme through KernThemeProvider.",
    packages: ["@xoroh/kern-native", "expo"],
    href: "/components/mobile",
    cta: "See the native gallery",
  },
  {
    id: "consumer-this-site",
    title: "This site",
    body: "The page you are reading runs on kern: the header, the docs sidebar, and every demo are shipped components on live tokens.",
    packages: ["@xoroh/kern", "@xoroh/kern/start"],
    href: "/components",
    cta: "Browse what it is built from",
  },
  {
    id: "consumer-start-scaffold",
    title: "The start scaffold",
    body: "AppShell, the navigation rail, drawers, split panes and top bars that take slots instead of baking in one app shape.",
    packages: ["@xoroh/kern/start"],
    href: "/getting-started",
    cta: "Use it in the web quickstart",
  },
];

export function ShowcaseWall() {
  return (
    <section
      className="px-4 py-4 sm:px-6 sm:py-6"
      aria-labelledby="showcase-wall-heading"
    >
      <div className="rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
        <header className="flex flex-col gap-3">
          <Kicker>Showcase</Kicker>
          <h2
            id="showcase-wall-heading"
            className={`m-0 ${T_SECTION} ${INK}`}
          >
            Built with kern, running now
          </h2>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Everything below ships. When blocks, templates, and example apps
            exist, they join this wall — until then it lists exactly what
            consumes the system today.
          </p>
        </header>
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {CONSUMERS.map((item) => (
            <article
              key={item.title}
              className="flex flex-col gap-3 rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-5"
            >
              <h3 id={item.id} className={`m-0 ${T_SMALL_TITLE} ${INK}`}>{item.title}</h3>
              <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{item.body}</p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {item.packages.map((pkg) => (
                  <li key={pkg} className="m-0 p-0">
                    <span
                      className={`inline-flex items-center rounded-full bg-(--md-sys-color-surface-container-high) px-2.5 py-1 ${T_CODE} ${INK_SOFT}`}
                    >
                      {pkg}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={item.href}
                className={`mt-auto pt-1 ${T_LABEL_LG} text-(--md-sys-color-primary) no-underline hover:underline`}
              >
                {item.cta} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
