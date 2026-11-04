import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { KernOverlay } from "./kern-overlay";
import { KernPicker, type PickerOption } from "./kern-picker";
import { StatusPill } from "./status-pill";
import { Textarea } from "./textarea";

/**
 * KernComposer — ONE composer (CL-016; D925 "one composer").
 *
 * Merges the desk `ConversationComposer` + `ComposerModeBar` (+
 * Article/Canned pickers CMP-0576/0577/0578), the mobile
 * `ConversationFooter` internal/locked/panel states (CMP-2603) and the
 * Kern chat composers (CMP-3125/3202) into one contract:
 *
 * - `value` + `onSend` + `panels[]` + `replyTo` + `mode`
 *   (`public` / `internal` / `note`) + `cannedInserts` + `knowledge`
 *   flyout — the inventory slots, verbatim.
 * - Slots (all exported): `ComposerModeBar`, `ComposerAttachmentTray`,
 *   `ComposerReplyBar`, `ComposerCannedPicker` (the last composes
 *   `KernPicker`, never a second option list).
 * - Affordances (all opt-in by prop presence): scheduling
 *   (`scheduledFor` pair), draft state (`draftStatus` + save/discard
 *   actions), out-of-office (`outOfOffice` pair + banner).
 *
 * The input composes `Textarea` (W keyboard: Enter sends, Shift+Enter
 * newlines); N uses the multiline `Input` twin (see the native file —
 * sheet physics + no hover/focus-ring classes there).
 *
 * `InviteAccept` (MS-037) and `ShareLinkRow` (MS-005/MS-024) are blocks
 * in this file: they compose the composer + `KernOverlay` + `KernPicker`
 * (+ `StatusPill`), no re-implementation. MS-038 stays by-design
 * excluded (plan Q7).
 *
 * M3: text fields (https://m3.material.io/components/text-fields),
 * dialogs (https://m3.material.io/components/dialogs),
 * lists (https://m3.material.io/components/lists)
 */

export type ComposerMode = "public" | "internal" | "note";

const COMPOSER_MODES: readonly { value: ComposerMode; label: string }[] = [
  { value: "public", label: "Public" },
  { value: "internal", label: "Internal" },
  { value: "note", label: "Note" },
];

export type ComposerModeBarProps = {
  mode?: ComposerMode;
  defaultMode?: ComposerMode;
  onModeChange?: (mode: ComposerMode) => void;
  label?: string;
  disabled?: boolean;
};

/**
 * Mode switch (public / internal / note). Real radios in one group —
 * arrow-key travel and screen-reader count come free with the platform.
 */
export function ComposerModeBar({
  mode,
  defaultMode = "public",
  onModeChange,
  label = "Message visibility",
  disabled = false,
}: ComposerModeBarProps) {
  const group = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultMode);
  const current = mode ?? uncontrolled;
  const choose = (next: ComposerMode) => {
    if (mode === undefined) setUncontrolled(next);
    onModeChange?.(next);
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-slot="composer-mode-bar"
      className="flex gap-1 rounded-(--sys-shape-corner-full) border border-(--sys-color-outline) bg-(--sys-color-surface) p-1"
    >
      {COMPOSER_MODES.map((option) => {
        const active = option.value === current;
        return (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-(--sys-shape-corner-full) px-3 py-1 text-xs font-medium outline-none transition-colors",
              FOCUS_RING_CLASS,
              active
                ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
                : "text-(--sys-color-on-surface-variant)",
              disabled &&
                "cursor-not-allowed opacity-[var(--sys-state-disabled)]",
            )}
          >
            <input
              type="radio"
              name={group}
              value={option.value}
              checked={active}
              disabled={disabled}
              onChange={() => choose(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export type ComposerReplyBarProps = {
  replyTo: { author: string; excerpt: string };
  /** Reply dismissal (R2 lexicon: DOMAIN action, not state). */
  onDismissReply?: () => void;
  dismissLabel?: string;
};

/** Quoted-reply strip above the input. */
export function ComposerReplyBar({
  replyTo,
  onDismissReply,
  dismissLabel = "Dismiss reply",
}: ComposerReplyBarProps) {
  return (
    <div
      data-slot="composer-reply-bar"
      className="flex items-center gap-2 rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-surface-container-high) px-3 py-2"
    >
      <span className="min-w-0 flex-1 truncate text-xs text-(--sys-color-on-surface-variant)">
        <span className="font-medium text-(--sys-color-on-surface)">
          {replyTo.author}
        </span>{" "}
        {replyTo.excerpt}
      </span>
      {onDismissReply ? (
        <button
          type="button"
          onClick={onDismissReply}
          aria-label={dismissLabel}
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-(--sys-shape-corner-full) text-(--sys-color-on-surface-variant) outline-none",
            FOCUS_RING_CLASS,
          )}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
}

export type ComposerAttachment = { id: string; label: string };

export type ComposerAttachmentTrayProps = {
  attachments: readonly ComposerAttachment[];
  /** Attachment removal (DOMAIN action). */
  onRemoveAttachment?: (id: string) => void;
  removeLabel?: (label: string) => string;
};

/** Attachment chips above the input. */
export function ComposerAttachmentTray({
  attachments,
  onRemoveAttachment,
  removeLabel = (label) => `Remove ${label}`,
}: ComposerAttachmentTrayProps) {
  if (attachments.length === 0) return null;
  return (
    <ul
      data-slot="composer-attachment-tray"
      className="flex flex-wrap gap-2"
      aria-label="Attachments"
    >
      {attachments.map((attachment) => (
        <li
          key={attachment.id}
          className="flex items-center gap-1 rounded-(--sys-shape-corner-full) bg-(--sys-color-surface-container-high) py-1 pe-1 ps-3 text-xs text-(--sys-color-on-surface)"
        >
          <span className="max-w-40 truncate">{attachment.label}</span>
          {onRemoveAttachment ? (
            <button
              type="button"
              onClick={() => onRemoveAttachment(attachment.id)}
              aria-label={removeLabel(attachment.label)}
              className={cn(
                "grid size-6 place-items-center rounded-(--sys-shape-corner-full) outline-none",
                FOCUS_RING_CLASS,
              )}
            >
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export type CannedInsert = { id: string; title: string; body: string };

export type ComposerCannedPickerProps = {
  inserts: readonly CannedInsert[];
  /** Insert pick (DOMAIN action; insertion into the draft is host-owned). */
  onCannedSelect?: (insert: CannedInsert) => void;
  label?: string;
};

/** Canned-response picker. Composes `KernPicker`, owns no option list. */
export function ComposerCannedPicker({
  inserts,
  onCannedSelect,
  label = "Canned responses",
}: ComposerCannedPickerProps) {
  const options: PickerOption[] = inserts.map((insert) => ({
    value: insert.id,
    label: insert.title,
  }));
  return (
    <KernPicker
      mode="option-list"
      variant="inline-popover"
      label={label}
      options={options}
      onSelect={(id) => {
        const insert = inserts.find((entry) => entry.id === id);
        if (insert) onCannedSelect?.(insert);
      }}
      testID="kern-composer-canned-picker"
    />
  );
}

export type ComposerDraftStatus = "unsaved" | "saving" | "saved";

export type KernComposerProps = {
  /** Draft text. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Send (DOMAIN action; receives the current text). */
  onSend?: (text: string) => void;
  mode?: ComposerMode;
  defaultMode?: ComposerMode;
  onModeChange?: (mode: ComposerMode) => void;
  replyTo?: { author: string; excerpt: string };
  onDismissReply?: () => void;
  /** Panel slot: attachment tray content, article cards, custom panels. */
  panels?: ReactNode;
  attachments?: readonly ComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  cannedInserts?: readonly CannedInsert[];
  onCannedSelect?: (insert: CannedInsert) => void;
  /** Knowledge-flyout slot (disclosure; uncontrolled). */
  knowledge?: ReactNode;
  knowledgeLabel?: string;
  /**
   * Scheduling affordance. Passing state, a default, or the change
   * callback renders the schedule row; `null` = send now. The host owns
   * the clock.
   */
  scheduledFor?: Date | null;
  defaultScheduledFor?: Date | null;
  onScheduledChange?: (date: Date | null) => void;
  /** Draft-state affordance. Present → saved/saving line + actions. */
  draftStatus?: ComposerDraftStatus;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
  /**
   * Out-of-office affordance. Passing state, a default, or the change
   * callback renders the OOO banner + toggle.
   */
  outOfOffice?: boolean;
  defaultOutOfOffice?: boolean;
  onOutOfOfficeChange?: (next: boolean) => void;
  sending?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  sendLabel?: string;
  className?: string;
  testID?: string;
};

/** ONE composer: text + mode + reply + panels + canned + knowledge. */
export function KernComposer({
  value,
  defaultValue = "",
  onValueChange,
  onSend,
  mode,
  defaultMode,
  onModeChange,
  replyTo,
  onDismissReply,
  panels,
  attachments = [],
  onRemoveAttachment,
  cannedInserts = [],
  onCannedSelect,
  knowledge,
  knowledgeLabel = "Knowledge base",
  scheduledFor,
  defaultScheduledFor = null,
  onScheduledChange,
  draftStatus,
  onSaveDraft,
  onDiscardDraft,
  outOfOffice,
  defaultOutOfOffice,
  onOutOfOfficeChange,
  sending = false,
  disabled = false,
  label = "Message",
  placeholder = "Type a message…",
  sendLabel = "Send",
  className,
  testID,
}: KernComposerProps) {
  const [internalText, setInternalText] = useState(defaultValue);
  const text = value ?? internalText;
  const setText = (next: string) => {
    if (value === undefined) setInternalText(next);
    onValueChange?.(next);
  };
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  // Affordances are opt-in: passing state, a default, OR the change
  // callback renders the row (a host that reports scheduling clearly
  // wants the schedule row, even uncontrolled).
  const schedulingOn =
    scheduledFor !== undefined ||
    defaultScheduledFor != null ||
    onScheduledChange !== undefined;
  const [internalSchedule, setInternalSchedule] = useState<Date | null>(
    defaultScheduledFor,
  );
  const scheduled =
    scheduledFor !== undefined ? scheduledFor : internalSchedule;
  const setScheduled = (next: Date | null) => {
    if (scheduledFor === undefined) setInternalSchedule(next);
    onScheduledChange?.(next);
  };
  const oooOn =
    outOfOffice !== undefined ||
    defaultOutOfOffice !== undefined ||
    onOutOfOfficeChange !== undefined;
  const [internalOoo, setInternalOoo] = useState(defaultOutOfOffice ?? false);
  const ooo = outOfOffice ?? internalOoo;
  const setOoo = (next: boolean) => {
    if (outOfOffice === undefined) setInternalOoo(next);
    onOutOfOfficeChange?.(next);
  };
  const busy = sending || disabled;
  const send = () => {
    if (busy || text.trim() === "") return;
    onSend?.(text);
  };
  const toInputValue = (date: Date | null): string => {
    if (!date) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  return (
    <div
      data-slot="kern-composer"
      data-testid={testID ?? "kern-composer"}
      className={cn(
        "kern-composer flex flex-col gap-2 rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface) p-3",
        className,
      )}
    >
      {ooo ? (
        <p
          data-slot="composer-ooo-banner"
          className="rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-warning-container) px-3 py-2 text-xs text-(--sys-color-on-warning-container)"
        >
          Out-of-office replies are on — recipients see your away message.
        </p>
      ) : null}
      {replyTo ? (
        <ComposerReplyBar replyTo={replyTo} onDismissReply={onDismissReply} />
      ) : null}
      {panels}
      <ComposerAttachmentTray
        attachments={attachments}
        onRemoveAttachment={onRemoveAttachment}
      />
      <Textarea
        aria-label={label}
        placeholder={placeholder}
        value={text}
        onValueChange={setText}
        disabled={busy}
        rows={3}
        onKeyDown={(event) => {
          // W keyboard proof: Enter sends, Shift+Enter keeps the newline.
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
      />
      {draftStatus ? (
        <p
          data-slot="composer-draft-status"
          className="text-xs text-(--sys-color-on-surface-variant)"
        >
          {draftStatus === "saved"
            ? "Draft saved"
            : draftStatus === "saving"
              ? "Saving draft…"
              : "Unsaved changes"}
        </p>
      ) : null}
      {knowledge ? (
        <div data-slot="composer-knowledge">
          <button
            type="button"
            aria-expanded={knowledgeOpen}
            onClick={() => setKnowledgeOpen((open) => !open)}
            className={cn(
              "text-xs font-medium text-(--sys-color-secondary) outline-none",
              FOCUS_RING_CLASS,
            )}
          >
            {knowledgeLabel}
          </button>
          {knowledgeOpen ? (
            <div className="pt-2 text-sm text-(--sys-color-on-surface)">
              {knowledge}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="composer-footer"
        className="flex flex-wrap items-center gap-2"
      >
        <ComposerModeBar
          mode={mode}
          defaultMode={defaultMode}
          onModeChange={onModeChange}
          disabled={busy}
        />
        {cannedInserts.length > 0 ? (
          <ComposerCannedPicker
            inserts={cannedInserts}
            onCannedSelect={onCannedSelect}
          />
        ) : null}
        {schedulingOn ? (
          <label className="flex items-center gap-2 text-xs text-(--sys-color-on-surface-variant)">
            <input
              type="checkbox"
              checked={scheduled !== null}
              disabled={busy}
              onChange={(event) =>
                setScheduled(event.target.checked ? new Date() : null)
              }
              className="size-4 accent-(--sys-color-primary)"
            />
            Schedule
            {scheduled !== null ? (
              <input
                type="datetime-local"
                aria-label="Scheduled send time"
                value={toInputValue(scheduled)}
                disabled={busy}
                onChange={(event) => {
                  const next = event.target.valueAsDate;
                  setScheduled(next);
                }}
                className="rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline) bg-(--sys-color-surface) px-2 py-1 text-xs text-(--sys-color-on-surface)"
              />
            ) : null}
          </label>
        ) : null}
        {oooOn ? (
          <label className="flex items-center gap-2 text-xs text-(--sys-color-on-surface-variant)">
            <input
              type="checkbox"
              checked={ooo}
              disabled={busy}
              onChange={(event) => setOoo(event.target.checked)}
              className="size-4 accent-(--sys-color-primary)"
            />
            Out of office
          </label>
        ) : null}
        <span className="flex-1" />
        {draftStatus && (onSaveDraft || onDiscardDraft) ? (
          <>
            {onDiscardDraft ? (
              <button
                type="button"
                onClick={onDiscardDraft}
                disabled={busy}
                className={cn(
                  "rounded-(--sys-shape-corner-full) px-3 py-2 text-xs font-medium text-(--sys-color-on-surface-variant) outline-none",
                  FOCUS_RING_CLASS,
                )}
              >
                Discard
              </button>
            ) : null}
            {onSaveDraft ? (
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={busy}
                className={cn(
                  "rounded-(--sys-shape-corner-full) px-3 py-2 text-xs font-medium text-(--sys-color-secondary) outline-none",
                  FOCUS_RING_CLASS,
                )}
              >
                Save draft
              </button>
            ) : null}
          </>
        ) : null}
        <button
          type="button"
          onClick={send}
          disabled={busy || text.trim() === ""}
          className={cn(
            "rounded-(--sys-shape-corner-full) bg-(--sys-color-primary) px-4 py-2 text-sm font-medium text-(--sys-color-on-primary) outline-none disabled:opacity-[var(--sys-state-disabled)]",
            FOCUS_RING_CLASS,
          )}
        >
          {sending ? "Sending…" : scheduled !== null ? "Schedule" : sendLabel}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InviteAccept block (MS-037) — composes overlay + picker + composer
// ---------------------------------------------------------------------------

export type InviteDetails = {
  workspaceName: string;
  inviterName: string;
  role: string;
  expiresAt?: string;
};

export type InviteAcceptProps = {
  invite: InviteDetails;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Role picker rows (the invite may offer a choice of roles). */
  roleOptions?: readonly PickerOption[];
  roleValue?: string;
  defaultRoleValue?: string;
  onRoleChange?: (role: string) => void;
  /** Optional accept-note via the composer (mode fixed to `note`). */
  messageEnabled?: boolean;
  messageValue?: string;
  defaultMessageValue?: string;
  onMessageChange?: (message: string) => void;
  /** Accept receives the note when `messageEnabled`. */
  onAccept?: (note?: string) => void;
  onDecline?: () => void;
  acceptLabel?: string;
  declineLabel?: string;
  className?: string;
  testID?: string;
};

/** Invitation acceptance shell (MS-037): review → pick role → accept. */
export function InviteAccept({
  invite,
  open,
  defaultOpen,
  onOpenChange,
  roleOptions = [],
  roleValue,
  defaultRoleValue,
  onRoleChange,
  messageEnabled = false,
  messageValue,
  defaultMessageValue = "",
  onMessageChange,
  onAccept,
  onDecline,
  acceptLabel = "Accept invite",
  declineLabel = "Decline",
  className,
  testID,
}: InviteAcceptProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const openValue = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const [internalMessage, setInternalMessage] = useState(defaultMessageValue);
  const message = messageValue ?? internalMessage;
  const setMessage = (next: string) => {
    if (messageValue === undefined) setInternalMessage(next);
    onMessageChange?.(next);
  };
  return (
    <KernOverlay
      variant="modal"
      open={openValue}
      onOpenChange={setOpen}
      title={`Join ${invite.workspaceName}`}
      description={`${invite.inviterName} invited you${invite.expiresAt ? ` · expires ${invite.expiresAt}` : ""}`}
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              onDecline?.();
              setOpen(false);
            }}
            className={cn(
              "rounded-(--sys-shape-corner-full) px-4 py-2 text-sm font-medium text-(--sys-color-on-surface-variant) outline-none",
              FOCUS_RING_CLASS,
            )}
          >
            {declineLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept?.(messageEnabled ? message : undefined);
              setOpen(false);
            }}
            className={cn(
              "rounded-(--sys-shape-corner-full) bg-(--sys-color-primary) px-4 py-2 text-sm font-medium text-(--sys-color-on-primary) outline-none",
              FOCUS_RING_CLASS,
            )}
          >
            {acceptLabel}
          </button>
        </>
      }
      testID={testID ?? "kern-invite-accept"}
      className={className}
    >
      <div className="flex flex-col gap-3">
        <StatusPill tone="info">{invite.role}</StatusPill>
        {roleOptions.length > 0 ? (
          <KernPicker
            mode="option-list"
            variant="inline-popover"
            label="Role"
            options={roleOptions}
            value={roleValue}
            defaultValue={defaultRoleValue}
            onSelect={(role) => onRoleChange?.(role)}
            testID="kern-invite-role-picker"
          />
        ) : null}
        {messageEnabled ? (
          <KernComposer
            mode="note"
            value={message}
            onValueChange={setMessage}
            label="Note to the workspace"
            placeholder="Say hello (optional)…"
            testID="kern-invite-message"
          />
        ) : null}
      </div>
    </KernOverlay>
  );
}

// ---------------------------------------------------------------------------
// ShareLinkRow block (MS-005/MS-024) — composes picker + overlay + pill
// ---------------------------------------------------------------------------

export type ShareLink = {
  id: string;
  label: string;
  url: string;
  scope?: string;
  expiresAt?: string;
  revoked?: boolean;
};

export type ShareLinkRowProps = {
  link: ShareLink;
  /** Copy (DOMAIN action; the host writes the clipboard). */
  onCopy?: (link: ShareLink) => void;
  /** Revoke (DOMAIN action; fires after the alert confirms). */
  onRevoke?: (link: ShareLink) => void;
  /** Per-recipient scope rows (MS-024); absent → scope renders as text. */
  scopes?: readonly PickerOption[];
  onScopeSelect?: (scope: string) => void;
  copied?: boolean;
  copyLabel?: string;
  revokeLabel?: string;
  className?: string;
  testID?: string;
};

/** Share-link row (MS-005 mint/revoke-any, MS-024 per-recipient scope). */
export function ShareLinkRow({
  link,
  onCopy,
  onRevoke,
  scopes = [],
  onScopeSelect,
  copied = false,
  copyLabel = "Copy",
  revokeLabel = "Revoke",
  className,
  testID,
}: ShareLinkRowProps) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div
      data-slot="share-link-row"
      data-testid={testID ?? `kern-share-link-row-${link.id}`}
      className={cn(
        "kern-share-link-row flex min-h-14 items-center gap-3 bg-(--sys-color-surface) px-4 py-2",
        className,
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-(--sys-color-on-surface)">
            {link.label}
          </span>
          <StatusPill
            tone={link.revoked ? "error" : copied ? "success" : "info"}
            density="compact"
          >
            {link.revoked ? "Revoked" : copied ? "Copied" : "Active"}
          </StatusPill>
        </span>
        <span className="truncate text-xs text-(--sys-color-on-surface-variant)">
          {link.url}
          {link.expiresAt ? ` · expires ${link.expiresAt}` : ""}
        </span>
      </span>
      {scopes.length > 0 && !link.revoked ? (
        <KernPicker
          mode="option-list"
          variant="inline-popover"
          label="Link scope"
          placeholder={link.scope ?? "Scope"}
          options={scopes}
          value={link.scope}
          onSelect={(scope) => onScopeSelect?.(scope)}
          testID={`kern-share-link-scope-${link.id}`}
        />
      ) : link.scope ? (
        <span className="shrink-0 text-xs text-(--sys-color-on-surface-variant)">
          {link.scope}
        </span>
      ) : null}
      {onCopy && !link.revoked ? (
        <button
          type="button"
          onClick={() => onCopy(link)}
          className={cn(
            "shrink-0 rounded-(--sys-shape-corner-full) px-3 py-2 text-xs font-medium text-(--sys-color-secondary) outline-none",
            FOCUS_RING_CLASS,
          )}
        >
          {copyLabel}
        </button>
      ) : null}
      {onRevoke && !link.revoked ? (
        <>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={cn(
              "shrink-0 rounded-(--sys-shape-corner-full) px-3 py-2 text-xs font-medium text-(--sys-color-error) outline-none",
              FOCUS_RING_CLASS,
            )}
          >
            {revokeLabel}
          </button>
          <KernOverlay
            variant="alert"
            open={confirming}
            onOpenChange={setConfirming}
            title={`Revoke ${link.label}?`}
            description="Recipients lose access immediately. This cannot be undone."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={cn(
                    "rounded-(--sys-shape-corner-full) px-4 py-2 text-sm font-medium text-(--sys-color-on-surface-variant) outline-none",
                    FOCUS_RING_CLASS,
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRevoke(link);
                    setConfirming(false);
                  }}
                  className={cn(
                    "rounded-(--sys-shape-corner-full) bg-(--sys-color-error) px-4 py-2 text-sm font-medium text-(--sys-color-on-error) outline-none",
                    FOCUS_RING_CLASS,
                  )}
                >
                  {revokeLabel}
                </button>
              </>
            }
            testID={`kern-share-link-revoke-${link.id}`}
          />
        </>
      ) : null}
    </div>
  );
}
