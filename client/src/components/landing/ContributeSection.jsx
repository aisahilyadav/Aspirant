import React from 'react';
import { FiGithub, FiCornerDownRight, FiGitPullRequest, FiTerminal } from 'react-icons/fi';

export default function ContributeSection() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 transition-colors duration-1000 select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] paper-grid" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl text-left">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ open source community ]
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-[1.1]">
            Build the study operating system.
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg font-sans-inter leading-relaxed">
            Aspirant is 100% open source. Join developers around the globe in constructing modular tools, local vector pipelines, and customizable note canvases.
          </p>
        </div>

        {/* Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Code/Git Terminal Mockup (6 cols) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div 
              className="w-full max-w-md bg-[#18181b] border border-stone-850 rounded-2xl p-5 shadow-lg text-left font-mono text-[11px] text-stone-400 space-y-4 relative"
              style={{ filter: 'url(#handdrawn)' }}
            >
              {/* Terminal header controls */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-2 text-stone-500">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold">git-contributions</span>
              </div>

              {/* Console commands & tree diagram */}
              <div className="space-y-2 leading-relaxed">
                <p className="text-stone-300">$ git log --oneline -n 3</p>
                <div className="pl-3 space-y-1 text-stone-500">
                  <p><span className="text-stone-300">● e0eca79</span> Refactor components to modular scenes</p>
                  <p><span className="text-stone-300">● 979dcb6</span> Add floating glassmorphic navbar</p>
                  <p><span className="text-stone-300">● 36c3641</span> Enhance 3D notebook coordinates</p>
                </div>
                
                <p className="text-stone-300 pt-2">$ git branch --all</p>
                <div className="pl-3 text-stone-500 font-bold space-y-1">
                  <p className="text-stone-300">* main</p>
                  <p className="text-stone-500">  feature/rag-pipeline</p>
                  <p className="text-stone-500">  feature/lofi-audio</p>
                </div>
              </div>

              <div className="border-t border-stone-800 pt-3 flex justify-between items-center text-[9px] text-stone-500 uppercase tracking-widest font-bold">
                <span>Branch: main</span>
                <span className="text-stone-300 animate-pulse">● online sync active</span>
              </div>

            </div>
          </div>

          {/* Right: Description & Contributions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h3 className="text-xl font-serif-cormorant font-bold text-stone-900 border-b border-stone-200 pb-2 uppercase tracking-wider">
              Contribution Logs
            </h3>

            <div className="space-y-4 font-sans-inter text-xs text-stone-605 leading-relaxed">
              <p>
                We believe study software shouldn't track your analytics to sell ads. By making Aspirant open source, self-learners can audit their data privacy, customize RAG prompts, and host local databases.
              </p>
              
              <div className="space-y-2.5 font-serif-cormorant italic text-stone-700">
                <div className="flex items-start gap-1">
                  <FiCornerDownRight className="w-4 h-4 mt-0.5 text-stone-400 flex-shrink-0" />
                  <p>Implement local-first databases to skip Cloudinary queues.</p>
                </div>
                <div className="flex items-start gap-1">
                  <FiCornerDownRight className="w-4 h-4 mt-0.5 text-stone-400 flex-shrink-0" />
                  <p>Write simple CSS-based transition helpers for page wiggles.</p>
                </div>
                <div className="flex items-start gap-1">
                  <FiCornerDownRight className="w-4 h-4 mt-0.5 text-stone-400 flex-shrink-0" />
                  <p>Submit RAG prompt iterations for rate-limit optimizations.</p>
                </div>
              </div>
            </div>

            {/* CTA GitHub */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://github.com/aisahilyadav/Aspirant"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <FiGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <span className="font-handwritten text-xs text-stone-500 font-bold">
                * Help us build lofi study
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
