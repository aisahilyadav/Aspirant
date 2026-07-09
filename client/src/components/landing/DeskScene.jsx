import React, { useState } from 'react';

export default function DeskScene() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Pencil Smudge decoration */}
      <div className="absolute top-1/4 right-1/4 w-40 h-20 pencil-smudge pointer-events-none opacity-50" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header explanation */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1.5deg]">
            [ interactive study workspace ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            Sit Down, Grab a Coffee & Start Study
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Hover over elements on the study desk to see the notebook journal come alive. Play with the coffee cup, desk lamp, book pile, window, and companion cat.
          </p>
        </div>

        {/* The Desk Drawing Container */}
        <div 
          className="w-full max-w-xl mx-auto bg-white border border-stone-300 rounded-3xl p-6 shadow-sm relative flex flex-col items-center select-none"
          style={{ filter: 'url(#handdrawn)' }}
        >
          {/* Notebook coil rings on left side representing journal sheets */}
          <div className="absolute left-[-8px] top-12 bottom-12 flex flex-col justify-between pointer-events-none z-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-5 h-3.5 border-2 border-stone-400 bg-stone-100 rounded-full" />
            ))}
          </div>

          <div className="relative w-full h-80 flex items-center justify-center pt-4">
            <svg viewBox="0 0 400 300" className="w-full h-full text-stone-850" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              
              {/* Desk Wood Line */}
              <line x1="20" y1="260" x2="380" y2="260" strokeWidth="3" />
              
              {/* 1. Window & Cloud (Hover Window) */}
              <g 
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredItem('window')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <rect x="290" y="30" width="70" height="100" strokeWidth="2" />
                <line x1="325" y1="30" x2="325" y2="130" strokeWidth="1.5" />
                <line x1="290" y1="80" x2="360" y2="80" strokeWidth="1.5" />
                {/* Floating cloud path */}
                <path 
                  d="M305 55 C305 50 315 50 320 53 C325 50 335 50 335 55 Z" 
                  fill="rgba(143, 183, 217, 0.15)"
                  className={hoveredItem === 'window' ? 'animate-cloud' : ''}
                />
              </g>

              {/* 2. Desk Lamp (Hover Lamp) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem('lamp')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <path d="M50 260 L50 160 L80 180" />
                <path d="M40 260 L60 260" />
                <path d="M70 180 a10 10 0 0 1 20 -5" />
                {/* Lamp glow beam */}
                {hoveredItem === 'lamp' ? (
                  <>
                    <polygon points="80,185 190,260 100,260" fill="rgba(248, 214, 109, 0.22)" stroke="none" />
                    <circle cx="80" cy="180" r="4" fill="rgb(248, 214, 109)" stroke="none" />
                  </>
                ) : (
                  <circle cx="80" cy="180" r="2" fill="none" />
                )}
              </g>

              {/* 3. Coffee Mug (Hover Coffee) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem('coffee')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <path d="M100 260 L100 240 L120 240 L120 260 Z" fill={hoveredItem === 'coffee' ? 'rgba(217, 134, 107, 0.1)' : 'none'} />
                <path d="M120 245 C125 245 125 255 120 255" />
                {/* Steam paths */}
                {hoveredItem === 'coffee' && (
                  <>
                    <path d="M105 233 C105 228 108 228 108 223" strokeWidth="1" className="animate-steam" />
                    <path d="M112 235 C112 230 115 230 115 225" strokeWidth="1" className="animate-steam" />
                  </>
                )}
              </g>

              {/* 4. Open Notebook (Hover Notebook) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem('notebook')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <path d="M140 260 L150 225 L210 225 L200 260 Z" fill={hoveredItem === 'notebook' ? 'rgba(239, 230, 216, 0.4)' : 'none'} />
                <line x1="155" y1="235" x2="200" y2="235" strokeWidth="1" />
                <line x1="152" y1="245" x2="192" y2="245" strokeWidth="1" />
                <line x1="150" y1="253" x2="185" y2="253" strokeWidth="1" />
                {/* Simulated flipping page curve */}
                {hoveredItem === 'notebook' && (
                  <path d="M200 260 C190 250 185 230 210 225" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5" />
                )}
              </g>

              {/* 5. Companion Cat (Hover Cat) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem('cat')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Sleeping body */}
                <path d="M300 260 C300 248 318 248 322 252 C326 248 338 248 338 260 Z" fill="rgba(169, 197, 160, 0.2)" />
                {/* Tail wiggle */}
                <path 
                  d="M338 256 C342 256 345 258 344 262" 
                  className={hoveredItem === 'cat' ? 'animate-tail' : ''} 
                  style={{ transformOrigin: '338px 256px' }}
                />
                <circle cx="308" cy="254" r="1" fill="currentColor" />
              </g>

              {/* 6. Bookshelf / Stack of Books (Hover Books) */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem('books')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Bottom book */}
                <rect x="220" y="248" width="60" height="12" fill={hoveredItem === 'books' ? 'rgba(143, 183, 217, 0.1)' : 'none'} />
                {/* Top book pulled out slightly if hovered */}
                <rect 
                  x={hoveredItem === 'books' ? "215" : "225"} 
                  y="236" 
                  width="50" 
                  height="12" 
                  fill={hoveredItem === 'books' ? 'rgba(217, 134, 107, 0.15)' : 'none'}
                  className="transition-all duration-300"
                />
              </g>

            </svg>
          </div>

          {/* Prompt status tag */}
          <div className="font-handwritten text-xs text-stone-500 tracking-wider">
            {hoveredItem === 'coffee' && "Hot espresso steam triggers comfort..."}
            {hoveredItem === 'lamp' && "Lamp rays focus active recall..."}
            {hoveredItem === 'notebook' && "Flipping pages of your journal..."}
            {hoveredItem === 'cat' && "Companion cat wiggles tail..."}
            {hoveredItem === 'books' && "Pulling reference outlines..."}
            {hoveredItem === 'window' && "Day clouds float in window sky..."}
            {!hoveredItem && "Hover elements to activate lofi doodles."}
          </div>

        </div>

      </div>
    </div>
  );
}
