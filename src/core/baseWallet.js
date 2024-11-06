import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BaseWalletGenerator {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.outputDir = path.join(dirname(__dirname), "../output");
  }

  async ensureOutputDirExists() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  async saveToFile(wallets, networkName) {
    await this.ensureOutputDirExists();

    const detailsFileName = path.join(
      this.outputDir,
      `${networkName}_wallets_details_${this.timestamp}.txt`
    );
    const addressesFileName = path.join(
      this.outputDir,
      `${networkName}_addresses_${this.timestamp}.txt`
    );
    const addresses = wallets.map((w) => w.address);

    const detailsContent = wallets
      .map((wallet, index) => {
        return (
          `Wallet #${index + 1}\n` +
          Object.entries(wallet)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n") +
          "\n" +
          "-".repeat(50) +
          "\n"
        );
      })
      .join("\n");

    const addressesContent = addresses.join("\n");

    await fs.writeFile(detailsFileName, detailsContent);
    await fs.writeFile(addressesFileName, addressesContent);

    return { detailsFileName, addressesFileName };
  }

  async generateBulkWallets(count, networkName) {
    const wallets = [];
    console.log(
      chalk.cyan(
        `\nStarting generation of ${count} ${networkName} wallet(s)...`
      )
    );

    const spinner = ora({
      text: "Generating wallets...",
      color: "yellow",
    }).start();

    try {
      for (let i = 0; i < count; i++) {
        const wallet = await this.generateWallet();
        wallets.push(wallet);
        spinner.text = chalk.yellow(`Generated ${i + 1}/${count} wallet(s)`);
      }

      spinner.succeed(chalk.green("Wallet generation completed!"));

      const { detailsFileName, addressesFileName } = await this.saveToFile(
        wallets,
        networkName
      );

      console.log(
        chalk.cyan(`\nFull details saved to: ${path.basename(detailsFileName)}`)
      );
      console.log(
        chalk.cyan(
          `Addresses only saved to: ${path.basename(addressesFileName)}`
        )
      );

      return wallets;
    } catch (error) {
      spinner.fail(chalk.red(`Error during ${networkName} bulk generation`));
      console.error(chalk.red(error));
      throw error;
    }
  }

  async generateWallet() {
    throw new Error("generateWallet method must be implemented");
  }
}

export default BaseWalletGenerator;
