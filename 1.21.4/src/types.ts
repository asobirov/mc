type ModEnvironment = "client" | "server" | "both";

export type Mod = {
  name: string;
  fileUrl: `${string}.jar`;
  previewUrl: string;
  environment: ModEnvironment;
};
