import React, { useState } from 'react';
import { FiCheckSquare, FiCpu, FiMessageSquare, FiBookOpen, FiZap } from 'react-icons/fi';

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const featuresList = [
    {
      title: "Interactive AI Quiz",
      desc: "Auto-generate practice recall exams from textbook chapters or custom topic descriptions. Grades answers instantly with comparisons.",
      icon: <FiBookOpen className="w-5 h-5" />,
      image: "/quiz_feature.png",
      color: "border-[#D9866B]"
    },
    {
      title: "Rich Notes Canvas",
      desc: "Draft study summaries inside a live editor with headings, bullet lists, color highlights, and automatic keystroke background saves.",
      icon: <FiCheckSquare className="w-5 h-5" />,
      image: "/notes_feature.png",
      color: "border-[#A9C5A0]"
    },
    {
      title: "Schedule & Timetable",
      desc: "Plan your weekly study objectives on lined notepad card checklists and track tasks along clean calendar grid views.",
      icon: <FiCheckSquare className="w-5 h-5" />,
      image: "/about_philosophy.png", // Reuse desk illustration for timetable/desk setup
      color: "border-[#F8D66D]"
    },
    {
      title: "Chat with PDF (RAG)",
      desc: "Ingest textbook documents and chat interactively with specific paragraphs. Locates key terms locally via Vector parsing.",
      icon: <FiMessageSquare className="w-5 h-5" />,
      image: "/notes_feature.png",
      color: "border-[#8FB7D9]"
    },
    {
      title: "Daily Study Streak",
      desc: "Stay accountable to your study consistency. Build daily streaking values and monitor minutes logged automatically.",
      icon: <FiZap className="w-5 h-5" />,
      image: "/quiz_feature.png",
      color: "border-[#D9866B]"
    }
  ];

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 py-24 transition-colors duration-1000 select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] paper-grid" />

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl text-left">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ system utilities ]
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-[1.1]">
            A Distraction-Free Study System
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-xl font-sans-inter leading-relaxed">
            Every feature is structured to keep you focused. No unnecessary popups or flashing alerts—just minimal, elegant widgets supporting active recall and synthesis.
          </p>
        </div>

        {/* Premium Split Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive 3D Mockup Container (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div 
              className="relative w-full max-w-md aspect-[4/3] bg-white border border-stone-200 rounded-3xl p-3 shadow-md transition-all duration-300 ease-out flex items-center justify-center cursor-pointer"
              style={{
                perspective: '1000px',
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Colored tag indicator on mockup */}
              <div className={`absolute top-4 left-4 z-20 w-3 h-3 rounded-full bg-stone-300 transition-colors duration-500`} />

              {/* Large Mockup Image Viewport with smooth crossfade */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-150">
                {featuresList.map((feature, idx) => (
                  <img
                    key={idx}
                    src={feature.image}
                    alt={feature.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === activeTab ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Hover Tabs (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {featuresList.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveTab(idx)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                  idx === activeTab
                    ? `bg-white ${item.color} border-l-4 shadow-sm translate-x-1`
                    : 'bg-transparent border-transparent hover:bg-stone-100/40 hover:border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    idx === activeTab ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-500'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className={`text-xs mt-1 leading-relaxed transition-colors ${
                      idx === activeTab ? 'text-stone-700 font-serif-cormorant text-sm' : 'text-stone-550'
                    }`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
