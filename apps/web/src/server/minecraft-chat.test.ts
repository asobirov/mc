import { describe, expect, it } from "vitest";

import {
  minecraftTellraw,
  parseMinecraftChatLine,
  parseMinecraftLogLine,
} from "./minecraft-chat";

const serverLine = (message: string) =>
  `[04Sep2026 22:14:08.432] [Server thread/INFO] [net.minecraft.server.MinecraftServer/]: ${message}`;

describe("Minecraft chat bridge", () => {
  it("parses player chat from a dedicated-server log", () => {
    expect(
      parseMinecraftChatLine(serverLine("<xprim_> hello friends")),
    ).toEqual({ authorName: "xprim_", body: "hello friends" });
  });

  it.each([
    "xprim_ joined the game",
    "xprim_ left the game",
    "xprim_ has made the advancement [Stone Age]",
    "xprim_ has completed the challenge [How Did We Get Here?]",
    "xprim_ was slain by Zombie",
    "xprim_ fell from a high place",
  ])("parses the public system event: %s", (message) => {
    expect(parseMinecraftLogLine(serverLine(message))).toEqual({
      authorName: "Server",
      body: message,
      kind: "system",
    });
  });

  it("parses explicit server announcements", () => {
    expect(
      parseMinecraftLogLine(serverLine("[Server] Maintenance in 10 minutes")),
    ).toEqual({
      authorName: "Server",
      body: "Maintenance in 10 minutes",
      kind: "system",
    });
  });

  it.each([
    "There are 0 players online",
    "Made xprim_ a server operator",
    "[Rcon: Made xprim_ a server operator]",
    "Saved the game",
    "xprim_ issued server command: /gamemode creative",
    "Whitelist is now turned off",
  ])("ignores private or administrative output: %s", (message) => {
    expect(parseMinecraftLogLine(serverLine(message))).toBeNull();
  });

  it("ignores lookalike events emitted by mod loggers", () => {
    expect(
      parseMinecraftLogLine(
        "[04Sep2026 22:14:08.432] [Server thread/INFO] [some.mod.Logger/]: xprim_ joined the game",
      ),
    ).toBeNull();
  });

  it("escapes web messages inside tellraw JSON", () => {
    const command = minecraftTellraw('A"B', 'hello "world"');
    expect(command).toContain("tellraw @a");
    expect(command).toContain('A\\"B');
    expect(command).toContain('hello \\"world\\"');
  });
});
