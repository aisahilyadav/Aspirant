import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

export default function PlanningScene() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Read Biology Chapter 4", checked: true },
    { id: 2, text: "Summarize notes on Photosynthesis", checked: false },
    { id: 3, text: "Generate practice recall quiz", checked: false },
    { id: 4, text: "Revise calendar targets", checked: false }
  ]);
  const [hoveredCal, setHoveredCal] = useState(false);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Torn Edge Detail Top */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-stone-300/10 torn-edge-top z-10" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[1deg]">
            [ planning & goals ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            "What should I study today?"
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Organize daily tasks in a minimal, quiet planner layout. Check off items directly on the notebook sheet to stay accountable.
          </p>
        </div>

        {/* Double Page Planner Spread Layout */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm max-w-3xl mx-auto relative select-none"
          style={{ filter: 'url(#handdrawn)' }}
        >
          
          {/* Seam line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-stone-200 hidden md:block" />
          <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gradient-to-r from-stone-100/10 via-stone-100/30 to-stone-100/10 -translate-x-1.5 hidden md:block" />

          {/* Left Page: Study Calendar Planner */}
          <div 
            className="p-8 space-y-6 cursor-pointer"
            onMouseEnter={() => setHoveredCal(true)}
            onMouseLeave={() => setHoveredCal(false)}
          >
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-550 border-b border-stone-150 pb-2">
              Monthly Calendar
            </h3>
            
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-serif-cormorant text-stone-600">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="font-bold text-stone-400">{d}</span>
              ))}
              {[...Array(30)].map((_, idx) => {
                const dayNum = idx + 1;
                const isToday = dayNum === 10;
                return (
                  <div key={idx} className="h-8 flex items-center justify-center relative">
                    <span className={`z-10 text-xs ${isToday ? 'font-bold text-stone-900' : 'text-stone-500'}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <svg className="absolute inset-0 w-full h-full text-stone-900 stroke-current" fill="none" strokeWidth="1.5">
                        {/* Circle itself if hovered */}
                        <path 
                          d="M 5,16 A 11,11 0 1,0 27,16 A 11,11 0 1,0 5,16" 
                          strokeDasharray={hoveredCal ? "100" : "15 5"}
                          className="transition-all duration-700"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="font-handwritten text-xs text-stone-450 mt-4 rotate-[-1deg]">
              * hover page to circle today's date
            </p>
          </div>

          {/* Right Page: Checklist Todos */}
          <div className="p-8 space-y-6 bg-stone-50/30">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-stone-550 border-b border-stone-150 pb-2">
              Daily Study List
            </h3>

            <div className="space-y-3 text-left">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-4.5 h-4.5 border border-stone-450 rounded flex items-center justify-center transition-colors ${
                    task.checked ? 'bg-[#A9C5A0]/20 border-stone-800' : 'bg-transparent'
                  }`}>
                    {task.checked && <FiCheck className="w-3.5 h-3.5 text-stone-850" />}
                  </div>
                  <span className={`text-xs font-serif-cormorant text-stone-700 transition-all ${
                    task.checked ? 'line-through text-stone-400 decoration-stone-400' : 'group-hover:text-stone-950'
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-handwritten text-xs text-stone-450 mt-4 rotate-[1deg]">
              * click boxes to draw checkmarks
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
