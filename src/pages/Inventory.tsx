import React, { useState } from "react";
import Card from "../components/Card";
import mockCards from "../data/mockData";
import CardDetailModal from "../components/CardDetailModal";
import {
  getRarityForCard,
  getMarketPriceForCard,
  getDescriptionForCard,
} from "../utils/cardUtils";

interface CardDetails {
  id: number;
  name: string;
  image: string;
  rarity: string;
  marketPrice: number;
  description: string;
}

const Inventory: React.FC = () => {
  // For demo purposes, let's assume the user owns a subset of the cards
  const ownedCards = mockCards.filter((card) => card.id % 2 === 0); // Just for example, owns even-numbered cards

  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle card click
  const handleCardClick = (card: any) => {
    // Enhance the card with additional details
    const enhancedCard = {
      ...card,
      rarity: getRarityForCard(card.id),
      marketPrice: getMarketPriceForCard(card.id),
      description: getDescriptionForCard(card.name),
    };

    setSelectedCard(enhancedCard);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Inventory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ownedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <Card
              id={card.id}
              name={card.name}
              image={card.image}
              // No price or buy button in inventory
            />
          </div>
        ))}
      </div>

      {/* Modal for 3D view */}
      {isModalOpen && selectedCard && (
        <CardDetailModal card={selectedCard} onClose={closeModal} />
      )}
    </div>
  );
};

export default Inventory;
