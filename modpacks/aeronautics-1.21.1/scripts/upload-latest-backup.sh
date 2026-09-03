#!/bin/sh

set -eu

: "${OCI_BACKUP_PAR_URL:?OCI_BACKUP_PAR_URL is required}"

initial_delay="${UPLOAD_INITIAL_DELAY:-30m}"
upload_interval="${UPLOAD_INTERVAL:-24h}"
marker_file=/state/last-uploaded

sleep "$initial_delay"

while true; do
  latest_backup="$({
    find /backups -maxdepth 1 -type f \( -name '*.tar.zst' -o -name '*.tgz' \) -print
  } | sort | tail -n 1)"

  if [ -n "$latest_backup" ]; then
    object_name="$(basename "$latest_backup")"
    previous_object=""

    if [ -f "$marker_file" ]; then
      IFS= read -r previous_object < "$marker_file" || true
    fi

    if [ "$object_name" != "$previous_object" ]; then
      target_url="${OCI_BACKUP_PAR_URL%/}/$object_name"
      echo "Uploading $object_name to OCI Object Storage"
      curl \
        --fail \
        --show-error \
        --silent \
        --retry 5 \
        --retry-all-errors \
        --connect-timeout 30 \
        --max-time 3600 \
        --upload-file "$latest_backup" \
        "$target_url"
      printf '%s\n' "$object_name" > "$marker_file"
      echo "Uploaded $object_name"
    fi
  else
    echo "No local backup archive found yet"
  fi

  sleep "$upload_interval"
done
