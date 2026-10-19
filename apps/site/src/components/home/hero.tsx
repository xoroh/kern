/**
 * Hero — the homepage opening, painted in the M3 palette.
 *
 * Quiet tonal paper, editorial display type, and a live composition of real
 * package controls: a workspace settings card with working selection and
 * feedback states, plus the install command. No decorative specimens — the
 * product is the visual.
 *
 * Ink is `on-primary-container` for the same reason: it is the role paired
 * with the primary container; the page repaints in both light and dark modes.
 */
import {
  Avatar,
  Button,
  buttonVariants,
  Chip,
  cn,
  SegmentedButton,
  Switch,
} from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import {
  T_BODY,
  T_HERO,
  T_LABEL_LG,
  T_SUB,
} from "../../domains/shared/systems/type-scale";
import { Kicker } from "../chrome/kicker";
import { InstallTabs } from "../docs/install-tabs";

const INK = "text-(--sys-color-on-primary-container)";

/**
 * Workspace settings — a believable slice of app UI composed from real
 * package controls, every one of them live: the switch toggles, the
 * segmented control moves exclusively, Save reports back. What a visitor
 * touches here is what they ship.
 */
function WorkspaceCard() {
  const [notify, setNotify] = useState(true);
  const [saved, setSaved] = useState(false);
  return (
    <section className="hero-app-card" aria-label="Workspace settings demo">
      <div className="flex items-center gap-3">
        <Avatar.Root size="default">
          <Avatar.Fallback delay={0}>Ac</Avatar.Fallback>
        </Avatar.Root>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className={T_LABEL_LG}>Acme project</span>
          <span className={`${T_SUB} hero-dim`}>3 members · synced</span>
        </div>
        <Chip variant="assist">Pro</Chip>
      </div>
      <div className="hero-app-row">
        <span className={T_LABEL_LG} id="hero-notify">
          Notifications
        </span>
        <Switch
          aria-labelledby="hero-notify"
          checked={notify}
          onCheckedChange={(next) => {
            setNotify(next);
            setSaved(false);
          }}
        />
      </div>
      <div className="hero-app-row">
        <span className={T_LABEL_LG} id="hero-density">
          Density
        </span>
        <SegmentedButton.Root defaultValue={["comfortable"]} aria-label="Density">
          <SegmentedButton.Item value="comfortable">
            Comfortable
          </SegmentedButton.Item>
          <SegmentedButton.Item value="compact">Compact</SegmentedButton.Item>
        </SegmentedButton.Root>
      </div>
      <div className="hero-app-actions">
        <Button variant="text" onClick={() => setSaved(false)}>
          Reset
        </Button>
        <Button
          variant="filled"
          onClick={() => setSaved(true)}
          aria-live="polite"
        >
          <Icon name={saved ? "check" : "save"} size={18} />
          {saved ? "Saved" : "Save changes"}
        </Button>
      </div>
      <span className="sr-only" role="status">
        {saved ? "Workspace settings saved in this demo." : ""}
      </span>
    </section>
  );
}

/** Install, honestly: the command works at 0.1.0; until then the checkout does. */
function InstallCard() {
  return (
    <section className="hero-install" aria-label="Install Kern">
      <div className="hero-install-tabs">
        <InstallTabs target="@xoroh/kern" />
      </div>
      <p className={`m-0 ${T_SUB} hero-dim`}>
        Free and open source — publishes with 0.1.0. Until then,{" "}
        <a href="/docs/getting-started" className="hero-dim-link">
          start from a checkout
        </a>
        .
      </p>
    </section>
  );
}

export function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-grid">
        <div className="flex flex-col justify-center">
          <Kicker className={INK}>Material 3. Made for you.</Kicker>
          <h1 className={`my-6 ${T_HERO} ${INK}`}>
            Make it
            <br />
            <span className="text-(--sys-color-primary)">feel right.</span>
          </h1>
          <p className={`m-0 max-w-[38ch] text-pretty ${T_BODY} ${INK}`}>
            Thoughtful components. Expressive color. A shared foundation for
            beautiful experiences on web and native.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/docs/getting-started"
              className={cn(
                buttonVariants({ variant: "filled" }),
                "home-cta no-underline",
              )}
            >
              Start building <Icon name="arrow-forward" size={20} />
            </a>
            <a
              href="/components"
              className={cn(
                buttonVariants({ variant: "outlined" }),
                "home-cta no-underline",
              )}
            >
              Explore components
            </a>
          </div>
          <div
            className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 ${T_LABEL_LG} ${INK}`}
          >
            <span className="flex items-center gap-1.5">
              <Icon name="check" size={16} />
              React + React Native
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="check" size={16} />
              Open source
            </span>
          </div>
        </div>
        <div className="hero-art">
          <WorkspaceCard />
          <InstallCard />
        </div>
      </div>
    </section>
  );
}
