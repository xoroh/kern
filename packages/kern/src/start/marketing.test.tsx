import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { type LinkProps, LinkProvider } from "./link";
import { Hero, SiteFooter, TopBar } from "./marketing";

afterEach(cleanup);

describe("Hero", () => {
  it("names its region from the page heading and renders its slots", () => {
    render(
      <Hero
        id="welcome"
        eyebrow="A design system for work"
        title="Make the next thing."
        lede="One foundation for products on web and native."
        actions={<button type="button">Get started</button>}
        art={<div>Component preview</div>}
      />,
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Make the next thing.",
    });
    const region = screen.getByRole("region", {
      name: "Make the next thing.",
    });

    expect(heading.id).toBe("welcome-title");
    expect(region.id).toBe("welcome");
    expect(screen.getByText("A design system for work")).toBeTruthy();
    expect(
      screen.getByText("One foundation for products on web and native."),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Get started" })).toBeTruthy();
    expect(screen.getByText("Component preview")).toBeTruthy();
  });
});

describe("TopBar", () => {
  const items = [
    { to: "/projects", label: "Projects" },
    { to: "/docs", label: "Docs" },
  ] as const;

  it("marks the active route and exposes an operable mobile disclosure", () => {
    render(<TopBar brand="Kern" items={items} activePath="/docs/guides" />);

    expect(
      screen.getByRole("link", { name: "Kern" }).getAttribute("href"),
    ).toBe("/");
    expect(
      screen.getByRole("link", { name: "Docs" }).getAttribute("aria-current"),
    ).toBe("page");

    const trigger = screen.getByRole("button", { name: "Open navigation" });
    const menuId = trigger.getAttribute("aria-controls");
    const menu = menuId ? document.getElementById(menuId) : null;
    expect(menu).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(menu?.hasAttribute("hidden")).toBe(true);

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-label")).toBe("Close navigation");
    expect(menu?.hasAttribute("hidden")).toBe(false);
    expect(
      within(menu as HTMLElement)
        .getByRole("link", { name: "Docs" })
        .getAttribute("aria-current"),
    ).toBe("page");

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes the disclosure after a destination is selected", () => {
    render(<TopBar brand="Kern" items={items} />);
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(trigger);

    const menuId = trigger.getAttribute("aria-controls");
    const menu = menuId ? document.getElementById(menuId) : null;
    expect(menu).toBeTruthy();
    fireEvent.click(
      within(menu as HTMLElement).getByRole("link", { name: "Projects" }),
    );

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(menu?.hasAttribute("hidden")).toBe(true);
  });
});

describe("SiteFooter", () => {
  it("renders labelled link groups and routes internal links through the host", () => {
    const RouterLink = ({ to, href, children, ...props }: LinkProps) => (
      <a href={`router:${to ?? href}`} data-router-link="true" {...props}>
        {children}
      </a>
    );

    render(
      <LinkProvider component={RouterLink}>
        <SiteFooter
          brand="Acme"
          summary="Tools for teams."
          groups={[
            {
              heading: "Explore",
              links: [
                { to: "/docs", label: "Documentation" },
                {
                  href: "https://example.com",
                  label: "Company",
                  detail: "About Acme",
                },
              ],
            },
          ]}
          legal="© Acme"
          trailing="MIT License"
        />
      </LinkProvider>,
    );

    expect(screen.getByRole("contentinfo")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Explore" })).toBeTruthy();
    expect(screen.getByText("Tools for teams.")).toBeTruthy();

    const internal = screen.getByRole("link", { name: "Documentation" });
    expect(internal.getAttribute("href")).toBe("router:/docs");
    expect(internal.getAttribute("data-router-link")).toBe("true");

    expect(
      screen
        .getByRole("link", { name: "Company,About Acme" })
        .getAttribute("href"),
    ).toBe("https://example.com");
    expect(screen.getByText("© Acme")).toBeTruthy();
    expect(screen.getByText("MIT License")).toBeTruthy();
  });
});
