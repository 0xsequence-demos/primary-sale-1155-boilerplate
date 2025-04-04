import { useReadContract } from "wagmi";

import { useContractInfo } from "./data";
import { SALES_CONTRACT_ABI } from "../config/sales/salesContractAbi";
import { UnpackedSaleConfigurationProps } from "../helpers";
import { ERC20_ABI } from "../config/ERC20/ERC20_abi";

export const useSalesCurrency = (
  saleConfiguration: UnpackedSaleConfigurationProps,
) => {
  const { data: paymentTokenData, isLoading: paymentTokenIsLoading } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "paymentToken",
      chainId: saleConfiguration.chainId,
      address: saleConfiguration.salesContractAddress,
    });

  const { data: decimals } = useReadContract({
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: saleConfiguration.chainId,
    address: paymentTokenData as `0x${string}`,
  });

  const paymentTokenAddress = (paymentTokenData as string) || "";

  const {
    data: currencyContractInfoData,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(saleConfiguration.chainId, paymentTokenAddress);

  return {
    data: { info: currencyContractInfoData, decimals },
    isLoading: paymentTokenIsLoading || currencyContractInfoIsLoading,
  };
};
