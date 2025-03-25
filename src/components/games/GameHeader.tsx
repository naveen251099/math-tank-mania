
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Volume2, VolumeX, Play, Pause, 
  Medal, Menu, RotateCcw
} from "lucide-react";

interface GameHeaderProps {
  score: number;
  level: number;
  isPaused: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onPause: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onRestart: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  level,
  isPaused,
  soundEnabled,
  musicEnabled,
  onPause,
  onToggleSound,
  onToggleMusic,
  onRestart
}) => {
  return (
    <div className="flex justify-between items-center mb-4 text-white">
      <div className="flex items-center gap-2">
        <div className="bg-green-700 p-2 px-3 rounded-lg shadow-md flex items-center space-x-1">
          <Medal className="text-yellow-400 w-5 h-5" /> 
          <span className="font-bold">{score}</span>
        </div>
        <div className="bg-green-700 p-2 px-3 rounded-lg shadow-md">
          Level: {level}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-green-700 border-green-600 hover:bg-green-600"
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-green-700 border-green-600 hover:bg-green-600"
          onClick={onPause}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="outline" 
          className="bg-green-700 border-green-600 hover:bg-green-600"
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
