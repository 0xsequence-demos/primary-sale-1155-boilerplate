import { useReadContract } from "wagmi";

import { useSalesCurrency } from "./useSalesCurrency";

import { ERC20_ABI } from "../config/ERC20/ERC20_abi";

import { UnpackedSaleConfigurationProps } from "../helpers";

export function useNetworkBalance({
  address,
  saleConfiguration,
}: {
  address?: `0x${string}`;
  saleConfiguration: UnpackedSaleConfigurationProps;
}) {
  // Fetch the currency data
  const { data: currencyData } = useSalesCurrency(saleConfiguration);

  // Fetch the user payment currency balance
  const {
    data: userPaymentCurrencyBalance,
    // isLoading: userPaymentCurrencyBalanceIsLoading,
  } = useReadContract(
    currencyData.info?.address && address
      ? {
          abi: ERC20_ABI,
          functionName: "balanceOf",
          chainId: saleConfiguration.chainId,
          address: currencyData.info?.address as `0x${string}`,
          args: [address],
          query: {
            refetchInterval: 30000,
            enabled: Boolean(currencyData?.info?.address && address),
          },
        }
      : undefined,
  );

  return userPaymentCurrencyBalance;
}
