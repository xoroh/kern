#!/usr/bin/env bash
# Install the version-controlled git hooks.
#
# WHY NOT HUSKY / LEFTHOOK
#
# Both auto-install their hooks from a `prepare` script -- and D-037 deliberately
# REMOVED the per-package `prepare` lifecycle, because Bun runs workspace prepare
# scripts in parallel and a dependency edge is install order, not build order.
# Reintroducing `prepare` for a hook installer would undo that ruling for the
# sake of a convenience.
#
# So the hook is version-controlled in `.githooks/` and installed explicitly. No
# new dependency, no lifecycle change, and the hook is auditable in the diff
# rather than hidden in a package manager's config.
#
# `.git/hooks/` is deliberately NOT committed -- git ignores it -- so a clone
# does not get the hook until it runs this. CONTRIBUTING.md says so, and CI runs
# `check:generated` regardless, so a missing local hook cannot let stale output
# reach main.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

SRC=".githooks"
DST=".git/hooks"

if [ ! -d "$SRC" ]; then
  echo "hooks:install: no $SRC directory; nothing to install." >&2
  exit 1
fi

mkdir -p "$DST"

installed=0
for hook in "$SRC"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  # Only real hook names. `install.sh` lives in the same directory and is NOT a
  # git hook -- installing it would put a stray executable in .git/hooks under a
  # name git will never call, which is clutter that reads like configuration.
  case "$name" in
    *.sample) continue ;;
    *.sh) continue ;;
    *.*) continue ;;
  esac
  # Back up anything already there rather than silently replacing it.
  if [ -e "$DST/$name" ] && ! grep -q "Xoroh" "$DST/$name" 2>/dev/null; then
    mv "$DST/$name" "$DST/$name.pre-xoroh"
    echo "hooks:install: existing $name moved to $name.pre-xoroh"
  fi
  cp "$hook" "$DST/$name"
  chmod +x "$DST/$name"
  echo "hooks:install: installed $name"
  installed=$((installed + 1))
done

if [ "$installed" -eq 0 ]; then
  echo "hooks:install: no hooks found in $SRC." >&2
  exit 1
fi

echo
echo "hooks:install: $installed hook(s) installed into $DST."
echo "These are NOT committed (.git/hooks is git-ignored). Run this again after a"
echo "fresh clone, or ask the maintainer to wire a post-clone step."