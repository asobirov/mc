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
import { env } from "./env";

const app = new Hono();
const accessActionSchema = z.object({ action: z.enum(accessActions) });
const trustedOrigin = new URL(env.BETTER_AUTH_URL).origin;

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

app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const { runMigrations } = await getMigrations(auth.options);
await runMigrations();
bootstrapAdminAccounts();

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`Friends MC web is listening on port ${env.PORT}`);
