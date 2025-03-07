import React from "react";

export interface CardProps {
  id: number;
  name: string;
  image: string;
  price?: number; // Optional price for marketplace cards
  onBuy?: () => void; // Optional buy function for marketplace
}

const Card: React.FC<CardProps> = ({ name, image, price, onBuy }) => {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] border border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <div className="h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute bottom-0 w-full p-6 z-20">
        <h3 className="text-xl font-bold mb-2 text-white tracking-wide drop-shadow-lg">
          {name}
        </h3>
        {price !== undefined && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ${price}
            </span>
            {onBuy && (
              <button
                onClick={onBuy}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold 
                  transform transition-all duration-300 hover:from-purple-500 hover:to-pink-500 
                  hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
              >
                Buy Now
              </button>
            )}
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default Card;
