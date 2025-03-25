
import React from 'react';

interface VillainProps {
  strength: number;
  tankPosition: number;
}

export const Villain: React.FC<VillainProps> = ({ strength, tankPosition }) => {
  // Only show villain if strength > 0
  if (strength <= 0) return null;
  
  return (
    <div 
      className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
      style={{ 
        top: '120px',
        transform: `translateX(-50%) translateY(${-tankPosition * 40}px)`,
        transition: 'transform 0.1s linear'
      }}
    >
      <div className="relative">
        {/* Villain Body */}
        <div className="bg-purple-700 w-24 h-24 rounded-lg border-4 border-purple-900 flex items-center justify-center">
          <div className="text-3xl">👾</div>
          
          {/* Villain Health */}
          <div className="absolute -bottom-6 left-0 right-0 bg-gray-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-300" 
              style={{ width: `${(strength / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
