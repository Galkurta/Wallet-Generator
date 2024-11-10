export const celestiaChains = [
  {
    name: "Celestia",
    chain_name: "celestia",
    prefix: "celestia",
    hdPath: "m/44'/118'/0'/0/0",
    denom: "utia",
    apis: {
      rpc: [{ address: "https://public-celestia-rpc.numia.xyz" }],
      rest: [{ address: "https://public-celestia-lcd.numia.xyz" }],
    },
  },
];
