import { Address } from "viem";
import { getChainConfig } from "./helpers";
import { arbitrumSepolia, polygonAmoy } from "viem/chains";

export interface SaleItem {
  tokenId: string;
}

export interface SaleConfigurationProps {
  networkName: string;
  nftTokenAddress: Address;
  salesContractAddress: Address;
  chainId: number;
  itemsForSale: SaleItem[];
}

export const salesConfigurations = [
  {
    networkName: getChainConfig(polygonAmoy.id)?.name,
    nftTokenAddress: "0x888a322db4b8033bac3ff84412738c096f87f9d0",
    salesContractAddress: "0x0327b2f274e04d292e74a06809bcd687c63a4ba4",
    chainId: polygonAmoy.id,
    // Modify here to show different items
    itemsForSale: [
      {
        tokenId: "0",
      },
      {
        tokenId: "1",
      },
    ],
  },
  {
    networkName: getChainConfig(arbitrumSepolia.id)?.name,
    nftTokenAddress: "0xd4bb59d0ba1f7b2beea4c6d9b9f151ee1da02665",
    salesContractAddress: "0x326d2fbe4808dd2a3e205aecc5e25a6322ad0a81",
    chainId: arbitrumSepolia.id,
    // Modify here to show different items
    itemsForSale: [
      {
        tokenId: "0",
      },
    ],
  },
] as SaleConfigurationProps[];

// This value must match one of the chainIds present in your salesConfigurations.
export const defaultChainId = 80002;
