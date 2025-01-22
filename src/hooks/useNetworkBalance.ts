import { useMemo } from "react";
import { useReadContract } from "wagmi";

import { useSalesCurrency } from "../hooks/useSalesCurrency";

import { ERC20_ABI } from "~/config/ERC20/ERC20_abi";

import { formatPriceWithDecimals, getSaleConfiguration } from "~/helpers";

export function useNetworkBalance({
  address,
  chainId,
}: {
  address?: `0x${string}`;
  chainId?: number;
}) {
  // Setup the sale configuration based on the chainId

  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );

  // Fetch the currency data
  const { data: currencyData } = useSalesCurrency(saleConfiguration);

  // Fetch the user payment currency balance
  const {
    data: userPaymentCurrencyBalance,
    // isLoading: userPaymentCurrencyBalanceIsLoading,
  } = useReadContract(
    currencyData?.address && address
      ? {
          abi: ERC20_ABI,
          functionName: "balanceOf",
          chainId: chainId,
          address: currencyData.address as `0x${string}`,
          args: [address],
          query: {
            refetchInterval: 30000,
            enabled: Boolean(currencyData?.address && address),
          },
        }
      : undefined,
  );

  const currencyDecimals: number | undefined = currencyData?.decimals;

  return userPaymentCurrencyBalance && currencyDecimals
    ? formatPriceWithDecimals(userPaymentCurrencyBalance, currencyDecimals)
    : false;
}
