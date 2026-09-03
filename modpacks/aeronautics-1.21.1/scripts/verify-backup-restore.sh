#!/usr/bin/env bash

set -Eeuo pipefail

readonly stack_dir="${FRIENDS_MC_STACK_DIR:-/srv/minecraft/aeronautics}"
readonly container="friends-mc-restore-drill"
archive="${1:-}"

if docker container inspect "$container" >/dev/null 2>&1; then
  echo "Container $container already exists; refusing to overwrite it" >&2
  exit 1
fi

if [[ -z "$archive" ]]; then
  archive="$({
    find "$stack_dir/backups" -maxdepth 1 -type f \
      -name 'friends-mc-*.tar.zst' -printf '%T@ %p\n'
  } | sort -nr | head -n 1 | cut -d' ' -f2-)"
fi

if [[ -z "$archive" || ! -f "$archive" ]]; then
  echo "No backup archive found" >&2
  exit 1
fi

drill_root="$(mktemp -d /srv/minecraft/restore-drill.XXXXXX)"
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  case "$drill_root" in
    /srv/minecraft/restore-drill.*) rm -rf -- "$drill_root" ;;
  esac
}
trap cleanup EXIT

data_dir="$drill_root/data"
mkdir -p "$data_dir"
tar --zstd -xf "$archive" -C "$data_dir"

[[ -s "$data_dir/world/level.dat" ]]
[[ -d "$data_dir/world/region" ]]

# Old archives may contain install markers while intentionally excluding JARs.
# Remove all reproducible runtime state so the image performs a clean install.
rm -rf -- "$data_dir/libraries" "$data_dir/versions" "$data_dir/mods"
rm -f -- \
  "$data_dir/run.sh" \
  "$data_dir/run.bat" \
  "$data_dir/.install-modrinth.env" \
  "$data_dir/.modrinth-modpack-manifest.json" \
  "$data_dir/.neoforge-manifest.json"

archive_sha="$(sha256sum "$archive" | awk '{print $1}')"
world_bytes="$(du -sb "$data_dir/world" | awk '{print $1}')"
rcon_secret="$(openssl rand -hex 24)"
exclude_files='AmbientSounds appleskin BetterAdvancements DistantHorizons emi- emi_ EMIProfessions entityculling extra-mod-integrations ImmediatelyFast iris- irisflw justzoom lambdynamiclights modelfix MouseTweaks notenoughanimations OverflowingBars reeses-sodium-options SimpleBackups sodium-neoforge sound-physics-remastered xaerominimap xaeroworldmap YungsBetterEndIsland'

docker run -d \
  --name "$container" \
  --cpus 3 \
  --memory 6g \
  -e EULA=TRUE \
  -e TZ=Europe/London \
  -e MODPACK_PLATFORM=MODRINTH \
  -e MODRINTH_MODPACK=/modpacks/Friends-MC-1.1.1.mrpack \
  -e MODRINTH_LOADER=neoforge \
  -e MODRINTH_FORCE_SYNCHRONIZE=true \
  -e MODRINTH_EXCLUDE_FILES="$exclude_files" \
  -e VERSION=1.21.1 \
  -e INIT_MEMORY=2G \
  -e MAX_MEMORY=5G \
  -e USE_MEOWICE_FLAGS=true \
  -e OVERRIDE_SERVER_PROPERTIES=true \
  -e ONLINE_MODE=false \
  -e MAX_PLAYERS=1 \
  -e VIEW_DISTANCE=2 \
  -e SIMULATION_DISTANCE=2 \
  -e ENABLE_RCON=true \
  -e RCON_PASSWORD="$rcon_secret" \
  -v "$data_dir:/data" \
  -v "$stack_dir/pack:/modpacks:ro" \
  itzg/minecraft-server:java21 >/dev/null

ready=false
for _attempt in $(seq 1 120); do
  if docker logs "$container" 2>&1 | grep -q 'Done ('; then
    ready=true
    break
  fi
  if [[ "$(docker inspect -f '{{.State.Running}}' "$container")" != "true" ]]; then
    break
  fi
  sleep 5
done

if [[ "$ready" != "true" ]]; then
  echo "RESTORE_DRILL=FAILED" >&2
  docker logs --tail 120 "$container" >&2
  exit 1
fi

docker exec "$container" rcon-cli list >/dev/null
docker exec "$container" rcon-cli 'save-all flush' >/dev/null

printf '%s\n' \
  'RESTORE_DRILL=PASSED' \
  "ARCHIVE=$(basename "$archive")" \
  "SHA256=$archive_sha" \
  "WORLD_BYTES=$world_bytes" \
  'LEVEL_DAT=present' \
  'SERVER_START=ready' \
  'RCON=responsive' \
  'SAVE_FLUSH=passed'
