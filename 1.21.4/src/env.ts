import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    MINECRAFT_MODS_DIR: z.string().optional(),
    SORT_MODS: z.string().transform((v) => v === "true" || v === "1").default("true"),
  },
  emptyStringAsUndefined: true,

  runtimeEnv: process.env,
});
