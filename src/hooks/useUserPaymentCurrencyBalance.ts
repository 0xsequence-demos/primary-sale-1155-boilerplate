import { useReadContract } from "wagmi";

import { ERC20_ABI } from "../config/ERC20/ERC20_abi";

import { useSalesCurrency } from "../contexts/SalesCurrencyContext";
import { useSalesConfig } from "../contexts/SalesConfigContext";
import { Address } from "viem";

export function useUserPaymentCurrencyBalance({
  address,
}: {
  address?: Address;
}) {
  const saleConfig = useSalesConfig();

  const { info: currencyInfo } = useSalesCurrency();

  // Fetch the user payment currency balance
  const {
    data: userPaymentCurrencyBalance,
    // isLoading: userPaymentCurrencyBalanceIsLoading,
  } = useReadContract(
    currencyInfo?.address && address
      ? {
          abi: ERC20_ABI,
          functionName: "balanceOf",
          chainId: saleConfig.chainId,
          address: currencyInfo?.address as Address,
          args: [address],
          query: {
            refetchInterval: 30000,
            enabled: Boolean(currencyInfo?.address && address),
          },
        }
      : undefined,
  );

  return userPaymentCurrencyBalance;
}
