import { Mod } from "@/types";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

export const removeNonListedMods = (mods: Mod[], outputDir: string) => {
  const filesInOutputDir = fs.readdirSync(outputDir);
  let removedCount = 0;

  const IGNORED_FILES = [".connector", "_bclib_deactivated"];
  const SYSTEM_FILES = [".DS_Store"];

  for (const file of filesInOutputDir) {
    if (IGNORED_FILES.includes(file)) {
      console.log(chalk.cyan.dim(`SKIP: Folder ${file} is ignored.`));
      continue;
    }

    if (SYSTEM_FILES.includes(file)) {
      console.log(chalk.cyan.dim(`SKIP: System file ${file} is ignored.`));
      continue;
    }

    if (file.startsWith("tl_")) {
      console.log(chalk.cyan.dim(`SKIP: Ignoring TL mod ${file}`));
      continue;
    }

    if (!mods.some((mod) => mod.name === file)) {
      const filePath = path.join(outputDir, file);
      console.warn(chalk.redBright.bold(`DELETE: Removing old mod ${file}`));
      fs.unlinkSync(filePath);
      removedCount++;
    }
  }

  return { removedCount };
};
