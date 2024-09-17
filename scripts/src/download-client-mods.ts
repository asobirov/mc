import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

import { env } from "@/env";

import { parseMarkdownFile, downloadFile } from "./open-urls-in-file";

// Path to the markdown file
const mdFilePath = path.resolve(path.dirname(""), "../1.20.1/client_mods.md");

const getOutputDir = () => {
  if (!env.MINECRAFT_MODS_DIR) {
    const dir = path.resolve(path.dirname(""), "./client-mods");
    console.log(
      chalk.yellow(
        `${chalk.yellow.bold(
          "MINECRAFT_MODS_DIR"
        )} is not set. Downloading mods into the ${chalk.blueBright.bold(
          dir
        )} directory.`
      )
    );
    return dir;
  }

  const dir = path.resolve(path.dirname(""), env.MINECRAFT_MODS_DIR);
  console.log(
    chalk.blue(
      `Downloading mods into the ${chalk.blueBright.bold(dir)} directory.`
    )
  );

  if (!fs.existsSync(dir)) {
    console.error(chalk.red.bold(`Directory ${dir} does not exist.`));
    return process.exit(1);
  }

  return dir;
};

(async () => {
  try {
    console.log(chalk.green.bold("Starting the download process..."));
    let links = await parseMarkdownFile(mdFilePath);
    console.log(
      chalk.dim(`Found ${links.length} URLs in the markdown file.\n`)
    );

    const outputDir = getOutputDir();

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(chalk.green(`Created directory ${outputDir}.\n`));
    }

    const downloadedFiles = new Set<string>();

    const count = {
      reused: 0,
      downloaded: 0,
      deleted: 0,
    };

    if (env.SORT_MODS) {
      links = links.sort((a, b) => a.name.localeCompare(b.name));
    }

    for (const { name, url } of links) {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);

      downloadedFiles.add(fileName);

      if (fs.existsSync(outputPath)) {
        console.log(
          `${chalk.cyan(`SKIP (${chalk.cyan.dim(name)}):`)} File ${chalk.italic(
            fileName
          )} already exists.`
        );
        count.reused++;
        continue;
      }

      console.log(
        chalk.dim(
          `Downloading ${name} - ${chalk.italic(
            url
          )} to ${chalk.blueBright.bold(outputPath)}...`
        )
      );

      await downloadFile(url, outputPath);
      count.downloaded++;

      console.log(`${chalk.green(`DOWNLOAD COMPLETE (${name}):`)} ${fileName}`);
    }

    // Delete old mods not listed in the markdown file
    const filesInOutputDir = fs.readdirSync(outputDir);
    for (const file of filesInOutputDir) {
      // ignore ".connector" folder
      const ignoreFolders = [".connector", "_bclib_deactivated"];
      if (ignoreFolders.includes(file)) {
        console.log(chalk.cyan.dim(`SKIP: Folder ${file} is ignored.`));
        continue;
      }

      const systemFiles = [".DS_Store"];
      if (systemFiles.includes(file)) {
        console.log(chalk.cyan.dim(`SKIP: System file ${file}`));
        continue;
      }

      if (file.startsWith("tl_")) {
        console.log(chalk.cyan.dim(`SKIP: Ignoring TL mod ${file}`));
        continue;
      }

      if (!downloadedFiles.has(file)) {
        const filePath = path.join(outputDir, file);
        console.warn(chalk.redBright.bold(`DELETE: Removing old mod ${file}`));
        fs.unlinkSync(filePath);
        count.deleted++;
      }
    }

    console.log(chalk.dim("========="));
    console.log(
      chalk.green.bold(
        "All mods have been downloaded and cleaned up successfully."
      )
    );
    console.log(`${chalk.bold("Directory")}: ${outputDir}`);
    console.log(
      chalk(
        `${chalk.bold("Reused")}: ${count.reused}\n` +
          `${chalk.bold("Downloaded")}: ${count.downloaded}\n` +
          `${chalk.bold("Deleted")}: ${count.deleted}`
      )
    );
  } catch (error) {
    console.error(chalk.red("Failed to download mods:"), error);
  }
})();
