import { GAME_LOADER } from "@/constants";

type ModEnvironment = "client" | "server" | "both";

export type Mod = {
  name?: string;
  slug?: string;
  fileUrl?: `${string}.jar`;
  previewUrl: string;
  environment?: ModEnvironment;
  loader?: GAME_LOADER;
};
