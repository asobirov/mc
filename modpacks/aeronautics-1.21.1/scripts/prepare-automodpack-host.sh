#!/usr/bin/env bash

set -Eeuo pipefail

readonly pack="/modpacks/${AUTOMODPACK_PACK_FILE:-Friends-MC-1.3.0.mrpack}"
readonly automodpack_root=/data/automodpack
readonly host_root="$automodpack_root/host-modpack"
readonly target="$host_root/main"
readonly managed_config=/automodpack-config/automodpack-server.json

for command_name in curl jq rsync sha1sum unzip; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Missing required command: $command_name" >&2
    exit 1
  }
done

test -s "$pack"
unzip -tq "$pack" >/dev/null
test -s "$managed_config"
jq -e . "$managed_config" >/dev/null

mkdir -p "$host_root"
work_dir=$(mktemp -d "$host_root/.prepare.XXXXXX")
trap 'rm -rf -- "$work_dir"' EXIT HUP INT TERM

mkdir -p "$work_dir/content"
unzip -q "$pack" 'overrides/*' -d "$work_dir/archive"
if [[ -d "$work_dir/archive/overrides" ]]; then
  rsync -a "$work_dir/archive/overrides/" "$work_dir/content/"
fi
# The bootstrap pack adds Friends MC once; updater runs must not replace a
# player's launcher-managed multiplayer list afterward.
rm -f -- "$work_dir/content/servers.dat"

manifest="$work_dir/modrinth.index.json"
unzip -p "$pack" modrinth.index.json > "$manifest"
jq -e '.files | type == "array"' "$manifest" >/dev/null

# The upstream pack incorrectly marks client-only entries as server-required,
# so mirror the exact files intentionally excluded from the dedicated server.
while IFS=$'\t' read -r relative_path download_url expected_sha1; do
  filename=${relative_path##*/}
  is_client_only=false

  for pattern in ${AUTOMODPACK_CLIENT_ONLY_PATTERNS:-}; do
    if [[ "$filename" == *"$pattern"* ]]; then
      is_client_only=true
      break
    fi
  done

  if [[ "$is_client_only" != true ]]; then
    continue
  fi

  destination="$work_dir/content/$relative_path"
  mkdir -p "$(dirname -- "$destination")"
  curl --fail --location --retry 4 --retry-all-errors --silent --show-error \
    --output "$destination" "$download_url"
  printf '%s  %s\n' "$expected_sha1" "$destination" | sha1sum --check --status
done < <(
  jq -r '.files[] | [.path, .downloads[0], .hashes.sha1] | @tsv' "$manifest"
)

mkdir -p "$target"
rsync -a --delete "$work_dir/content/" "$target/"
install -m 0600 "$managed_config" "$automodpack_root/automodpack-server.json"

file_count=$(find "$target" -type f | wc -l | tr -d ' ')
echo "Prepared AutoModpack client payload with $file_count files"
