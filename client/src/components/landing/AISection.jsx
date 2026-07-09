import React, { useState, useEffect } from 'react';

export default function AISection() {
  const [linesRevealed, setLinesRevealed] = useState(0);

  // Magic auto-writing line counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLinesRevealed(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Masking tape on top-right */}
      <div className="absolute top-12 right-20 w-24 h-5.5 masking-tape rotate-[2.5deg] opacity-50 border-x border-stone-300/30" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ organic assistant intelligence ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            A Notebook That Writes with You
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg mx-auto font-sans-inter leading-relaxed">
            No robots, no flashing neon lights, no futuristic dashboards. Our AI is integrated directly into the paper: summaries outline themselves and cards fill in automatically.
          </p>
        </div>

        {/* Double-page open notebook spread representing magical AI */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm max-w-3xl mx-auto relative select-none"
          style={{ filter: 'url(#handdrawn)' }}
        >
          
          {/* Seam line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-stone-200 hidden md:block" />
          <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gradient-to-r from-stone-100/10 via-stone-100/30 to-stone-100/10 -translate-x-1.5 hidden md:block" />

          {/* Left Page: Input Material */}
          <div className="p-8 space-y-6 text-left">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-450 border-b border-stone-150 pb-2">
              Raw Syllabus Ingestion
            </h3>

            <div className="space-y-3 font-serif-cormorant text-stone-600 leading-relaxed text-xs">
              <p>
                "The mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. They are referred to as the powerhouse of the cell."
              </p>
              <p className="opacity-50">
                "They also perform tasks such as signaling, cellular differentiation, and cell death, maintaining control of the cell cycle and growth."
              </p>
            </div>

            <div className="pt-4 flex items-center gap-2">
              {/* Handdrawn sparkles SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-stone-400 animate-spin" style={{ animationDuration: '10s' }} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" />
              </svg>
              <span className="font-handwritten text-xs text-stone-400">Summarizing key definitions...</span>
            </div>
          </div>

          {/* Right Page: Magic Self-Writing Summary */}
          <div className="p-8 space-y-6 text-left bg-[#FDFBF6]/30">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-450 border-b border-stone-150 pb-2">
              Auto-Compiled Index
            </h3>

            <div className="space-y-4 font-handwritten text-stone-850 text-base leading-snug">
              <p className={`transition-all duration-700 ${linesRevealed >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                - Mitochondria = cellular powerhouse.
              </p>
              <p className={`transition-all duration-700 ${linesRevealed >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                - Primary job: generate ATP (chemical energy).
              </p>
              <p className={`transition-all duration-700 ${linesRevealed >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                - Secondary: signals, cell cycle control.
              </p>
              <p className={`transition-all duration-700 ${linesRevealed >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                - Auto-created outline card complete.
              </p>
            </div>

            {/* Simulated automatic drawing pencil */}
            <div className="flex justify-end pt-2">
              <span className="font-mono text-[9px] text-stone-400 animate-bounce">pencil writing...</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
