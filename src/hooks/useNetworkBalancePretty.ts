import { useSalesCurrency } from "./useSalesCurrency";

import {
  formatPriceWithDecimals,
  UnpackedSaleConfigurationProps,
} from "../helpers";
import { useNetworkBalance } from "./useNetworkBalance";

export function useNetworkBalancePretty(props: {
  address?: `0x${string}`;
  saleConfiguration: UnpackedSaleConfigurationProps;
}) {
  const balance = useNetworkBalance(props);

  const { data: currencyData } = useSalesCurrency(props.saleConfiguration);

  return balance && currencyData.decimals !== undefined
    ? formatPriceWithDecimals(balance, currencyData.decimals)
    : false;
}
