import { useMemo } from "react";
import { useReadContract } from "wagmi";

import { SALES_CONTRACT_ABI } from "~/config/sales/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "~/config/nft-token/nftTokenContractAbi";

import { calculateMintedPercentage, getSaleConfiguration } from "~/helpers";

// UI - Library

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

export function useNFTSales({ chainId }) {
  // Setup the sale configuration based on the chainId
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );

  // Fetch the contract info

  // Fetch the currency data

  // Fetch the token sale details data
  const {
    data: tokenSaleDetailsData,
    // isLoading: tokenSaleDetailsDataIsLoading,
  } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: chainId,
    address: saleConfiguration.salesContractAddress,
  });

  // Fetch the total minted NFTs
  const { data: nftsMinted } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "totalSupply",
    chainId: chainId,
    address: saleConfiguration.nftTokenAddress,
  });

  const totalSupply =
    (tokenSaleDetailsData as GlobalSalesDetailsData)?.supplyCap?.toString() ||
    0;

  const totalMintedNftsPercentage = calculateMintedPercentage(
    Number(nftsMinted),
    Number(totalSupply),
  );

  return {
    percentage: Number(totalMintedNftsPercentage),
    value: Number(nftsMinted),
    total: Number(totalSupply),
  };
}
