import chalk from "chalk";
import inquirer from "inquirer";
import TONWalletGenerator from "../generators/tonWallet.js";
import SuiWalletGenerator from "../generators/suiWallet.js";
import SolanaWalletGenerator from "../generators/solanaWallet.js";
import EVMWalletGenerator from "../generators/evmWallet.js";
import { createBanner } from "../constants/banner.js";

class WalletGeneratorService {
  constructor() {
    this.generators = {
      ton: new TONWalletGenerator(),
      sui: new SuiWalletGenerator(),
      solana: new SolanaWalletGenerator(),
      evm: new EVMWalletGenerator(),
    };
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

        const numberOfWallets = await this.promptForWalletCount();

        if (numberOfWallets > 100) {
          const confirmed = await this.confirmLargeGeneration(numberOfWallets);
          if (!confirmed) {
            console.log(chalk.red("\nOperation cancelled."));
            continue;
          }
        }

        await generator.generateBulkWallets(
          numberOfWallets,
          network.toUpperCase()
        );

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
