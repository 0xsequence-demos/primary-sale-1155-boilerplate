import { FC, useState } from "react";
import { motion } from "framer-motion";

import ItemViewer3D from "../3d/ItemViewer3D";
import View3D from "../3d/View3D";
import Chest from "../3d/Chest";

export const Pack: FC = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [cardDetails] = useState({
    name: "The Magician",
    rarity: "Legendary",
  });

  const handleOpenChest = () => {
    setIsOpening(true);

    // Simulate the chest opening animation time
    setTimeout(() => {
      setHasOpened(true);
    }, 2000);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Title */}
      <motion.h1
        className="absolute top-8 left-0 right-0 text-center text-4xl md:text-5xl font-bold text-purple-300 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Mystical Tarot Pack
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="absolute top-20 left-0 right-0 text-center text-xl text-purple-200 italic z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Unveil your mystical destiny by clicking the chest
      </motion.p>

      {/* 3D Chest with click handler */}
      <div className="w-full h-full cursor-pointer" onClick={!isOpening ? handleOpenChest : undefined}>
        <View3D env={"item"}>
          <ItemViewer3D>
            <Chest isOpening={isOpening} />
          </ItemViewer3D>
        </View3D>
      </div>

      {/* Card details that appear after chest is opened */}
      {hasOpened && (
        <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center z-20">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-yellow-300 text-center mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
          >
            {cardDetails.name}
          </motion.h2>
          <motion.div
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              cardDetails.rarity === "Legendary"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900"
                : cardDetails.rarity === "Rare"
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 text-purple-100"
                  : "bg-gradient-to-r from-blue-400 to-blue-600 text-blue-100"
            }`}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 150,
            }}
          >
            {cardDetails.rarity}
          </motion.div>
        </div>
      )}
    </div>
  );
};
