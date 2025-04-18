import chalk from "chalk";
import fs from "fs";

import { GAME_LOADER } from "@/constants";
import { client } from "@/lib/modrinth";

import { mods } from "@/mods";
import type { ModVersionFile, Project, ProjectVersion } from "@xmcl/modrinth";
import { downloadModByUrl } from "@/helpers/download-mod-url";
import * as path from "path";

const GAME_VERSION = "1.20.1";
const ACTIVE_LOADER = GAME_LOADER.FORGE;
const MODS_LIST = mods.map((mod) => ({
  slug: mod.slug || mod.previewUrl.split("/").pop(),
  loader: mod.loader,
  version: mod.version,
}));

const CLIENT_MODS_OUTPUT_DIR = path.join(process.cwd(), "mods");
// const CLIENT_MODS_OUTPUT_DIR = undefined;
const EXTRAS_DIR = path.join(process.cwd(), "extras");
const MODS_TXT_PATH = path.join(EXTRAS_DIR, "mods.txt");

type DOWNLOAD_FILE = ModVersionFile & {
  slug: string;
  platforms: ("client" | "server")[];
};

const main = async () => {
  // Ensure extras directory exists
  fs.mkdirSync(EXTRAS_DIR, { recursive: true });
  // Clear the mods.txt file
  fs.writeFileSync(MODS_TXT_PATH, "");

  const dependencies: ProjectVersion["dependencies"] = [];

  for (const { slug, loader = ACTIVE_LOADER, version } of MODS_LIST) {
    try {
      if (!slug) {
        console.error(`No slug found for ${slug}`);
        continue;
      }

      const mod = await client.getProject(slug);

      const { loader: validLoader } = validateModCompatibility(mod, loader);

      const { files, dependencies } = await getLatestVersion(
        mod,
        validLoader,
        version
      );

      if (!files.length) {
        console.error(`No files found for mod ${mod.title}`);
        continue;
      }

      const primaryFile = files.find((file) => file.primary);

      if (!primaryFile) {
        throw new Error(`No primary file found for mod ${mod.title}`);
      }

      if (dependencies.length > 0) {
        dependencies.push(...dependencies);
      }

      const platforms = sortModByPlatform(mod);

      await downloadMod({
        ...primaryFile,
        slug,
        platforms,
      });

      console.log(chalk.green(`✅ Finished ${mod.title} (${slug})`));
    } catch (error) {
      console.error(chalk.red(`Error fetching mod ${slug}\n`), error);
    }
  }
};

const validateModCompatibility = (
  mod: Project,
  loaderOverride?: GAME_LOADER
) => {
  const _meta = {
    loader: loaderOverride || ACTIVE_LOADER,
  };

  if (mod.project_type !== "mod") {
    throw new Error(`${mod.title} (${mod.slug}) is not a mod`);
  }

  if (!mod.game_versions.includes(GAME_VERSION)) {
    throw new Error(
      `${mod.title} (${
        mod.slug
      }) does not have a ${GAME_VERSION} version. Supported versions: ${JSON.stringify(
        mod.game_versions
      )}`
    );
  }

  if (!mod.loaders.includes(ACTIVE_LOADER)) {
    console.error(
      `${mod.title} (${mod.slug}) does not have a ${ACTIVE_LOADER} loader supported. Trying to use Fabric...`
    );
    if (!mod.loaders.includes(GAME_LOADER.FABRIC)) {
      throw new Error(
        `${mod.title} (${mod.slug}) does not have support for ${
          GAME_LOADER.FABRIC
        } and ${ACTIVE_LOADER}. Please resolve this mod. Supported loaders: ${JSON.stringify(
          mod.loaders
        )}`
      );
    }

    _meta.loader = GAME_LOADER.FABRIC;
    console.log(
      chalk.yellow(
        `⚠️  ${mod.title} (${mod.slug}) does not have support for ${ACTIVE_LOADER}. Using ${GAME_LOADER.FABRIC} instead.`
      )
    );
  }

  if (mod.client_side === "unknown" || mod.server_side === "unknown") {
    throw new Error(
      `${mod.title} (${mod.slug}) has unknown platform compatibility. Resolve this manually`
    );
  }

  console.log(chalk.green(`${mod.title} (${mod.slug}) is valid`));
  return _meta;
};

const getLatestVersion = async (
  mod: Project,
  loader: GAME_LOADER,
  versionOverride?: string
) => {
  const versions = await client.getProjectVersions(mod.slug, {
    gameVersions: [GAME_VERSION],
    loaders: [loader],
  });

  const latestVersion = versions[0];

  if (!versionOverride) {
    return latestVersion;
  }

  const version = versions.find(
    (v) => v.version_number === versionOverride || v.id === versionOverride
  );

  if (!version) {
    console.log(versions);
    throw new Error(
      `${mod.title} (${mod.slug}) using version override: ${versionOverride} not found`
    );
  }

  console.log(
    chalk.dim(
      `${mod.title} (${mod.slug}) using version override: ${versionOverride}`
    )
  );

  return version;
};

const sortModByPlatform = (mod: Project) => {
  const platforms: ("client" | "server")[] = [];

  if (mod.client_side === "unknown" || mod.server_side === "unknown") {
    console.error(
      `${mod.title} (${mod.slug}) has unknown platform compatibility`
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
      })}`
    )
  );

  if (platforms.length === 0) {
    throw new Error(`${mod.title} (${mod.slug}) has no platform`);
  }

  return platforms;
};

const downloadMod = async (file: DOWNLOAD_FILE) => {
  if (file.platforms.includes("client") && CLIENT_MODS_OUTPUT_DIR) {
    await downloadModByUrl({
      filename: file.filename,
      slug: file.slug,
      url: file.url,
      outputDirs: [CLIENT_MODS_OUTPUT_DIR],
    });
  }

  if (file.platforms.includes("server")) {
    // Append server mod URL to mods.txt
    const modEntry = `${file.url}\n`;
    fs.appendFileSync(MODS_TXT_PATH, modEntry);
    console.log(
      `${chalk.green(`ADDED TO SERVER MODS (${file.slug}):`)} ${file.url}`
    );
  }
};

main();
