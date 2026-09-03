import { describe, expect, it } from "vitest";

import { minecraftTellraw, parseMinecraftChatLine } from "./minecraft-chat";

describe("Minecraft chat bridge", () => {
  it("parses player chat from a dedicated-server log", () => {
    expect(
      parseMinecraftChatLine(
        "[20:24:10] [Server thread/INFO] [minecraft/MinecraftServer]: <xprim_> hello friends",
      ),
    ).toEqual({ authorName: "xprim_", body: "hello friends" });
  });

  it("ignores commands and system log lines", () => {
    expect(
      parseMinecraftChatLine(
        "[20:24:10] [Server thread/INFO] [minecraft/MinecraftServer]: There are 0 players online",
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
