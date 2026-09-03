#!/usr/bin/env bash

set -euo pipefail

mc_container="${MC_CONTAINER:-friends-mc}"
poll_interval="${POLL_INTERVAL_SECONDS:-30}"
max_runtime="${MAX_RUNTIME_SECONDS:-9900}"
task_started=false
task_running=false
deadline=$((SECONDS + max_runtime))

rcon() {
  timeout 15 docker exec "${mc_container}" rcon-cli "$@" 2>&1 |
    sed $'s/\033\[[0-9;]*[mK]//g'
}

players_are_online() {
  ! rcon list | grep -q "There are 0 of a max of"
}

pause_task() {
  if [[ "${task_running}" == true ]]; then
    echo "Pausing Chunky before exit"
    rcon chunky pause || true
    task_running=false
  fi
}

trap pause_task EXIT
trap 'pause_task; exit 0' INT TERM

initial_progress="$(rcon chunky progress)"
if ! grep -q "No tasks running" <<<"${initial_progress}"; then
  task_started=true
  task_running=true
  if grep -qi "paused" <<<"${initial_progress}"; then
    task_running=false
  fi
fi

while ((SECONDS < deadline)); do
  progress="$(rcon chunky progress)"

  if [[ "${task_started}" == true ]] &&
    grep -q "No tasks running" <<<"${progress}"; then
    echo "Chunky pre-generation completed"
    task_running=false
    exit 0
  fi

  if players_are_online; then
    if [[ "${task_running}" == true ]]; then
      echo "Player detected; pausing Chunky"
      rcon chunky pause
      task_running=false
    fi
  elif [[ "${task_started}" == false ]]; then
    echo "Server empty; starting the configured Chunky selection"
    start_output="$(rcon chunky start)"
    echo "${start_output}"
    if grep -qi "confirm" <<<"${start_output}"; then
      rcon chunky confirm
    fi
    task_started=true
    task_running=true
  elif [[ "${task_running}" == false ]]; then
    echo "Server empty; resuming Chunky"
    rcon chunky continue
    task_running=true
  fi

  sleep "${poll_interval}"
done

echo "Idle pre-generation window ended"
