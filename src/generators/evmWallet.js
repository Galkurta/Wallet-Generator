import { ethers } from "ethers";
import BaseWalletGenerator from "../core/baseWallet.js";

class EVMWalletGenerator extends BaseWalletGenerator {
  async generateWallet() {
    try {
      const wallet = ethers.Wallet.createRandom();

      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
      };
    } catch (error) {
      throw new Error(`Error generating EVM wallet: ${error.message}`);
    }
  }
}

export default EVMWalletGenerator;
