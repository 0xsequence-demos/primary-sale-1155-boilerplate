import { useReadContract } from "wagmi";

import { SALES_CONTRACT_ABI } from "../config/sales/salesContractAbi";
import { ContractInfo } from "@0xsequence/metadata";
import { createContext, ReactNode } from "react";
import { useContractInfo } from "../hooks/data";
import useCustomContext from "./useCustomContext";
import { useSalesConfig } from "./SalesConfigContext";

const SalesCurrencyContext = createContext<CurrencyInfo | undefined>(undefined);

type CurrencyInfo = {
  info: ContractInfo | undefined;
  isLoading: boolean;
};

export function SalesCurrencyProvider({ children }: { children: ReactNode }) {
  const salesConfig = useSalesConfig();
  const { data: paymentTokenData, isLoading: paymentTokenIsLoading } =
    useReadContract({
      abi: SALES_CONTRACT_ABI,
      functionName: "paymentToken",
      chainId: salesConfig.chainId,
      address: salesConfig.salesContractAddress,
    });

  const paymentTokenAddress = (paymentTokenData as string) || "";
  const {
    data: currencyContractInfo,
    isLoading: currencyContractInfoIsLoading,
  } = useContractInfo(salesConfig.chainId, paymentTokenAddress);

  return (
    <SalesCurrencyContext.Provider
      value={{
        info: currencyContractInfo,
        isLoading: currencyContractInfoIsLoading || paymentTokenIsLoading,
      }}
    >
      {children}
    </SalesCurrencyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSalesCurrency() {
  return useCustomContext(SalesCurrencyContext);
}
