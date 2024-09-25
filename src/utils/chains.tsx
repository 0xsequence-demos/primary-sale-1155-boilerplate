import type { Chain } from "wagmi/chains";
import { friendlySalesConfigurations } from "./primarySales/constants";

const chains = Array.from(
  new Set(friendlySalesConfigurations.map((item) => item.chain)),
) as [Chain, ...Chain[]];

export default chains;
