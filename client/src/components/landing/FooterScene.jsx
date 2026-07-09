import React from 'react';
import { Link } from 'react-router-dom';

export default function FooterScene({ onReset }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 px-6 transition-colors duration-1000">
      
      {/* Spacer / Content Block */}
      <div className="max-w-4xl w-full text-center space-y-12 mx-auto relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-400 block rotate-[-1deg]">
            [ the day is complete ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-200 tracking-tight leading-tight">
            Rest Well. Start Fresh Tomorrow.
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Close the study journal. Let the brain solidify what you learned today. Aspirant tracks your consistency and waits for your next study day.
          </p>
        </div>

        {/* Closed Notebook and Sleep Cat Scene */}
        <div 
          className="w-full max-w-md mx-auto aspect-[4/3] bg-stone-900 border border-stone-800 rounded-3xl p-6 relative flex flex-col justify-center items-center select-none"
          style={{ filter: 'url(#handdrawn)' }}
        >
          {/* Masking tape on corner */}
          <div className="absolute top-[-8px] right-8 w-16 h-5 bg-stone-850/60 rotate-[2deg] border-x border-stone-700/30" />
          
          <svg viewBox="0 0 300 220" className="w-full h-full text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Night Moon and Stars */}
            <path d="M40 50 a15 15 0 0 1 15 15 a17 17 0 0 0 -13 -15" fill="currentColor" stroke="none" />
            <circle cx="80" cy="40" r="1" fill="currentColor" stroke="none" />
            <circle cx="100" cy="55" r="1.5" fill="currentColor" stroke="none" />

            {/* Closed Study Journal flat on desk */}
            <rect x="90" y="110" width="120" height="85" rx="4" fill="rgba(239, 230, 216, 0.08)" />
            {/* Journal cover details */}
            <path d="M120 110 L120 195" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="135" y="152" className="font-serif-cormorant text-[14px] text-stone-300 font-bold" stroke="none" fill="currentColor">ASPIRANT</text>
            <text x="135" y="165" className="font-handwritten text-[10px] text-stone-500" stroke="none" fill="currentColor">day completed</text>

            {/* Sleeping cat outline stretched on top of closed book */}
            <path d="M130 110 C140 100 160 100 165 110 Z" fill="rgba(169, 197, 160, 0.15)" />
            
            {/* Lamp turned off base outline */}
            <path d="M240 195 L240 140 M230 195 L250 195 M230 140 L250 140" stroke="rgba(255, 255, 255, 0.1)" />
          </svg>

          {/* Pencil annotation */}
          <span className="font-handwritten text-xs text-stone-500 mt-2 rotate-[-1deg]">
            "consistency leads to mastery."
          </span>

        </div>

        {/* Reset / Go back to top CTA */}
        <div className="pt-4">
          <button
            onClick={onReset}
            className="px-6 py-2.5 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Flipped back to Morning
          </button>
        </div>

      </div>

      {/* Cozy Footer Block */}
      <footer className="w-full max-w-5xl mx-auto border-t border-stone-850 pt-10 mt-12 text-stone-500 font-sans-inter">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-lg font-serif-cormorant font-bold text-stone-200">
              Aspirant
            </span>
            <p className="font-handwritten text-stone-500 text-sm italic block">
              "Live as if you were to die tomorrow. Learn as if you were to live forever."
            </p>
          </div>

          {/* Footer menu links */}
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-stone-400">
            <a href="#morning" className="hover:text-white transition-colors">Home</a>
            <a href="#desk" className="hover:text-white transition-colors">Story</a>
            <a href="#planner" className="hover:text-white transition-colors">Features</a>
            <a href="#notes" className="hover:text-white transition-colors">Philosophy</a>
            <a href="#ending" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-stone-600">
          <p>© {new Date().getFullYear()} Aspirant study system. All rights reserved.</p>
          
          {/* Lofi text indicator */}
          <div className="flex items-center gap-2 text-stone-500 font-mono text-[9px] uppercase tracking-widest select-none">
            <span>[ lofi journal ]</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
