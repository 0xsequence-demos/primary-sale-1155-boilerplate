import { ThemeProvider } from "@0xsequence/design-system";
import { getDefaultWaasConnectors, KitProvider } from "@0xsequence/kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { chains } from "~/helpers";
import { KitCheckoutProvider } from "@0xsequence/kit-checkout";
import "react-toastify/dist/ReactToastify.css";
import { SequenceBoilerplate } from "boilerplate-design-system";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

import { Chain, Transport } from "viem";
import { allNetworks, findNetworkConfig } from "@0xsequence/network";
import { defaultChainId } from "./config/sales/salesConfigs";

import { Toaster } from "sonner";

import "@0xsequence/design-system/styles.css";
import { useNetworkBalance } from "~/hooks/useNetworkBalance";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Marketplace from "./pages/Marketplace";
import Inventory from "./pages/Inventory";
import Home from "./pages/Home";

const queryClient = new QueryClient();

function getTransportConfigs(
  chains: [Chain, ...Chain[]],
): Record<number, Transport> {
  return chains.reduce(
    (acc, chain) => {
      const network = findNetworkConfig(allNetworks, chain.id);
      if (network) acc[chain.id] = http(network.rpcUrl);
      return acc;
    },
    {} as Record<number, Transport>,
  );
}

export default function Layout() {
  const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
  const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
  const appleRedirectURI = window.location.origin + window.location.pathname;
  const walletConnectId = import.meta.env.VITE_WALLET_CONNECT_ID;

  const connectors = getDefaultWaasConnectors({
    walletConnectProjectId: walletConnectId,
    waasConfigKey,
    googleClientId,
    // Notice: Apple Login only works if deployed on https (to support Apple redirects)
    appleClientId,
    appleRedirectURI,
    defaultChainId,
    appName: "Kit Starter",
    projectAccessKey,
  });

  const transports = getTransportConfigs(chains);

  const config = createConfig({
    transports,
    connectors,
    chains,
  });

  const kitConfig = {
    projectAccessKey,
  };

  return (
    <ThemeProvider theme="dark">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <KitProvider config={kitConfig}>
            <KitCheckoutProvider>
              <Toaster />
              <App />
            </KitCheckoutProvider>
          </KitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

const App: React.FC = () => {
  const { isConnected, address, chainId } = useAccount();
  const balance = useNetworkBalance({ address, chainId });

  return (
    <SequenceBoilerplate
      githubUrl="https://github.com/0xsequence-demos/primary-sale-1155-boilerplate/"
      name="ERC 1155 Pack Boilerplate"
      description="Example of how to perform sales of 1155 NFT Pack using Sequence."
      docsUrl="https://docs.sequence.xyz/"
      wagmi={{ useAccount, useDisconnect, useSwitchChain }}
      faucetUrl="https://faucet.circle.com/"
      balance={balance ? `$${balance}` : false}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home isConnected={isConnected} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Router>
    </SequenceBoilerplate>
  );
};
