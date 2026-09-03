#!/usr/bin/env bash

set -euo pipefail

if (( $# == 0 )); then
  echo "Usage: $0 ROOT..." >&2
  exit 2
fi

verify_config() {
  local config="$1"
  local git_directory="${config%/config}"

  effective_config() {
    git --git-dir="$git_directory" config --local --includes "$@"
  }

  if ! effective_config --list >/dev/null 2>&1; then
    echo "Git config cannot be verified: $config" >&2
    return 1
  fi

  if effective_config --get-regexp '^credential\.|^http(\..*)?\.extraheader$' >/dev/null 2>&1; then
    echo "Git credential configuration remains in $config" >&2
    return 1
  fi

  if effective_config --get-regexp '^remote\..*\.(url|pushurl)$' | grep -Eq 'https?://[^/[:space:]]+@'; then
    echo "An authenticated Git remote remains in $config" >&2
    return 1
  fi

  if effective_config --get-regexp '^url\..*\.(insteadof|pushinsteadof)$' | grep -Eq '^url\.https?://[^/[:space:]]+@'; then
    echo "A Git URL rewrite contains credentials in $config" >&2
    return 1
  fi
}

config_list="$(mktemp)"
trap 'rm -f "$config_list"' EXIT

for root in "$@"; do
  [[ -e "$root" ]] || continue
  if ! find "$root" -maxdepth 15 -type f -name config \
      \( -path '*/.git/config' -o -path '*/.git/modules/*/config' \) \
      -print0 >> "$config_list"; then
    echo "Git config search could not inspect $root" >&2
    exit 1
  fi
done

while IFS= read -r -d '' config; do
  verify_config "$config"
done < "$config_list"
