import { useAccount } from "wagmi";

import "./Home.css";
import Connected from "./components/blockchain/Connected";
import { SequenceBoilerplate } from "boilerplate-design-system";
import { Connector } from "./components/Connector";

const Home = () => {
  const { isConnected } = useAccount();

  return (
    <SequenceBoilerplate
      githubUrl="https://github.com/0xsequence-demos/kit-embedded-wallet-remix-cloudflare-boilerplate"
      name="Primary Sale 1155 Boilerplate"
      description="Example of how to perform primary sales of 1155 NFTs using Sequence."
      docsUrl="https://docs.sequence.xyz/"
    >
      {!isConnected ? <Connector /> : <Connected />}
    </SequenceBoilerplate>
  );
};

export default Home;
