import { createHash } from "node:crypto";

import type { ChatMessage } from "../lib/chat";
import { database } from "./auth";

type StoredChatRow = {
  authorName: string;
  body: string;
  createdAt: number | bigint;
  id: number | bigint;
  kind: "chat" | "system";
  source: "game" | "web";
};

database.exec(`
  CREATE TABLE IF NOT EXISTS portal_chat_message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL CHECK (source IN ('game', 'web')),
    authorId TEXT,
    authorName TEXT NOT NULL,
    body TEXT NOT NULL,
    externalKey TEXT UNIQUE,
    kind TEXT NOT NULL DEFAULT 'chat' CHECK (kind IN ('chat', 'system')),
    createdAt INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS portal_chat_message_created_at
    ON portal_chat_message(createdAt);
`);

const chatColumns = database
  .prepare("PRAGMA table_info(portal_chat_message)")
  .all() as { name: string }[];
if (!chatColumns.some((column) => column.name === "kind")) {
  database.exec(`
    ALTER TABLE portal_chat_message
      ADD COLUMN kind TEXT NOT NULL DEFAULT 'chat'
      CHECK (kind IN ('chat', 'system'));
  `);
}

function publicMessage(row: StoredChatRow): ChatMessage {
  return {
    authorName: row.authorName,
    body: row.body,
    createdAt: Number(row.createdAt),
    id: Number(row.id),
    kind: row.kind,
    source: row.source,
  };
}

export function listChatMessages(after = 0, limit = 100): ChatMessage[] {
  const safeAfter = Math.max(0, Math.trunc(after));
  const safeLimit = Math.min(200, Math.max(1, Math.trunc(limit)));
  const rows = database
    .prepare(
      `SELECT id, source, authorName, body, kind, createdAt
       FROM portal_chat_message
       WHERE id > ?
       ORDER BY id ASC
       LIMIT ?`,
    )
    .all(safeAfter, safeLimit) as unknown as StoredChatRow[];
  return rows.map(publicMessage);
}

export function recordWebMessage(input: {
  authorId: string;
  authorName: string;
  body: string;
}): ChatMessage {
  const createdAt = Date.now();
  const result = database
    .prepare(
      `INSERT INTO portal_chat_message
         (source, authorId, authorName, body, createdAt)
       VALUES ('web', ?, ?, ?, ?)`,
    )
    .run(input.authorId, input.authorName, input.body, createdAt);
  return publicMessage({
    authorName: input.authorName,
    body: input.body,
    createdAt,
    id: result.lastInsertRowid,
    kind: "chat",
    source: "web",
  });
}

export function recordGameMessage(input: {
  authorName: string;
  body: string;
  kind: "chat" | "system";
  rawLine: string;
}): ChatMessage | null {
  const createdAt = Date.now();
  const externalKey = createHash("sha256").update(input.rawLine).digest("hex");
  const result = database
    .prepare(
      `INSERT OR IGNORE INTO portal_chat_message
         (source, authorName, body, externalKey, kind, createdAt)
       VALUES ('game', ?, ?, ?, ?, ?)`,
    )
    .run(input.authorName, input.body, externalKey, input.kind, createdAt);
  if (Number(result.changes) === 0) return null;
  return publicMessage({
    authorName: input.authorName,
    body: input.body,
    createdAt,
    id: result.lastInsertRowid,
    kind: input.kind,
    source: "game",
  });
}
