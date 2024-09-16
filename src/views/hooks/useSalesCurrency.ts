import { useReadContract } from "wagmi";

import { useContractInfo } from "../hooks/data";
import { SALES_CONTRACT_ABI } from "../constants/salesContractAbi";
import { SaleConfigurationProps } from "../constants";

export const useSalesCurrency = (saleConfiguration: SaleConfigurationProps) => {
  const { data: paymentTokenData, isLoading: paymentTokenIsLoading } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "paymentToken",
      chainId: saleConfiguration.chainId,
      address: saleConfiguration.salesContractAddress,
    });

  const paymentTokenAddress = (paymentTokenData as string) || "";

  const {
    data: currencyContractInfoData,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(saleConfiguration.chainId, paymentTokenAddress);

  return {
    data: currencyContractInfoData,
    isLoading: paymentTokenIsLoading || currencyContractInfoIsLoading,
  };
};
