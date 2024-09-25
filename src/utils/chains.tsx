import type { Chain } from "wagmi/chains";
import { friendlySalesConfigurations } from "./primarySales/constants";

const chains = Array.from(
  new Set(
    friendlySalesConfigurations.map((item) => {
      const chain = chains.find((chain) => chain.id === item.chainId);
      if (!chain) {
        throw new Error(`No chain with id ${item.chainId}`);
      }
      return chain;
    }),
  ),
) as [Chain, ...Chain[]];

export default chains;
