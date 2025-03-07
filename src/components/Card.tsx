import React from "react";

export interface CardProps {
  id: number;
  name: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ name, image }) => {
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
        <h3 className="text-xl font-bold mb-2 text-white tracking-wide drop-shadow-lg">{name}</h3>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default Card;
