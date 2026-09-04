#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PACK_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
BASE_PACK="$PACK_ROOT/pack/Friends-MC-1.1.2.mrpack"
OUTPUT_PACK="$PACK_ROOT/pack/Friends-MC-1.1.3.mrpack"
RADAR_CONFIG="$PACK_ROOT/client-config/xaero/minimap/default_radar_categories_client.json"

for command_name in jq unzip zip; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Missing required command: $command_name" >&2
    exit 1
  }
done

test -f "$BASE_PACK"
test -f "$RADAR_CONFIG"
jq -e . "$RADAR_CONFIG" >/dev/null

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT HUP INT TERM

unzip -q "$BASE_PACK" -d "$WORK_DIR"
mkdir -p "$WORK_DIR/overrides/config/xaero/minimap"
install -m 0644 "$RADAR_CONFIG" \
  "$WORK_DIR/overrides/config/xaero/minimap/default_radar_categories_client.json"
jq '.versionId = "1.1.3"' "$WORK_DIR/modrinth.index.json" \
  > "$WORK_DIR/modrinth.index.json.next"
mv "$WORK_DIR/modrinth.index.json.next" "$WORK_DIR/modrinth.index.json"
# Fixed timestamps make repeated builds byte-for-byte reproducible.
find "$WORK_DIR" -exec touch -t 202609040000 {} +

rm -f "$OUTPUT_PACK"
(cd "$WORK_DIR" && zip -X -q -r "$OUTPUT_PACK" .)
unzip -tq "$OUTPUT_PACK"
shasum -a 256 "$OUTPUT_PACK"
