import {
  CHAIN_ID_AMOY,
  CHAIN_ID_ARBITRUM_SEPOLIA,
  itemsForSalesAmoy,
  itemsForSalesArbitrumSepolia,
  NFT_TOKEN_ADDRESS_AMOY,
  NFT_TOKEN_ADDRESS_ARBITRUM_SEPOLIA,
  SaleItem,
  SALES_CONTRACT_ADDRESS_AMOY,
  SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
} from "../views/constants";

export function getChainId(chainId: number | undefined): number {
  switch (chainId) {
    case CHAIN_ID_AMOY:
      return CHAIN_ID_AMOY;
    case CHAIN_ID_ARBITRUM_SEPOLIA:
      return CHAIN_ID_ARBITRUM_SEPOLIA;
    default:
      return CHAIN_ID_AMOY;
  }
}

export function getSalesContractAddress(
  chainId: number | undefined,
): `0x${string}` {
  switch (chainId) {
    case CHAIN_ID_AMOY:
      return SALES_CONTRACT_ADDRESS_AMOY;
    case CHAIN_ID_ARBITRUM_SEPOLIA:
      return SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA;
    default:
      return SALES_CONTRACT_ADDRESS_AMOY;
  }
}

export function getNftTokenAddress(chainId: number | undefined): `0x${string}` {
  switch (chainId) {
    case CHAIN_ID_AMOY:
      return NFT_TOKEN_ADDRESS_AMOY;
    case CHAIN_ID_ARBITRUM_SEPOLIA:
      return NFT_TOKEN_ADDRESS_ARBITRUM_SEPOLIA;
    default:
      return NFT_TOKEN_ADDRESS_AMOY;
  }
}

export function getItemsForSale(chainId: number | undefined): SaleItem[] {
  switch (chainId) {
    case CHAIN_ID_AMOY:
      return itemsForSalesAmoy;
    case CHAIN_ID_ARBITRUM_SEPOLIA:
      return itemsForSalesArbitrumSepolia;
    default:
      return itemsForSalesAmoy;
  }
}
