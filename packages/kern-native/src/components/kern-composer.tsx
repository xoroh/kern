import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Input } from "./input";
import { KernOverlay } from "./kern-overlay";
import { KernPicker } from "./kern-picker";
import { StatusPill } from "./status-pill";
import { Switch } from "./switch";
import { Text } from "./text";

/**
 * KernComposer — native twin of web `KernComposer` (CL-016; D925).
 *
 * Same contract (value/onSend/mode/replyTo/panels/canned/knowledge +
 * scheduling/draft/OOO affordances, InviteAccept + ShareLinkRow
 * blocks); only the interaction idiom differs (N):
 *
 * - The input is the multiline `Input`; Enter-to-send does not exist
 *   on N (software keyboards own the return key) — send is the Send
 *   pressable only.
 * - Scheduling uses the sheet date-time picker (KernPicker
 *   `date-time` `bottom-sheet`, real snap physics from the host sheet);
 *   W uses the datetime-local field.
 * - `InviteAccept` renders the `sheet` overlay (bottom-anchored, snap);
 *   W centers a modal. Scrim/back dismissal is platform-owned.
 * - No hover/focus-ring classes (platform-gated); 48dp targets.
 */

export type ComposerMode = "public" | "internal" | "note";

const COMPOSER_MODES: readonly { value: ComposerMode; label: string }[] = [
  { value: "public", label: "Public" },
  { value: "internal", label: "Internal" },
  { value: "note", label: "Note" },
];

export type NativeComposerModeBarProps = {
  mode?: ComposerMode;
  defaultMode?: ComposerMode;
  onModeChange?: (mode: ComposerMode) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Mode switch (public / internal / note): press + radio roles. */
export function ComposerModeBar({
  mode,
  defaultMode = "public",
  onModeChange,
  label = "Message visibility",
  disabled = false,
  style,
}: NativeComposerModeBarProps) {
  const scheme = useKernScheme();
  const [uncontrolled, setUncontrolled] = useState(defaultMode);
  const current = mode ?? uncontrolled;
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      testID="kern-composer-mode-bar"
      style={[
        {
          flexDirection: "row",
          gap: 4,
          borderRadius: Number.parseFloat(scheme.shape.full),
          borderWidth: 1,
          borderColor: scheme.color.outline,
          padding: 4,
        },
        style,
      ]}
    >
      {COMPOSER_MODES.map((option) => {
        const active = option.value === current;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active, disabled }}
            disabled={disabled}
            onPress={() => {
              if (mode === undefined) setUncontrolled(option.value);
              onModeChange?.(option.value);
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              minHeight: 40,
              justifyContent: "center",
              borderRadius: Number.parseFloat(scheme.shape.full),
              backgroundColor: active
                ? scheme.color.secondaryContainer
                : "transparent",
              opacity: disabled ? 0.38 : 1,
            }}
          >
            <Text
              variant="label"
              style={{
                color: active
                  ? scheme.color.onSecondaryContainer
                  : scheme.color.onSurfaceVariant,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export type NativeComposerReplyBarProps = {
  replyTo: { author: string; excerpt: string };
  /** Reply dismissal (DOMAIN action, not state). */
  onDismissReply?: () => void;
  dismissLabel?: string;
};

/** Quoted-reply strip above the input. */
export function ComposerReplyBar({
  replyTo,
  onDismissReply,
  dismissLabel = "Dismiss reply",
}: NativeComposerReplyBarProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID="kern-composer-reply-bar"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: Number.parseFloat(scheme.shape.small),
        backgroundColor: scheme.color.surfaceContainerHigh,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="label" numberOfLines={2}>
          {replyTo.author} · {replyTo.excerpt}
        </Text>
      </View>
      {onDismissReply ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          onPress={onDismissReply}
          style={{
            minHeight: 48,
            minWidth: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text variant="title">×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export type ComposerAttachment = { id: string; label: string };

export type NativeComposerAttachmentTrayProps = {
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
}: NativeComposerAttachmentTrayProps) {
  const scheme = useKernScheme();
  if (attachments.length === 0) return null;
  return (
    <View
      accessibilityRole="list"
      accessibilityLabel="Attachments"
      testID="kern-composer-attachment-tray"
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
    >
      {attachments.map((attachment) => (
        <View
          key={attachment.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            borderRadius: Number.parseFloat(scheme.shape.full),
            backgroundColor: scheme.color.surfaceContainerHigh,
            paddingHorizontal: 12,
            paddingVertical: 8,
            minHeight: 40,
          }}
        >
          <Text variant="label" numberOfLines={1}>
            {attachment.label}
          </Text>
          {onRemoveAttachment ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={removeLabel(attachment.label)}
              onPress={() => onRemoveAttachment(attachment.id)}
              style={{
                minHeight: 40,
                minWidth: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text variant="label">×</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export type CannedInsert = { id: string; title: string; body: string };

export type NativeComposerCannedPickerProps = {
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
}: NativeComposerCannedPickerProps) {
  // The sheet picker is triggerless by contract — the trigger chrome +
  // open state live here, the sheet physics stay the picker's.
  const [open, setOpen] = useState(false);
  return (
    <View testID="kern-composer-canned-picker">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={{
          minHeight: 48,
          justifyContent: "center",
          paddingHorizontal: 12,
        }}
      >
        <Text variant="label">{label}</Text>
      </Pressable>
      <KernPicker
        mode="option-list"
        variant="bottom-sheet"
        label={label}
        options={inserts.map((insert) => ({
          value: insert.id,
          label: insert.title,
        }))}
        open={open}
        onOpenChange={setOpen}
        onSelect={(id) => {
          const insert = inserts.find((entry) => entry.id === id);
          if (insert) onCannedSelect?.(insert);
        }}
        testID="kern-composer-canned-picker-sheet"
      />
    </View>
  );
}

export type ComposerDraftStatus = "unsaved" | "saving" | "saved";

export type NativeKernComposerProps = {
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
  panels?: ReactNode;
  attachments?: readonly ComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  cannedInserts?: readonly CannedInsert[];
  onCannedSelect?: (insert: CannedInsert) => void;
  knowledge?: ReactNode;
  knowledgeLabel?: string;
  /**
   * Scheduling affordance (sheet date-time picker). Passing state, a
   * default, or the change callback renders the row; `null` = send now.
   */
  scheduledFor?: Date | null;
  defaultScheduledFor?: Date | null;
  onScheduledChange?: (date: Date | null) => void;
  draftStatus?: ComposerDraftStatus;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
  /**
   * Out-of-office affordance. Passing state, a default, or the change
   * callback renders the banner + toggle.
   */
  outOfOffice?: boolean;
  defaultOutOfOffice?: boolean;
  onOutOfOfficeChange?: (next: boolean) => void;
  sending?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  sendLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** ONE composer, native renderer. */
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
  style,
  testID,
}: NativeKernComposerProps) {
  const scheme = useKernScheme();
  const [internalText, setInternalText] = useState(defaultValue);
  const text = value ?? internalText;
  const setText = (next: string) => {
    if (value === undefined) setInternalText(next);
    onValueChange?.(next);
  };
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
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
  return (
    <View
      testID={testID ?? "kern-composer"}
      style={[
        {
          flexDirection: "column",
          gap: 8,
          borderRadius: Number.parseFloat(scheme.shape.medium),
          borderWidth: 1,
          borderColor: scheme.color.outlineVariant,
          backgroundColor: scheme.color.surface,
          padding: 12,
        },
        style,
      ]}
    >
      {ooo ? (
        <View
          testID="kern-composer-ooo-banner"
          style={{
            borderRadius: Number.parseFloat(scheme.shape.small),
            backgroundColor: scheme.color.warningContainer,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            variant="label"
            style={{ color: scheme.color.onWarningContainer }}
          >
            Out-of-office replies are on — recipients see your away message.
          </Text>
        </View>
      ) : null}
      {replyTo ? (
        <ComposerReplyBar replyTo={replyTo} onDismissReply={onDismissReply} />
      ) : null}
      {panels}
      <ComposerAttachmentTray
        attachments={attachments}
        onRemoveAttachment={onRemoveAttachment}
      />
      <Input
        aria-label={label}
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        editable={!busy}
        multiline
        numberOfLines={3}
        testID="kern-composer-input"
      />
      {draftStatus ? (
        <Text variant="label" style={{ color: scheme.color.onSurfaceVariant }}>
          {draftStatus === "saved"
            ? "Draft saved"
            : draftStatus === "saving"
              ? "Saving draft…"
              : "Unsaved changes"}
        </Text>
      ) : null}
      {knowledge ? (
        <View testID="kern-composer-knowledge">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={knowledgeLabel}
            accessibilityState={{ expanded: knowledgeOpen }}
            onPress={() => setKnowledgeOpen((open) => !open)}
            style={{ minHeight: 48, justifyContent: "center" }}
          >
            <Text variant="label" style={{ color: scheme.color.secondary }}>
              {knowledgeLabel}
            </Text>
          </Pressable>
          {knowledgeOpen ? (
            <View style={{ paddingTop: 8 }}>{knowledge}</View>
          ) : null}
        </View>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        }}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minHeight: 48,
            }}
          >
            <Switch
              checked={scheduled !== null}
              onCheckedChange={(next) => setScheduled(next ? new Date() : null)}
              disabled={busy}
              accessibilityLabel="Schedule send"
              testID="kern-composer-schedule-toggle"
            />
            <Text variant="label">Schedule</Text>
            {scheduled !== null ? (
              <KernPicker
                mode="date-time"
                variant="bottom-sheet"
                label="Scheduled send time"
                dateValue={scheduled}
                defaultDateValue={scheduled}
                onDateChange={(date) => setScheduled(date)}
                testID="kern-composer-schedule-picker"
              />
            ) : null}
          </View>
        ) : null}
        {oooOn ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              minHeight: 48,
            }}
          >
            <Switch
              checked={ooo}
              onCheckedChange={setOoo}
              disabled={busy}
              accessibilityLabel="Out of office"
              testID="kern-composer-ooo-toggle"
            />
            <Text variant="label">Out of office</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        {draftStatus && onDiscardDraft ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Discard draft"
            accessibilityState={{ disabled: busy }}
            disabled={busy}
            onPress={onDiscardDraft}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 12,
            }}
          >
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              Discard
            </Text>
          </Pressable>
        ) : null}
        {draftStatus && onSaveDraft ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save draft"
            accessibilityState={{ disabled: busy }}
            disabled={busy}
            onPress={onSaveDraft}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 12,
            }}
          >
            <Text variant="label" style={{ color: scheme.color.secondary }}>
              Save draft
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            scheduled !== null && schedulingOn ? "Schedule send" : sendLabel
          }
          accessibilityState={{ disabled: busy || text.trim() === "" }}
          disabled={busy || text.trim() === ""}
          onPress={send}
          testID="kern-composer-send"
          style={{
            minHeight: 48,
            justifyContent: "center",
            paddingHorizontal: 16,
            borderRadius: Number.parseFloat(scheme.shape.full),
            backgroundColor: scheme.color.primary,
            opacity: busy || text.trim() === "" ? 0.38 : 1,
          }}
        >
          <Text variant="label" style={{ color: scheme.color.onPrimary }}>
            {sending ? "Sending…" : sendLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// InviteAccept block (MS-037) — composes overlay sheet + picker + composer
// ---------------------------------------------------------------------------

export type InviteDetails = {
  workspaceName: string;
  inviterName: string;
  role: string;
  expiresAt?: string;
};

export type NativeInviteAcceptProps = {
  invite: InviteDetails;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  roleOptions?: readonly { value: string; label: string }[];
  roleValue?: string;
  defaultRoleValue?: string;
  onRoleChange?: (role: string) => void;
  messageEnabled?: boolean;
  messageValue?: string;
  defaultMessageValue?: string;
  onMessageChange?: (message: string) => void;
  /** Accept receives the note when `messageEnabled`. */
  onAccept?: (note?: string) => void;
  onDecline?: () => void;
  acceptLabel?: string;
  declineLabel?: string;
  style?: StyleProp<ViewStyle>;
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
  style,
  testID,
}: NativeInviteAcceptProps) {
  const scheme = useKernScheme();
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
      variant="sheet"
      open={openValue}
      onOpenChange={setOpen}
      title={`Join ${invite.workspaceName}`}
      description={`${invite.inviterName} invited you${invite.expiresAt ? ` · expires ${invite.expiresAt}` : ""}`}
      footer={
        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={declineLabel}
            onPress={() => {
              onDecline?.();
              setOpen(false);
            }}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 16,
            }}
          >
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {declineLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={acceptLabel}
            onPress={() => {
              onAccept?.(messageEnabled ? message : undefined);
              setOpen(false);
            }}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 16,
              borderRadius: Number.parseFloat(scheme.shape.full),
              backgroundColor: scheme.color.primary,
            }}
          >
            <Text variant="label" style={{ color: scheme.color.onPrimary }}>
              {acceptLabel}
            </Text>
          </Pressable>
        </View>
      }
      testID={testID ?? "kern-invite-accept"}
    >
      <View style={[{ flexDirection: "column", gap: 12 }, style]}>
        <StatusPill tone="info">{invite.role}</StatusPill>
        {roleOptions.length > 0 ? (
          <KernPicker
            mode="option-list"
            variant="inline-popover"
            label="Role"
            options={roleOptions.map((option) => ({ ...option }))}
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
      </View>
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

export type NativeShareLinkRowProps = {
  link: ShareLink;
  /** Copy (DOMAIN action; the host writes the clipboard). */
  onCopy?: (link: ShareLink) => void;
  /** Revoke (DOMAIN action; fires after the alert confirms). */
  onRevoke?: (link: ShareLink) => void;
  scopes?: readonly { value: string; label: string }[];
  onScopeSelect?: (scope: string) => void;
  copied?: boolean;
  copyLabel?: string;
  revokeLabel?: string;
  style?: StyleProp<ViewStyle>;
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
  style,
  testID,
}: NativeShareLinkRowProps) {
  const scheme = useKernScheme();
  const [confirming, setConfirming] = useState(false);
  return (
    <View
      testID={testID ?? `kern-share-link-row-${link.id}`}
      style={[
        {
          minHeight: 56,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: scheme.color.surface,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
            {link.label}
          </Text>
          <StatusPill
            tone={link.revoked ? "error" : copied ? "success" : "info"}
            density="compact"
          >
            {link.revoked ? "Revoked" : copied ? "Copied" : "Active"}
          </StatusPill>
        </View>
        <Text
          variant="label"
          numberOfLines={1}
          style={{ color: scheme.color.onSurfaceVariant }}
        >
          {link.url}
          {link.expiresAt ? ` · expires ${link.expiresAt}` : ""}
        </Text>
      </View>
      {scopes.length > 0 && !link.revoked ? (
        <KernPicker
          mode="option-list"
          variant="inline-popover"
          label="Link scope"
          placeholder={link.scope ?? "Scope"}
          options={scopes.map((scope) => ({ ...scope }))}
          value={link.scope}
          onSelect={(scope) => onScopeSelect?.(scope)}
          testID={`kern-share-link-scope-${link.id}`}
        />
      ) : link.scope ? (
        <Text variant="label" style={{ color: scheme.color.onSurfaceVariant }}>
          {link.scope}
        </Text>
      ) : null}
      {onCopy && !link.revoked ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copyLabel}
          onPress={() => onCopy(link)}
          style={{
            minHeight: 48,
            justifyContent: "center",
            paddingHorizontal: 12,
          }}
        >
          <Text variant="label" style={{ color: scheme.color.secondary }}>
            {copyLabel}
          </Text>
        </Pressable>
      ) : null}
      {onRevoke && !link.revoked ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revokeLabel}
            onPress={() => setConfirming(true)}
            style={{
              minHeight: 48,
              justifyContent: "center",
              paddingHorizontal: 12,
            }}
          >
            <Text variant="label" style={{ color: scheme.color.error }}>
              {revokeLabel}
            </Text>
          </Pressable>
          <KernOverlay
            variant="alert"
            open={confirming}
            onOpenChange={setConfirming}
            title={`Revoke ${link.label}?`}
            description="Recipients lose access immediately. This cannot be undone."
            confirmLabel={revokeLabel}
            cancelLabel="Cancel"
            onConfirm={() => {
              onRevoke(link);
              setConfirming(false);
            }}
            onCancel={() => setConfirming(false)}
            testID={`kern-share-link-revoke-${link.id}`}
          />
        </>
      ) : null}
    </View>
  );
}
