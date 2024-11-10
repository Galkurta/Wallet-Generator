import { cosmosChains } from "./cosmos.js";
import { osmosisChains } from "./osmosis.js";
import { neutronChains } from "./neutron.js";
import { celestiaChains } from "./celestia.js";
import { seiChains } from "./sei.js";
import { strideChains } from "./stride.js";
import { injectiveChains } from "./injective.js";
import { axelarChains } from "./axelar.js";
import { secretChains } from "./secret.js";
import { kavaChains } from "./kava.js";

export const IBC_CHAINS = [
  ...cosmosChains,
  ...osmosisChains,
  ...neutronChains,
  ...celestiaChains,
  ...seiChains,
  ...strideChains,
  ...injectiveChains,
  ...axelarChains,
  ...secretChains,
  ...kavaChains,
];
