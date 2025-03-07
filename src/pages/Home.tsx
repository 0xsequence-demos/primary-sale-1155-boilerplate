import React from "react";
import { Pack } from "~/components/pack";
import { NotConnected } from "~/views/NotConnected";

const Home: React.FC<{ isConnected: boolean }> = ({ isConnected }) => {
  return isConnected ? (
    <>
      <div style={{ height: 800, width: "auto" }}>
        <Pack />
      </div>
    </>
  ) : (
    <NotConnected />
  );
};

export default Home;
