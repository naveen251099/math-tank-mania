import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GameControls } from "./GameControls";
import { GameHeader } from "./GameHeader";
import { MathProblem } from "./MathProblem";
import { MineOptions } from "./MineOptions";
import { GameOverDialog } from "./GameOverDialog";
import { Tank } from "./Tank";
import { Villain } from "./Villain";
import { Coin } from "./Coin";
import { generateDivisionProblem } from "@/utils/gameUtils";
import { 
  Volume2, VolumeX, Play, Pause, 
  Medal, Heart, Shield, RotateCcw, Menu
} from "lucide-react";

const MathTankMania = () => {
  // Game states
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [tankHealth, setTankHealth] = useState(3);
  const [villainStrength, setVillainStrength] = useState(6);
  const [currentProblem, setCurrentProblem] = useState(generateDivisionProblem());
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [tankPosition, setTankPosition] = useState(2); // 0-4 horizontal position
  const [tankVerticalPosition, setTankVerticalPosition] = useState(0);
  const [selectedMine, setSelectedMine] = useState<number | null>(null);
  const [wrongAnswerFeedback, setWrongAnswerFeedback] = useState(false);
  const [correctAnswerFeedback, setCorrectAnswerFeedback] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [coins, setCoins] = useState(generateCoins());
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fix 1: Generate coins with proper structure including collected flag
  function generateCoins() {
    const newCoins = [];
    // Generate 10 coins randomly
    for (let i = 0; i < 10; i++) {
      newCoins.push({
        id: i,
        x: Math.floor(Math.random() * 5),  // 0-4 horizontal
        y: Math.floor(Math.random() * 9) + 1, // 1-9 vertical
        collected: false
      });
    }
    return newCoins;
  }

  // Fix 2: Improve coin collection logic
  const checkCoinCollection = useCallback(() => {
    let coinCollected = false;
    
    const updatedCoins = coins.map(coin => {
      // Check if the tank is near a coin
      if (
        !coin.collected && 
        coin.x === tankPosition && 
        Math.abs(coin.y - tankVerticalPosition) < 0.5
      ) {
        // Collect the coin
        coinCollected = true;
        return { ...coin, collected: true };
      }
      return coin;
    });
    
    if (coinCollected) {
      setCoins(updatedCoins);
      setScore(prev => prev + 50);
      playSound('coin');
      toast({
        title: "Coin Collected!",
        description: "+50 points",
        duration: 1000
      });
    }
  }, [coins, tankPosition, tankVerticalPosition, toast]);

  // Fix 3: Auto-forward movement (correct direction)
  useEffect(() => {
    if (gameOver || isPaused) return;

    const movementInterval = setInterval(() => {
      setTankVerticalPosition(prev => {
        const newPosition = prev + 0.05; // Slower movement
        
        // Check for coin collection
        checkCoinCollection();
        
        // Check if tank has reached the end of the level
        if (newPosition >= 10) {
          if (villainStrength > 0) {
            // Tank reaches end without defeating villain
            setGameOver(true);
            setGameResult('lose');
            playSound('gameOver');
            return prev;
          } else {
            // Move to next level
            handleLevelComplete();
            return 0; // Reset position
          }
        }
        return newPosition;
      });
    }, 100);

    return () => clearInterval(movementInterval);
  }, [gameOver, isPaused, villainStrength, tankPosition, checkCoinCollection]);

  const handleLevelComplete = () => {
    setShowLevelComplete(true);
    playSound('levelUp');
    
    // Continue to next level after a delay
    setTimeout(() => {
      setLevel(prev => prev + 1);
      setVillainStrength(6 + Math.floor(level / 2)); // Increase difficulty
      setTankVerticalPosition(0);
      setCoins(generateCoins());
      setShowLevelComplete(false);
      
      // Make division problems slightly harder as levels progress
      setCurrentProblem(generateDivisionProblem(level));
    }, 2000);
  };

  const handleMineSelection = (selectedAnswer: number) => {
    if (gameOver || isPaused) return;

    setSelectedMine(selectedAnswer);

    if (selectedAnswer === currentProblem.correctAnswer) {
      // Correct answer
      setScore(prev => prev + 100);
      setCorrectAnswerFeedback(true);
      playSound('correct');
      
      toast({
        title: "Correct!",
        description: "+100 points",
        duration: 1500
      });
      
      // Reduce villain strength
      setVillainStrength(prev => {
        const newStrength = Math.max(0, prev - 1);
        
        // Check if villain is defeated
        if (newStrength === 0) {
          playSound('victory');
          // We don't set game over here, but at the end of the level
        }
        
        return newStrength;
      });
      
      // Reset feedback and generate new problem after a short delay
      setTimeout(() => {
        setCorrectAnswerFeedback(false);
        setSelectedMine(null);
        setCurrentProblem(generateDivisionProblem(level));
      }, 1000);
    } else {
      // Wrong answer
      setWrongAnswerFeedback(true);
      playSound('wrong');
      
      toast({
        title: "Incorrect!",
        description: "Try again!",
        variant: "destructive",
        duration: 1500
      });
      
      // Reduce tank health
      setTankHealth(prev => {
        const newHealth = Math.max(0, prev - 1);
        
        // Check if tank is destroyed
        if (newHealth === 0) {
          setGameOver(true);
          setGameResult('lose');
          playSound('gameOver');
        }
        
        return newHealth;
      });

      // Reset wrong answer feedback after a short delay
      setTimeout(() => {
        setWrongAnswerFeedback(false);
        setSelectedMine(null);
      }, 800);
    }
  };

  const handleTankMove = (direction: 'left' | 'right') => {
    if (gameOver || isPaused) return;

    setTankPosition(prev => {
      // Constrain movement between 0-4 (5 lanes)
      if (direction === 'left' && prev > 0) return prev - 1;
      if (direction === 'right' && prev < 4) return prev + 1;
      return prev;
    });
    
    playSound('move');
  };

  const handlePause = () => {
    setIsPaused(prev => !prev);
    playSound('click');
  };

  const handleRestart = () => {
    // Reset all game states
    setLevel(1);
    setScore(0);
    setTankHealth(3);
    setVillainStrength(6);
    setCurrentProblem(generateDivisionProblem());
    setGameOver(false);
    setGameResult(null);
    setIsPaused(false);
    setTankPosition(2);
    setTankVerticalPosition(0);
    setCoins(generateCoins());
    setWrongAnswerFeedback(false);
    setCorrectAnswerFeedback(false);
    playSound('restart');
  };
  
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  const toggleMusic = () => {
    setMusicEnabled(prev => !prev);
  };
  
  const playSound = (type: 'correct' | 'wrong' | 'coin' | 'move' | 'gameOver' | 'victory' | 'click' | 'restart' | 'levelUp') => {
    if (!soundEnabled) return;
    
    // This would ideally play actual sounds
    console.log(`Playing sound: ${type}`);
    // Here we would use the Web Audio API or a library like Howler.js
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handleTankMove('left');
          break;
        case 'ArrowRight':
          handleTankMove('right');
          break;
        case ' ':
          handlePause();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  return (
    <div className="bg-gradient-to-b from-green-900 to-green-800 p-6 rounded-xl shadow-xl relative h-[600px] w-full max-w-3xl mx-auto flex flex-col">
      {/* Game Over Dialog */}
      {gameOver && (
        <GameOverDialog 
          gameResult={gameResult}
          score={score}
          level={level}
          onRestart={handleRestart}
        />
      )}

      {/* Level Complete Notification */}
      {showLevelComplete && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40 flex flex-col items-center justify-center">
          <div className="bg-green-700 p-6 rounded-xl text-center transform scale-in-center animate-bounce">
            <h2 className="text-3xl font-bold mb-2 text-yellow-300">Level {level} Complete!</h2>
            <p className="text-white">Great job! Get ready for level {level + 1}...</p>
          </div>
        </div>
      )}

      {/* Game Header with Score and Level */}
      <GameHeader 
        score={score}
        level={level}
        onPause={handlePause}
        isPaused={isPaused}
        onToggleSound={toggleSound}
        onToggleMusic={toggleMusic}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onRestart={handleRestart}
      />

      {/* Main Game Area */}
      <div 
        ref={gameAreaRef}
        className={`
          flex-grow relative overflow-hidden rounded-lg border-4 border-green-950
          ${wrongAnswerFeedback ? 'bg-red-600' : ''}
          ${correctAnswerFeedback ? 'bg-green-600' : ''}
          ${!wrongAnswerFeedback && !correctAnswerFeedback ? 'bg-gradient-to-b from-green-600 to-green-700' : ''}
        `}
        style={{ transition: 'background-color 0.3s ease' }}
      >
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 z-40 flex flex-col items-center justify-center">
            <div className="bg-green-800 p-6 rounded-xl text-center">
              <h2 className="text-3xl font-bold mb-2 text-white">Game Paused</h2>
              <p className="text-white mb-4">Take a break and come back when you're ready!</p>
              <Button onClick={handlePause} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2" /> Resume Game
              </Button>
            </div>
          </div>
        )}

        {/* Problem Display */}
        <MathProblem problem={currentProblem.problem} />

        {/* Game progress */}
        <div className="absolute top-20 left-4 right-4 flex justify-between items-center z-30">
          <div className="bg-black bg-opacity-50 p-2 rounded-lg text-white flex items-center space-x-2">
            <Heart className="text-red-500" />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-5 h-5 rounded-full ${i < tankHealth ? 'bg-red-500' : 'bg-gray-500 opacity-30'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-2 rounded-lg text-white flex items-center space-x-2">
            <Shield className="text-blue-400" />
            <Progress 
              value={(villainStrength / 6) * 100} 
              className="w-24 h-3" 
              indicatorClassName="bg-red-600" 
            />
          </div>
        </div>

        {/* Background Elements to simulate movement */}
        <div className="absolute inset-0">
          {/* Path lines */}
          {[0, 1, 2, 3, 4].map(lane => (
            <div 
              key={lane}
              className="absolute top-0 bottom-0 w-0.5 bg-green-500 opacity-30"
              style={{ 
                left: `${lane * 25}%`,
                transform: `translateX(${lane === 0 ? 0 : -50}%) translateY(${-tankVerticalPosition * 40}px)`,
                height: '2000px',
                transition: 'transform 0.1s linear'
              }}
            />
          ))}
          
          {/* Ground texture */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute left-0 right-0 h-8 bg-green-800 opacity-20"
              style={{ 
                top: `${i * 60}px`,
                transform: `translateY(${-tankVerticalPosition * 40}px)`,
                transition: 'transform 0.1s linear'
              }}
            />
          ))}
        </div>

        {/* Mine Options */}
        <MineOptions 
          options={currentProblem.options}
          correctAnswer={currentProblem.correctAnswer}
          selectedMine={selectedMine}
          onSelect={handleMineSelection}
          verticalPosition={tankVerticalPosition}
        />

        {/* Coins */}
        {coins.map((coin) => (
          !coin.collected && (
            <Coin 
              key={coin.id}
              position={{ x: coin.x, y: coin.y }}
              tankPosition={tankVerticalPosition}
            />
          )
        ))}

        {/* Villain */}
        <Villain 
          strength={villainStrength}
          tankPosition={tankVerticalPosition}
        />

        {/* Tank */}
        <Tank 
          position={tankPosition}
          health={tankHealth}
          isMoving={!isPaused && !gameOver}
        />
      </div>

      {/* Game Controls */}
      <GameControls 
        onMoveLeft={() => handleTankMove('left')}
        onMoveRight={() => handleTankMove('right')}
        onPause={handlePause}
        isPaused={isPaused}
        disabled={gameOver}
      />

      {/* Touch Controls for Mobile */}
      <div className="md:hidden mt-2 flex justify-between">
        <div 
          className="w-1/2 h-16" 
          onTouchStart={() => handleTankMove('left')}
        />
        <div 
          className="w-1/2 h-16" 
          onTouchStart={() => handleTankMove('right')}
        />
      </div>
    </div>
  );
};

export default MathTankMania;
