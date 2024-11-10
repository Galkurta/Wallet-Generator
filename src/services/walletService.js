import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { format } from "date-fns";
import TONWalletGenerator from "../generators/tonWallet.js";
import SuiWalletGenerator from "../generators/suiWallet.js";
import SolanaWalletGenerator from "../generators/solanaWallet.js";
import EVMWalletGenerator from "../generators/evmWallet.js";
import IBCWalletGenerator from "../generators/ibcWallet.js";
import { createBanner } from "../constants/banner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WalletGeneratorService {
  constructor() {
    this.generators = {
      ton: new TONWalletGenerator(),
      sui: new SuiWalletGenerator(),
      solana: new SolanaWalletGenerator(),
      evm: new EVMWalletGenerator(),
      ibc: new IBCWalletGenerator(),
    };
    this.outputDir = path.join(dirname(__dirname), "../output");
  }

  getFormattedTimestamp() {
    return format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  }

  async promptForNetwork() {
    const networks = Object.keys(this.generators);
    const { network } = await inquirer.prompt([
      {
        type: "list",
        name: "network",
        message: chalk.green("Select blockchain network:"),
        choices: networks.map((net) => ({
          name: chalk.yellow(net.toUpperCase()),
          value: net,
        })),
        pageSize: 10,
      },
    ]);
    return network;
  }

  async promptForIBCChain(ibcChains) {
    const { chain } = await inquirer.prompt([
      {
        type: "list",
        name: "chain",
        message: chalk.green("Select IBC Chain:"),
        choices: ibcChains.map((chain) => ({
          name: chalk.yellow(`${chain.name} (${chain.denom})`),
          value: chain,
        })),
        pageSize: 15,
      },
    ]);
    return chain;
  }

  async promptForWalletCount() {
    const { count } = await inquirer.prompt([
      {
        type: "input",
        name: "count",
        message: chalk.green("Enter the number of wallets to generate:"),
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num <= 0) {
            return "Please enter a valid positive number";
          }
          return true;
        },
      },
    ]);
    return parseInt(count);
  }

  async confirmLargeGeneration(count) {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: chalk.yellow(
          `You are about to generate ${count} wallets. This might take some time. Continue?`
        ),
        default: false,
      },
    ]);
    return confirm;
  }

  async showMainMenu() {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: chalk.green("What would you like to do?"),
        choices: [
          {
            name: chalk.yellow("Generate Wallets"),
            value: "generate",
          },
          {
            name: chalk.yellow("Exit"),
            value: "exit",
          },
        ],
        pageSize: 10,
      },
    ]);
    return action;
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      return this.outputDir;
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
      return this.outputDir;
    }
  }

  async generateIBCWallets(generator, selectedChain, numberOfWallets) {
    const wallets = [];
    console.log(
      chalk.cyan(
        `\nStarting generation of ${numberOfWallets} ${selectedChain.name} wallet(s)...`
      )
    );

    for (let i = 0; i < numberOfWallets; i++) {
      const wallet = await generator.generateWallet(selectedChain);
      wallets.push(wallet);
      console.log(chalk.green(`Generated wallet ${i + 1}/${numberOfWallets}`));
    }

    const timestamp = this.getFormattedTimestamp();
    const chainName = selectedChain.name.toLowerCase().replace(/\s+/g, "_");

    const detailsFileName = `${chainName}_wallet_details_${timestamp}.txt`;
    const addressesFileName = `${chainName}_addresses_${timestamp}.txt`;

    const outputDir = await this.ensureOutputDir();
    const detailsPath = path.join(outputDir, detailsFileName);
    const addressesPath = path.join(outputDir, addressesFileName);

    const detailsContent = wallets
      .map(
        (wallet, index) =>
          `Wallet #${index + 1}\n` +
          `Chain: ${wallet.chain}\n` +
          `Chain ID: ${wallet.chain_id}\n` +
          `Address: ${wallet.address}\n` +
          `Mnemonic: ${wallet.mnemonic}\n` +
          `Public Key: ${wallet.publicKey}\n` +
          `HD Path: ${wallet.hdPath}\n` +
          `Denom: ${wallet.denom}\n` +
          `RPC: ${wallet.rpc_endpoint}\n` +
          `REST: ${wallet.rest_endpoint}\n` +
          "-".repeat(50) +
          "\n"
      )
      .join("\n");

    const addressesContent = wallets.map((wallet) => wallet.address).join("\n");

    await Promise.all([
      fs.writeFile(detailsPath, detailsContent),
      fs.writeFile(addressesPath, addressesContent),
    ]);

    console.log(chalk.green("\nGeneration completed successfully!"));
    console.log(chalk.cyan(`Full details saved to: ${detailsFileName}`));
    console.log(chalk.cyan(`Addresses only saved to: ${addressesFileName}`));
  }

  async generateWallets() {
    try {
      createBanner();

      while (true) {
        const action = await this.showMainMenu();

        if (action === "exit") {
          console.log(
            chalk.green("\nThank you for using Multi-Chain Wallet Generator!")
          );
          process.exit(0);
        }

        const network = await this.promptForNetwork();
        const generator = this.generators[network];

        let selectedChain;
        if (network === "ibc") {
          const ibcChains = generator.getAvailableChains();
          selectedChain = await this.promptForIBCChain(ibcChains);
        }

        const numberOfWallets = await this.promptForWalletCount();

        if (numberOfWallets > 100) {
          const confirmed = await this.confirmLargeGeneration(numberOfWallets);
          if (!confirmed) {
            console.log(chalk.red("\nOperation cancelled."));
            continue;
          }
        }

        if (network === "ibc") {
          await this.generateIBCWallets(
            generator,
            selectedChain,
            numberOfWallets
          );
        } else {
          await generator.generateBulkWallets(
            numberOfWallets,
            network.toUpperCase()
          );
        }

        const { again } = await inquirer.prompt([
          {
            type: "confirm",
            name: "again",
            message: chalk.cyan("\nWould you like to generate more wallets?"),
            default: true,
          },
        ]);

        if (!again) {
          console.log(
            chalk.green("\nThank you for using Multi-Chain Wallet Generator!")
          );
          break;
        }
      }
    } catch (error) {
      console.error(chalk.red("Error in wallet generation service:", error));
    }
  }
}

export default WalletGeneratorService;
