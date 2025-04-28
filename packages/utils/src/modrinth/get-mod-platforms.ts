import { Project } from "@xmcl/modrinth";
import chalk from "chalk";

import { Platforms } from "@mc/validators/platform";

/**
 * Get the platforms of a mod
 */
export const getModPlatforms = (mod: Project): Platforms => {
  const platforms: Platforms = [];

  if (mod.client_side === "unknown" || mod.server_side === "unknown") {
    console.error(
      `${mod.title} (${mod.slug}) has unknown platform compatibility`,
    );
    throw new Error(`${mod.title} (${mod.slug}) has no platform`);
  }

  if (mod.client_side === "required" || mod.client_side === "optional") {
    platforms.push("client");
  }

  if (mod.server_side === "required" || mod.server_side === "optional") {
    platforms.push("server");
  }

  console.log(
    chalk.dim(
      `Mod compatibility: ${JSON.stringify({
        client: mod.client_side,
        server: mod.server_side,
        platforms,
      })}`,
    ),
  );

  if (platforms.length === 0) {
    throw new Error(`${mod.title} (${mod.slug}) has no platform`);
  }

  return platforms;
};
