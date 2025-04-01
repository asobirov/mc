import chalk from "chalk";

import * as path from "path";
import * as fs from "fs";

import { hasIncompatibleMods } from "@/helpers/has-incompatible-mods";
import { mods } from "../mods";
import { env } from "@/env";
import { Mod } from "@/types";
import { downloadModByUrl } from "@/helpers/download-mod-url";
import { removeNonListedMods } from "@/helpers/remove-non-listed-mods";

const MINECRAFT_MODS_DIR = env.MINECRAFT_MODS_DIR ?? "./client-mods";

async () => {
  if (hasIncompatibleMods()) {
    console.log(chalk.red.bold("Incompatible mods found."));
    return;
  }

  const count = {
    reused: 0,
    downloaded: 0,
    deleted: 0,
  };

  const dir = path.resolve(path.dirname(""), MINECRAFT_MODS_DIR);
  console.log(
    chalk.blue(
      `Downloading mods into the ${chalk.blueBright.bold(dir)} directory.`
    )
  );

  if (!fs.existsSync(dir)) {
    console.error(chalk.red.bold(`Directory ${dir} does not exist.`));
    return process.exit(1);
  }

  const formattedMods = getFormattedMods(mods);

  for (const mod of formattedMods) {
    const { status } = await downloadModByUrl(mod, dir);

    switch (status) {
      case "skipped":
        count.reused++;
        break;
      case "downloaded":
        count.downloaded++;
        break;
    }
  }

  const { removedCount } = removeNonListedMods(formattedMods, dir);
  count.deleted += removedCount;

  console.log(chalk.dim("========="));
  console.log(
    chalk.green.bold(
      "All mods have been downloaded and cleaned up successfully."
    )
  );
  console.log(`${chalk.bold("Directory")}: file://${dir.replace(/ /g, "%20")}`);
  console.log(
    chalk(
      `${chalk.bold("Reused")}: ${count.reused}\n` +
        `${chalk.bold("Downloaded")}: ${count.downloaded}\n` +
        `${chalk.bold("Deleted")}: ${count.deleted}`
    )
  );
};

const getFormattedMods = (mods: Mod[]) => {
  if (!env.SORT_MODS) {
    return mods;
  }

  return mods.sort((a, b) => a.name.localeCompare(b.name));
};
