import { useMemo } from "react";
import { useReadContract } from "wagmi";

import { SALES_CONTRACT_ABI } from "../config/sales/salesContractAbi";
import { NFT_TOKEN_CONTRACT_ABI } from "../config/nft-token/nftTokenContractAbi";

import { calculateMintedPercentage, getSaleConfiguration } from "../helpers";

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

export function useNFTSales({ chainId }: { chainId?: number }) {
  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );
  const { data: tokenSaleDetailsResponse } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: chainId,
    address: saleConfiguration.salesContractAddress,
  });

  const tokenSaleDetailsData =
    tokenSaleDetailsResponse as GlobalSalesDetailsData;

  const { data: nftsMinted, refetch: refetchTotalMinted } = useReadContract({
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
    percentage: totalMintedNftsPercentage,
    value: Number(nftsMinted),
    total: Number(totalSupply),
    cost: tokenSaleDetailsData?.cost,
    refetchTotalMinted,
  };
}
