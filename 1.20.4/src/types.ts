type ModEnvironment = "client" | "server" | "both";

export type Mod = {
  name?: string;
  slug?: string;
  fileUrl?: `${string}.jar`;
  previewUrl: string;
  environment?: ModEnvironment;
  platform?: "neoforge" | "fabric";
};
