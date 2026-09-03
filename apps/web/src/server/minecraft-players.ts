import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type PlayerProfile = {
  name?: unknown;
  uuid?: unknown;
};

type BannedProfile = PlayerProfile & {
  reason?: unknown;
};

export type MinecraftPlayer = {
  banReason: string | null;
  banned: boolean;
  lastActiveAt: string | null;
  name: string | null;
  uuid: string;
  whitelisted: boolean;
};

export type MinecraftRoster = {
  kickUnlistedPlayers: boolean;
  players: MinecraftPlayer[];
  whitelistEnabled: boolean;
};

function readJsonArray(path: string): unknown[] {
  if (!existsSync(path)) return [];
  try {
    const value: unknown = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function profileMap(entries: unknown[]): Map<string, string> {
  const profiles = new Map<string, string>();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const { name, uuid } = entry as PlayerProfile;
    if (typeof uuid === "string" && typeof name === "string") {
      profiles.set(uuid.toLowerCase(), name);
    }
  }
  return profiles;
}

function readProperties(path: string): Map<string, string> {
  const properties = new Map<string, string>();
  if (!existsSync(path)) return properties;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    properties.set(trimmed.slice(0, separator), trimmed.slice(separator + 1));
  }
  return properties;
}

function latestPlayerActivity(dataPath: string, uuid: string): Date | null {
  const paths = [
    join(dataPath, "world", "playerdata", `${uuid}.dat`),
    join(dataPath, "world", "stats", `${uuid}.json`),
    join(dataPath, "world", "advancements", `${uuid}.json`),
  ];
  const times = paths
    .filter(existsSync)
    .map((path) => statSync(path).mtimeMs)
    .filter(Number.isFinite);
  return times.length > 0 ? new Date(Math.max(...times)) : null;
}

export function readMinecraftRoster(dataPath: string): MinecraftRoster {
  const playerDataPath = join(dataPath, "world", "playerdata");
  if (!existsSync(playerDataPath)) {
    throw new Error("Minecraft player history is not available");
  }

  const cachedProfiles = profileMap(
    readJsonArray(join(dataPath, "usercache.json")),
  );
  const whitelistProfiles = profileMap(
    readJsonArray(join(dataPath, "whitelist.json")),
  );
  const bannedEntries = readJsonArray(join(dataPath, "banned-players.json"));
  const bannedProfiles = profileMap(bannedEntries);
  const bannedReasons = new Map<string, string>();
  for (const entry of bannedEntries) {
    if (!entry || typeof entry !== "object") continue;
    const { reason, uuid } = entry as BannedProfile;
    if (typeof uuid === "string" && typeof reason === "string") {
      bannedReasons.set(uuid.toLowerCase(), reason);
    }
  }

  const playerUuids = readdirSync(playerDataPath)
    .filter((file) => file.endsWith(".dat"))
    .map((file) => file.slice(0, -4).toLowerCase());
  const players = playerUuids.map((uuid): MinecraftPlayer => {
    const lastActive = latestPlayerActivity(dataPath, uuid);
    return {
      banReason: bannedReasons.get(uuid) ?? null,
      banned: bannedProfiles.has(uuid),
      lastActiveAt: lastActive?.toISOString() ?? null,
      name:
        cachedProfiles.get(uuid) ??
        whitelistProfiles.get(uuid) ??
        bannedProfiles.get(uuid) ??
        null,
      uuid,
      whitelisted: whitelistProfiles.has(uuid),
    };
  });
  players.sort((left, right) =>
    (right.lastActiveAt ?? "").localeCompare(left.lastActiveAt ?? ""),
  );

  const properties = readProperties(join(dataPath, "server.properties"));
  return {
    kickUnlistedPlayers: properties.get("enforce-whitelist") === "true",
    players,
    whitelistEnabled: properties.get("white-list") === "true",
  };
}

export const minecraftPlayerActions = [
  "whitelist",
  "unwhitelist",
  "ban",
  "pardon",
] as const;

export type MinecraftPlayerAction = (typeof minecraftPlayerActions)[number];

export function minecraftPlayerCommand(
  playerName: string,
  action: MinecraftPlayerAction,
): string {
  if (!/^[A-Za-z0-9_]{1,16}$/u.test(playerName)) {
    throw new Error("This player does not have a valid Minecraft username");
  }
  switch (action) {
    case "whitelist":
      return `whitelist add ${playerName}`;
    case "unwhitelist":
      return `whitelist remove ${playerName}`;
    case "ban":
      return `ban ${playerName} Blocked by a Friends MC admin`;
    case "pardon":
      return `pardon ${playerName}`;
  }
}
