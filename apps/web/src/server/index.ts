import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getMigrations } from "better-auth/db/migration";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { stream } from "hono/streaming";
import { z } from "zod";

import { accessActions, canAccessPortal } from "./access";
import {
  bootstrapAdminAccounts,
  getAccessUser,
  listAccessUsers,
  updateAccessUser,
} from "./access-store";
import { auth } from "./auth";
import { listChatMessages, recordWebMessage } from "./chat-store";
import { env } from "./env";
import {
  minecraftTellraw,
  startMinecraftChatIngestion,
} from "./minecraft-chat";
import {
  minecraftPlayerActions,
  minecraftPlayerCommand,
  readMinecraftRoster,
} from "./minecraft-players";
import { enrichModCatalog, readModCatalog } from "./mod-catalog";
import { sendRconCommand } from "./rcon";

const app = new Hono();
const accessActionSchema = z.object({ action: z.enum(accessActions) });
const chatMessageSchema = z.object({
  body: z.string().trim().min(1).max(240),
});
const minecraftPlayerActionSchema = z.object({
  action: z.enum(minecraftPlayerActions),
});
const whitelistActionSchema = z.object({
  action: z.enum(["enable", "disable"]),
});
const trustedOrigin = new URL(env.BETTER_AUTH_URL).origin;
const chatBridgeEnabled = Boolean(
  env.MINECRAFT_RCON_HOST && env.MINECRAFT_RCON_PASSWORD,
);

async function authenticatedUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  return getAccessUser(session.user.id);
}

app.use("*", secureHeaders());
app.get("/api/health", (c) => c.json({ ok: true }));
app.get("/api/config", (c) =>
  c.json({
    authProviders: {
      discord: Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET),
      google: true,
      microsoft: Boolean(
        env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET,
      ),
    },
  }),
);
app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/api/access", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user) return c.json({ authenticated: false }, 401);
  return c.json({ authenticated: true, user });
});

app.get("/api/admin/users", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  if (!canAccessPortal(user) || user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  return c.json({ users: listAccessUsers() });
});

app.patch("/api/admin/users/:id", async (c) => {
  if (c.req.header("Origin") !== trustedOrigin) {
    return c.json({ error: "Invalid origin" }, 403);
  }

  const actor = await authenticatedUser(c.req.raw.headers);
  if (!actor) return c.json({ error: "Unauthorized" }, 401);
  if (!canAccessPortal(actor) || actor.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const parsed = accessActionSchema.safeParse(
    await c.req.json().catch(() => null),
  );
  if (!parsed.success) return c.json({ error: "Invalid action" }, 400);

  const target = getAccessUser(c.req.param("id"));
  if (!target) return c.json({ error: "User not found" }, 404);

  const removesAccess = ["block", "demote", "reset"].includes(
    parsed.data.action,
  );
  if (removesAccess && (target.id === actor.id || target.protectedAdmin)) {
    return c.json({ error: "Protected admins cannot lose access here" }, 409);
  }

  const user = updateAccessUser(target.id, parsed.data.action);
  return c.json({ user });
});

app.get("/api/admin/minecraft-players", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  if (!canAccessPortal(user) || user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  if (!env.MINECRAFT_DATA_PATH) {
    return c.json({ error: "Minecraft player history is not configured" }, 503);
  }

  try {
    c.header("Cache-Control", "private, no-store");
    return c.json(readMinecraftRoster(env.MINECRAFT_DATA_PATH));
  } catch (error) {
    console.error("Could not read Minecraft player history", error);
    return c.json({ error: "Minecraft player history is unavailable" }, 503);
  }
});

app.patch("/api/admin/minecraft-players/:uuid", async (c) => {
  if (c.req.header("Origin") !== trustedOrigin) {
    return c.json({ error: "Invalid origin" }, 403);
  }
  const actor = await authenticatedUser(c.req.raw.headers);
  if (!actor) return c.json({ error: "Unauthorized" }, 401);
  if (!canAccessPortal(actor) || actor.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  if (
    !env.MINECRAFT_DATA_PATH ||
    !env.MINECRAFT_RCON_HOST ||
    !env.MINECRAFT_RCON_PASSWORD
  ) {
    return c.json({ error: "Minecraft controls are not configured" }, 503);
  }
  const parsed = minecraftPlayerActionSchema.safeParse(
    await c.req.json().catch(() => null),
  );
  if (!parsed.success) return c.json({ error: "Invalid action" }, 400);

  try {
    const roster = readMinecraftRoster(env.MINECRAFT_DATA_PATH);
    const player = roster.players.find(
      (item) => item.uuid === c.req.param("uuid"),
    );
    if (!player) return c.json({ error: "Player not found" }, 404);
    if (!player.name) {
      return c.json(
        { error: "This player's Minecraft name is unavailable" },
        409,
      );
    }
    await sendRconCommand({
      command: minecraftPlayerCommand(player.name, parsed.data.action),
      host: env.MINECRAFT_RCON_HOST,
      password: env.MINECRAFT_RCON_PASSWORD,
      port: env.MINECRAFT_RCON_PORT,
    });
    return c.json(readMinecraftRoster(env.MINECRAFT_DATA_PATH));
  } catch (error) {
    console.error("Could not update Minecraft player", error);
    return c.json({ error: "Minecraft did not accept that change" }, 502);
  }
});

app.patch("/api/admin/minecraft-whitelist", async (c) => {
  if (c.req.header("Origin") !== trustedOrigin) {
    return c.json({ error: "Invalid origin" }, 403);
  }
  const actor = await authenticatedUser(c.req.raw.headers);
  if (!actor) return c.json({ error: "Unauthorized" }, 401);
  if (!canAccessPortal(actor) || actor.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }
  if (
    !env.MINECRAFT_DATA_PATH ||
    !env.MINECRAFT_RCON_HOST ||
    !env.MINECRAFT_RCON_PASSWORD
  ) {
    return c.json({ error: "Minecraft controls are not configured" }, 503);
  }
  const parsed = whitelistActionSchema.safeParse(
    await c.req.json().catch(() => null),
  );
  if (!parsed.success) return c.json({ error: "Invalid action" }, 400);

  try {
    await sendRconCommand({
      command:
        parsed.data.action === "enable" ? "whitelist on" : "whitelist off",
      host: env.MINECRAFT_RCON_HOST,
      password: env.MINECRAFT_RCON_PASSWORD,
      port: env.MINECRAFT_RCON_PORT,
    });
    return c.json(readMinecraftRoster(env.MINECRAFT_DATA_PATH));
  } catch (error) {
    console.error("Could not update the Minecraft whitelist", error);
    return c.json({ error: "Minecraft did not accept that change" }, 502);
  }
});

app.get("/api/modpack", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user || !canAccessPortal(user)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!existsSync(env.MODPACK_PATH)) {
    return c.json({ error: "Modpack is not available yet" }, 503);
  }

  const details = await stat(env.MODPACK_PATH);
  c.header("Content-Disposition", 'attachment; filename="Friends-MC.mrpack"');
  c.header("Content-Length", details.size.toString());
  c.header("Content-Type", "application/octet-stream");
  c.header("Cache-Control", "private, no-store");
  return stream(c, async (output) => {
    const input = Readable.toWeb(
      createReadStream(env.MODPACK_PATH),
    ) as ReadableStream<Uint8Array>;
    await output.pipe(input);
  });
});

let modCatalogPromise: Promise<ReturnType<typeof readModCatalog>> | null = null;

app.get("/api/mods", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user || !canAccessPortal(user)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!existsSync(env.MODPACK_PATH)) {
    return c.json({ error: "Modpack is not available yet" }, 503);
  }

  try {
    modCatalogPromise ??= (async () => {
      const catalog = readModCatalog(env.MODPACK_PATH);
      try {
        return await enrichModCatalog(catalog);
      } catch (error) {
        console.warn(
          "Could not enrich the mod catalog; using local fallbacks",
          error,
        );
        return catalog;
      }
    })();
    c.header("Cache-Control", "private, max-age=300");
    return c.json(await modCatalogPromise);
  } catch (error) {
    console.error("Could not read the mod catalog", error);
    return c.json({ error: "Mod list is temporarily unavailable" }, 503);
  }
});

app.get("/api/chat", async (c) => {
  const user = await authenticatedUser(c.req.raw.headers);
  if (!user || !canAccessPortal(user)) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const after = z.coerce
    .number()
    .int()
    .nonnegative()
    .catch(0)
    .parse(c.req.query("after"));
  return c.json({
    bridgeEnabled: chatBridgeEnabled,
    messages: listChatMessages(after),
  });
});

app.post("/api/chat", async (c) => {
  if (c.req.header("Origin") !== trustedOrigin) {
    return c.json({ error: "Invalid origin" }, 403);
  }

  const user = await authenticatedUser(c.req.raw.headers);
  if (!user || !canAccessPortal(user)) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const parsed = chatMessageSchema.safeParse(
    await c.req.json().catch(() => null),
  );
  if (!parsed.success) {
    return c.json({ error: "Messages must be 1–240 characters" }, 400);
  }

  const preferredName = user.name.trim();
  const authorName =
    preferredName.length > 0
      ? preferredName
      : (user.email.split("@")[0] ?? "Friend");
  const message = recordWebMessage({
    authorId: user.id,
    authorName,
    body: parsed.data.body,
  });
  let relayError: string | undefined;

  if (env.MINECRAFT_RCON_HOST && env.MINECRAFT_RCON_PASSWORD) {
    try {
      await sendRconCommand({
        command: minecraftTellraw(authorName, message.body),
        host: env.MINECRAFT_RCON_HOST,
        password: env.MINECRAFT_RCON_PASSWORD,
        port: env.MINECRAFT_RCON_PORT,
      });
    } catch (error) {
      console.error("Could not relay web chat to Minecraft", error);
      relayError = "Saved here, but the game relay is temporarily offline";
    }
  }

  return c.json({ message, relayError }, 201);
});

app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const { runMigrations } = await getMigrations(auth.options);
await runMigrations();
bootstrapAdminAccounts();
if (env.MINECRAFT_LOG_PATH) {
  startMinecraftChatIngestion(env.MINECRAFT_LOG_PATH);
}

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`Friends MC web is listening on port ${env.PORT}`);
