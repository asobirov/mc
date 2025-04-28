import fs from "fs";
import path from "path";
import chalk from "chalk";

import { installModBySlug } from "@mc/utils/modrinth/install-mods";

import { modList } from "./mod-list";

const setupMods = async () => {
  const loader = modList.baseLoader;
  const version = modList.gameVersion;

  const CLIENT_MODS_OUTPUT_DIR = path.join(process.cwd(), "mods");

  const EXTRAS_DIR = path.join(process.cwd(), "extras");
  const SERVER_MODS_TXT_PATH = path.join(EXTRAS_DIR, "mods.txt");

  // Clear the server mods file
  fs.writeFileSync(SERVER_MODS_TXT_PATH, "");

  for (const mod of modList.mods) {
    switch (mod.type) {
      case "file":
        console.log(chalk.red(`File mods are not supported yet`));
        break;
      case "provider":
        console.log(chalk.red(`Provider mods are not supported yet`));
        break;
      case "provider-list":
        const modList = mod;

        if (modList.provider === "curseforge") {
          console.log(chalk.red(`Curseforge mods are not supported yet`));
          break;
        }

        if (modList.provider === "modrinth") {
          for (const mod of modList.mods) {
            await installModBySlug({
              mod: {
                slug: mod.slug,
                version: mod.version,
                loader: mod.loader,
              },
              client: { loader, version },
              output: {
                clientDir: CLIENT_MODS_OUTPUT_DIR,
                serverDir: SERVER_MODS_TXT_PATH,
              },
            });
          }
        }
        break;
      default:
        console.log(chalk.red(`Unknown mod type`));
        break;
    }
  }
};

setupMods();
