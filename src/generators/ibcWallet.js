import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import BaseWalletGenerator from "../core/baseWallet.js";
import { IBC_CHAINS } from "../chains/ibc/index.js";

class IBCWalletGenerator extends BaseWalletGenerator {
  constructor() {
    super();
    this.chainInfo = IBC_CHAINS;
  }

  getAvailableChains() {
    return this.chainInfo;
  }

  async generateWallet(selectedChain = null) {
    if (!selectedChain) {
      throw new Error("Chain must be selected for IBC wallet generation");
    }

    try {
      const wallet = await DirectSecp256k1HdWallet.generate(24, {
        prefix: selectedChain.prefix,
        hdPath: selectedChain.hdPath,
      });

      const [firstAccount] = await wallet.getAccounts();
      const mnemonic = wallet.mnemonic;

      return {
        chain: selectedChain.name,
        chain_id: selectedChain.chain_name,
        prefix: selectedChain.prefix,
        address: firstAccount.address,
        publicKey: Buffer.from(firstAccount.pubkey).toString("base64"),
        mnemonic: mnemonic,
        hdPath: selectedChain.hdPath,
        denom: selectedChain.denom,
        rpc_endpoint: selectedChain.apis?.rpc?.[0]?.address || "Not available",
        rest_endpoint:
          selectedChain.apis?.rest?.[0]?.address || "Not available",
      };
    } catch (error) {
      throw new Error(`Error generating IBC wallet: ${error.message}`);
    }
  }
}

export default IBCWalletGenerator;
