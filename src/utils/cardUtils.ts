export const getRarityForCard = (id: number): string => {
  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  return rarities[id % rarities.length];
};

export const getMarketPriceForCard = (id: number): number => {
  // Generate a price between 0.01 and 2.5 ETH based on card id
  return parseFloat((0.01 + ((id * 0.1) % 2.5)).toFixed(2));
};

export const getDescriptionForCard = (name: string): string => {
  const descriptions = [
    `The ${name} card is a powerful artifact from the ancient civilization of Eldoria. It grants its owner enhanced abilities in strategic thinking.`,
    `Forged in the depths of the Mystic Forge, the ${name} card contains the essence of forgotten magic.`,
    `The ${name} is sought after by collectors across the multiverse for its unique energy signature and historical significance.`,
    `Legend says that the ${name} card was created by the first Archmage as a tool to preserve knowledge through the ages.`,
    `The ${name} card pulses with an otherworldly energy, connecting its owner to realms beyond our understanding.`,
  ];

  // Use the first character of the name to select a description
  const index = name.charCodeAt(0) % descriptions.length;
  return descriptions[index];
};
