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
  price: number;
  rarity: string;
  marketPrice: number;
  description: string;
}

const Marketplace: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuy = (id: number) => {
    console.log(`Buying card ${id}`);
    // Implement actual buying logic here
    setIsModalOpen(false);
  };

  // Function to handle card click
  const handleCardClick = (card: any) => {
    // Enhance the card with additional details
    const enhancedCard = {
      ...card,
      rarity: getRarityForCard(card.id),
      marketPrice: card.price, // Use the existing price
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
      <h1 className="text-3xl font-bold mb-8 text-center">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockCards.map((card) => (
          <div
            key={card.id}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleCardClick(card)}
          >
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              image={card.image}
              price={card.price}
              onBuy={(e) => {
                e.stopPropagation(); // Prevent modal from opening when buy button is clicked
                handleBuy(card.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal for 3D view */}
      {isModalOpen && selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={closeModal}
          showBuyButton={true}
          onBuy={handleBuy}
        />
      )}
    </div>
  );
};

export default Marketplace;
