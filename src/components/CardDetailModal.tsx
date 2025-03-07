import React from "react";
import View3D from "./3d/View3D";
import ItemViewer3D from "./3d/ItemViewer3D";
import { Card as Card3D } from "./3d/Card";

interface CardDetails {
  id: number;
  name: string;
  image: string;
  rarity: string;
  marketPrice: number;
  description: string;
}

interface CardDetailModalProps {
  card: CardDetails;
  onClose: () => void;
  showBuyButton?: boolean;
  onBuy?: (id: number) => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  showBuyButton = false,
  onBuy,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{card.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* 3D Card View */}
          <div className="h-80 w-full md:w-1/2 relative">
            <View3D env="item">
              <ItemViewer3D>
                <Card3D
                  isChestOpen={true}
                  position={[0, 0, 0]}
                  imageNumber={card.id}
                />
              </ItemViewer3D>
            </View3D>
          </div>

          {/* Card Details */}
          <div className="p-6 w-full md:w-1/2">
            <div className="mb-4">
              <span className="text-gray-400">Rarity:</span>
              <span className={`ml-2 font-bold ${getRarityColor(card.rarity)}`}>
                {card.rarity}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-gray-400">Market Price:</span>
              <span className="ml-2 font-bold text-yellow-400">
                {card.marketPrice} ETH
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-400 mb-2">Description:</h3>
              <p className="text-white">{card.description}</p>
            </div>

            {showBuyButton && onBuy && (
              <button
                onClick={() => onBuy(card.id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on rarity
const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case "Common":
      return "text-gray-300";
    case "Uncommon":
      return "text-green-400";
    case "Rare":
      return "text-blue-400";
    case "Epic":
      return "text-purple-400";
    case "Legendary":
      return "text-yellow-300";
    default:
      return "text-white";
  }
};

export default CardDetailModal;
