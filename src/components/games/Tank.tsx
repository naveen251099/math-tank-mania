
import React from 'react';

interface TankProps {
  position: number;
  health: number;
  isMoving: boolean;
}

export const Tank: React.FC<TankProps> = ({ position, health, isMoving }) => {
  return (
    <div 
      className={`
        absolute left-0 bottom-8 transition-all duration-200
        ${isMoving ? 'animate-[bounce_1s_ease-in-out_infinite]' : ''}
      `}
      style={{ 
        left: `${position * 25}%`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="relative">
        {/* Tank Body */}
        <div className="bg-green-500 w-20 h-12 rounded-lg border-4 border-green-600 relative">
          {/* Tank Turret */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-6 bg-green-700 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-2 h-8 bg-green-800 rounded"></div>
          
          {/* Tank Treads */}
          <div className="absolute -left-1 -right-1 bottom-2 h-2 bg-gray-800 rounded"></div>
          <div className="absolute -left-1 -right-1 top-2 h-2 bg-gray-800 rounded"></div>
          
          {/* Tank Health */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(health)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-red-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
