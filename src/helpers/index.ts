import { Address, Chain, formatUnits } from "viem";
import { formatDisplay, getDefaultChains } from "@0xsequence/connect";
import { defaultChainId, salesConfigs } from "../config/sales/salesConfigs";

import type { Chain as ChainType } from "wagmi/chains";

interface SaleItem {
  tokenId: string;
}

export interface UnpackedSaleConfigurationProps {
  networkName: string;
  nftTokenAddress: Address;
  salesContractAddress: Address;
  chainId: number;
  itemsForSale: SaleItem[];
}

const unpackedSalesConfigurations = salesConfigs.map((item) => {
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
}) as UnpackedSaleConfigurationProps[];

const defaultSaleConfiguration = unpackedSalesConfigurations.find(
  (saleConfiguration) => saleConfiguration.chainId === defaultChainId,
);
if (!defaultSaleConfiguration)
  throw new Error(
    "SaleConfigurationNotFoundError: No sale configuration found for the specified chain ID",
  );

export function getSaleConfiguration(
  chainId: number | undefined,
): UnpackedSaleConfigurationProps {
  if (!defaultSaleConfiguration) {
    throw new Error(
      "SaleConfigurationNotFoundError: No default sale configuration found",
    );
  }

  return (
    unpackedSalesConfigurations.find(
      (saleConfiguration) => saleConfiguration.chainId === chainId,
    ) || defaultSaleConfiguration
  );
}

export const formatPriceWithDecimals = (
  price: bigint,
  tokenDecimals: number = 0,
): string => {
  const formattedPrice = formatUnits(price, tokenDecimals);
  return formatDisplay(formattedPrice, {
    disableScientificNotation: true,
    disableCompactNotation: true,
    significantDigits: 6,
  });
};

function getChainConfig(chainId: number): Chain {
  return getDefaultChains([chainId])[0];
}

export const chains = Array.from(
  new Set(salesConfigs.map((item) => getChainConfig(item.chainId))),
) as [ChainType, ...ChainType[]];

export const calculateMintedPercentage = (
  minted: number,
  totalMax: number,
): number => (totalMax <= 0 ? 0 : Math.floor((minted / totalMax) * 100));
