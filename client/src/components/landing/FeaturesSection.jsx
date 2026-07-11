import React from 'react';
import { FiBookOpen, FiEdit3, FiCalendar, FiMessageSquare, FiZap } from 'react-icons/fi';
import { DraggableCardBody, DraggableCardContainer } from '../ui/draggable-card';
import { TextGenerateEffect } from '../ui/text-generate-effect';

export default function FeaturesSection() {
  const featuresList = [
    {
      title: 'Interactive AI Quiz',
      desc: 'Auto-generate practice recall exams from textbook chapters or custom topic descriptions. Grades answers instantly with comparisons.',
      icon: <FiBookOpen className="w-5 h-5 text-stone-950" />,
      color: 'bg-[#F8C537]', // Yellow
      positionClass: 'left-[2%] md:left-[5%] top-[2%] md:top-[8%] rotate-[-4deg]'
    },
    {
      title: 'Rich Notes Canvas',
      desc: 'Draft study summaries inside a live editor with headings, bullet lists, color highlights, and automatic keystroke background saves.',
      icon: <FiEdit3 className="w-5 h-5 text-stone-950" />,
      color: 'bg-[#A9C5A0]', // Green
      positionClass: 'left-[8%] md:left-[23%] top-[20%] md:top-[4%] rotate-[5deg]'
    },
    {
      title: 'Schedule & Timetable',
      desc: 'Plan your weekly study objectives on clean card checklists and track tasks along calendar grid views.',
      icon: <FiCalendar className="w-5 h-5 text-stone-950" />,
      color: 'bg-[#FEA1A1]', // Coral/Pink
      positionClass: 'left-[14%] md:left-[41%] top-[38%] md:top-[12%] rotate-[-2deg]'
    },
    {
      title: 'Chat with PDF (RAG)',
      desc: 'Ingest textbook documents and chat interactively with specific paragraphs. Locates key terms locally via vector parsing.',
      icon: <FiMessageSquare className="w-5 h-5 text-stone-950" />,
      color: 'bg-[#8FB7D9]', // Blue
      positionClass: 'left-[20%] md:left-[59%] top-[56%] md:top-[6%] rotate-[3deg]'
    },
    {
      title: 'Daily Study Streak',
      desc: 'Stay accountable to your study consistency. Build daily streaking values and monitor minutes logged automatically.',
      icon: <FiZap className="w-5 h-5 text-stone-950" />,
      color: 'bg-[#F26430]', // Orange
      positionClass: 'left-[26%] md:left-[77%] top-[74%] md:top-[14%] rotate-[-5deg]'
    }
  ];

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
            Every feature is structured to keep you focused. Grab, throw, and organize the colorful interactive card panels below to tidy up your study workspace.
          </p>
        </div>

        {/* Floating cards playground */}
        <div className="w-full flex justify-center items-center min-h-[900px] md:min-h-[500px]">
          <DraggableCardContainer className="relative w-full h-[850px] md:h-[450px] overflow-visible">
            {featuresList.map((item, idx) => (
              <DraggableCardBody
                key={idx}
                className={`absolute ${item.positionClass} border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${item.color} w-72 p-6 rounded-3xl flex flex-col justify-between transition-shadow duration-300`}
              >
                <div className="space-y-4">
                  {/* Card Top bar */}
                  <div className="flex justify-between items-center pb-3 border-b-2 border-stone-950/20">
                    <div className="p-2 rounded-xl border-2 border-stone-900 bg-white shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-mono font-black text-stone-950 uppercase tracking-widest bg-white border-2 border-stone-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      Utility {idx + 1}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider">
                    {item.title}
                  </h3>

                  {/* Animated Text Description */}
                  <TextGenerateEffect words={item.desc} className="text-xs text-stone-950 font-medium" />
                </div>

                {/* Card Bottom bar */}
                <div className="pt-3 border-t-2 border-stone-950/20 flex justify-between items-center text-[9px] font-mono font-bold text-stone-950 uppercase tracking-widest">
                  <span>Aspirant Study OS</span>
                  <span>[ Drag & Throw ]</span>
                </div>
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </div>

      </div>
    </div>
  );
}
