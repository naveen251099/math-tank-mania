
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onPause: () => void;
  isPaused: boolean;
  disabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onPause,
  isPaused,
  disabled
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button 
        onClick={onMoveLeft}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform"
        size="lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button 
        onClick={onPause}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full shadow-lg"
      >
        {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
      </Button>
      
      <Button 
        onClick={onMoveRight}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform"
        size="lg"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
};
