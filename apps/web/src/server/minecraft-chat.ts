import { open, stat } from "node:fs/promises";

const ANSI_ESCAPE = new RegExp(
  `${String.fromCharCode(27)}\\[[0-9;?]*[ -/]*[@-~]`,
  "g",
);
const CHAT_LINE = /\]: <([A-Za-z0-9_]{1,16})> (.+)$/;
const MAX_READ_BYTES = 1024 * 1024;

export function parseMinecraftChatLine(
  rawLine: string,
): { authorName: string; body: string } | null {
  const clean = rawLine.replace(ANSI_ESCAPE, "").replace(/\r/g, "");
  const match = CHAT_LINE.exec(clean);
  if (!match?.[1] || !match[2]) return null;
  return { authorName: match[1], body: match[2].trim() };
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
          const message = parseMinecraftChatLine(rawLine);
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
