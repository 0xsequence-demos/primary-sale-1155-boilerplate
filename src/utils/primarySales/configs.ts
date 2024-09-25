import { Address } from "viem";
import { friendlySalesConfigurations } from "./constants";
import { getChainConfig } from "./helpers";
import chains from "../chains";

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
  const chain = chains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`No chain with id ${chainId}`);
  }
  return {
    networkName: getChainConfig(chain.id)?.name,
    nftTokenAddress,
    salesContractAddress,
    chainId: chain.id,
    itemsForSale: itemsForSale.map((id) => {
      return { tokenId: id };
    }),
  };
}) as SaleConfigurationProps[];
