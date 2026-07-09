import React from 'react';
import { FiAward, FiUsers, FiTarget, FiStar } from 'react-icons/fi';

export default function About() {
  const cards = [
    {
      icon: <FiTarget className="w-5 h-5 text-purple-400" />,
      title: "Our Mission",
      desc: "To empower students and professionals to master complex topics through personalized, AI-driven study pathways. We believe active recall and retrieval practice are the building blocks of rapid comprehension."
    },
    {
      icon: <FiUsers className="w-5 h-5 text-indigo-400" />,
      desc: "We build intuitive SaaS and AI systems at the intersection of brand and product engineering. Aspirant is created to automate boring tasks, letting you focus on true understanding.",
      title: "The Approach"
    },
    {
      icon: <FiAward className="w-5 h-5 text-green-400" />,
      title: "Google Gemini Driven",
      desc: "Our platform leverages rate-limit-compliant, highly-capable generative models to structure accurate outline summaries, construct practice quizzes, and run semantic PDF inquiries."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-16 font-sans overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-650/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-3 flex items-center gap-1.5">
            <FiStar />
            About Aspirant
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Pioneering the <span className="font-serif italic font-normal text-indigo-200">Next Gen</span> of Learning.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Aspirant was created by builders who believe studying shouldn't be about endless reading, 
            but about active challenging and smart feedback.
          </p>
        </div>

        {/* Mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {cards.map((card, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-between min-h-[250px]"
            >
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mb-6">
                {card.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Callout */}
        <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.01]">
          <h2 className="text-2xl font-extrabold mb-4">
            Built for Students, by Students
          </h2>
          <p className="text-sm text-gray-450 leading-relaxed">
            Aspirant is an open, community-oriented study platform. Our goal is to expand operations into B2B consulting, B2B SaaS integrations, and advanced study planners to make modern learning open and structured.
          </p>
        </div>

      </div>
    </div>
  );
}
