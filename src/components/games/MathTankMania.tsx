
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
import { 
  generateDivisionProblem, 
  checkCollision, 
  generateInitialMines, 
  generateCoins 
} from "@/utils/gameUtils";
import { 
  Volume2, VolumeX, Play, Pause, 
  Medal, Heart, Shield, RotateCcw, Menu
} from "lucide-react";

// Define a type for our mine objects
interface Mine {
  value: number;
  x: number;
  y: number;
  isCorrect: boolean;
  isHit: boolean;
}

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
  const [tankIsHit, setTankIsHit] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  
  // New state for falling mines and coins
  const [mines, setMines] = useState<Mine[]>(
    generateInitialMines(currentProblem.correctAnswer, currentProblem.options)
  );
  const [coins, setCoins] = useState(generateCoins());
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gameSpeedRef = useRef<number>(1);

  // Initialize or reset the game
  const resetGame = useCallback(() => {
    const newProblem = generateDivisionProblem(level);
    setCurrentProblem(newProblem);
    setMines(generateInitialMines(newProblem.correctAnswer, newProblem.options));
    setCoins(generateCoins());
  }, [level]);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [resetGame]);

  // Game animation loop
  const gameLoop = useCallback((timestamp: number) => {
    if (isPaused || gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Calculate delta time
    const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 16.67 : 1;
    lastTimeRef.current = timestamp;

    // Move mines downward
    setMines(prevMines => {
      const newMines = prevMines.map(mine => {
        // Move mines down
        const newY = mine.y + (2 * gameSpeedRef.current * deltaTime);
        
        // Check for collision with tank
        const mineObj = { 
          x: mine.x, 
          y: newY, 
          width: 80, // Approximate mine width in pixels
          height: 80 // Approximate mine height in pixels
        };
        
        const tankObj = {
          position: tankPosition,
          width: 80 // Approximate tank width in pixels
        };
        
        const hasCollided = checkCollision(tankObj, mineObj);
        
        // Handle collision if not already hit
        if (hasCollided && !mine.isHit) {
          if (mine.isCorrect) {
            // Correct mine hit
            handleCorrectMineHit();
          } else {
            // Wrong mine hit
            handleWrongMineHit();
          }
          
          return { 
            ...mine, 
            isHit: true,
            y: newY
          };
        }
        
        return { 
          ...mine, 
          y: newY
        };
      });
      
      // Remove mines that are off-screen
      const visibleMines = newMines.filter(mine => mine.y < window.innerHeight + 200);
      
      // Add new mines if needed
      if (visibleMines.length < 3 && !gameOver) {
        const newOptions = [...currentProblem.options];
        for (let i = visibleMines.length; i < 5; i++) {
          visibleMines.push({
            value: newOptions[i] || Math.floor(Math.random() * 50) + 1,
            x: Math.floor(Math.random() * 5),
            y: -100 - Math.random() * 300,
            isCorrect: newOptions[i] === currentProblem.correctAnswer,
            isHit: false
          });
        }
      }
      
      return visibleMines;
    });
    
    // Move coins downward
    setCoins(prevCoins => {
      const newCoins = prevCoins.map(coin => {
        // Move coins down
        const newY = coin.y + (2 * gameSpeedRef.current * deltaTime);
        
        // Check for collision with tank if not already collected
        if (!coin.collected) {
          const coinObj = { 
            x: coin.x, 
            y: newY, 
            width: 40, // Approximate coin width in pixels
            height: 40 // Approximate coin height in pixels
          };
          
          const tankObj = {
            position: tankPosition,
            width: 80 // Approximate tank width in pixels
          };
          
          const hasCollided = checkCollision(tankObj, coinObj);
          
          if (hasCollided) {
            // Collect coin
            playSound('coin');
            setScore(prev => prev + 50);
            toast({
              title: "Coin Collected!",
              description: "+50 points",
              duration: 1000
            });
            
            return { ...coin, collected: true, y: newY };
          }
        }
        
        return { ...coin, y: newY };
      });
      
      // Remove coins that are off-screen
      const visibleCoins = newCoins.filter(coin => 
        !coin.collected && coin.y < window.innerHeight + 100
      );
      
      // Add new coins if needed
      if (visibleCoins.length < 5 && !gameOver) {
        for (let i = visibleCoins.length; i < 10; i++) {
          visibleCoins.push({
            id: Date.now() + i,
            x: Math.floor(Math.random() * 5),
            y: -100 - Math.random() * 300,
            collected: false
          });
        }
      }
      
      return visibleCoins;
    });
    
    // Check for level completion
    if (villainStrength <= 0) {
      handleLevelComplete();
    }
    
    // Continue the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, gameOver, tankPosition, currentProblem.correctAnswer, currentProblem.options, villainStrength]);

  // Start/continue game loop
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  // Handle a correct mine hit
  const handleCorrectMineHit = useCallback(() => {
    // Reduce villain strength
    setVillainStrength(prev => {
      const newStrength = Math.max(0, prev - 1);
      
      if (newStrength === 0) {
        playSound('victory');
      }
      
      return newStrength;
    });
    
    // Increase score
    setScore(prev => prev + 100);
    
    // Show toast
    toast({
      title: "Correct!",
      description: "+100 points",
      duration: 1500
    });
    
    playSound('correct');
    
    // Generate new problem
    setTimeout(() => {
      const newProblem = generateDivisionProblem(level);
      setCurrentProblem(newProblem);
    }, 1000);
  }, [level, toast]);

  // Handle a wrong mine hit
  const handleWrongMineHit = useCallback(() => {
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
    
    // Show hit effect
    setTankIsHit(true);
    setTimeout(() => setTankIsHit(false), 800);
    
    // Show toast
    toast({
      title: "Incorrect!",
      description: "Try again!",
      variant: "destructive",
      duration: 1500
    });
    
    playSound('wrong');
  }, [toast]);

  const handleLevelComplete = useCallback(() => {
    setShowLevelComplete(true);
    playSound('levelUp');
    
    // Pause the game briefly
    setIsPaused(true);
    
    // Continue to next level after a delay
    setTimeout(() => {
      setLevel(prev => prev + 1);
      setVillainStrength(6 + Math.floor(level / 2)); // Increase difficulty
      setIsPaused(false);
      setShowLevelComplete(false);
      
      // Increase game speed slightly for higher levels
      gameSpeedRef.current = 1 + (level * 0.1);
      
      // Reset game state for new level
      resetGame();
    }, 2000);
  }, [level, resetGame]);

  const handleTankMove = useCallback((direction: 'left' | 'right') => {
    if (gameOver || isPaused) return;

    setTankPosition(prev => {
      // Constrain movement between 0-4 (5 lanes)
      if (direction === 'left' && prev > 0) return prev - 1;
      if (direction === 'right' && prev < 4) return prev + 1;
      return prev;
    });
    
    playSound('move');
  }, [gameOver, isPaused]);

  const handlePause = useCallback(() => {
    setIsPaused(prev => !prev);
    playSound('click');
  }, []);

  const handleRestart = useCallback(() => {
    // Reset all game states
    setLevel(1);
    setScore(0);
    setTankHealth(3);
    setVillainStrength(6);
    setGameOver(false);
    setGameResult(null);
    setIsPaused(false);
    setTankPosition(2);
    setTankIsHit(false);
    setShowLevelComplete(false);
    gameSpeedRef.current = 1;
    
    // Reset game elements
    resetGame();
    
    playSound('restart');
  }, [resetGame]);
  
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  
  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);
  
  const playSound = useCallback((type: 'correct' | 'wrong' | 'coin' | 'move' | 'gameOver' | 'victory' | 'click' | 'restart' | 'levelUp') => {
    if (!soundEnabled) return;
    
    // This would ideally play actual sounds
    console.log(`Playing sound: ${type}`);
    // Here we would use the Web Audio API or a library like Howler.js
  }, [soundEnabled]);

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
  }, [gameOver, handlePause, handleTankMove]);

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
          ${tankIsHit ? 'bg-red-600' : 'bg-gradient-to-b from-green-600 to-green-700'}
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
                transform: `translateX(${lane === 0 ? 0 : -50}%)`,
                height: '100%'
              }}
            />
          ))}
          
          {/* Ground texture */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute left-0 right-0 h-8 bg-green-800 opacity-20"
              style={{ top: `${i * 60}px` }}
            />
          ))}
        </div>

        {/* Falling Mines */}
        <MineOptions mines={mines} />

        {/* Falling Coins */}
        {coins.map(coin => (
          <Coin 
            key={coin.id}
            position={{ x: coin.x, y: coin.y }}
            collected={coin.collected}
          />
        ))}

        {/* Villain */}
        <Villain strength={villainStrength} />

        {/* Tank */}
        <Tank 
          position={tankPosition}
          health={tankHealth}
          isMoving={!isPaused && !gameOver}
          isHit={tankIsHit}
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
