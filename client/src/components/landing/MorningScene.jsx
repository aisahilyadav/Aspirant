import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function MorningScene({ onCtaClick }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Coffee Stain detail */}
      <div className="absolute top-16 left-12 w-28 h-28 coffee-stain rotate-12 pointer-events-none opacity-40">
        <div className="w-full h-full coffee-stain-inner" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Brand Header */}
        <div className="space-y-2 select-none">
          <h2 className="text-stone-400 font-mono text-[10px] font-extrabold uppercase tracking-widest">
            Aspirant study operating system
          </h2>
          <h1 className="text-6xl sm:text-8xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none">
            Aspirant
          </h1>
          <p className="font-handwritten text-lg text-stone-500 max-w-sm mx-auto rotate-[-2deg]">
            a notebook that studies with you.
          </p>
        </div>

        {/* Sleeping Student Doodle Scene */}
        <div className="w-full max-w-md mx-auto aspect-[4/3] bg-white border border-stone-300 rounded-3xl p-6 shadow-sm relative flex flex-col justify-center items-center select-none" style={{ filter: 'url(#handdrawn)' }}>
          
          {/* Masking tape on corner */}
          <div className="absolute top-[-8px] right-8 w-16 h-5 masking-tape rotate-[3deg] border-x border-stone-300/30" />
          
          <svg viewBox="0 0 300 220" className="w-full h-full text-stone-850" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Morning Sun Rays */}
            <path d="M20 20 L40 40 M20 50 L50 50 M20 80 L40 70" stroke="rgba(248, 214, 109, 0.4)" strokeWidth="3" />
            <circle cx="20" cy="50" r="15" fill="rgba(248, 214, 109, 0.15)" stroke="none" />

            {/* Bed outline */}
            <path d="M40 170 L260 170" strokeWidth="3" />
            <path d="M50 170 L50 130 C50 120 70 120 80 130 L80 170" /> {/* Pillow */}
            
            {/* Sleeping student head and body outline */}
            <path d="M80 150 C85 140 100 140 105 150 C110 160 120 160 130 155" /> {/* Blanket ripple */}
            <path d="M90 150 C75 125 90 115 100 125 C105 130 95 145 90 150 Z" fill="rgba(239, 230, 216, 0.4)" /> {/* Face/Head */}
            <circle cx="88" cy="132" r="1.5" fill="currentColor" /> {/* Closed eye */}
            <path d="M85 142 C82 142 82 145 85 145" /> {/* Smile */}
            
            {/* Blanket covering body */}
            <path d="M100 135 L240 135 L250 170 L100 170 Z" fill="rgba(143, 183, 217, 0.1)" />

            {/* Vibrating Alarm Clock */}
            <g className="animate-alarm" style={{ transformOrigin: '240px 125px' }}>
              {/* Clock Circle */}
              <circle cx="240" cy="125" r="12" fill="white" />
              {/* Clock Bells */}
              <path d="M230 115 A 4 4 0 0 1 234 111" />
              <path d="M250 115 A 4 4 0 0 0 246 111" />
              {/* Clock legs */}
              <line x1="232" y1="136" x2="228" y2="142" />
              <line x1="248" y1="136" x2="252" y2="142" />
              {/* Clock hands */}
              <line x1="240" y1="125" x2="240" y2="120" />
              <line x1="240" y1="125" x2="246" y2="125" />
              {/* Ringing waves */}
              <path d="M222 120 C220 123 220 127 222 130" strokeWidth="1" />
              <path d="M258 120 C260 123 260 127 258 130" strokeWidth="1" />
            </g>
            
            {/* Sleeping Cat outline at the foot of bed */}
            <path d="M200 135 C200 125 215 125 220 130 C225 125 235 125 235 135 Z" fill="rgba(169, 197, 160, 0.15)" />
            <text x="215" y="118" className="font-handwritten text-[9px] text-stone-400" stroke="none" fill="currentColor">z</text>
            <text x="223" y="110" className="font-handwritten text-[11px] text-stone-400" stroke="none" fill="currentColor">Z</text>
          </svg>

          {/* Pencil annotation */}
          <span className="font-handwritten text-xs text-stone-450 mt-2 rotate-[1deg]">
            "designed for people who learn alone."
          </span>

        </div>

        {/* CTA Action button */}
        <div className="pt-4">
          <button
            onClick={onCtaClick}
            className="px-8 py-4 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 mx-auto"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <span>Start Your Learning Journey</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
