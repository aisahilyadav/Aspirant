import React from 'react';
import { FiBookOpen, FiEdit3, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { DraggableCardBody, DraggableCardContainer } from '../ui/draggable-card';
import { TextGenerateEffect } from '../ui/text-generate-effect';

export default function FeaturesSection() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-[#FAF9F6] select-none overflow-hidden">
      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-12">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase inline-block bg-[#A9C5A0] border-2 border-stone-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            System Utilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black text-stone-950 tracking-tight leading-[1.1]">
            A Distraction-Free Study System
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed font-medium">
            Grab, throw, and organize the interactive card panels below to tidy up your study workspace.
          </p>
        </div>

        {/* Floating cards playground */}
        <div className="w-full flex justify-center items-center min-h-[950px] md:min-h-[600px]">
          <DraggableCardContainer className="relative w-full h-[900px] md:h-[550px] overflow-visible">
            
            {/* Card 1: Interactive AI Quiz (Wide, Top) */}
            <DraggableCardBody
              className="absolute left-[3%] md:left-[6%] top-[2%] md:top-[4%] w-full max-w-[420px] sm:max-w-[480px] h-[260px] sm:h-[240px] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl bg-[#dbe4ff] [background-size:20px_20px] [background-image:linear-gradient(to_right,rgba(28,25,23,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.06)_1px,transparent_1px)] p-5 flex flex-col justify-between transition-shadow duration-300 cursor-grab active:cursor-grabbing"
            >
              <div className="grid grid-cols-12 gap-3 h-full items-stretch">
                
                {/* Left Side: Title & Mascot */}
                <div className="col-span-7 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 bg-white border-2 border-stone-900 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <FiBookOpen className="w-3 h-3 text-stone-950" />
                      <span>Utility 1</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-stone-950 uppercase tracking-tight leading-tight">
                      Interactive AI Quiz
                    </h3>
                  </div>

                  {/* Running Mascot SVG */}
                  <svg className="w-32 h-20 text-stone-950" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 40 45 C 50 35, 90 35, 100 45 C 110 50, 115 65, 100 70 L 50 70 C 35 65, 30 50, 40 45 Z" fill="white" />
                    <path d="M 100 45 C 105 35, 120 35, 125 45 C 130 50, 125 60, 115 60" fill="white" />
                    <path d="M 112 40 C 110 30, 102 32, 105 42" fill="white" />
                    <circle cx="118" cy="46" r="1.5" fill="black" />
                    <path d="M 125 47 L 128 47" />
                    <path d="M 48 70 L 38 85 M 58 70 L 52 82 M 90 70 L 98 86 M 100 70 L 108 82" />
                    <path d="M 40 50 C 30 42, 28 48, 35 55" />
                    <path d="M 10 90 L 150 90" />
                    <path d="M 20 90 L 22 84 M 25 90 L 28 85 M 130 90 L 133 82" />
                  </svg>
                </div>

                {/* Right Side: Description & Button */}
                <div className="col-span-5 flex flex-col justify-between items-start text-left pl-2 border-l border-stone-900/10">
                  <TextGenerateEffect 
                    words="Auto-generate practice recall exams from textbook chapters or custom topic descriptions. Grades answers instantly with comparisons." 
                    className="text-[10px] text-stone-700 leading-relaxed font-semibold" 
                  />
                  <button className="px-3 py-1.5 bg-stone-900 text-white font-mono text-[8px] font-black uppercase tracking-wider rounded-lg border-2 border-stone-950 shadow-[2px_2px_0px_0px_#F8C537] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all mt-2">
                    Try for free →
                  </button>
                </div>

              </div>
            </DraggableCardBody>

            {/* Card 2: Rich Notes Canvas (Tall, Middle-Right) */}
            <DraggableCardBody
              className="absolute left-[8%] md:left-[54%] top-[30%] md:top-[1%] w-full max-w-[280px] h-[340px] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl bg-gradient-to-b from-[#4fa8ff] to-[#b3dbff] p-5 flex flex-col justify-between transition-shadow duration-300 cursor-grab active:cursor-grabbing"
            >
              {/* Top drifting clouds illustration */}
              <div className="w-full opacity-90">
                <svg className="w-full h-16 text-white" viewBox="0 0 200 80" fill="currentColor">
                  <path d="M 20 60 C 20 50, 30 40, 45 40 C 50 30, 70 30, 78 38 C 85 30, 105 30, 110 42 C 120 42, 125 50, 125 60 Z" opacity="0.9" />
                  <path d="M 100 50 C 100 42, 108 35, 120 35 C 125 25, 140 25, 148 32 C 155 25, 170 25, 175 35 C 182 35, 186 42, 186 50 Z" opacity="0.75" />
                </svg>
              </div>

              {/* Bottom text */}
              <div className="space-y-3 text-left">
                <div className="inline-flex items-center gap-1 bg-white border-2 border-stone-900 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <FiEdit3 className="w-3 h-3 text-stone-950" />
                  <span>Utility 2</span>
                </div>
                <h3 className="text-sm font-black text-stone-950 uppercase tracking-tight leading-tight">
                  Rich Notes Canvas
                </h3>
                <TextGenerateEffect 
                  words="Draft study summaries inside a live editor with headings, bullet lists, color highlights, and automatic keystroke background saves." 
                  className="text-[10px] text-stone-800 leading-relaxed font-semibold" 
                />
              </div>
            </DraggableCardBody>

            {/* Card 3: Schedule & Timetable (Tall, Bottom-Left) */}
            <DraggableCardBody
              className="absolute left-[12%] md:left-[10%] top-[60%] md:top-[30%] w-full max-w-[280px] h-[340px] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl bg-[#FFE066] [background-size:20px_20px] [background-image:linear-gradient(to_right,rgba(28,25,23,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.08)_1px,transparent_1px)] p-5 flex flex-col justify-between transition-shadow duration-300 cursor-grab active:cursor-grabbing"
            >
              {/* Top Text content */}
              <div className="space-y-3 text-left">
                <div className="inline-flex items-center gap-1 bg-white border-2 border-stone-900 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <FiCalendar className="w-3 h-3 text-stone-950" />
                  <span>Utility 3</span>
                </div>
                <h3 className="text-sm font-black text-stone-950 uppercase tracking-tight leading-tight">
                  Personalized Schedule
                </h3>
                <TextGenerateEffect 
                  words="Plan your weekly study objectives on clean checklists and track tasks along calendar grid views." 
                  className="text-[10px] text-stone-700 leading-relaxed font-semibold" 
                />
              </div>

              {/* Bottom walking student SVG */}
              <div className="flex justify-end">
                <svg className="w-28 h-24 text-stone-950" viewBox="0 0 140 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 40 95 L 55 60 M 70 95 L 60 60" strokeWidth="3.5" />
                  <path d="M 58 60 L 58 40" strokeWidth="3.5" />
                  <circle cx="58" cy="28" r="8" fill="white" />
                  <path d="M 58 43 L 45 55 L 50 65" />
                  <path d="M 90 75 C 95 68, 115 68, 120 75 C 125 78, 128 85, 120 88 L 95 88 Z" fill="white" />
                  <path d="M 120 75 C 122 70, 128 70, 130 75 L 126 82" fill="white" />
                  <path d="M 93 88 L 90 98 M 99 88 L 97 96 M 112 88 L 115 98 M 118 88 L 121 96" />
                  <path d="M 90 78 C 82 72, 80 75, 84 82" />
                  <path d="M 10 105 L 130 105" />
                </svg>
              </div>
            </DraggableCardBody>

            {/* Card 4: Chat with PDF (RAG) (Wide, Bottom-Right) */}
            <DraggableCardBody
              className="absolute left-[6%] md:left-[43%] top-[82%] md:top-[38%] w-full max-w-[420px] sm:max-w-[500px] h-[260px] sm:h-[240px] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl bg-[#d3ffd0] [background-size:20px_20px] [background-image:linear-gradient(to_right,rgba(28,25,23,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.07)_1px,transparent_1px)] p-5 flex flex-col justify-between transition-shadow duration-300 cursor-grab active:cursor-grabbing"
            >
              <div className="grid grid-cols-12 gap-3 h-full items-stretch">
                
                {/* Left Side: Title & Description */}
                <div className="col-span-7 flex flex-col justify-between items-start text-left pr-2 border-r border-stone-900/10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 bg-white border-2 border-stone-900 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <FiMessageSquare className="w-3 h-3 text-stone-950" />
                      <span>Utility 4</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-stone-950 uppercase tracking-tight leading-tight">
                      Chat with PDF (RAG)
                    </h3>
                  </div>

                  <TextGenerateEffect 
                    words="Ingest textbook documents and chat interactively with specific paragraphs. Locates key terms locally via vector parsing." 
                    className="text-[10px] text-stone-700 leading-relaxed font-semibold mt-1" 
                  />

                  <button className="px-3 py-1.5 bg-stone-900 text-white font-mono text-[8px] font-black uppercase tracking-wider rounded-lg border-2 border-stone-950 shadow-[2px_2px_0px_0px_#F26430] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all mt-2">
                    Upload document →
                  </button>
                </div>

                {/* Right Side: Desk illustration */}
                <div className="col-span-5 flex items-center justify-center">
                  <svg className="w-full h-32 text-stone-950" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 30 90 L 170 90 M 45 90 L 45 110 M 155 90 L 155 110" strokeWidth="2.5" />
                    <path d="M 120 90 L 120 75 L 105 75 L 105 110" />
                    <path d="M 105 75 L 105 55 C 105 50, 120 50, 120 55 L 120 75" />
                    <path d="M 112 90 L 112 110 L 120 110" strokeWidth="3" />
                    <path d="M 112 75 L 112 55" strokeWidth="3" />
                    <circle cx="112" cy="45" r="7" fill="white" />
                    <path d="M 112 60 L 95 65 L 90 75" />
                    <path d="M 85 90 L 98 90 L 103 78" />
                    <path d="M 50 90 L 50 72 L 62 65" />
                    <path d="M 58 60 L 68 67" strokeWidth="3" />
                    <path d="M 15 90 L 25 90 L 22 105 L 18 105 Z" fill="white" />
                    <path d="M 20 90 Q 5 70, 10 60 Q 20 70, 20 90" fill="white" />
                    <path d="M 20 90 Q 30 75, 28 65 Q 22 75, 20 90" fill="white" />
                    <path d="M 148 90 C 145 80, 155 75, 160 80 C 163 83, 166 92, 160 98 C 158 102, 165 110, 170 110" />
                    <circle cx="160" cy="80" r="1.5" fill="black" />
                  </svg>
                </div>

              </div>
            </DraggableCardBody>

          </DraggableCardContainer>
        </div>

      </div>
    </div>
  );
}
