import {
  salesConfigurations,
  defaultChainId,
  SaleConfigurationProps,
} from "./constants";

const defaultSaleConfiguration = salesConfigurations.find(
  (saleConfiguration) => saleConfiguration.chainId === defaultChainId,
);
if (!defaultSaleConfiguration)
  throw new Error(
    "SaleConfigurationNotFoundError: No sale configuration found for the specified chain ID",
  );

export function getSaleConfiguration(
  chainId: number | undefined,
): SaleConfigurationProps {
  if (!defaultSaleConfiguration) {
    throw new Error(
      "SaleConfigurationNotFoundError: No default sale configuration found",
    );
  }

  return (
    salesConfigurations.find(
      (saleConfiguration) => saleConfiguration.chainId === chainId,
    ) || defaultSaleConfiguration
  );
}

export const formatPriceWithDecimals = (
  price: bigint,
  tokenDecimals: number,
): string => {
  const divisor = BigInt(10 ** tokenDecimals);

  const integerPart = price / divisor;
  const decimalPart = price % divisor;

  let formattedDecimal = decimalPart.toString().padStart(tokenDecimals, "0");

  formattedDecimal = formattedDecimal.replace(/0+$/, "");

  return formattedDecimal
    ? `${integerPart.toString()}.${formattedDecimal}`
    : integerPart.toString();
};
