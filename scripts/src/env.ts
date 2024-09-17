import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    MINECRAFT_MODS_DIR: z.string().optional(),
    SORT_MODS: z.boolean().default(false),
  },
  emptyStringAsUndefined: true,

  runtimeEnv: process.env,
});
