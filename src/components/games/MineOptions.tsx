
import React from 'react';

interface MineOption {
  value: number;
  x: number;
  y: number;
  isCorrect: boolean;
  isHit: boolean;
}

interface MineOptionsProps {
  mines: MineOption[];
}

export const MineOptions: React.FC<MineOptionsProps> = ({ mines }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {mines.map((mine, index) => (
        <div 
          key={index}
          className={`
            absolute w-16 h-16 md:w-20 md:h-20 rounded-full 
            flex items-center justify-center
            text-lg md:text-xl font-bold text-white relative
            border-4 transition-all duration-200
            ${mine.isHit 
              ? (mine.isCorrect 
                ? 'bg-green-500 border-green-300 animate-pulse' 
                : 'bg-red-500 border-red-300 animate-[shake_0.2s_ease-in-out_0s_3]') 
              : 'bg-gray-700 border-gray-500'}
            shadow-lg
          `}
          style={{ 
            left: `${mine.x * 25}%`,
            top: `${mine.y}px`,
            transform: 'translateX(-50%)',
            transition: 'top 0.1s linear'
          }}
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
          <span className="z-10 relative text-white">{mine.value}</span>
        </div>
      ))}
    </div>
  );
};
