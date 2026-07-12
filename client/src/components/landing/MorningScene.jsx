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
        className="absolute inset-0 h-full w-full opacity-80"
      />

      {/* --- BORDER VECTOR ART DOODLES --- */}
      
      {/* 1. Top-Left: Lightbulb (representing active ideas) */}
      <div className="absolute left-3 sm:left-12 top-28 pointer-events-none opacity-20 sm:opacity-60 rotate-[-12deg] transition-all duration-300 hover:opacity-100 hover:scale-110">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 50 20 C 35 20, 30 35, 35 50 C 40 60, 43 65, 43 72 L 57 72 C 57 65, 60 60, 65 50 C 70 35, 65 20, 50 20 Z" fill="#F8C537" />
          <path d="M 43 72 L 57 72 M 45 78 L 55 78 M 48 84 L 52 84" />
          <path d="M 50 10 L 50 5 M 20 50 L 15 50 M 80 50 L 85 50 M 28 28 L 24 24 M 72 28 L 76 24" />
        </svg>
      </div>

      {/* 2. Top-Right: Coffee Mug (representing study focus) */}
      <div className="absolute right-3 sm:right-12 top-28 pointer-events-none opacity-20 sm:opacity-60 rotate-[15deg] transition-all duration-300 hover:opacity-100 hover:scale-110">
        <svg className="w-14 h-14 sm:w-16 sm:h-16 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M 30 35 L 70 35 L 66 80 C 65 85, 35 85, 34 80 Z" fill="#F26430" />
          <path d="M 70 45 C 82 45, 82 70, 70 70" />
          <path d="M 40 25 Q 43 15, 40 10 M 50 25 Q 53 15, 50 10 M 60 25 Q 63 15, 60 10" />
        </svg>
      </div>

      {/* 3. Bottom-Left: Crossed Pencils & Ruler (representing writing/calculating) */}
      <div className="absolute left-2 sm:left-16 bottom-20 pointer-events-none opacity-10 sm:opacity-60 rotate-[20deg] transition-all duration-300 hover:opacity-100 hover:scale-110">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-stone-900 stroke-[2.5]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <g transform="rotate(45 50 50)">
            <rect x="42" y="15" width="16" height="60" rx="3" fill="#8FB7D9" />
            <path d="M 42 15 L 50 5 L 58 15 Z" fill="#FAF9F6" />
            <path d="M 48 5 L 50 2 L 52 5 Z" fill="black" />
          </g>
          <g transform="rotate(-30 50 50)">
            <rect x="45" y="20" width="10" height="55" rx="2" fill="#F8C537" />
            <path d="M 45 20 L 50 10 L 55 20 Z" fill="#FAF9F6" />
          </g>
        </svg>
      </div>

      {/* 4. Bottom-Right: Pointer Doodle Arrow (pointing to active centerpiece) */}
      <div className="absolute right-2 sm:right-20 bottom-24 pointer-events-none opacity-10 sm:opacity-75 rotate-[-5deg]">
        <svg className="w-20 h-20 sm:w-24 sm:h-24 text-stone-900 stroke-[2.5]" viewBox="0 0 120 120" fill="none" stroke="currentColor">
          <path d="M 20 20 Q 50 40, 60 72" />
          <path d="M 48 65 L 60 74 L 59 58" />
          <text x="12" y="12" fill="currentColor" stroke="none" className="font-mono text-[8px] font-black uppercase tracking-widest text-[#F26430]">Draw here!</text>
        </svg>
      </div>

      {/* --- CENTERED HERO CONTENT BLOCK --- */}
      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
        
        {/* Label Tag */}
        <div className="inline-block">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase bg-[#FEF5D1] border-2 border-stone-900 px-3 py-1.5 rounded-lg shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
            AI Study Operating System
          </span>
        </div>

        {/* Main Centered Headline */}
        <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-stone-950 leading-[1.05] uppercase">
            A notebook that 
            <br />
            <span className="relative inline-block mt-2 px-2">
              <span className="relative z-10 text-stone-950">studies with you.</span>
              <span className="absolute inset-0 bg-[#F8C537] -rotate-1 border-2 border-stone-900 rounded-lg -z-0" />
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto font-semibold pt-2">
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

        {/* Centered Stats Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {[
            { icon: <FiUsers className="w-3.5 h-3.5" />, text: '10,000+ Journals Created' },
            { icon: <FiZap className="w-3.5 h-3.5" />, text: 'AI-Powered Quizzes' },
            { icon: <FiBookOpen className="w-3.5 h-3.5" />, text: '100% Free & Open Source' },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-stone-700 uppercase tracking-wider bg-white border border-stone-200 px-3 py-1.5 rounded-full">
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
