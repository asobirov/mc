import * as fs from "fs";
import { createWriteStream } from "fs";
import chalk from "chalk";
import { Mod } from "@/types";

import * as path from "path";
import axios from "axios";

type DownloadStatus = "skipped" | "downloaded";

export const downloadModByUrl = async (
  mod: Mod,
  outputDir: string
): Promise<{
  status: DownloadStatus;
}> => {
  const fileName = path.basename(mod.fileUrl);
  const outputPath = path.join(outputDir, fileName);

  if (fs.existsSync(outputPath)) {
    console.log(
      `${chalk.cyan(`SKIP (${chalk.cyan.dim(mod.name)}):`)} File ${chalk.italic(
        fileName
      )} already exists.`
    );
    return {
      status: "skipped",
    };
  }

  console.log(
    chalk.dim(
      `Downloading ${mod.name} - ${chalk.italic(
        mod.fileUrl
      )} to ${chalk.blueBright.bold(outputPath)}...`
    )
  );
  await downloadFile(mod.fileUrl, outputPath);

  console.log(`${chalk.green(`DOWNLOAD COMPLETE (${mod.name}):`)} ${fileName}`);

  return {
    status: "downloaded",
  };
};

const downloadFile = async (url: string, outputPath: string) => {
  const writer = createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};
