#!/usr/bin/env bash

set -uo pipefail

readonly stack_dir="${FRIENDS_MC_STACK_DIR:-/srv/minecraft/aeronautics}"
readonly max_disk_percent="${MAX_DISK_PERCENT:-85}"
readonly max_local_backup_age="${MAX_LOCAL_BACKUP_AGE_SECONDS:-28800}"
readonly max_offsite_backup_age="${MAX_OFFSITE_BACKUP_AGE_SECONDS:-108000}"

failures=()

container_health="$({
  docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    friends-mc
} 2>/dev/null || true)"
if [[ "$container_health" != "healthy" ]]; then
  failures+=("Minecraft container is $container_health")
fi

if ! curl --fail --silent --show-error --max-time 10 \
  https://mc.xpr.im/api/health | grep -q '"ok":true'; then
  failures+=("Portal HTTPS health check failed")
fi

if ! timeout 5 bash -c '</dev/tcp/mc.xpr.im/25565' 2>/dev/null; then
  failures+=("Minecraft TCP port 25565 is unreachable")
fi

if ! ss -H -lun | awk '$4 ~ /:24454$/ { found=1 } END { exit !found }'; then
  failures+=("Voice Chat UDP port 24454 is not listening")
fi

disk_percent="$(df -P "$stack_dir" | awk 'NR == 2 { gsub(/%/, "", $5); print $5 }')"
if [[ ! "$disk_percent" =~ ^[0-9]+$ ]] || ((disk_percent >= max_disk_percent)); then
  failures+=("Disk usage is ${disk_percent:-unknown}%")
fi

latest_backup="$({
  find "$stack_dir/backups" -maxdepth 1 -type f \
    \( -name '*.tar.zst' -o -name '*.tgz' \) -printf '%T@ %p\n'
} 2>/dev/null | sort -nr | head -n 1 | cut -d' ' -f2-)"
if [[ -z "$latest_backup" ]]; then
  failures+=("No local backup archive exists")
else
  local_backup_age=$(($(date +%s) - $(stat -c %Y "$latest_backup")))
  if ((local_backup_age > max_local_backup_age)); then
    failures+=("Latest local backup is ${local_backup_age}s old")
  fi
fi

offsite_started="$({
  docker compose -f "$stack_dir/docker-compose.yml" ps --status running --services
} 2>/dev/null | grep -x 'offsite-backup' || true)"
if [[ -z "$offsite_started" ]]; then
  failures+=("Off-site backup uploader is not running")
else
  offsite_epoch="$({
    docker compose -f "$stack_dir/docker-compose.yml" exec -T offsite-backup \
      stat -c %Y /state/last-uploaded
  } 2>/dev/null || true)"
  if [[ ! "$offsite_epoch" =~ ^[0-9]+$ ]]; then
    failures+=("Off-site backup has no upload marker")
  else
    offsite_age=$(($(date +%s) - offsite_epoch))
    if ((offsite_age > max_offsite_backup_age)); then
      failures+=("Latest off-site upload is ${offsite_age}s old")
    fi
  fi
fi

if ((${#failures[@]} > 0)); then
  report="$(IFS='; '; echo "${failures[*]}")"
  echo "$report" >&2
  exit 1
fi

summary="healthy; disk=${disk_percent}%; local_backup=$(basename "$latest_backup")"
echo "$summary"
