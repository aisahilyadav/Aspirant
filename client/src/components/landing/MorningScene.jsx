import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiBookOpen, FiUsers } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import { InteractiveGridPattern } from '../ui/interactive-grid-pattern';
import Interactive3DModel from './Interactive3DModel';

export default function MorningScene({ onCtaClick }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-6 bg-[#FAF9F6] text-stone-900 overflow-hidden select-none">
      
      {/* Background Interactive Grid Pattern */}
      <InteractiveGridPattern
        className="absolute inset-0 h-full w-full opacity-90"
      />

      {/* --- POPPY BORDER VECTOR ART DOODLES --- */}
      
      {/* 1. Top-Left: Lightbulb (representing active ideas) */}
      <div className="absolute left-3 sm:left-12 top-28 pointer-events-none opacity-20 sm:opacity-85 rotate-[-12deg] transition-all duration-300 hover:opacity-100 hover:scale-110">
        <svg className="w-14 h-14 sm:w-17 sm:h-17 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 50 20 C 35 20, 30 35, 35 50 C 40 60, 43 65, 43 72 L 57 72 C 57 65, 60 60, 65 50 C 70 35, 65 20, 50 20 Z" fill="#F8C537" />
          <path d="M 43 72 L 57 72 M 45 78 L 55 78 M 48 84 L 52 84" />
          <path d="M 50 10 L 50 5 M 20 50 L 15 50 M 80 50 L 85 50 M 28 28 L 24 24 M 72 28 L 76 24" />
        </svg>
      </div>

      {/* 2. Top-Right: Coffee Mug (representing study focus) */}
      <div className="absolute right-3 sm:right-12 top-28 pointer-events-none opacity-20 sm:opacity-85 rotate-[15deg] transition-all duration-300 hover:opacity-100 hover:scale-110">
        <svg className="w-14 h-14 sm:w-17 sm:h-17 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 30 35 L 70 35 L 66 80 C 65 85, 35 85, 34 80 Z" fill="#F26430" />
          <path d="M 70 45 C 82 45, 82 70, 70 70" />
          <path d="M 40 25 Q 43 15, 40 10 M 50 25 Q 53 15, 50 10 M 60 25 Q 63 15, 60 10" />
        </svg>
      </div>

      {/* 3. Bottom-Left: Boy & Dog Lying on Sofa (Cozy studying illustration) */}
      <div className="absolute left-2 sm:left-10 bottom-16 pointer-events-none opacity-20 sm:opacity-90 rotate-[-4deg] transition-all duration-300 hover:opacity-100 hover:scale-105">
        <svg className="w-28 h-20 sm:w-40 sm:h-28 text-stone-900 stroke-[2.2]" viewBox="0 0 160 100" fill="none" stroke="currentColor">
          <path d="M 20 65 L 140 65 L 140 80 L 20 80 Z" fill="#F8C537" /> {/* Yellow sofa cushion */}
          <path d="M 15 50 Q 15 80, 20 80 M 145 50 Q 145 80, 140 80" /> {/* Armrests */}
          <path d="M 15 50 C 15 45, 30 40, 45 42 L 115 42 C 130 40, 145 45, 145 50" /> {/* Backrest */}
          <path d="M 20 80 L 25 90 M 140 80 L 135 90" strokeWidth="3" /> {/* Legs */}
          <path d="M 25 55 C 22 55, 22 65, 35 63 C 38 63, 38 57, 25 55 Z" fill="white" /> {/* Pillow */}
          <circle cx="38" cy="52" r="6" fill="white" /> {/* Boy Head */}
          <path d="M 38 52 C 34 50, 34 45, 42 46" />
          <path d="M 44 54 C 50 50, 80 50, 95 62" strokeWidth="3" fill="none" /> {/* Body */}
          <path d="M 95 62 L 110 58 L 125 65" strokeWidth="2.5" /> {/* Legs */}
          <path d="M 46 58 L 60 52 L 64 56" />
          <path d="M 58 50 L 70 50 C 72 45, 66 45, 58 50" fill="white" strokeWidth="1.5" /> {/* Book */}
          <path d="M 112 65 C 108 55, 128 55, 132 65 Z" fill="#F26430" /> {/* Dog curled up */}
          <circle cx="128" cy="62" r="1.2" fill="black" />
          <path d="M 130 58 C 127 54, 123 54, 125 58" fill="#FAF9F6" />
        </svg>
      </div>

      {/* 4. Bottom-Right: Pointer Doodle Arrow (pointing to centerpiece notepad) */}
      <div className="absolute right-2 sm:right-20 bottom-24 pointer-events-none opacity-10 sm:opacity-90 rotate-[-5deg]">
        <svg className="w-20 h-20 sm:w-24 sm:h-24 text-stone-900 stroke-[2.5]" viewBox="0 0 120 120" fill="none" stroke="currentColor">
          <path d="M 20 20 Q 50 40, 60 72" />
          <path d="M 48 65 L 60 74 L 59 58" />
          <text x="12" y="12" fill="currentColor" stroke="none" className="font-mono text-[8px] font-black uppercase tracking-widest text-[#F26430]">Draw here!</text>
        </svg>
      </div>

      {/* --- CENTERED HERO CONTENT BLOCK --- */}
      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
        
        {/* Popping Label Tag */}
        <div className="inline-block">
          <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase bg-[#F26430] border-2 border-stone-900 px-4 py-1.5 rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
            AI Study Operating System
          </span>
        </div>

        {/* Main Centered Headline with Poppy highlights */}
        <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-stone-950 leading-[1.05] uppercase">
            <span className="text-[#F26430]">A notebook</span> that 
            <br />
            <span className="relative inline-block mt-2 px-3">
              <span className="relative z-10 text-stone-950">studies with you.</span>
              <span className="absolute inset-0 bg-[#F8C537] -rotate-1 border-2 border-stone-900 rounded-lg -z-0" />
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-stone-605 leading-relaxed max-w-xl mx-auto font-bold pt-2">
            Plan your learning roadmap, organize personal knowledge, generate practice exams with AI, and stay consistent — all within a clean, minimal study workspace.
          </p>
        </div>

        {/* Centered CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-7 py-3.5 bg-stone-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
          >
            <span>Start Learning Free</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onCtaClick}
            className="px-7 py-3.5 bg-white text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Explore Features
          </button>
        </div>

        {/* Popping Centered Stats Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {[
            { icon: <FiUsers className="w-3.5 h-3.5 text-stone-950" />, text: '10,000+ Journals Created', color: 'bg-[#dbe4ff]' },
            { icon: <FiZap className="w-3.5 h-3.5 text-stone-950" />, text: 'AI-Powered Quizzes', color: 'bg-[#FFE066]' },
            { icon: <FiBookOpen className="w-3.5 h-3.5 text-stone-950" />, text: '100% Free & Open Source', color: 'bg-[#d3ffd0]' },
          ].map((stat, idx) => (
            <div key={idx} className={cn(
              "flex items-center gap-1.5 text-[10px] font-mono font-black text-stone-950 uppercase tracking-wider border-2 border-stone-900 px-3.5 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]",
              stat.color
            )}>
              {stat.icon}
              <span>{stat.text}</span>
            </div>
          ))}
        </div>

        {/* Centered Centerpiece 3D Interactive Notepad */}
        <div className="w-full max-w-2xl bg-stone-900 border-2 border-stone-900 rounded-3xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 mt-6 relative z-25">
          <Interactive3DModel />
        </div>

      </div>
    </div>
  );
}
