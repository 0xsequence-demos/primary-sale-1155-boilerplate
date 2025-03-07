export interface CardData {
  id: number;
  name: string;
  image: string;
  price?: number;
}

const mockCards: CardData[] = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: `Card ${i + 1}`,
  image: `/img-${i + 1}.png`,
  price: Math.floor(Math.random() * 10) + 1, // Random price between 1 and 10
}));

export default mockCards;
