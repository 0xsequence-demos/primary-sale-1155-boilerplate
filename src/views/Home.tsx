import { SequenceBoilerplate } from "boilerplate-design-system";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";

import Connected from "./Connected";
import { NotConnected } from "./NotConnected";
import { useUserPaymentCurrencyBalancePretty } from "../hooks/useUserPaymentCurrencyBalancePretty";

export default function Home() {
  const { isConnected, address, chainId } = useAccount();

  const balance = useUserPaymentCurrencyBalancePretty({ address });

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
        <Connected userAddress={address} chainId={chainId} />
      ) : (
        <NotConnected />
      )}
    </SequenceBoilerplate>
  );
}
