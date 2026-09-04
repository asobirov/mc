import { open, stat } from "node:fs/promises";

const ANSI_ESCAPE = new RegExp(
  `${String.fromCharCode(27)}\\[[0-9;?]*[ -/]*[@-~]`,
  "g",
);
const PLAYER_NAME = "[A-Za-z0-9_]{1,16}";
const SERVER_INFO_LINE = new RegExp(
  String.raw`^\[[^\]\r\n]+\] \[Server thread/INFO\] \[(?:minecraft/MinecraftServer|net\.minecraft\.server\.(?:MinecraftServer|dedicated\.DedicatedServer))/?\]: (.+)$`,
);
const CHAT_MESSAGE = new RegExp(String.raw`^<(${PLAYER_NAME})> (.+)$`);
const PLAYER_LIFECYCLE = new RegExp(
  String.raw`^${PLAYER_NAME} (?:joined|left) the game$`,
);
const PLAYER_ADVANCEMENT = new RegExp(
  String.raw`^${PLAYER_NAME} has (?:made the advancement|completed the challenge|reached the goal) \[.+\]$`,
);
const PLAYER_DEATH = new RegExp(
  String.raw`^${PLAYER_NAME} (?:blew up|burned to death|discovered the floor was lava|didn't want to live in the same world as .+|died(?: because of .+)?|drowned(?: whilst trying to escape .+)?|experienced kinetic energy(?: whilst trying to escape .+)?|fell (?:from a high place|off .+|out of the world|too far and was finished by .+)|froze to death|hit the ground too hard|left the confines of this world|starved to death|suffocated in a wall|tried to swim in lava|walked into (?:a cactus(?: whilst trying to escape .+)?|danger zone due to .+)|was (?:blown (?:from a high place|up) by .+|burned to a crisp whilst fighting .+|doomed to fall(?: by .+)?|fireballed by .+|frozen to death by .+|impaled (?:by .+|on a stalagmite)|killed (?:by .+|trying to hurt .+)|obliterated by a sonically-charged shriek|poked to death by .+|pricked to death|pummeled by .+|roasted in dragon breath|shot (?:by|off by) .+|skewered by .+|slain by .+|squashed by .+|squished too much|struck by lightning|stung to death|withered away)|went (?:off with a bang|up in flames))$`,
);
const SERVER_ANNOUNCEMENT = /^\[Server\] (.+)$/;
const MAX_READ_BYTES = 1024 * 1024;

export type MinecraftLogMessage = {
  authorName: string;
  body: string;
  kind: "chat" | "system";
};

export function parseMinecraftLogLine(
  rawLine: string,
): MinecraftLogMessage | null {
  const clean = rawLine.replace(ANSI_ESCAPE, "").replace(/\r/g, "");
  const logMatch = SERVER_INFO_LINE.exec(clean);
  const content = logMatch?.[1]?.trim();
  if (!content) return null;

  const chatMatch = CHAT_MESSAGE.exec(content);
  if (chatMatch?.[1] && chatMatch[2]) {
    return {
      authorName: chatMatch[1],
      body: chatMatch[2].trim(),
      kind: "chat",
    };
  }

  const announcementMatch = SERVER_ANNOUNCEMENT.exec(content);
  if (announcementMatch?.[1]) {
    return {
      authorName: "Server",
      body: announcementMatch[1].trim(),
      kind: "system",
    };
  }

  if (
    PLAYER_LIFECYCLE.test(content) ||
    PLAYER_ADVANCEMENT.test(content) ||
    PLAYER_DEATH.test(content)
  ) {
    return { authorName: "Server", body: content, kind: "system" };
  }

  return null;
}

export function parseMinecraftChatLine(
  rawLine: string,
): { authorName: string; body: string } | null {
  const message = parseMinecraftLogLine(rawLine);
  if (message?.kind !== "chat") return null;
  return { authorName: message.authorName, body: message.body };
}

export function minecraftTellraw(authorName: string, body: string): string {
  const payload = {
    text: "",
    extra: [
      { text: "[Web] ", color: "green" },
      { text: authorName, color: "aqua" },
      { text: `: ${body}`, color: "white" },
    ],
  };
  return `tellraw @a ${JSON.stringify(payload)}`;
}

export function startMinecraftChatIngestion(logPath: string): () => void {
  let cursor = 0;
  let remainder = "";
  let initialized = false;
  let running = false;

  async function scan() {
    if (running) return;
    running = true;
    try {
      const details = await stat(logPath);
      if (!initialized) {
        cursor = details.size;
        initialized = true;
        return;
      }
      if (details.size < cursor) {
        cursor = 0;
        remainder = "";
      }
      if (details.size === cursor) return;

      const length = Math.min(details.size - cursor, MAX_READ_BYTES);
      const file = await open(logPath, "r");
      try {
        const buffer = Buffer.alloc(length);
        const { bytesRead } = await file.read(buffer, 0, length, cursor);
        cursor += bytesRead;
        const lines =
          `${remainder}${buffer.subarray(0, bytesRead).toString("utf8")}`.split(
            "\n",
          );
        remainder = lines.pop() ?? "";
        const gameMessages = lines.flatMap((rawLine) => {
          const message = parseMinecraftLogLine(rawLine);
          return message ? [{ ...message, rawLine }] : [];
        });
        if (gameMessages.length === 0) return;
        const { recordGameMessage } = await import("./chat-store");
        for (const message of gameMessages) {
          recordGameMessage(message);
        }
      } finally {
        await file.close();
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn("Could not read Minecraft chat log", error);
      }
    } finally {
      running = false;
    }
  }

  void scan();
  const timer = setInterval(() => void scan(), 2_000);
  timer.unref();
  return () => clearInterval(timer);
}
