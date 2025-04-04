import { useReadContract } from "wagmi";

import { SALES_CONTRACT_ABI } from "../config/sales/salesContractAbi";
import { createContext, ReactNode } from "react";
import useCustomContext from "./useCustomContext";
import { useSalesConfig } from "./SalesConfigContext";
import { NFT_TOKEN_CONTRACT_ABI } from "../config/nft-token/nftTokenContractAbi";
import { calculateMintedPercentage } from "../helpers";

const SalesDetailsContext = createContext<SalesDetails | undefined>(undefined);

type SalesDetails = {
  cost: bigint;
  totalSupply: number;
  supplyCap: number;
  percentage: number;
  refetchTotalMinted: () => void;
};

interface GlobalSalesDetailsData {
  cost: bigint;
  endtime: bigint;
  merkleRoot: string;
  startTime: bigint;
  supplyCap: bigint;
}

export function SalesDetailsProvider({ children }: { children: ReactNode }) {
  const salesConfig = useSalesConfig();
  const { data: tokenSaleDetailsResponse } = useReadContract({
    abi: SALES_CONTRACT_ABI,
    functionName: "globalSaleDetails",
    chainId: salesConfig.chainId,
    address: salesConfig.salesContractAddress,
  });

  const tokenSaleDetailsData =
    tokenSaleDetailsResponse as GlobalSalesDetailsData;

  const { data: totalSupply, refetch: refetchTotalMinted } = useReadContract({
    abi: NFT_TOKEN_CONTRACT_ABI,
    functionName: "totalSupply",
    chainId: salesConfig.chainId,
    address: salesConfig.nftTokenAddress,
  });

  const supplyCap = tokenSaleDetailsData?.supplyCap?.toString() || 0;

  const totalMintedNftsPercentage = calculateMintedPercentage(
    Number(totalSupply),
    Number(supplyCap),
  );

  return (
    <SalesDetailsContext.Provider
      value={{
        percentage: totalMintedNftsPercentage,
        totalSupply: Number(totalSupply),
        supplyCap: Number(supplyCap),
        cost: tokenSaleDetailsData?.cost,
        refetchTotalMinted,
      }}
    >
      {children}
    </SalesDetailsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSalesDetails() {
  return useCustomContext(SalesDetailsContext);
}
