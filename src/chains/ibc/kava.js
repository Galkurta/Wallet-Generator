export const kavaChains = [
  {
    name: "Kava",
    chain_name: "kava-9",
    prefix: "kava",
    hdPath: "m/44'/459'/0'/0/0", // Kava specific path
    denom: "ukava",
    apis: {
      rpc: [{ address: "https://kava-rpc.polkachu.com" }],
      rest: [{ address: "https://kava-api.polkachu.com" }],
    },
  },
];
