import { useSalesCurrency } from "../contexts/SalesCurrencyContext";
import { formatPriceWithDecimals } from "../helpers";
import { useUserPaymentCurrencyBalance } from "./useUserPaymentCurrencyBalance";
import { Address } from "viem";

export function useUserPaymentCurrencyBalancePretty(props: {
  address?: Address;
}) {
  const balance = useUserPaymentCurrencyBalance(props);

  const { info: currencyInfo } = useSalesCurrency();

  return balance && currencyInfo !== undefined
    ? formatPriceWithDecimals(balance, currencyInfo.decimals)
    : false;
}
