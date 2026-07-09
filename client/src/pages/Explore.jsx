import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCompass, 
  FiAward, 
  FiMessageSquare, 
  FiFileText, 
  FiZap, 
  FiArrowRight, 
  FiLayers 
} from 'react-icons/fi';

export default function Explore() {
  const navigate = useNavigate();

  const features = [
    {
      num: "01",
      title: "Interactive AI Quiz Engine",
      description: "Auto-generate practice exams from text paragraphs or uploaded PDFs. Test your retention with multiple-choice questions, accurate score calculations, and immediate correction sheets.",
      color: "border-purple-500/30 text-purple-400",
      bgOrb: "bg-purple-500/5",
      path: "/quiz"
    },
    {
      num: "02",
      title: "PDF RAG Chat Sidebar",
      description: "Chat interactively with text blocks extracted from your source materials. Perfect for clarifying complex concepts, translating dense terminology, and finding quick answers.",
      color: "border-blue-500/30 text-blue-400",
      bgOrb: "bg-blue-500/5",
      path: "/notes"
    },
    {
      num: "03",
      title: "Rich Notes Canvas",
      description: "Say goodbye to simple text areas. Write beautiful notes, structure them with H1/H2 headers, bullet lists, custom highlight backgrounds, colors, and auto-save text content in the background.",
      color: "border-green-500/30 text-green-400",
      bgOrb: "bg-green-500/5",
      path: "/notes"
    },
    {
      num: "04",
      title: "Streak & Progress Tracker",
      description: "Build a consistent study streak, monitor your daily study duration (⏱), and tick off tasks inside your Todo dashboard to stay accountable to your study schedule.",
      color: "border-yellow-500/30 text-yellow-400",
      bgOrb: "bg-yellow-500/5",
      path: "/todos"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-16 font-sans overflow-x-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-3 flex items-center gap-1.5">
            <FiCompass className="animate-spin" style={{ animationDuration: '6s' }} />
            Explore Modules
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            Discover the <span className="font-serif italic font-normal text-indigo-200">AI Study</span> Arsenal.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Take a tour of our core functionalities. Explore how Aspirant automates notes, schedules, 
            questions, and reference searches.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, i) => (
            <div 
              key={i} 
              onClick={() => navigate(feature.path)}
              className="relative overflow-hidden p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300 group cursor-pointer flex flex-col justify-between min-h-[300px]"
            >
              {/* Backlight Orb */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgOrb} rounded-full blur-[60px] pointer-events-none`} />

              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-mono text-gray-500 font-extrabold">
                  {feature.num}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-white/5 border ${feature.color}`}>
                  Interactive Module
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-white mb-3 group-hover:translate-x-1 transition-transform">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                Launch Module
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Showcase Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border border-white/10 rounded-3xl p-8 bg-white/[0.01] items-center gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Ready to construct your study system?
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connect textbooks, parse summaries, launch chat assistants, and monitor study metrics today.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
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
