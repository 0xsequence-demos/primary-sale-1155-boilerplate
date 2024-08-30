import { useReadContract } from "wagmi";

import { useContractInfo } from "../hooks/data";
import {
  CHAIN_ID_AMOY,
  CHAIN_ID_ARBITRUM_SEPOLIA,
  SALES_CONTRACT_ADDRESS_AMOY,
  SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
} from "../constants";
import { SALES_CONTRACT_ABI } from "../constants/abi";

export const useSalesCurrency = (chainId: number) => {
  const { data: paymentTokenData, isLoading: paymentTokenIsLoading } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "paymentToken",
      chainId:
        chainId === CHAIN_ID_AMOY ? CHAIN_ID_AMOY : CHAIN_ID_ARBITRUM_SEPOLIA,
      address:
        chainId === CHAIN_ID_AMOY
          ? SALES_CONTRACT_ADDRESS_AMOY
          : SALES_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA,
    });

  const paymentTokenAddress = (paymentTokenData as string) || "";

  const {
    data: currencyContractInfoData,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(
    chainId === CHAIN_ID_AMOY ? CHAIN_ID_AMOY : CHAIN_ID_ARBITRUM_SEPOLIA,
    paymentTokenAddress,
  );

  return {
    data: currencyContractInfoData,
    isLoading: paymentTokenIsLoading || currencyContractInfoIsLoading,
  };
};
