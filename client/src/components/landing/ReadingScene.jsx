import React, { useState } from 'react';

export default function ReadingScene() {
  const [hoveredPage, setHoveredPage] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Masking tape on top-left */}
      <div className="absolute top-12 left-16 w-20 h-5 masking-tape rotate-[-4deg] opacity-50 border-x border-stone-300/30" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ structured knowledge canvas ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            Write Summaries with Comfort
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Read chapter PDF excerpts on the left, and jot down summaries on the right. Hover the sheet to fold the notebook corner slightly.
          </p>
        </div>

        {/* Notebook spread */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm max-w-3xl mx-auto relative select-none transition-transform duration-500 ${
            hoveredPage ? 'scale-[1.01] rotate-[-0.3deg]' : ''
          }`}
          style={{ filter: 'url(#handdrawn)' }}
          onMouseEnter={() => setHoveredPage(true)}
          onMouseLeave={() => setHoveredPage(false)}
        >
          {/* Seam line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-stone-200 hidden md:block" />
          <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gradient-to-r from-stone-100/10 via-stone-100/30 to-stone-100/10 -translate-x-1.5 hidden md:block" />

          {/* Page corner fold effect top-right */}
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
            <svg viewBox="0 0 30 30" className="w-full h-full text-stone-200" fill="none">
              <path 
                d={hoveredPage ? "M 0,0 L 30,30 L 0,30 Z" : "M 15,0 L 30,15 L 15,15 Z"} 
                fill="rgba(239, 230, 216, 0.4)" 
                stroke="currentColor" 
                strokeWidth="1"
                className="transition-all duration-300"
              />
            </svg>
          </div>

          {/* Left Page: PDF Source text */}
          <div className="p-8 space-y-6 text-left">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-450 border-b border-stone-150 pb-2">
              Source PDF Page 12
            </h3>
            
            <div className="space-y-4 font-serif-cormorant text-stone-700 leading-relaxed text-xs sm:text-sm">
              <p>
                "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy."
              </p>
              <p>
                "The process occurs within cellular organelles known as chloroplasts, which contain chlorophyll pigments that absorb light wavelengths."
              </p>
            </div>
          </div>

          {/* Right Page: Hand-written notes with drawing strokes */}
          <div className="p-8 space-y-6 text-left bg-[#FDFBF6]/30">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-450 border-b border-stone-150 pb-2">
              My Summaries
            </h3>

            <div className="space-y-4 font-handwritten text-stone-850 text-base leading-snug">
              <p className="border-b border-stone-200/60 pb-1 hover:text-stone-950 transition-colors">
                - Photosynthesis = plants absorbing sunlight to chemical energy.
              </p>
              <p className="border-b border-stone-200/60 pb-1 hover:text-stone-950 transition-colors">
                - Happens inside chloroplasts (with chlorophyll pigments).
              </p>
              <p className="border-b border-stone-200/60 pb-1 hover:text-stone-950 transition-colors">
                - Focus recall on Calvin cycle ratios!
              </p>
            </div>
            
            <div className="flex justify-end pt-2">
              <span className="font-mono text-[9px] text-stone-400">Page 1 of 1</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
