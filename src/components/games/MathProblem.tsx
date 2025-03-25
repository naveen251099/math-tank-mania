
import React from 'react';

interface MathProblemProps {
  problem: string;
}

export const MathProblem: React.FC<MathProblemProps> = ({ problem }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 text-center py-4 px-6 bg-gradient-to-r from-green-900 to-green-800 shadow-md">
      <div className="flex flex-col items-center">
        <span className="text-sm text-green-300 font-medium">Find the correct answer:</span>
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {problem}
        </h3>
      </div>
    </div>
  );
};
