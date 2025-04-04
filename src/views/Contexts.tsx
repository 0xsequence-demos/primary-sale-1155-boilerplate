import { ReactNode } from "react";
import { SalesCurrencyProvider } from "../contexts/SalesCurrencyContext";
import { SalesConfigProvider } from "../contexts/SalesConfigContext";
import { SalesDetailsProvider } from "../contexts/SalesDetailsContext";

export default function Contexts({ children }: { children: ReactNode }) {
  return (
    <SalesConfigProvider>
      <SalesCurrencyProvider>
        <SalesDetailsProvider>{children}</SalesDetailsProvider>
      </SalesCurrencyProvider>
    </SalesConfigProvider>
  );
}
