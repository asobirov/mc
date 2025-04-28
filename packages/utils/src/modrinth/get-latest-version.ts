import chalk from "chalk";
import { Project } from "@xmcl/modrinth";

import { GameLoader } from "@mc/validators/loader";

import { modrinthClient } from "./client";

type GetLatestVersionOpts = {
  project: Project;
  mod: {
    slug: string;
    /**
     * The version of the mod to install.
     * If not provided, the latest version will be installed.
     */
    version?: string;
    /**
     * The loader of the mod.
     * If not provided, the loader will be inferred from the client.
     */
    loader?: GameLoader;
  };
  client: {
    version: string;
    loader: GameLoader;
  };
};

export const getLatestVersion = async ({
  project,
  client,
  mod,
}: GetLatestVersionOpts) => {
  const loader = mod.loader || client.loader;
  const versions = await modrinthClient.getProjectVersions(mod.slug, {
    gameVersions: [client.version],
    loaders: [loader],
  });

  const latestVersion = versions[0];

  if (!mod.version) {
    if (!latestVersion) {
      console.log(
        chalk.red(
          `${project.title} (${mod.slug}) has no versions.\nloader: ${loader}, game version: ${client.version}`,
        ),
      );
      throw new Error(`${project.title} (${mod.slug}) has no versions`);
    }

    return latestVersion;
  }

  const version = versions.find(
    (v) => v.version_number === mod.version || v.id === mod.version,
  );

  if (!version) {
    console.log(versions);
    throw new Error(
      `${project.title} (${mod.slug}) using version override: ${mod.version} not found`,
    );
  }

  console.log(
    chalk.dim(
      `${project.title} (${mod.slug}) using version override: ${mod.version}`,
    ),
  );

  return version;
};
