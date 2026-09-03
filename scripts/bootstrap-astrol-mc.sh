#!/usr/bin/env bash

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

if [[ "$(id -u)" -ne 0 ]]; then
  echo "bootstrap must run as root" >&2
  exit 1
fi

apt-get update
apt-get -y upgrade
apt-get install -y ca-certificates curl gnupg sudo ufw unattended-upgrades

install -m 0755 -d /etc/apt/keyrings
curl --fail --silent --show-error --location \
  https://download.docker.com/linux/ubuntu/gpg \
  --output /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

. /etc/os-release
docker_arch="$(dpkg --print-architecture)"
docker_codename="${UBUNTU_CODENAME:-$VERSION_CODENAME}"
printf '%s\n' \
  'Types: deb' \
  'URIs: https://download.docker.com/linux/ubuntu' \
  "Suites: ${docker_codename}" \
  'Components: stable' \
  "Architectures: ${docker_arch}" \
  'Signed-By: /etc/apt/keyrings/docker.asc' \
  > /etc/apt/sources.list.d/docker.sources

apt-get update
apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

systemctl enable --now docker

if ! id mcadmin >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash --groups sudo mcadmin
fi

install -d -m 0700 -o mcadmin -g mcadmin /home/mcadmin/.ssh
install -m 0600 -o mcadmin -g mcadmin \
  /root/.ssh/authorized_keys /home/mcadmin/.ssh/authorized_keys
printf '%s\n' 'mcadmin ALL=(ALL:ALL) NOPASSWD: ALL' \
  > /etc/sudoers.d/90-mcadmin
chmod 0440 /etc/sudoers.d/90-mcadmin
visudo --check --file=/etc/sudoers.d/90-mcadmin

if ! id minecraft >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /srv/minecraft \
    --shell /usr/sbin/nologin minecraft
fi
usermod --append --groups docker minecraft
install -d -m 0750 -o minecraft -g minecraft \
  /srv/minecraft/aeronautics \
  /srv/minecraft/aeronautics/data \
  /srv/minecraft/aeronautics/backups

timedatectl set-timezone Europe/London

printf '%s\n' \
  'vm.swappiness = 10' \
  'vm.max_map_count = 262144' \
  'fs.file-max = 1048576' \
  'net.core.somaxconn = 1024' \
  > /etc/sysctl.d/90-friends-mc.conf
sysctl --system >/dev/null

printf '%s\n' \
  '{' \
  '  "live-restore": true,' \
  '  "userland-proxy": false' \
  '}' \
  > /etc/docker/daemon.json
systemctl restart docker

ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 25565/tcp comment 'Minecraft Java'
ufw allow 24454/udp comment 'Simple Voice Chat'
ufw --force enable

printf '%s\n' \
  'APT::Periodic::Update-Package-Lists "1";' \
  'APT::Periodic::Unattended-Upgrade "1";' \
  > /etc/apt/apt.conf.d/20auto-upgrades
systemctl enable --now unattended-upgrades

docker run --rm hello-world >/dev/null

echo 'bootstrap-complete'
