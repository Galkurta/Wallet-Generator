export const osmosisChains = [
  {
    name: "Osmosis",
    chain_name: "osmosis-1",
    prefix: "osmo",
    hdPath: "m/44'/118'/0'/0/0",
    denom: "uosmo",
    apis: {
      rpc: [{ address: "https://rpc.osmosis.zone" }],
      rest: [{ address: "https://lcd.osmosis.zone" }],
    },
  },
];
