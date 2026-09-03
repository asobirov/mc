#!/bin/sh

set -eu

readonly account="asobirov357@gmail.com"
readonly keychain_service="dash.astrolnodes.net"
readonly base_url="https://dash.astrolnodes.net"
readonly state_dir="/Users/asobirov/Library/Application Support/T3 Code/astrol-vps-watch"
readonly ready_marker="$state_dir/vps-1917-ready"
readonly latest_response="$state_dir/servers-latest.json"
readonly log_file="$state_dir/watch.log"
readonly codex_log="$state_dir/codex-deploy.log"
readonly codex_result="$state_dir/codex-last-message.md"

/bin/mkdir -p "$state_dir"

log() {
  /bin/date '+%Y-%m-%d %H:%M:%S %Z' | /usr/bin/tr -d '\n' >> "$log_file"
  /usr/bin/printf ' %s\n' "$1" >> "$log_file"
}

notify_ready() {
  ip_address="$1"
  message="Astrol VPS #1917 is ready"
  if [ -n "$ip_address" ]; then
    message="$message at $ip_address"
  fi

  /usr/bin/osascript \
    -e 'on run argv' \
    -e 'display notification (item 1 of argv) with title "Friends MC" subtitle "Server provisioned" sound name "Glass"' \
    -e 'end run' \
    -- "$message"
}

run_codex_deployment() {
  log "Starting unattended Codex deployment run"

  prompt='Astrol Nodes has now provisioned VPS service #1917 for the Friends MC server. Continue and finish the previously authorized setup without waiting for the user.

Work from the authoritative current state in /Users/asobirov/dev/mc. Read the VPS details from /Users/asobirov/Library/Application Support/T3 Code/astrol-vps-watch/servers-latest.json. The SSH public key ~/.ssh/id_ed25519.pub was registered in VirtFusion as “Akbarshokh Mac mini”; use the matching private key and create/update an astrol-mc SSH alias once the public IP is known.

Deploy /Users/asobirov/dev/mc/modpacks/aeronautics-1.21.1 for a smooth 6–10-player experience. Securely bootstrap Ubuntu 24.04, install Docker Engine and Compose, create a dedicated service user, verify key-based SSH before hardening SSH, configure the firewall for SSH plus Minecraft TCP 25565 and UDP 24454, deploy and start the prepared Compose stack, and tune it for this 20 GB / 8-vCore VPS. Preserve the existing Oracle vanilla server. Retrieve the write-only OCI backup PAR securely from oracle-ubuntu:/home/ubuntu/.mc-backup-par-url without printing it, configure local and offsite backups, force and verify a real backup, and verify container health, RCON, listening ports, resource use, and Minecraft startup.

Do not expose passwords, tokens, PAR URLs, or private keys in logs or output. Do not enable Astrol auto-renewal. Keep working until the requested deployment is genuinely complete, or clearly record the exact external blocker if Astrol has created a record but the VM is not SSH-ready yet.'

  if /usr/bin/printf '%s\n' "$prompt" | /opt/homebrew/bin/codex exec \
    --cd /Users/asobirov/dev/mc \
    --sandbox danger-full-access \
    --config 'approval_policy="never"' \
    --output-last-message "$codex_result" \
    - >> "$codex_log" 2>&1; then
    log "Codex deployment run finished; result saved to codex-last-message.md"
    return 0
  fi

  log "ERROR: unattended Codex deployment run failed; it will retry in 30 minutes"
  return 1
}

if [ -f "$ready_marker" ]; then
  exit 0
fi

tmp_dir="$(/usr/bin/mktemp -d /tmp/astrol-vps-watch.XXXXXX)"
cleanup() {
  /bin/rm -f \
    "$tmp_dir/login.html" \
    "$tmp_dir/cookies.txt" \
    "$tmp_dir/login.json" \
    "$tmp_dir/servers.json"
  /bin/rmdir "$tmp_dir" 2>/dev/null || true
}
trap cleanup EXIT HUP INT TERM

if ! password="$(/usr/bin/security find-generic-password \
  -s "$keychain_service" \
  -a "$account" \
  -w 2>/dev/null)"; then
  log "ERROR: Astrol credential is unavailable in Keychain"
  exit 1
fi

if ! /usr/bin/curl \
  --fail \
  --silent \
  --show-error \
  --connect-timeout 20 \
  --max-time 60 \
  --cookie-jar "$tmp_dir/cookies.txt" \
  "$base_url/login" \
  -o "$tmp_dir/login.html"; then
  log "ERROR: could not load the Astrol login page"
  exit 1
fi

csrf_token="$(/usr/bin/sed -n 's/.*<meta name="csrf-token" content="\([^"]*\)".*/\1/p' "$tmp_dir/login.html" | /usr/bin/head -n 1)"
if [ -z "$csrf_token" ]; then
  log "ERROR: Astrol login CSRF token was not found"
  exit 1
fi

payload="$(/usr/bin/jq -nc \
  --arg email "$account" \
  --arg password "$password" \
  '{email: $email, password: $password, remember: true, captcha: null}')"
unset password

login_status="$(/usr/bin/curl \
  --silent \
  --show-error \
  --connect-timeout 20 \
  --max-time 60 \
  --cookie "$tmp_dir/cookies.txt" \
  --cookie-jar "$tmp_dir/cookies.txt" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'X-Requested-With: XMLHttpRequest' \
  --header "X-CSRF-TOKEN: $csrf_token" \
  --data "$payload" \
  --output "$tmp_dir/login.json" \
  --write-out '%{http_code}' \
  "$base_url/login")"
unset payload csrf_token

if [ "$login_status" != "200" ]; then
  log "ERROR: Astrol login returned HTTP $login_status"
  exit 1
fi

server_status="$(/usr/bin/curl \
  --silent \
  --show-error \
  --connect-timeout 20 \
  --max-time 60 \
  --cookie "$tmp_dir/cookies.txt" \
  --header 'Accept: application/json' \
  --header 'X-Requested-With: XMLHttpRequest' \
  --output "$tmp_dir/servers.json" \
  --write-out '%{http_code}' \
  "$base_url/servers/_list")"

if [ "$server_status" != "200" ] || ! /usr/bin/jq -e '.status == "success" and (.data | type == "array")' "$tmp_dir/servers.json" >/dev/null; then
  log "ERROR: Astrol server-list request returned an unexpected response (HTTP $server_status)"
  exit 1
fi

/bin/cp "$tmp_dir/servers.json" "$latest_response"
/bin/chmod 600 "$latest_response"

server_count="$(/usr/bin/jq '.data | length' "$tmp_dir/servers.json")"
if [ "$server_count" -eq 0 ]; then
  log "Waiting: no VPS has been assigned yet"
  exit 0
fi

ip_address="$(/usr/bin/jq -r '.. | objects | .ip? // .ipAddress? // .address? // empty' "$tmp_dir/servers.json" | /usr/bin/head -n 1)"
log "READY: Astrol assigned $server_count VPS record(s)${ip_address:+; IP $ip_address}"
notify_ready "$ip_address"

if ! run_codex_deployment; then
  exit 1
fi

/usr/bin/printf '%s\n' "$ip_address" > "$ready_marker"
/bin/chmod 600 "$ready_marker"
