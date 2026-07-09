import React from 'react';

export default function ProgressScene() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Coffee Stain detail */}
      <div className="absolute bottom-16 right-12 w-24 h-24 coffee-stain rotate-[-15deg] pointer-events-none opacity-30">
        <div className="w-full h-full coffee-stain-inner" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[1deg]">
            [ organic habits log ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            Consistency Without complex Charts
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg mx-auto font-sans-inter leading-relaxed">
            See your learning progress reflected directly on the desk: books stacked, study notes piled, plants growing, and sunset colors in the window.
          </p>
        </div>

        {/* Organized Study Desk Doodle Scene */}
        <div 
          className="w-full max-w-md mx-auto aspect-[4/3] bg-white border border-stone-300 rounded-3xl p-6 shadow-sm relative flex flex-col justify-center items-center select-none"
          style={{ filter: 'url(#handdrawn)' }}
        >
          
          {/* Masking tape on corner */}
          <div className="absolute top-[-8px] left-8 w-16 h-5 masking-tape rotate-[-3deg] border-x border-stone-300/30" />
          
          <svg viewBox="0 0 300 220" className="w-full h-full text-stone-850" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Sunset Window colors */}
            <rect x="210" y="20" width="60" height="90" strokeWidth="2" />
            <polygon points="210,20 270,20 270,110 210,110" fill="rgba(217, 134, 107, 0.15)" stroke="none" />
            
            {/* Desk Surface */}
            <line x1="20" y1="180" x2="280" y2="180" strokeWidth="3" />
            
            {/* Organized Clean Books Stack */}
            <rect x="40" y="168" width="50" height="12" fill="rgba(143, 183, 217, 0.15)" />
            <rect x="43" y="156" width="44" height="12" fill="rgba(169, 197, 160, 0.15)" />
            <rect x="45" y="144" width="40" height="12" fill="rgba(239, 230, 216, 0.3)" />

            {/* Growing plant in pot */}
            <path d="M120 180 L124 162 L136 162 L140 180 Z" fill="rgba(217, 134, 107, 0.1)" />
            {/* Plant stem & leaves */}
            <path d="M130 162 C130 145 125 135 128 125" />
            <path d="M128 145 C120 142 118 135 125 135 C128 135 128 142 128 145 Z" fill="rgba(169, 197, 160, 0.4)" strokeWidth="1" />
            <path d="M130 135 C138 132 140 125 133 125 C130 125 130 132 130 135 Z" fill="rgba(169, 197, 160, 0.4)" strokeWidth="1" />

            {/* Completed Notebook shut flat */}
            <rect x="155" y="172" width="45" height="8" rx="1" fill="rgba(239, 230, 216, 0.3)" />
            <line x1="160" y1="176" x2="195" y2="176" strokeWidth="1" />

            {/* Lined study schedule card on wall with checkmarks */}
            <rect x="135" y="30" width="55" height="70" rx="2" strokeDasharray="2 2" />
            {/* Checked items */}
            <path d="M142 45 L145 48 L150 42" stroke="rgba(169, 197, 160, 0.8)" strokeWidth="1.5" />
            <path d="M142 60 L145 63 L150 57" stroke="rgba(169, 197, 160, 0.8)" strokeWidth="1.5" />
            <path d="M142 75 L145 78 L150 72" stroke="rgba(169, 197, 160, 0.8)" strokeWidth="1.5" />
            
            {/* Tiny calendar sheet filled dots */}
            <circle cx="140" cy="90" r="1.5" fill="rgba(169, 197, 160, 0.8)" />
            <circle cx="146" cy="90" r="1.5" fill="rgba(169, 197, 160, 0.8)" />
            <circle cx="152" cy="90" r="1.5" fill="rgba(169, 197, 160, 0.8)" />

            {/* Cat tail wiggling lazily beside pot */}
            <path d="M96 180 C98 170 108 170 110 180" />
          </svg>

          {/* Pencil annotation */}
          <span className="font-handwritten text-xs text-stone-450 mt-2 rotate-[-1deg]">
            "every study hour makes the plant grow."
          </span>

        </div>

      </div>
    </div>
  );
}
