import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiGithub, FiRefreshCw } from 'react-icons/fi';

export default function FooterScene({ onReset }) {
  // Game states
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState('smart'); // 'easy' or 'smart'
  const [scores, setScores] = useState({ player: 0, bot: 0, draws: 0 });
  const [gameResult, setGameResult] = useState(null); // 'win', 'loss', 'draw', or null
  const [winningLine, setWinningLine] = useState([]);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Check game result
  const checkWinner = (tempBoard) => {
    for (let i = 0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];
      if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
        return { winner: tempBoard[a], line: winLines[i] };
      }
    }
    const isDraw = tempBoard.every(cell => cell !== null);
    return { winner: isDraw ? 'draw' : null, line: [] };
  };

  // Bot move triggers
  useEffect(() => {
    if (!isPlayerTurn && !gameResult && !isBotThinking) {
      setIsBotThinking(true);
      
      // Thinking simulation delay
      const timer = setTimeout(() => {
        makeBotMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameResult]);

  // Mini-max score evaluator for Smart Bot
  const minimax = (tempBoard, depth, isMax) => {
    const { winner } = checkWinner(tempBoard);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    if (isMax) {
      let bestVal = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'O';
          bestVal = Math.max(bestVal, minimax(tempBoard, depth + 1, false));
          tempBoard[i] = null;
        }
      }
      return bestVal;
    } else {
      let bestVal = Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'X';
          bestVal = Math.min(bestVal, minimax(tempBoard, depth + 1, true));
          tempBoard[i] = null;
        }
      }
      return bestVal;
    }
  };

  const makeBotMove = () => {
    const availableSpots = board.reduce((acc, cell, idx) => {
      if (cell === null) acc.push(idx);
      return acc;
    }, []);

    if (availableSpots.length === 0) return;

    let chosenSpot;

    if (difficulty === 'easy') {
      // Pick random available spot
      const randomIdx = Math.floor(Math.random() * availableSpots.length);
      chosenSpot = availableSpots[randomIdx];
    } else {
      // Minimax choice
      let bestVal = -Infinity;
      chosenSpot = availableSpots[0];

      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const tempBoard = [...board];
          tempBoard[i] = 'O';
          const moveVal = minimax(tempBoard, 0, false);
          if (moveVal > bestVal) {
            bestVal = moveVal;
            chosenSpot = i;
          }
        }
      }
    }

    const newBoard = [...board];
    newBoard[chosenSpot] = 'O';
    setBoard(newBoard);

    const { winner, line } = checkWinner(newBoard);
    if (winner) {
      handleGameOver(winner, line);
    } else {
      setIsPlayerTurn(true);
    }
    setIsBotThinking(false);
  };

  const handleCellClick = (idx) => {
    if (board[idx] || !isPlayerTurn || gameResult || isBotThinking) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    const { winner, line } = checkWinner(newBoard);
    if (winner) {
      handleGameOver(winner, line);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const handleGameOver = (winner, line) => {
    setWinningLine(line);
    if (winner === 'X') {
      setGameResult('win');
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (winner === 'O') {
      setGameResult('loss');
      setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
    } else {
      setGameResult('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameResult(null);
    setWinningLine([]);
    setIsBotThinking(false);
  };

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 px-6 bg-stone-900 text-stone-300 select-none">

      {/* Content Block */}
      <div className="max-w-4xl w-full text-center space-y-12 mx-auto relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase inline-block bg-stone-800 border-2 border-stone-600 px-3 py-1 rounded-lg">
            Study Session Completed
          </span>
          <h2 className="text-4xl sm:text-6xl font-sans font-black text-stone-100 tracking-tight leading-tight uppercase">
            Rest Well.{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-stone-950">Take a Break.</span>
              <span className="absolute inset-0 bg-[#F8C537] -rotate-1 border-2 border-stone-900 rounded-lg -z-0" />
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed font-medium">
            Close the study tabs. Reset your focus with a quick board game against our study bot before calling it a day.
          </p>
        </div>

        {/* Tic Tac Toe Board Game Widget (Warm Neo-Brutalist Layout) */}
        <div className="w-full max-w-sm mx-auto bg-stone-800 border-2 border-stone-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.08)] space-y-5">
          
          {/* Game Controls & Score */}
          <div className="flex justify-between items-center px-1">
            {/* Difficulty Toggle badge */}
            <div className="flex border-2 border-stone-900 rounded-lg overflow-hidden text-[9px] font-mono font-bold">
              <button 
                onClick={() => setDifficulty('easy')}
                className={`px-2.5 py-1 transition-colors uppercase ${
                  difficulty === 'easy' ? 'bg-[#A9C5A0] text-stone-950' : 'bg-stone-700 text-stone-400'
                }`}
              >
                Easy
              </button>
              <button 
                onClick={() => setDifficulty('smart')}
                className={`px-2.5 py-1 transition-colors uppercase border-l-2 border-stone-900 ${
                  difficulty === 'smart' ? 'bg-[#F8C537] text-stone-950' : 'bg-stone-700 text-stone-400'
                }`}
              >
                Smart Bot
              </button>
            </div>

            {/* Reset widget button */}
            <button 
              onClick={resetGame} 
              className="p-1.5 bg-[#FAF9F6] border-2 border-stone-900 text-stone-900 rounded-lg hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1 text-[9px] font-mono font-black uppercase"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${isBotThinking ? 'animate-spin' : ''}`} />
              <span>Reset</span>
            </button>
          </div>

          {/* 3x3 Tic Tac Toe Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto relative">
            {board.map((cell, idx) => {
              const isWinning = winningLine.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`aspect-square rounded-2xl border-2 border-stone-900 transition-all duration-100 flex items-center justify-center text-3xl font-black font-sans shadow-[2.5px_2.5px_0px_0px_rgba(28,25,23,1)] ${
                    cell ? 'cursor-default' : 'hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_0px_rgba(28,25,23,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none'
                  } ${
                    isWinning 
                      ? 'bg-[#A9C5A0]' 
                      : cell === 'X' 
                        ? 'bg-white text-[#F26430]' 
                        : cell === 'O' 
                          ? 'bg-[#FAF9F6] text-[#F8C537]' 
                          : 'bg-[#FAF9F6]'
                  }`}
                >
                  {cell}
                </button>
              );
            })}

            {/* Overlay win banner */}
            {gameResult && (
              <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border-2 border-stone-600 p-4 animate-fade-in z-20">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FAF9F6] uppercase mb-1">Result</span>
                <h3 className="text-xl font-sans font-black text-white uppercase tracking-wider mb-4">
                  {gameResult === 'win' && 'You Won! 🎉'}
                  {gameResult === 'loss' && 'Bot Won 🤖'}
                  {gameResult === 'draw' && 'Draw Game 🤝'}
                </h3>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-[#F8C537] text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Scoreboard stats */}
          <div className="pt-2 border-t border-stone-750 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 px-2">
            <div className="flex flex-col items-center">
              <span>Player (X)</span>
              <span className="text-sm font-black text-[#F26430]">{scores.player}</span>
            </div>
            <div className="flex flex-col items-center">
              <span>Draws</span>
              <span className="text-sm font-black text-stone-400">{scores.draws}</span>
            </div>
            <div className="flex flex-col items-center">
              <span>Study Bot</span>
              <span className="text-sm font-black text-[#F8C537]">{scores.bot}</span>
            </div>
          </div>

        </div>

        {/* Scroll back to top */}
        <div className="pt-4">
          <button
            onClick={onReset}
            className="px-7 py-3.5 bg-white text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 mx-auto"
          >
            <span>Back to Morning</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Footer Block */}
      <footer className="w-full max-w-5xl mx-auto border-t border-stone-800 pt-10 mt-12 text-stone-500 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-sans font-black text-stone-200">
                Aspirant
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest bg-stone-800 border border-stone-700 px-2 py-0.5 rounded">study os</span>
            </div>
            <p className="text-stone-500 text-xs font-medium max-w-sm">
              "Live as if you were to die tomorrow. Learn as if you were to live forever."
            </p>
          </div>

          {/* Footer menu links */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
            <button onClick={() => handleScrollTo('morning')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => handleScrollTo('contact')} className="hover:text-white transition-colors">Contact Us</button>
            <button onClick={() => handleScrollTo('contribute')} className="hover:text-white transition-colors">Contribute</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-600 border-t border-stone-800 pt-6">
          <p className="font-medium">© {new Date().getFullYear()} Aspirant Study Operating System. Open source software.</p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/aisahilyadav/Aspirant" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-stone-400 transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Code Repository</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
