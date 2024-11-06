import WalletGeneratorService from "./services/walletService.js";

async function main() {
  const service = new WalletGeneratorService();
  await service.generateWallets();
}

main().catch(console.error);
