import { useReadContract } from "wagmi";

import { useContractInfo } from "../hooks/data";
import { SALES_CONTRACT_ABI } from "../constants/abi";
import { getChainId, getSalesContractAddress } from "../../utils/primarySellHelpers";

export const useSalesCurrency = (chainId: number) => {
  const { data: paymentTokenData, isLoading: paymentTokenIsLoading } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "paymentToken",
      chainId: getChainId(chainId),
      address: getSalesContractAddress(chainId),
    });

  const paymentTokenAddress = (paymentTokenData as string) || "";

  const {
    data: currencyContractInfoData,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(
    getChainId(chainId),
    paymentTokenAddress,
  );

  return {
    data: currencyContractInfoData,
    isLoading: paymentTokenIsLoading || currencyContractInfoIsLoading,
  };
};
