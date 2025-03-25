
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, XCircle, RotateCcw, Share2 } from "lucide-react";

interface GameOverDialogProps {
  gameResult: 'win' | 'lose' | null;
  score: number;
  level: number;
  onRestart: () => void;
}

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
  gameResult,
  score,
  level,
  onRestart
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      <div className="bg-green-800 p-8 rounded-xl text-center max-w-md w-full transform scale-in-center shadow-2xl border-4 border-green-700">
        {gameResult === 'win' ? (
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-4" />
            <h2 className="text-4xl font-bold mb-2 text-yellow-300">Victory!</h2>
            <p className="text-white text-xl">You defeated the villain!</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <XCircle className="w-20 h-20 mx-auto text-red-500 mb-4" />
            <h2 className="text-4xl font-bold mb-2 text-red-300">Game Over</h2>
            <p className="text-white text-xl">The villain has survived!</p>
          </div>
        )}
        
        <div className="bg-green-900 rounded-lg p-4 mb-6">
          <div className="text-white mb-2">
            <span className="font-semibold">Final Score:</span> 
            <span className="text-yellow-300 text-2xl ml-2">{score}</span>
          </div>
          <div className="text-white">
            <span className="font-semibold">Level Reached:</span> 
            <span className="text-blue-300 text-xl ml-2">{level}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onRestart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 rounded-lg text-lg font-bold flex items-center justify-center"
          >
            <RotateCcw className="mr-2" /> Play Again
          </Button>
          
          <Button 
            variant="outline"
            className="border-green-600 text-white hover:bg-green-700"
          >
            <Share2 className="mr-2" /> Share Score
          </Button>
        </div>
      </div>
    </div>
  );
};
