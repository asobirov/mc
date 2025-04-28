import fs from "fs";
import chalk from "chalk";

import { GameLoader } from "@mc/validators/loader";

import { downloadModByUrl } from "../helpers/download-mod-url";
import { modrinthClient } from "./client";
import { getLatestVersion } from "./get-latest-version";
import { getModPlatforms } from "./get-mod-platforms";

type InstallModBySlugOpts = {
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
  output: {
    clientDir?: string;
    serverDir?: string;
  };
};

export const installModBySlug = async ({
  mod,
  client,
  output,
}: InstallModBySlugOpts) => {
  const project = await modrinthClient.getProject(mod.slug);

  const { files, dependencies } = await getLatestVersion({
    project,
    client,
    mod,
  });

  if (!files.length) {
    throw new Error(`${project.title} (${mod.slug}) has no files`);
  }

  const file = files.find((file) => file.primary);

  if (!file) {
    throw new Error(`No primary file found for mod ${project.title}`);
  }

  const platforms = getModPlatforms(project);

  if (platforms.includes("client") && output.clientDir) {
    await downloadModByUrl({
      slug: mod.slug,
      filename: file.filename,
      url: file.url,
      outputDirs: [output.clientDir],
    });
  }

  if (platforms.includes("server") && output.serverDir) {
    // if serverDir is not a file, throw an error
    if (!fs.existsSync(output.serverDir)) {
      throw new Error(`Server mods file ${output.serverDir} does not exist`);
    }

    // if serverDir is a directory, throw an error
    if (fs.statSync(output.serverDir).isDirectory()) {
      throw new Error(`Server mods file ${output.serverDir} is a directory`);
    }

    // Add the mod to the server mods file
    const modEntry = `${file.url}\n`;
    fs.appendFileSync(output.serverDir, modEntry);
    console.log(
      `${chalk.green(`ADDED TO SERVER MODS (${mod.slug}):`)} ${file.url}`,
    );
  }
};
