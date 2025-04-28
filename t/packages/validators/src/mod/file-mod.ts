import { z } from "zod";

export const FileMod = z.object({
  type: z.literal("file").default("file"),
  fileUrl: z.custom<`${string}.jar`>(
    (v: string) => v === "string" && v.toLowerCase().endsWith(".jar"),
    { message: "fileUrl must be a .jar file" },
  ),
});
