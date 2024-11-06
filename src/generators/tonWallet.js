import TonWeb from "tonweb";
import tonMnemonic from "tonweb-mnemonic";
import BaseWalletGenerator from "../core/baseWallet.js";

class TONWalletGenerator extends BaseWalletGenerator {
  constructor() {
    super();
    this.tonweb = new TonWeb();
  }

  async generateWallet() {
    try {
      const words = await tonMnemonic.generateMnemonic();
      const seed = await tonMnemonic.mnemonicToSeed(words);
      const keyPair = TonWeb.utils.keyPairFromSeed(seed);

      const WalletClass = this.tonweb.wallet.all["v4R2"];
      const wallet = new WalletClass(this.tonweb.provider, {
        publicKey: keyPair.publicKey,
      });

      const address = await wallet.getAddress();
      let addressString = address.toString({ bounceable: true });
      addressString = addressString.replace(/\+/g, "-").replace(/\//g, "_");

      return {
        mnemonic: words.join(" "),
        address: addressString,
        publicKey: TonWeb.utils.bytesToHex(keyPair.publicKey),
        secretKey: TonWeb.utils.bytesToHex(keyPair.secretKey),
      };
    } catch (error) {
      throw new Error(`Error generating TON wallet: ${error.message}`);
    }
  }
}

export default TONWalletGenerator;
