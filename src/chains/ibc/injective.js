export const injectiveChains = [
  {
    name: "Injective",
    chain_name: "injective-1",
    prefix: "inj",
    hdPath: "m/44'/60'/0'/0/0", // Using ETH derivation path
    denom: "inj",
    apis: {
      rpc: [{ address: "https://injective-rpc.polkachu.com" }],
      rest: [{ address: "https://injective-api.polkachu.com" }],
    },
  },
];
