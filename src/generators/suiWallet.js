import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import BaseWalletGenerator from "../core/baseWallet.js";

class SuiWalletGenerator extends BaseWalletGenerator {
  constructor() {
    super();
    this.client = new SuiClient({ url: getFullnodeUrl("mainnet") });
  }

  async generateWallet() {
    try {
      const keypair = new Ed25519Keypair();
      const address = keypair.getPublicKey().toSuiAddress();
      const exportedKeypair = keypair.export();

      return {
        address: address,
        publicKey: keypair.getPublicKey().toBase64(),
        privateKey: exportedKeypair.privateKey,
      };
    } catch (error) {
      throw new Error(`Error generating SUI wallet: ${error.message}`);
    }
  }
}

export default SuiWalletGenerator;
