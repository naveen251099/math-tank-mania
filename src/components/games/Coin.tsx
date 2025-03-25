
import React from 'react';

interface CoinProps {
  position: {
    x: number;
    y: number;
  };
  tankPosition: number;
}

export const Coin: React.FC<CoinProps> = ({ position, tankPosition }) => {
  return (
    <div 
      className="absolute w-10 h-10 flex items-center justify-center z-5"
      style={{ 
        left: `${position.x * 25}%`,
        top: `${position.y * 60}px`, 
        transform: `translateX(-50%) translateY(${-tankPosition * 40}px)`,
        transition: 'transform 0.1s linear'
      }}
    >
      <div className="w-10 h-10 bg-yellow-500 rounded-full border-4 border-yellow-300 flex items-center justify-center animate-[pulse_1.5s_infinite] shadow-lg text-xl">
        💰
      </div>
    </div>
  );
};
