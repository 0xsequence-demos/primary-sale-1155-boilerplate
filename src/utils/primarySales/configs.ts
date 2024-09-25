import { Address } from "viem";
import { friendlySalesConfigurations } from "./constants";
import { getChainConfig } from "./helpers";

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

export const salesConfigurations = friendlySalesConfigurations.map((item) => {
  const { nftTokenAddress, salesContractAddress, chainId, itemsForSale } = item;
  const chain = getChainConfig(chainId);
  return {
    networkName: chain.name,
    nftTokenAddress,
    salesContractAddress,
    chainId: chain.id,
    itemsForSale: itemsForSale.map((id) => {
      return { tokenId: id };
    }),
  };
}) as SaleConfigurationProps[];
