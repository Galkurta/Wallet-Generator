export const secretChains = [
  {
    name: "Secret Network",
    chain_name: "secret-4",
    prefix: "secret",
    hdPath: "m/44'/529'/0'/0/0", // Secret Network specific path
    denom: "uscrt",
    apis: {
      rpc: [{ address: "https://secret-rpc.polkachu.com" }],
      rest: [{ address: "https://secret-api.polkachu.com" }],
    },
  },
];
