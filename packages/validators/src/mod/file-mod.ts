import { z } from "zod";

import { Platforms } from "../platform";

export const FileMod = z.object({
  type: z.literal("file").default("file"),
  platforms: Platforms.optional(),
  fileUrl: z.custom<`${string}.jar`>(
    (v: string) => v === "string" && v.toLowerCase().endsWith(".jar"),
    { message: "fileUrl must be a .jar file" },
  ),
});
