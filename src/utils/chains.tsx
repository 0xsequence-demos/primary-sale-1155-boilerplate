import type { Chain } from "wagmi/chains";
import { friendlySalesConfigurations } from "./primarySales/constants";
import { getChainConfig } from "./primarySales/helpers";

const chains = Array.from(
  new Set(
    friendlySalesConfigurations.map((item) => getChainConfig(item.chainId)),
  ),
) as [Chain, ...Chain[]];

export default chains;
