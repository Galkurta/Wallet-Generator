import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import BaseWalletGenerator from "../core/baseWallet.js";

class SolanaWalletGenerator extends BaseWalletGenerator {
  async generateWallet() {
    try {
      const keypair = Keypair.generate();

      return {
        address: keypair.publicKey.toString(),
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
      };
    } catch (error) {
      throw new Error(`Error generating Solana wallet: ${error.message}`);
    }
  }
}

export default SolanaWalletGenerator;
