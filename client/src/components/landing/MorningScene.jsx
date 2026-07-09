import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function MorningScene({ onCtaClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Normalize coordinates to range [-1, 1]
    const x = ((e.clientX - rect.left) / width) * 2 - 1;
    const y = ((e.clientY - rect.top) / height) * 2 - 1;
    // Calculate tilt coordinates (max 20 degrees)
    setTilt({
      x: x * 20,
      y: -y * 20
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#1c1917] text-stone-100 px-6 pt-20 pb-16 transition-colors duration-1000 select-none overflow-hidden">
      
      {/* Background paper grid pattern (faint, dark opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] paper-grid" />

      {/* Decorative Coffee Stain (dark tone) */}
      <div className="absolute top-24 left-10 w-28 h-28 border-2 border-stone-800 rounded-full opacity-20 pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Brand content & Sleeping Student Doodle (7 columns) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <div className="space-y-4">
              <span className="text-stone-500 font-mono text-[10px] font-extrabold uppercase tracking-widest block">
                Aspirant study operating system
              </span>
              <h1 className="text-5xl sm:text-7xl font-serif-cormorant font-bold text-stone-100 tracking-tight leading-[1.05]">
                A notebook that 
                <br />
                studies with you.
              </h1>
              <p className="font-handwritten text-lg text-stone-400 rotate-[-1.5deg] w-fit">
                Designed for people who learn alone.
              </p>
              
              {/* Supporting Text Description */}
              <p className="text-xs sm:text-sm text-stone-400 font-sans-inter leading-relaxed max-w-xl">
                Plan your learning roadmap, organize personal knowledge, generate practice exams, and stay consistent—all within a warm, minimal study journal. Close the door to distractions and let the AI compile summaries dynamically on the sheets.
              </p>
            </div>

            {/* CTA Action button */}
            <div>
              <button
                onClick={onCtaClick}
                className="px-7 py-3.5 bg-stone-100 text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-200 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2"
                style={{ filter: 'url(#handdrawn)' }}
              >
                <span>Start Your Learning Journey</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Smaller Sleeping Student Doodle details (Horizontal layout inline) */}
            <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 opacity-60">
              <div className="w-40 h-28 bg-[#2e2a27]/30 border border-stone-800 rounded-2xl p-2 relative flex items-center justify-center">
                <svg viewBox="0 0 160 110" className="w-full h-full text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Bed */}
                  <line x1="20" y1="85" x2="140" y2="85" strokeWidth="2.5" />
                  <path d="M25 85 L25 65 C25 60 35 60 40 65 L40 85" /> {/* Pillow */}
                  <path d="M40 75 C45 68 55 68 60 75" /> {/* Face */}
                  <circle cx="48" cy="72" r="0.75" fill="currentColor" />
                  
                  {/* Blanket body */}
                  <path d="M50 72 L130 72 L135 85 L50 85 Z" fill="rgba(143, 183, 217, 0.08)" />

                  {/* Sleeping Cat */}
                  <path d="M110 72 C110 65 120 65 125 72 Z" fill="rgba(169, 197, 160, 0.1)" />

                  {/* Alarm clock vibration */}
                  <g className="animate-alarm" style={{ transformOrigin: '140px 65px' }}>
                    <circle cx="140" cy="65" r="7" fill="#1c1917" />
                    <line x1="140" y1="65" x2="140" y2="61" />
                    <line x1="140" y1="65" x2="144" y2="65" />
                  </g>
                </svg>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[9px] font-bold text-stone-500 uppercase tracking-widest block">Morning alarm status</span>
                <span className="font-handwritten text-xs text-stone-400">"Wakes up, brews coffee, opens cleanly."</span>
              </div>
            </div>

          </div>

          {/* Right Side: Interactive 3D Notebook & Floating Pencil (5 columns) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end py-6">
            <div 
              className="relative w-96 h-96 flex items-center justify-center cursor-pointer select-none"
              style={{ perspective: '1200px' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsOpen(!isOpen)}
            >
              
              {/* Interactive Floating Pencil */}
              <div 
                className="absolute z-30 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${tilt.x * 2.5}px, ${tilt.y * 2.5}px, 60px) rotateZ(${tilt.x * 0.8 - 25}deg)`,
                  width: '28px',
                  height: '110px',
                  right: '16px',
                  top: '40px'
                }}
              >
                <svg viewBox="0 0 30 110" className="w-full h-full text-stone-850" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Pencil body */}
                  <path d="M10 10 L20 10 L20 85 L15 100 L10 85 Z" fill="#F8D66D" />
                  {/* Lead tip */}
                  <path d="M13 95 L17 95 L15 100 Z" fill="#1D1D1D" />
                  {/* Eraser */}
                  <path d="M10 10 C10 5, 20 5, 20 10" fill="#D9866B" />
                  {/* Pencil stripes */}
                  <line x1="15" y1="10" x2="15" y2="85" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* The 3D Book Object */}
              <div 
                className="relative w-64 h-80 transition-all duration-300 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) rotateZ(-3deg)`,
                  filter: 'url(#handdrawn)'
                }}
              >
                
                {/* Spine Shadow / Thickness */}
                <div 
                  className="absolute inset-y-0.5 bg-stone-400 w-3.5 rounded-l-md"
                  style={{
                    transform: 'rotateY(-90deg) translateZ(1.75px)',
                    transformOrigin: 'left center'
                  }}
                />

                {/* Back Cover Layer with 3D Page Stacking Thickness */}
                <div 
                  className="absolute inset-0 bg-[#EFE6D8] border-2 border-stone-400 rounded-lg"
                  style={{ 
                    transform: 'translateZ(-8px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '1px 1px 0px #c2c0bb, 2px 2px 0px #c2c0bb, 3px 3px 0px #c2c0bb, 4px 4px 0px #c2c0bb, 5px 5px 0px #c2c0bb, 8px 8px 24px rgba(0,0,0,0.55)'
                  }}
                />

                {/* Protruding Colored Index Tabs (Sticking out of pages) */}
                <div 
                  className="absolute z-0 flex flex-col gap-3 right-[-8px] top-12"
                  style={{ transform: 'translateZ(-4px)' }}
                >
                  <div className="w-4 h-6 rounded-r bg-[#D9866B] border border-l-0 border-stone-400 opacity-90 shadow-sm" title="Notes tab" />
                  <div className="w-4 h-6 rounded-r bg-[#A9C5A0] border border-l-0 border-stone-400 opacity-90 shadow-sm" title="Quizzes tab" />
                  <div className="w-4 h-6 rounded-r bg-[#8FB7D9] border border-l-0 border-stone-400 opacity-90 shadow-sm" title="Stats tab" />
                </div>
                
                {/* Lined Pages Middle Layer (flips open) */}
                <div 
                  className="absolute inset-y-1.5 right-1.5 left-3.5 bg-[#FDFBF6] border-y border-r border-stone-300 rounded-r-md transition-transform duration-700 ease-in-out shadow-sm"
                  style={{
                    transform: isOpen ? 'rotateY(-138deg)' : 'rotateY(0deg)',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: 10
                  }}
                >
                  {/* Front of flipping sheet */}
                  <div 
                    className="absolute inset-0 p-5 flex flex-col justify-between text-left text-stone-850"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="space-y-2">
                      <span className="font-mono text-[8px] font-bold text-stone-450 uppercase tracking-widest">Page 01</span>
                      <p className="font-handwritten text-xs text-stone-600 leading-snug">
                        * Start study plan.<br />
                        * Read chapter summaries.<br />
                        * Circle dates.
                      </p>
                    </div>
                    <span className="font-mono text-[8px] text-stone-355">flip sheet...</span>
                  </div>
                  
                  {/* Back of flipping sheet (AI Core Concept) */}
                  <div 
                    className="absolute inset-0 p-5 bg-[#FDFBF6] border-y border-l border-stone-300 rounded-l-md text-left text-stone-850"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b border-stone-200 pb-1">
                        <span className="font-mono text-[8px] font-bold text-stone-450 uppercase tracking-widest">AI SUMMARY</span>
                        {/* Little sparkle icon */}
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" />
                        </svg>
                      </div>
                      <p className="font-handwritten text-xs text-stone-700 leading-snug">
                        "Active Recall Concept."<br />
                        Photosynthesis yields chemical energy in chloroplasts.
                      </p>
                    </div>
                  </div>

                </div>
                
                {/* Front Cover Layer */}
                <div 
                  className="absolute inset-0 bg-[#FAF9F6] border-2 border-stone-400 rounded-lg flex flex-col justify-between p-6 transition-transform duration-700 ease-in-out shadow-md text-stone-850"
                  style={{
                    transform: isOpen ? 'rotateY(-148deg)' : 'rotateY(0deg)',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    zIndex: 20
                  }}
                >
                  <div className="space-y-2 border-b border-stone-300 pb-5 text-left">
                    <span className="font-mono text-[8px] font-bold text-stone-450 uppercase tracking-widest">study operating system</span>
                    <h3 className="text-3xl font-serif-cormorant font-bold text-stone-900 leading-none">Aspirant</h3>
                  </div>
                  
                  {/* Small cover emblem sketch */}
                  <div className="flex justify-center py-2 opacity-60 select-none">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>

                  <div className="text-right border-t border-stone-250 pt-3">
                    <span className="font-handwritten text-xs text-stone-500 font-bold">
                      {isOpen ? "close notebook" : "click to open"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
