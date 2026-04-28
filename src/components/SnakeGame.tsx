import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GRID_CELLS = 20;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_CELLS),
        y: Math.floor(Math.random() * GRID_CELLS),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Collision with walls
      if (
        newHead.x < 0 || newHead.x >= GRID_CELLS ||
        newHead.y < 0 || newHead.y >= GRID_CELLS
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eating food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, isGameOver, generateFood]);

  useEffect(() => {
    const gameLoop = (time: number) => {
      if (time - lastUpdateRef.current > 150) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full px-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase tracking-widest text-xs">Score</span>
          <span className="neon-text-cyan text-xl font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase tracking-widest text-xs">Best</span>
          <span className="neon-text-pink text-xl font-bold">{highScore}</span>
        </div>
      </div>

      <div className="relative aspect-square w-full bg-zinc-900 neon-border rounded-lg overflow-hidden grid grid-cols-20 grid-rows-20 p-1 bg-grid-white">
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.5)] ${i === 0 ? 'bg-cyan-400 z-10' : 'bg-cyan-600/80'}`}
            style={{
              width: `${100 / GRID_CELLS}%`,
              height: `${100 / GRID_CELLS}%`,
              left: `${(segment.x / GRID_CELLS) * 100}%`,
              top: `${(segment.y / GRID_CELLS) * 100}%`,
              transition: 'all 0.15s linear',
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-pulse"
          style={{
            width: `${(100 / GRID_CELLS) * 0.8}%`,
            height: `${(100 / GRID_CELLS) * 0.8}%`,
            left: `${(food.x / GRID_CELLS) * 100 + (100 / GRID_CELLS) * 0.1}%`,
            top: `${(food.y / GRID_CELLS) * 100 + (100 / GRID_CELLS) * 0.1}%`,
          }}
        />

        {/* Overlays */}
        {!gameStarted && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold neon-text-cyan tracking-tighter">NEON SNAKE</h2>
            <button
              onClick={() => setGameStarted(true)}
              className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center gap-2"
            >
              <Play className="fill-current w-4 h-4" /> START MISSION
            </button>
            <p className="text-zinc-500 text-xs font-mono">USE ARROW KEYS TO NAVIGATE</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold neon-text-pink tracking-tighter">MISSION FAILED</h2>
            <div className="text-center">
              <p className="text-zinc-400 text-sm">FINAL SCORE</p>
              <p className="text-3xl font-bold neon-text-cyan">{score}</p>
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-pink-500 text-black font-bold rounded-full hover:bg-pink-400 transition-colors shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> REBOOT SYSTEM
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
