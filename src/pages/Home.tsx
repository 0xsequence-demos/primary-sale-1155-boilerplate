import { Canvas } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import RevealImage from "~/components/reveal-card/RevealCard";
import { JOKERS } from "~/jokers";
import Connected from "~/views/Connected";
import { NotConnected } from "~/views/NotConnected";

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Home: React.FC<{ isConnected: boolean }> = ({ isConnected }) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isRevealed, setIsRevealed] = useState(true);
  const revealProgress = useMotionValue(1);
  const [imageTexture, setImageTexture] = useState<string>("/card-bg.png");
  const imageNumber = useMemo(() => getRandomInt(1, 155), []);
  const joker = JOKERS[imageNumber];

  const handleReveal = () => {
    animate(revealProgress, isRevealed ? 0 : 1, {
      duration: 1.5,
      ease: "easeInOut",
    });
    setIsRevealed(!isRevealed);
  };

  const handleClick = () => {
    handleReveal();

    // Clear previous timeout to prevent memory leaks
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      const jokerImageTexture = `/jokers-wiki-fandom/${joker.Name.split(" ").join("_")}.png`;
      setImageTexture(jokerImageTexture);
      handleReveal();
    }, 3000);
  };

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  if (!isConnected) {
    return <NotConnected />;
  }

  return (
    <Canvas
      onClick={handleClick}
      className="z-10"
      style={{
        height: 500,
        backgroundColor: "#000",
      }}
    >
      <RevealImage
        imageTexture={imageTexture}
        revealProgress={revealProgress}
      />
    </Canvas>
  );

  // isConnected ? <Connected /> : <NotConnected />;
};

export default Home;
