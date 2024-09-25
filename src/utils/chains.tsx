import { polygonAmoy, arbitrumSepolia } from "wagmi/chains";
import type { Chain } from "wagmi/chains";

const chains = [polygonAmoy, arbitrumSepolia] as [Chain, ...Chain[]];

export default chains;
