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
export const nativeTokenDecimals = 18;
export const erc20TokenDecimals = 6;
export const nftPrice = 0.01;
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
