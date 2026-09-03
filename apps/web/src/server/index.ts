import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { getMigrations } from "better-auth/db/migration";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { stream } from "hono/streaming";

import { isEmailAllowed } from "./access";
import { allowedEmails, auth } from "./auth";
import { env } from "./env";

const app = new Hono();

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

app.get("/api/modpack", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user || !isEmailAllowed(session.user.email, allowedEmails)) {
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

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`Friends MC web is listening on port ${env.PORT}`);
