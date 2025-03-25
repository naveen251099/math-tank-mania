
import React from 'react';

interface MineOptionsProps {
  options: number[];
  correctAnswer: number;
  selectedMine: number | null;
  onSelect: (value: number) => void;
  verticalPosition: number;
}

export const MineOptions: React.FC<MineOptionsProps> = ({ 
  options, 
  correctAnswer, 
  selectedMine, 
  onSelect,
  verticalPosition 
}) => {
  return (
    <div 
      className="absolute top-1/3 left-0 right-0 flex justify-around px-4 z-10"
      style={{ 
        transform: `translateY(${-verticalPosition * 40}px)`,
        transition: 'transform 0.1s linear'
      }}
    >
      {options.map((option, index) => (
        <button 
          key={index}
          onClick={() => onSelect(option)}
          className={`
            w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
            text-lg md:text-xl font-bold text-white
            border-4 transition-all duration-200
            ${selectedMine === option 
              ? (option === correctAnswer 
                ? 'bg-green-500 border-green-300 animate-pulse' 
                : 'bg-red-500 border-red-300') 
              : 'bg-yellow-600 border-yellow-400 hover:bg-yellow-500'}
            ${selectedMine === option && option !== correctAnswer 
              ? 'animate-[shake_0.2s_ease-in-out_0s_3]' : ''}
            shadow-lg transform hover:scale-110
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
