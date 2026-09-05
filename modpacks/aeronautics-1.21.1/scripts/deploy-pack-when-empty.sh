#!/bin/sh
set -eu

STACK_DIR=${FRIENDS_MC_STACK_DIR:-/srv/minecraft/aeronautics}
TARGET_PACK=${1:-Friends-MC-1.2.0.mrpack}
POLL_SECONDS=${POLL_SECONDS:-30}
EMPTY_CHECKS_REQUIRED=${EMPTY_CHECKS_REQUIRED:-2}
HEALTH_TIMEOUT_SECONDS=${HEALTH_TIMEOUT_SECONDS:-600}

cd "$STACK_DIR"
test -s "pack/$TARGET_PACK"
grep -Fq "MODRINTH_MODPACK: /modpacks/$TARGET_PACK" docker-compose.yml
docker compose config --quiet

empty_checks=0
while :; do
  list_output=$(docker exec friends-mc rcon-cli list)
  player_count=$(printf '%s\n' "$list_output" | sed -n \
    's/^There are \([0-9][0-9]*\) of a max.*/\1/p' | head -n 1)

  if [ "${player_count:-1}" -eq 0 ]; then
    empty_checks=$((empty_checks + 1))
  else
    empty_checks=0
  fi

  if [ "$empty_checks" -ge "$EMPTY_CHECKS_REQUIRED" ]; then
    docker exec friends-mc rcon-cli 'save-all flush' >/dev/null

    # Abort this attempt if somebody joined during the save boundary.
    list_output=$(docker exec friends-mc rcon-cli list)
    player_count=$(printf '%s\n' "$list_output" | sed -n \
      's/^There are \([0-9][0-9]*\) of a max.*/\1/p' | head -n 1)
    if [ "${player_count:-1}" -ne 0 ]; then
      empty_checks=0
      sleep "$POLL_SECONDS"
      continue
    fi

    docker compose up -d --no-deps --force-recreate mc
    break
  fi

  sleep "$POLL_SECONDS"
done

waited=0
while [ "$waited" -lt "$HEALTH_TIMEOUT_SECONDS" ]; do
  health=$(docker inspect --format '{{.State.Health.Status}}' friends-mc 2>/dev/null || true)
  if [ "$health" = healthy ]; then
    docker exec friends-mc rcon-cli list >/dev/null
    printf 'DEPLOYED_PACK=%s\n' "$TARGET_PACK"
    exit 0
  fi
  sleep 5
  waited=$((waited + 5))
done

echo "Minecraft did not become healthy after deploying $TARGET_PACK" >&2
docker logs --tail 120 friends-mc >&2
exit 1
