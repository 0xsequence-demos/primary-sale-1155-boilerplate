import { SequenceBoilerplate } from "boilerplate-design-system";
import { useAccount } from "wagmi";

import { Connected } from "~/views/Connected";
import { NotConnected } from "~/views/NotConnected";

export default function HomeView() {
  const { isConnected } = useAccount();

  return (
    <SequenceBoilerplate
      githubUrl="https://github.com/0xsequence-demos/kit-embedded-wallet-remix-cloudflare-boilerplate"
      name="Primary Sale 1155 Boilerplate"
      description="Example of how to perform primary sales of 1155 NFTs using Sequence."
      docsUrl="https://docs.sequence.xyz/"
    >
      {!isConnected ? <NotConnected /> : <Connected />}
    </SequenceBoilerplate>
  );
}
