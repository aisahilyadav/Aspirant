import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCompass, 
  FiArrowRight 
} from 'react-icons/fi';

export default function Explore() {
  const navigate = useNavigate();

  const features = [
    {
      num: "01",
      title: "Interactive AI Quiz Engine",
      description: "Auto-generate practice exams from text paragraphs or uploaded PDFs. Test your retention with multiple-choice questions, accurate score calculations, and immediate correction sheets.",
      color: "border-stone-300 text-stone-700",
      rotation: "rotate-[-0.5deg]",
      path: "/quiz"
    },
    {
      num: "02",
      title: "PDF RAG Chat Sidebar",
      description: "Chat interactively with text blocks extracted from your source materials. Perfect for clarifying complex concepts, translating dense terminology, and finding quick answers.",
      color: "border-stone-300 text-stone-700",
      rotation: "rotate-[0.5deg]",
      path: "/notes"
    },
    {
      num: "03",
      title: "Rich Notes Canvas",
      description: "Say goodbye to simple text areas. Write beautiful notes, structure them with H1/H2 headers, bullet lists, custom highlight backgrounds, colors, and auto-save text content in the background.",
      color: "border-stone-300 text-stone-700",
      rotation: "rotate-[0.8deg]",
      path: "/notes"
    },
    {
      num: "04",
      title: "Streak & Progress Tracker",
      description: "Build a consistent study streak, monitor your daily study duration (⏱), and tick off tasks inside your Todo dashboard to stay accountable to your study schedule.",
      color: "border-stone-300 text-stone-700",
      rotation: "rotate-[-0.8deg]",
      path: "/todos"
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
        
        {/* Header Section */}
        <div className="border-b border-stone-200 pb-12 mb-16">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg] flex items-center gap-2">
            <FiCompass className="animate-spin text-stone-400" style={{ animationDuration: '8s' }} />
            [ explore study modules ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
            Discover the <span className="underline decoration-stone-400 decoration-wavy decoration-2">AI Study</span> Workspace.
          </h1>
          <p className="text-sm sm:text-base text-stone-605 max-w-2xl leading-relaxed">
            Take a tour of our core functionalities. Explore how Aspirant automates notes, schedules, questions, and reference searches.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <div 
              key={i} 
              onClick={() => navigate(feature.path)}
              className={`p-8 rounded-3xl border border-stone-300 bg-white hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-[280px] ${feature.rotation}`}
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-mono text-stone-400 font-extrabold">
                  {feature.num}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200 text-stone-600 font-mono">
                  Interactive Module
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-3 group-hover:translate-x-0.5 transition-transform uppercase">
                  {feature.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-6 font-serif-book">
                  {feature.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-extrabold text-stone-850 hover:text-stone-950 transition-colors uppercase tracking-widest">
                Launch Module
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Showcase Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border border-stone-300 rounded-3xl p-8 bg-white items-center gap-8" style={{ filter: 'url(#handdrawn)' }}>
          <div className="lg:col-span-2 space-y-3 text-left">
            <h2 className="text-xl font-serif-book font-extrabold tracking-tight text-stone-900">
              Ready to construct your study system?
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed font-serif-book">
              Connect textbooks, parse summaries, launch chat assistants, and monitor study metrics today.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 shadow-sm flex items-center gap-2"
            >
              Sign Up Now
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
