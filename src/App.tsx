import { createConfig, SequenceConnect } from "@0xsequence/connect";
import { SequenceCheckoutProvider } from "@0xsequence/checkout";

import { defaultChainId } from "./config/sales/salesConfigs";

import { Toaster } from "sonner";
import Home from "./views/Home";
import Contexts from "./views/Contexts";
import { arbitrumSepolia, polygonAmoy } from "viem/chains";

export default function App() {
  const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
  const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
  const appleRedirectURI = window.location.origin + window.location.pathname;
  const walletConnectId = import.meta.env.VITE_WALLET_CONNECT_ID;

  const sequenceConfig = createConfig("waas", {
    appName: "Primary Sale 1155 Boilerplate",
    chainIds: [polygonAmoy.id, arbitrumSepolia.id],
    defaultChainId,
    waasConfigKey,
    projectAccessKey,
    google: {
      clientId: googleClientId,
    },
    apple: {
      clientId: appleClientId,
      redirectURI: appleRedirectURI,
    },
    walletConnect: {
      projectId: walletConnectId,
    },
  });

  return (
    <SequenceConnect config={sequenceConfig}>
      <SequenceCheckoutProvider>
        <Toaster />
        <Contexts>
          <Home />
        </Contexts>
      </SequenceCheckoutProvider>
    </SequenceConnect>
  );
}
