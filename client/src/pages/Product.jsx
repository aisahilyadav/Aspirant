import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiCpu, FiTerminal, FiDatabase } from 'react-icons/fi';

export default function Product() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-850 pt-24 pb-16 font-sans overflow-x-hidden relative">
      
      {/* SVG Handdrawn Rough Line Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background paper grid dots */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-stone-200 pb-12 mb-16">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg]">
            [ the study journal ecosystem ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
            Engineered for <span className="underline decoration-stone-400 decoration-wavy decoration-2">Active Recall</span>.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            Aspirant is a complete study journal that merges vector text search, active recall exam generators, and distraction-free note editing.
          </p>
        </div>

        {/* Product Grid Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-stone-300 rounded-2xl bg-white shadow-sm overflow-hidden mb-20" style={{ filter: 'url(#handdrawn)' }}>
          {/* Module 1: AI Vector Ingestion */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-stone-300 space-y-6 hover:bg-stone-50/50 transition-colors">
            <div className="text-[10px] text-stone-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <FiDatabase className="w-3.5 h-3.5 text-stone-400" />
              01 / DATA INGESTION
            </div>
            <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
              Vectorized PDF Parsing
            </h3>
            <p className="text-xs text-stone-605 leading-relaxed">
              When you upload a textbook, our pipeline parses text segments, builds local vector databases, and prepares them for semantic query matching.
            </p>
          </div>

          {/* Module 2: LLM Engine */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-stone-300 space-y-6 hover:bg-stone-50/50 transition-colors">
            <div className="text-[10px] text-stone-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <FiCpu className="w-3.5 h-3.5 text-stone-400" />
              02 / LLM ENGINE
            </div>
            <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
              Gemini RAG Integration
            </h3>
            <p className="text-xs text-stone-605 leading-relaxed">
              Using Google's generative models, we construct prompts that synthesize accurate study guides and chat responses directly from your sources.
            </p>
          </div>

          {/* Module 3: Active recall testing */}
          <div className="p-8 space-y-6 hover:bg-stone-50/50 transition-colors">
            <div className="text-[10px] text-stone-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <FiTerminal className="w-3.5 h-3.5 text-stone-400" />
              03 / ACTIVE TESTING
            </div>
            <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wide">
              Syllabus-Based Testing
            </h3>
            <p className="text-xs text-stone-605 leading-relaxed">
              Convert any paragraph into customized multiple-choice practice questionnaires that give detailed, interactive correct-answer comparisons.
            </p>
          </div>
        </div>

        {/* Feature Rows */}
        <div className="space-y-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-8 bg-white border border-stone-300 rounded-3xl" style={{ filter: 'url(#handdrawn)' }}>
            <div className="lg:col-span-7 space-y-6">
              <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-300/60 text-stone-600 text-[10px] font-mono uppercase tracking-wider">
                Note Interface
              </span>
              <h3 className="text-2xl font-serif-book font-extrabold text-stone-900 leading-tight">
                Draft, format, and highlight inside a beautiful live editor canvas.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Our editor lets you format H1/H2 tags, set bullet lists, highlight keywords, change colors, and automatically saves every keystroke back to Mongoose in the background.
              </p>
              <ul className="space-y-3 font-serif-book">
                {[
                  'Keystroke auto-save mechanics',
                  'Rich toolbar with headers & color pickers',
                  'Markdown-based RAG outlines'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-xs font-bold text-stone-700">
                    <FiCheck className="text-stone-500 w-4 h-4 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Lined index card preview */}
            <div className="lg:col-span-5 aspect-[4/3] bg-stone-50 border border-stone-300 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative">
              {/* Ruled lines inside the card preview */}
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none rounded-2xl" 
                style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                  backgroundSize: '100% 20px',
                  backgroundPosition: '0 8px'
                }}
              />
              <div className="relative z-10 flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                </div>
                <span className="text-[10px] text-stone-400 font-mono">note_canvas.html</span>
              </div>
              <div className="relative z-10 flex-1 font-mono text-[11px] text-stone-600 py-4 space-y-2">
                <p className="text-stone-900 font-bold text-base">&lt;h1&gt;Photosynthesis Notes&lt;/h1&gt;</p>
                <p>&lt;p&gt;Active recall questions on Calvin cycle:&lt;/p&gt;</p>
                <p className="pl-4 text-stone-450">&lt;ul&gt;&lt;li&gt;ATP synthesis ratios&lt;/li&gt;&lt;/ul&gt;</p>
              </div>
              <div className="relative z-10 border-t border-stone-200 pt-3 flex justify-between items-center text-[9px] text-stone-400 font-mono">
                <span>UTF-8 Encoding</span>
                <span className="text-stone-600">● Auto-Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-stone-300 rounded-3xl p-10 text-center bg-white" style={{ filter: 'url(#handdrawn)' }}>
          <h2 className="text-2xl font-serif-book font-extrabold text-stone-950 mb-3">
            Unlock your full learning potential.
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
            Ready to explore? Connect your study materials, generate practices, and build active streaks with Aspirant today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-stone-850 text-white font-extrabold rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 gap-2 text-xs uppercase tracking-wider shadow-sm"
          >
            Create Your Account
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
