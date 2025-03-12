import { FC } from "react";
import { motion } from "framer-motion";
import type { Pack as PackType } from "~/views/Connected";

import ItemViewer3D from "../3d/ItemViewer3D";
import View3D from "../3d/View3D";
import Chest from "../3d/Chest";

interface PackProps {
  pack?: PackType;
}

export const Pack: FC<PackProps> = ({ pack }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Title */}
      <motion.h1
        className="absolute top-8 left-0 right-0 text-center text-4xl md:text-5xl font-bold text-purple-300 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Balatro Jokers {pack?.name || ""} Pack
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="absolute top-20 left-0 right-0 text-center text-xl text-purple-200 italic z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Unveil your Joker by clicking the chest
      </motion.p>

      {/* 3D Chest with click handler */}
      <div className="w-full h-full cursor-pointer">
        <View3D env={"item"}>
          <ItemViewer3D>
            <Chest />
          </ItemViewer3D>
        </View3D>
      </div>
    </div>
  );
};
