import { useAccount } from "wagmi";

import {
  getSaleConfiguration,
  UnpackedSaleConfigurationProps,
} from "../helpers";
import { createContext, ReactNode, useMemo } from "react";
import useCustomContext from "./useCustomContext";

const SalesConfigContext = createContext<
  UnpackedSaleConfigurationProps | undefined
>(undefined);

export function SalesConfigProvider({ children }: { children: ReactNode }) {
  const { chainId } = useAccount();

  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );
  return (
    <SalesConfigContext.Provider value={saleConfiguration}>
      {children}
    </SalesConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSalesConfig() {
  return useCustomContext(SalesConfigContext);
}
