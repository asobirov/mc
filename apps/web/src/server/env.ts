import { z } from "zod";

const schema = z
  .object({
    AUTH_ADMIN_EMAILS: z.string().min(3),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:5173"),
    BLUEMAP_URL: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().url().optional(),
    ),
    DISCORD_CLIENT_ID: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    DISCORD_CLIENT_SECRET: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    MICROSOFT_CLIENT_ID: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MICROSOFT_CLIENT_SECRET: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MINECRAFT_LOG_PATH: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MINECRAFT_DATA_PATH: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MINECRAFT_RCON_HOST: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MINECRAFT_RCON_PASSWORD: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(1).optional(),
    ),
    MINECRAFT_RCON_PORT: z.coerce.number().int().positive().default(25575),
    MODPACK_PATH: z
      .string()
      .default(
        "../../modpacks/aeronautics-1.21.1/pack/Friends-MC-1.2.0.mrpack",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3001),
    SQLITE_PATH: z.string().default("./data/auth.sqlite"),
  })
  .superRefine((values, context) => {
    if (
      Boolean(values.DISCORD_CLIENT_ID) !==
      Boolean(values.DISCORD_CLIENT_SECRET)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Discord client ID and secret must either both be set or both be omitted",
        path: ["DISCORD_CLIENT_ID"],
      });
    }
    if (
      Boolean(values.MICROSOFT_CLIENT_ID) !==
      Boolean(values.MICROSOFT_CLIENT_SECRET)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Microsoft client ID and secret must either both be set or both be omitted",
        path: ["MICROSOFT_CLIENT_ID"],
      });
    }
    if (
      Boolean(values.MINECRAFT_RCON_HOST) !==
      Boolean(values.MINECRAFT_RCON_PASSWORD)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Minecraft RCON host and password must either both be set or both be omitted",
        path: ["MINECRAFT_RCON_HOST"],
      });
    }
  });

export const env = schema.parse(process.env);
