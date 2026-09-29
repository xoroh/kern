/**
 * Semantic icon map — the unification table. Same meaning = same symbol, on
 * every surface (web + mobile). Values are verified Material Symbols glyph
 * names, pinned to the default set. Prefer these aliases over raw glyph names
 * so a re-decision stays a one-line change.
 */
export type IconSemantic =
  | "menu"
  | "close"
  | "back"
  | "forward"
  | "check"
  | "add"
  | "delete"
  | "edit"
  | "search"
  | "settings"
  | "home"
  | "mail"
  | "inbox"
  | "calendar"
  | "tasks"
  | "notifications"
  | "account"
  | "logout"
  | "help"
  | "info"
  | "chevronRight"
  | "chevronLeft"
  | "more"
  | "filter"
  | "refresh"
  | "download"
  | "upload"
  | "share"
  | "favorite"
  | "visible"
  | "locked"
  | "send"
  | "attach"
  | "image"
  | "mic"
  | "people"
  | "person"
  | "work"
  | "business"
  | "event"
  | "schedule";

/** Alias → `set:name` target. Qualified so a re-decision can move sets. */
export const SEMANTIC_ICONS: Record<IconSemantic, string> = {
  menu: "material:menu",
  close: "material:close",
  back: "material:arrow-back",
  forward: "material:arrow-forward",
  check: "material:check",
  add: "material:add",
  delete: "material:delete",
  edit: "material:edit",
  search: "material:search",
  settings: "material:settings",
  home: "material:home",
  mail: "material:mail",
  inbox: "material:inbox",
  calendar: "material:calendar-month",
  tasks: "material:task",
  notifications: "material:notifications",
  account: "material:account-circle",
  logout: "material:logout",
  help: "material:help",
  info: "material:info",
  chevronRight: "material:chevron-right",
  chevronLeft: "material:chevron-left",
  more: "material:more-vert",
  filter: "material:filter-list",
  refresh: "material:refresh",
  download: "material:download",
  upload: "material:upload",
  share: "material:share",
  favorite: "material:favorite",
  visible: "material:visibility",
  locked: "material:lock",
  send: "material:send",
  attach: "material:attach-file",
  image: "material:image",
  mic: "material:mic",
  people: "material:group",
  person: "material:person",
  work: "material:work",
  business: "material:business-center",
  event: "material:event",
  schedule: "material:schedule",
};
