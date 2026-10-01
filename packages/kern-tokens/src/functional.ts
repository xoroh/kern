import type { RoleTable } from "./resolve";
import { getHue, type StatusTone, statusTone, type ToneStep } from "./tones";

export type FunctionalHuePair = { hue: string; bg: ToneStep; fg: ToneStep };
export type FunctionalStatic = { static: { bg: string; fg: string } };
export type FunctionalValue = StatusTone | FunctionalHuePair | FunctionalStatic;
export type FunctionalDomainMap = Record<string, FunctionalValue>;
export type FunctionalColors = { bg: string; fg: string };

export const functional = {
  priority: {
    urgent: "error",
    high: "warning",
    normal: "neutral",
    low: "neutral",
  },
  ticketStatus: {
    open: "info",
    in_progress: "warning",
    pending: "neutral",
    resolved: "success",
    closed: "neutral",
  },
  conversationStatus: {
    open: "secondary",
    in_progress: "warning",
    pending: { hue: "orange", bg: "100", fg: "800" },
    resolved: "success",
    closed: "neutral",
  },
  category: {
    credits: "success",
    billing: "warning",
    account: { hue: "teal", bg: "100", fg: "700" },
    rides: "secondary",
    safety: "error",
    payments: { hue: "purple", bg: "100", fg: "800" },
    app: { hue: "magenta", bg: "100", fg: "800" },
  },
  channel: {
    chat: { hue: "teal", bg: "100", fg: "700" },
    email: "secondary",
    call: "warning",
    whatsapp: { static: { bg: "#dcfce7", fg: "#25d366" } },
    messenger: { static: { bg: "#dbeafe", fg: "#0084ff" } },
    phone: { hue: "orange", bg: "100", fg: "800" },
    internal: "neutral",
  },
  planTier: {
    free: "success",
    pro: { hue: "purple", bg: "100", fg: "800" },
    enterprise: "info",
  },
  fileType: {
    folder: { hue: "teal", bg: "100", fg: "700" },
    pdf: "error",
    image: { hue: "purple", bg: "100", fg: "800" },
    doc: "secondary",
    sheet: { hue: "green", bg: "100", fg: "800" },
    video: { hue: "magenta", bg: "100", fg: "800" },
    archive: "warning",
    code: "neutral",
  },
  taskStatus: {
    todo: "neutral",
    in_progress: "secondary",
    done: "success",
  },
  presence: {
    online: "success",
    away: "warning",
    busy: "error",
    offline: "neutral",
  },
} as const satisfies Record<string, Record<string, FunctionalValue>>;

export type FunctionalDomain = keyof typeof functional;

const extraDomains = new Map<string, FunctionalDomainMap>();
let overrides: Record<string, FunctionalDomainMap> | null = null;

export function isFunctionalTone(value: FunctionalValue): value is StatusTone {
  return typeof value === "string";
}

export function isFunctionalHuePair(
  value: FunctionalValue,
): value is FunctionalHuePair {
  return typeof value === "object" && "hue" in value;
}

function lookup(domain: string, key: string): FunctionalValue {
  const override = overrides?.[domain]?.[key];
  if (override !== undefined) return override;
  const extra = extraDomains.get(domain)?.[key];
  if (extra !== undefined) return extra;
  const base = (functional as Record<string, Record<string, FunctionalValue>>)[
    domain
  ]?.[key];
  if (base === undefined) {
    throw new Error(`Unknown functional key: ${domain}.${key}`);
  }
  return base;
}

/** Meaning → tone decision. Throws on unknown keys: fail loud, never untoned. */
export function functionalTone(domain: string, key: string): FunctionalValue {
  return lookup(domain, key);
}

const kebab = (name: string) =>
  name.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();

/** Generated utility class name for a functional entry. */
export function toneClass(domain: string, key: string): string {
  return `tone-${kebab(domain)}-${key}`;
}

/** Runtime colors for a functional entry (web and native). */
export function resolveFunctionalTone(
  scheme: RoleTable,
  domain: string,
  key: string,
): FunctionalColors {
  const value = lookup(domain, key);
  if (isFunctionalTone(value)) {
    const { bg, fg } = statusTone(scheme, value);
    return { bg, fg };
  }
  if (isFunctionalHuePair(value)) {
    const ramp = getHue(value.hue);
    if (!ramp) throw new Error(`Unknown hue: ${value.hue}`);
    return { bg: ramp[value.bg].srgb, fg: ramp[value.fg].srgb };
  }
  return value.static;
}

/** Add or extend a domain at runtime (app-level extension, additive). */
export function registerFunctionalDomain(
  domain: string,
  table: FunctionalDomainMap,
): void {
  if (!/^[a-z][a-zA-Z0-9]{1,31}$/.test(domain)) {
    throw new Error(`Invalid domain name: ${domain}`);
  }
  extraDomains.set(domain, { ...extraDomains.get(domain), ...table });
}

/** Tenant/theme-level remapping of domain keys. Pass null to clear. */
export function setFunctionalOverrides(
  table: Record<string, FunctionalDomainMap> | null,
): void {
  overrides = table;
}
