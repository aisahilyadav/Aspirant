import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiCpu, FiTerminal, FiDatabase } from 'react-icons/fi';

export default function Product() {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-16 font-sans overflow-x-hidden">
      
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-3">
            The Product Ecosystem
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Engineered for <span className="font-serif italic font-normal text-purple-200">Ultimate</span> Recall.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Aspirant is a complete study suite that merges advanced Vector search, active recall practice exams, 
            and rich markdown note editing into a unified browser-based terminal.
          </p>
        </div>

        {/* Product Grid Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 mb-20">
          {/* Module 1: AI Vector Parsing */}
          <div className="p-8 border-r border-b border-white/10 space-y-6 group hover:bg-white/[0.01] transition-colors">
            <div className="text-xs text-purple-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <FiDatabase className="w-3.5 h-3.5" />
              01 / DATA INGESTION
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Vectorized PDF Parsing
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              When you upload a textbook or study guide, our pipeline parses text segments, builds local FAISS vector databases, and prepares them for semantic query matching.
            </p>
          </div>

          {/* Module 2: LLM Generation */}
          <div className="p-8 border-r border-b border-white/10 space-y-6 group hover:bg-white/[0.01] transition-colors">
            <div className="text-xs text-purple-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <FiCpu className="w-3.5 h-3.5" />
              02 / LLM ENGINE
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Gemini RAG Integration
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Using Google's state-of-the-art model series, we construct rate-limit compliant prompts that synthesize accurate study guides and chat responses directly from your sources.
            </p>
          </div>

          {/* Module 3: Active Recall */}
          <div className="p-8 border-r border-b border-white/10 space-y-6 group hover:bg-white/[0.01] transition-colors">
            <div className="text-xs text-purple-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <FiTerminal className="w-3.5 h-3.5" />
              03 / ACTIVE TESTING
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Syllabus-Based Testing
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Convert any paragraph into customized multiple-choice practice questionnaires that give detailed, interactive correct-answer comparisons.
            </p>
          </div>
        </div>

        {/* Feature Rows */}
        <div className="space-y-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 bg-white/[0.01] border border-white/10 rounded-3xl">
            <div>
              <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                Note Interface
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-4 tracking-tight">
                Draft, format, and highlight inside a beautiful live editor canvas.
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Say goodbye to simple text areas. Our editor lets you format H1/H2 tags, set bullet lists, highlight keywords, change colors, and automatically saves every keystroke back to Mongoose in the background.
              </p>
              <ul className="space-y-2">
                {['Keystroke auto-save mechanics', 'Rich toolbar with headers & color pickers', 'Markdown-based RAG outlines'].map((item, i) => (
                  <li key={i} className="flex items-center text-xs font-bold text-gray-300">
                    <FiCheck className="text-purple-400 w-4 h-4 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-gray-500 font-bold font-mono">note_canvas.html</span>
              </div>
              <div className="flex-1 font-mono text-xs text-gray-400 py-4 space-y-2">
                <p className="text-white font-extrabold text-lg">&lt;h1 style="color: purple"&gt;Photosynthesis Study Notes&lt;/h1&gt;</p>
                <p>&lt;p&gt;Active recall questions on Calvin cycle dynamics:&lt;/p&gt;</p>
                <p className="pl-4 text-purple-300">&lt;ul&gt;&lt;li&gt;ATP synthesis ratios&lt;/li&gt;&lt;/ul&gt;</p>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>UTF-8 Encoding</span>
                <span className="text-green-400">● Auto-Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-white/10 rounded-3xl p-10 text-center bg-gradient-to-b from-white/[0.01] to-transparent">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Unlock your full learning potential.
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Ready to explore? Connect your study materials, generate practices, and build active streaks with Aspirant today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-gray-100 transition-colors gap-2 text-xs uppercase tracking-wider"
          >
            Create Your Account
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
