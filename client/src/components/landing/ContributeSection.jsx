import React from 'react';
import { FiGithub, FiCornerDownRight } from 'react-icons/fi';

export default function ContributeSection() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-[#FAF9F6] select-none">

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl text-left">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase inline-block bg-[#FEF5D1] border-2 border-stone-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Open Source Community
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black text-stone-950 tracking-tight leading-[1.1]">
            Build the study operating system.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed font-medium">
            Aspirant is 100% open source. Join developers around the globe in constructing modular tools, local vector pipelines, and customizable note canvases.
          </p>
        </div>

        {/* Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Code/Git Terminal Mockup (6 cols) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-[#18181b] border-2 border-stone-900 rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left font-mono text-[11px] text-stone-400 space-y-4 relative">
              {/* Terminal header controls */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-2 text-stone-500">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#F26430] border border-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-[#F8C537] border border-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-[#A9C5A0] border border-stone-700" />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-stone-500">git-contributions</span>
              </div>

              {/* Console commands */}
              <div className="space-y-2 leading-relaxed">
                <p className="text-stone-300">$ git log --oneline -n 3</p>
                <div className="pl-3 space-y-1 text-stone-500">
                  <p><span className="text-[#A9C5A0]">●</span> <span className="text-stone-300">e0eca79</span> Refactor components to modular scenes</p>
                  <p><span className="text-[#F8C537]">●</span> <span className="text-stone-300">979dcb6</span> Add floating glassmorphic navbar</p>
                  <p><span className="text-[#F26430]">●</span> <span className="text-stone-300">36c3641</span> Enhance 3D notebook coordinates</p>
                </div>
                
                <p className="text-stone-300 pt-2">$ git branch --all</p>
                <div className="pl-3 text-stone-500 font-bold space-y-1">
                  <p className="text-[#A9C5A0]">* main</p>
                  <p className="text-stone-500">  feature/rag-pipeline</p>
                  <p className="text-stone-500">  feature/lofi-audio</p>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3 flex justify-between items-center text-[9px] text-stone-500 uppercase tracking-widest font-bold">
                <span>Branch: main</span>
                <span className="text-[#A9C5A0] animate-pulse">● online sync active</span>
              </div>
            </div>
          </div>

          {/* Right: Description & Contributions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h3 className="text-lg font-sans font-black text-stone-950 border-b-2 border-stone-900 pb-2 uppercase tracking-wider">
              Contribution Logs
            </h3>

            <div className="space-y-4 text-xs text-stone-600 leading-relaxed font-medium">
              <p>
                We believe study software shouldn't track your analytics to sell ads. By making Aspirant open source, self-learners can audit their data privacy, customize RAG prompts, and host local databases.
              </p>
              
              <div className="space-y-3">
                {[
                  'Implement local-first databases to skip Cloudinary queues.',
                  'Write simple CSS-based transition helpers for page wiggles.',
                  'Submit RAG prompt iterations for rate-limit optimizations.'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-stone-50 border border-stone-200 rounded-xl p-3">
                    <FiCornerDownRight className="w-4 h-4 mt-0.5 text-stone-500 flex-shrink-0" />
                    <p className="text-stone-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA GitHub */}
            <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
              <a
                href="https://github.com/aisahilyadav/Aspirant"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
              >
                <FiGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mt-2 sm:mt-3">
                * help us build study tools
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
