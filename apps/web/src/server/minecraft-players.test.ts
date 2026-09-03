import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  minecraftPlayerCommand,
  readMinecraftRoster,
} from "./minecraft-players";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "friends-mc-roster-"));
  mkdirSync(join(root, "world", "playerdata"), { recursive: true });
  mkdirSync(join(root, "world", "stats"), { recursive: true });
  writeFileSync(
    join(root, "usercache.json"),
    JSON.stringify([
      { name: "JoinedFriend", uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
      { name: "LookedUpOnly", uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
    ]),
  );
  writeFileSync(
    join(root, "whitelist.json"),
    JSON.stringify([
      { name: "JoinedFriend", uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
    ]),
  );
  writeFileSync(
    join(root, "banned-players.json"),
    JSON.stringify([
      {
        name: "JoinedFriend",
        reason: "Testing",
        uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    ]),
  );
  writeFileSync(
    join(
      root,
      "world",
      "playerdata",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.dat",
    ),
    "player",
  );
  writeFileSync(
    join(root, "server.properties"),
    "white-list=true\nenforce-whitelist=false\n",
  );
  return root;
}

describe("Minecraft player administration", () => {
  it("lists only profiles that have actually joined the world", () => {
    const roster = readMinecraftRoster(fixture());

    expect(roster).toMatchObject({
      kickUnlistedPlayers: false,
      whitelistEnabled: true,
    });
    expect(roster.players).toHaveLength(1);
    expect(roster.players[0]).toMatchObject({
      banReason: "Testing",
      banned: true,
      name: "JoinedFriend",
      uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      whitelisted: true,
    });
    expect(roster.players[0]?.lastActiveAt).toBeTruthy();
  });

  it("builds commands from validated Minecraft usernames", () => {
    expect(minecraftPlayerCommand("Good_Name", "whitelist")).toBe(
      "whitelist add Good_Name",
    );
    expect(minecraftPlayerCommand("Good_Name", "ban")).toContain(
      "ban Good_Name",
    );
    expect(() => minecraftPlayerCommand("bad name", "ban")).toThrow(
      "valid Minecraft username",
    );
  });
});
