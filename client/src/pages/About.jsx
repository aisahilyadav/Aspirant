import React from 'react';
import { FiStar } from 'react-icons/fi';

export default function About() {
  const principles = [
    {
      title: "Self-Paced Focus",
      desc: "True understanding requires uninterrupted focus. We build spaces that eliminate noise and prompt cycles that wait for your click."
    },
    {
      title: "Retrieval First",
      desc: "エンドレス reading creates the illusion of learning. Aspirant prioritizes recall testing, practice exams, and index review loops."
    },
    {
      title: "Local Privacy",
      desc: "Your thoughts and notes belong to you. We store indices and databases locally to respect boundaries and ensure data security."
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAF9F6] text-stone-850 px-6 py-24 overflow-hidden select-none">
      
      {/* Background paper grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Illustration with float animation (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              className="relative w-full max-w-sm aspect-square bg-white border border-stone-200 rounded-3xl p-3 shadow-md group hover:scale-[1.01] transition-transform duration-500"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <img 
                src="/about_philosophy.png" 
                alt="Study Desk Philosophy" 
                className="w-full h-full object-cover rounded-2xl border border-stone-150"
              />
              {/* Overlay sticker decoration */}
              <div className="absolute -bottom-4 -right-4 bg-[#A9C5A0] text-stone-900 border border-stone-400 font-handwritten text-xs py-1.5 px-3 rounded-xl rotate-[4deg] shadow-sm">
                [ organic study desk ]
              </div>
            </div>
          </div>

          {/* Right Column: Mission Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg] flex items-center gap-1.5">
                <FiStar />
                [ our philosophy ]
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
                Pioneering the next gen of learning.
              </h2>
              <p className="text-xs sm:text-sm text-stone-605 leading-relaxed font-sans-inter max-w-xl">
                Aspirant was created by builders who believe studying shouldn't be about compiling long, unread PDFs, but about active recall challenges, smart summarization, and clean feedback logs.
              </p>
            </div>

            {/* Principles list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-stone-200 pt-8">
              {principles.map((pr, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 font-sans-inter">
                    {pr.title}
                  </h4>
                  <p className="text-xs text-stone-550 leading-relaxed font-serif-cormorant">
                    {pr.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
