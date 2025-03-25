
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
        transform: `translateY(${verticalPosition * 40}px)`,
        transition: 'transform 0.1s linear'
      }}
    >
      {options.map((option, index) => (
        <button 
          key={index}
          onClick={() => onSelect(option)}
          className={`
            w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
            text-lg md:text-xl font-bold text-white relative
            border-4 transition-all duration-200
            ${selectedMine === option 
              ? (option === correctAnswer 
                ? 'bg-green-500 border-green-300 animate-pulse' 
                : 'bg-red-500 border-red-300') 
              : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}
            ${selectedMine === option && option !== correctAnswer 
              ? 'animate-[shake_0.2s_ease-in-out_0s_3]' : ''}
            shadow-lg transform hover:scale-110
          `}
        >
          {/* Mine spikes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-3 h-3 bg-yellow-600" 
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-150%)`,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Number display */}
          <span className="z-10 relative text-white">{option}</span>
        </button>
      ))}
    </div>
  );
};
