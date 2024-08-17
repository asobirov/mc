import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    MINECRAFT_MODS_DIR: z.string().optional(),
  },
  emptyStringAsUndefined: true,

  runtimeEnv: process.env,
});
