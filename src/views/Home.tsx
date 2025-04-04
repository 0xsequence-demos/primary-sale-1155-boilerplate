import { SequenceBoilerplate } from "boilerplate-design-system";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

import { Connected } from "./Connected";
import { NotConnected } from "./NotConnected";
import { useMemo } from "react";
import { getSaleConfiguration } from "../helpers";
import { useNetworkBalancePretty } from "../hooks/useNetworkBalancePretty";

export default function Home() {
  const { isConnected, address, chainId } = useAccount();

  const saleConfiguration = useMemo(
    () => getSaleConfiguration(chainId),
    [chainId],
  );

  const balance = useNetworkBalancePretty({ address, saleConfiguration });

  return (
    <SequenceBoilerplate
      githubUrl="https://github.com/0xsequence-demos/primary-sale-1155-boilerplate/"
      name="Primary Sale 1155 Boilerplate"
      description="Example of how to perform primary sales of 1155 NFTs using Sequence."
      docsUrl="https://docs.sequence.xyz/"
      wagmi={{ useAccount, useDisconnect, useSwitchChain }}
      faucetUrl="https://faucet.circle.com/"
      balance={balance ? `$${balance}` : false}
    >
      {isConnected && address && chainId ? (
        <Connected
          saleConfiguration={saleConfiguration}
          userAddress={address}
          chainId={chainId}
        />
      ) : (
        <NotConnected />
      )}
    </SequenceBoilerplate>
  );
}
