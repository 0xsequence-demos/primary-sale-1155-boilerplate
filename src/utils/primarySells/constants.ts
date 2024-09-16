import { Address } from "viem";

// sales params
export const NFT_TOKEN_ADDRESS_AMOY =
  "0x888a322db4b8033bac3ff84412738c096f87f9d0";
export const SALES_CONTRACT_ADDRESS_AMOY =
  "0x0327b2f274e04d292e74a06809bcd687c63a4ba4";
export const CHAIN_ID_AMOY = 80002;
export const SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA =
  "0x326d2fbe4808dd2a3e205aecc5e25a6322ad0a81";
export const NFT_TOKEN_ADDRESS_ARBITRUM_SEPOLIA =
  "0xd4bb59d0ba1f7b2beea4c6d9b9f151ee1da02665";
export const CHAIN_ID_ARBITRUM_SEPOLIA = 421614;
export interface SaleItem {
  tokenId: string;
}

export const itemsForSalesAmoy: SaleItem[] = [
  {
    tokenId: "0",
  },
  {
    tokenId: "1",
  },
];

export const itemsForSalesArbitrumSepolia: SaleItem[] = [
  {
    tokenId: "0",
  },
];

export interface SaleConfigurationProps {
  networkName: string;
  nftTokenAddress: Address;
  salesContractAddress: Address;
  chainId: number;
  itemsForSale: SaleItem[];
}

export const salesConfigurations = [
  {
    networkName: "amoy",
    nftTokenAddress: "0x888a322db4b8033bac3ff84412738c096f87f9d0",
    salesContractAddress: "0x0327b2f274e04d292e74a06809bcd687c63a4ba4",
    chainId: 80002,
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
    networkName: "arbitrum sepolia",
    nftTokenAddress: "0xd4bb59d0ba1f7b2beea4c6d9b9f151ee1da02665",
    salesContractAddress: "0x326d2fbe4808dd2a3e205aecc5e25a6322ad0a81",
    chainId: 421614,
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
