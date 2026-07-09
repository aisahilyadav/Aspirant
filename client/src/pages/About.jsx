import React from 'react';
import { FiAward, FiUsers, FiTarget, FiStar } from 'react-icons/fi';

export default function About() {
  const cards = [
    {
      icon: <FiTarget className="w-5 h-5 text-stone-600" />,
      title: "Our Mission",
      desc: "To empower students and professionals to master complex topics through personalized, AI-driven study pathways. We believe active recall and retrieval practice are the building blocks of rapid comprehension."
    },
    {
      icon: <FiUsers className="w-5 h-5 text-stone-600" />,
      desc: "We build intuitive tools at the intersection of design and cognitive science. Aspirant is created to automate boring organization tasks, letting you focus on true understanding.",
      title: "The Approach"
    },
    {
      icon: <FiAward className="w-5 h-5 text-stone-600" />,
      title: "Google Gemini Driven",
      desc: "Our platform leverages rate-limit-compliant, highly-capable generative models to structure accurate outline summaries, construct practice quizzes, and run semantic PDF inquiries."
    }
  ];

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

      {/* Background paper grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-stone-200 pb-12 mb-16">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg] flex items-center gap-1.5">
            <FiStar />
            [ about aspirant ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
            Pioneering the <span className="underline decoration-stone-400 decoration-wavy decoration-2">Next Gen</span> of Learning.
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 max-w-2xl leading-relaxed font-serif-book">
            Aspirant was created by builders who believe studying shouldn't be about endless reading, but about active challenging and smart feedback.
          </p>
        </div>

        {/* Mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-stone-300 bg-white shadow-sm flex flex-col justify-between min-h-[240px] hover:shadow-md transition-shadow"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl w-fit mb-6">
                {card.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-serif-book">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Callout */}
        <div className="border border-stone-300 rounded-3xl p-10 bg-white" style={{ filter: 'url(#handdrawn)' }}>
          <h2 className="text-xl font-serif-book font-extrabold text-stone-900 mb-3">
            Built for Students, by Students
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed font-serif-book">
            Aspirant is an open, community-oriented study platform. Our goal is to expand operations into advanced tools, offline-first syncing, and collaborative index cards to make modern learning open and structured for independent minds.
          </p>
        </div>

      </div>
    </div>
  );
}
