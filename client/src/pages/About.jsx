import React, { useState, useRef, useEffect } from 'react';
import { FiStar, FiCpu, FiLock, FiMonitor, FiTerminal, FiLayers } from 'react-icons/fi';
import { cn } from '../lib/utils';

// Warm Brutalist Card styled for dark backdrop with custom entry delay
function WarmBrutalistCard({ children, shadowColor, delayClass, className }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl bg-[#FAF9F6] border-2 border-stone-900 p-5 transition-all duration-300 select-none text-stone-950",
        "opacity-0 scale-95 animate-[slide-in-right_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]",
        isHovered 
          ? "translate-x-[-2px] translate-y-[-2px]" 
          : "translate-x-0 translate-y-0",
        delayClass,
        className
      )}
      style={{
        boxShadow: isHovered 
          ? `6px 6px 0px 0px ${shadowColor}` 
          : `4px 4px 0px 0px ${shadowColor}`,
      }}
    >
      {children}
    </div>
  );
}

// Typing console simulation
function TerminalConsole() {
  const [logs, setLogs] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const logsQueue = [
    "sahil@workstation:~$ npm run dev",
    "✔ dev server initialized in 340ms",
    "✔ API gateway online: port 8000",
    "✔ RAG database connection initiated",
    "✔ loading local vector embeddings...",
    "✔ active recall modules: READY",
    "✔ watching changes. compilation complete!"
  ];

  useEffect(() => {
    if (lineIndex >= logsQueue.length) {
      const timer = setTimeout(() => {
        setLogs([]);
        setLineIndex(0);
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(timer);
    }

    const currentText = logsQueue[lineIndex];
    if (charIndex < currentText.length) {
      const charTimer = setTimeout(() => {
        setCurrentLine(prev => prev + currentText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(charTimer);
    } else {
      const lineTimer = setTimeout(() => {
        setLogs(prev => [...prev, currentText]);
        setCurrentLine('');
        setCharIndex(0);
        setLineIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(lineTimer);
    }
  }, [lineIndex, charIndex]);

  return (
    <div className="w-full bg-stone-950 border-2 border-stone-900 rounded-xl p-3 font-mono text-[9px] text-stone-300 space-y-1 mt-3 shadow-inner select-none text-left">
      <div className="flex items-center space-x-1.5 border-b border-stone-800 pb-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border border-stone-900" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFD93D] border border-stone-900" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#6BCB77] border border-stone-900" />
        <span className="text-[8px] uppercase tracking-wider text-stone-600 pl-2">shell</span>
      </div>
      <div className="space-y-1 h-[75px] overflow-y-auto scrollbar-none">
        {logs.map((log, i) => (
          <p key={i} className={log.startsWith("sahil@") ? "text-stone-300" : "text-[#A9C5A0]"}>
            {log}
          </p>
        ))}
        {lineIndex < logsQueue.length && (
          <p className={logsQueue[lineIndex].startsWith("sahil@") ? "text-stone-300" : "text-[#A9C5A0]"}>
            {currentLine}
            <span className="animate-pulse">_</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    setParallax({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-[#1c1917] text-[#FAF9F6] px-6 py-24 overflow-hidden select-none"
    >
      {/* Dynamic CSS entry transitions and keyframes */}
      <style>{`
        @keyframes draw-path {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: scale(0.95) translateX(50px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.6) rotate(-15deg); }
          to { opacity: 0.85; transform: scale(1) rotate(0deg); }
        }
        .animate-draw-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: draw-path 2s ease-out forwards;
        }
      `}</style>

      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 [background-size:50px_50px] [background-image:linear-gradient(to_right,rgba(250,249,246,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,249,246,0.12)_1px,transparent_1px)]" />

      {/* POPPY DECORATIVE CORNER DOODLES */}
      
      {/* Top-Left Doodle: Popping yellow lightbulb */}
      <div className="absolute left-4 sm:left-12 top-28 pointer-events-none rotate-[-12deg] transition-all duration-300 hover:scale-110 opacity-0 animate-[pop-in_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_0.2s_forwards]">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 50 20 C 35 20, 30 35, 35 50 C 40 60, 43 65, 43 72 L 57 72 C 57 65, 60 60, 65 50 C 70 35, 65 20, 50 20 Z" fill="#F8C537" />
          <path d="M 43 72 L 57 72 M 45 78 L 55 78 M 48 84 L 52 84" />
          <path d="M 50 10 L 50 5 M 20 50 L 15 50 M 80 50 L 85 50" />
        </svg>
      </div>

      {/* Top-Right Doodle: Popping orange coffee mug */}
      <div className="absolute right-4 sm:right-12 top-28 pointer-events-none rotate-[15deg] transition-all duration-300 hover:scale-110 opacity-0 animate-[pop-in_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_0.3s_forwards]">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 30 35 L 70 35 L 66 80 C 65 85, 35 85, 34 80 Z" fill="#F26430" />
          <path d="M 70 45 C 82 45, 82 70, 70 70" />
          <path d="M 40 25 Q 43 15, 40 10 M 50 25 Q 53 15, 50 10" />
        </svg>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Intro text Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-950 uppercase inline-block bg-[#A9C5A0] border-2 border-stone-900 px-3.5 py-1.5 rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
            <FiStar className="w-3.5 h-3.5 inline-block mr-1.5 text-stone-950 stroke-[3]" />
            Creator Details
          </span>
          <h2 className="text-2xl sm:text-4xl font-sans font-black text-[#FAF9F6] tracking-tight leading-tight uppercase">
            "One developer. No office. No investors.
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-stone-950">Just a laptop, and a team that never sleeps.</span>
              <span className="absolute inset-0 bg-[#F8C537] -rotate-1 border-2 border-stone-900 rounded-lg -z-0" />
            </span>"
          </h2>
          <p className="text-xs text-stone-450 leading-relaxed max-w-xl mx-auto font-bold pt-2">
            Aspirant was architected and built solo, using a virtual team of integrated systems and agents acting as collaborators. Here is the operational engine room.
          </p>
        </div>

        {/* Node Graph Grid Layout */}
        <div 
          className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto"
          style={{
            transform: `translate(${parallax.x * 4}px, ${parallax.y * 4}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          
          {/* Left Column: Creator Avatar (4 cols) with entrance slide */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right space-y-6 opacity-0 animate-[slide-in-left_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            
            <div className="relative group">
              {/* Solid yellow offset shadow */}
              <div className="absolute inset-0 bg-[#F8C537] rounded-full translate-x-[5px] translate-y-[5px] border-2 border-stone-900" />
              
              {/* Profile placeholder frame */}
              <div className="relative w-36 h-36 rounded-full bg-[#FAF9F6] border-2 border-stone-900 p-2 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-stone-100 flex flex-col items-center justify-center border-2 border-dashed border-stone-300">
                  <span className="text-3xl">💻</span>
                  <span className="text-[10px] font-mono font-black tracking-wider text-stone-600 uppercase mt-2">[ placeholder ]</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <h3 className="text-lg font-black tracking-wide text-[#FAF9F6] uppercase">Sahil Yadav</h3>
              
              {/* Label Pill */}
              <div className="flex justify-center md:justify-end items-center gap-2">
                <p className="text-[10px] font-mono text-stone-950 font-bold uppercase tracking-wider bg-[#A9C5A0] border-2 border-stone-900 px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  21 Years Old · Solo Creator
                </p>
              </div>

              <p className="text-[10px] text-stone-400 max-w-xs leading-relaxed font-semibold">
                Building client interfaces, prompt flows, and database pipelines.
              </p>

              {/* Sitting dog mascot vector art next to sahil's profile */}
              <div className="absolute left-[-45px] top-[-5px] hidden md:block opacity-90 transition-all hover:scale-110">
                <svg className="w-12 h-12 text-stone-100 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                  <path d="M 40 75 C 38 68, 48 60, 52 64 C 55 66, 58 75, 52 82 L 40 82 Z" fill="#FAF9F6" />
                  <path d="M 52 64 C 54 58, 62 58, 64 64 L 60 70" fill="#FAF9F6" />
                  <circle cx="58" cy="62" r="1" fill="black" stroke="none" />
                  <path d="M 64 60 C 62 55, 56 55, 58 60" fill="#F26430" />
                  <path d="M 42 82 L 40 92 M 48 82 L 46 90 M 55 82 L 58 92" />
                  <path d="M 38 78 C 30 74, 28 77, 32 82" />
                </svg>
              </div>
            </div>
          </div>

          {/* Center Column: SVG Connections (3 cols) with path drawing transition */}
          <div className="hidden md:block md:col-span-3 h-[450px] relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 400" fill="none">
              
              {/* 1. Path to Laptop Node (Top) */}
              <path d="M 0 200 C 90 200, 90 60, 200 60" stroke="#FAF9F6" strokeWidth="2.5" opacity="0.1" />
              <path d="M 0 200 C 90 200, 90 60, 200 60" stroke="#F26430" strokeWidth="2" strokeDasharray="6 6" className="animate-draw-path" />
              <circle r="5" fill="#F8C537" stroke="#1c1917" strokeWidth="1.5">
                <animateMotion path="M 0 200 C 90 200, 90 60, 200 60" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* 2. Path to Antigravity AI Node (Center) */}
              <path d="M 0 200 C 90 200, 90 200, 200 200" stroke="#FAF9F6" strokeWidth="2.5" opacity="0.1" />
              <path d="M 0 200 C 90 200, 90 200, 200 200" stroke="#F8C537" strokeWidth="2" strokeDasharray="6 6" className="animate-draw-path" style={{ animationDelay: '0.2s' }} />
              <circle r="5" fill="#F26430" stroke="#1c1917" strokeWidth="1.5">
                <animateMotion path="M 0 200 C 90 200, 90 200, 200 200" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* 3. Path to RAG Node (Bottom) */}
              <path d="M 0 200 C 90 200, 90 340, 200 340" stroke="#FAF9F6" strokeWidth="2.5" opacity="0.1" />
              <path d="M 0 200 C 90 200, 90 340, 200 340" stroke="#A9C5A0" strokeWidth="2" strokeDasharray="6 6" className="animate-draw-path" style={{ animationDelay: '0.4s' }} />
              <circle r="5" fill="#A9C5A0" stroke="#1c1917" strokeWidth="1.5">
                <animateMotion path="M 0 200 C 90 200, 90 340, 200 340" dur="5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Right Column: Warm Brutalist Cards with sequential delays */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-center h-auto md:h-[450px]">
            
            {/* Card 1: Workstation */}
            <WarmBrutalistCard shadowColor="#F26430" delayClass="[animation-delay:0.1s]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white border-2 border-stone-900 text-stone-950 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <FiMonitor className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">Workstation</h4>
                  <p className="text-[10px] text-stone-600 font-bold leading-relaxed">
                    The machine that never stopped compiling — running local compilation servers and build engines.
                  </p>
                  <TerminalConsole />
                </div>
              </div>
            </WarmBrutalistCard>

            {/* Card 2: AI Co-pilot */}
            <WarmBrutalistCard shadowColor="#F8C537" delayClass="[animation-delay:0.3s]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white border-2 border-stone-900 text-stone-950 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <FiCpu className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">Antigravity (AI)</h4>
                  <p className="text-[10px] text-stone-600 font-bold leading-relaxed">
                    The AI pair-programmer co-pilot that built, debugged, and architected the source codebase.
                  </p>
                </div>
              </div>
            </WarmBrutalistCard>

            {/* Card 3: Context Memory */}
            <WarmBrutalistCard shadowColor="#A9C5A0" delayClass="[animation-delay:0.5s]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white border-2 border-stone-900 text-stone-950 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-950">RAG layer</h4>
                  <p className="text-[10px] text-stone-600 font-bold leading-relaxed">
                    Retrieval-Augmented Generation context layer providing real-time data lookups and memory support.
                  </p>
                </div>
              </div>
            </WarmBrutalistCard>

          </div>

        </div>

      </div>
    </div>
  );
}
