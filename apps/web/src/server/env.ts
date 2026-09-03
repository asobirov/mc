import { z } from "zod";

const schema = z
  .object({
    AUTH_ADMIN_EMAILS: z.string().min(3),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:5173"),
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
    MODPACK_PATH: z
      .string()
      .default(
        "../../modpacks/aeronautics-1.21.1/pack/Friends-MC-1.0.1.mrpack",
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
  });

export const env = schema.parse(process.env);
