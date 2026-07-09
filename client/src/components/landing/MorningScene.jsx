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
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 transition-colors duration-1000">
      
      {/* Coffee Stain detail */}
      <div className="absolute top-24 left-16 w-28 h-28 coffee-stain rotate-12 pointer-events-none opacity-40">
        <div className="w-full h-full coffee-stain-inner" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Brand Header */}
        <div className="space-y-3 select-none">
          <h2 className="text-stone-400 font-mono text-[10px] font-extrabold uppercase tracking-widest">
            Aspirant study operating system
          </h2>
          <h1 className="text-6xl sm:text-8xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none">
            Aspirant
          </h1>
          <p className="font-handwritten text-lg text-stone-500 max-w-sm mx-auto rotate-[-2deg]">
            a notebook that studies with you.
          </p>
        </div>

        {/* Interactive 3D Sketchbook Illustration Component */}
        <div className="flex justify-center items-center py-6">
          <div 
            className="relative w-80 h-96 flex items-center justify-center cursor-pointer select-none"
            style={{ perspective: '1200px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsOpen(!isOpen)}
          >
            
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
                className="absolute inset-y-0.5 bg-stone-300 w-2.5 rounded-l-md"
                style={{
                  transform: 'rotateY(-90deg) translateZ(1.25px)',
                  transformOrigin: 'left center'
                }}
              />

              {/* Back Cover Layer */}
              <div 
                className="absolute inset-0 bg-[#EFE6D8] border-2 border-stone-400 rounded-lg shadow-lg"
                style={{ 
                  transform: 'translateZ(-6px)',
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Lined Pages Middle Layer (flips open) */}
              <div 
                className="absolute inset-y-1.5 right-1 left-3 bg-[#FDFBF6] border-y border-r border-stone-300 rounded-r-md transition-transform duration-700 ease-in-out shadow-sm"
                style={{
                  transform: isOpen ? 'rotateY(-138deg)' : 'rotateY(0deg)',
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  zIndex: 10
                }}
              >
                {/* Front of flipping sheet */}
                <div 
                  className="absolute inset-0 p-5 flex flex-col justify-between text-left"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] font-bold text-stone-400 uppercase tracking-widest">Page 01</span>
                    <p className="font-handwritten text-sm text-stone-600 leading-snug">
                      * Start study plan.<br />
                      * Read chapter summaries.<br />
                      * Circle dates.
                    </p>
                  </div>
                  <span className="font-mono text-[8px] text-stone-350">flip sheet...</span>
                </div>
                
                {/* Back of flipping sheet */}
                <div 
                  className="absolute inset-0 p-5 bg-[#FDFBF6] border-y border-l border-stone-300 rounded-l-md text-left"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] font-bold text-stone-400 uppercase tracking-widest">Page 02</span>
                    <p className="font-handwritten text-sm text-stone-700 leading-snug">
                      "Study Photosynthesis."<br />
                      Mitochondria cellular powerhouse generates chemical ATP.
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Front Cover Layer */}
              <div 
                className="absolute inset-0 bg-[#FAF9F6] border-2 border-stone-400 rounded-lg flex flex-col justify-between p-6 transition-transform duration-700 ease-in-out shadow-md"
                style={{
                  transform: isOpen ? 'rotateY(-148deg)' : 'rotateY(0deg)',
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  zIndex: 20
                }}
              >
                <div className="space-y-2 border-b border-stone-300 pb-5 text-left">
                  <span className="font-mono text-[8px] font-bold text-stone-400 uppercase tracking-widest">study operating system</span>
                  <h3 className="text-3xl font-serif-cormorant font-bold text-stone-900 leading-none">Aspirant</h3>
                </div>
                
                {/* Small cover emblem sketch */}
                <div className="flex justify-center py-2 opacity-60 select-none">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>

                <div className="text-right border-t border-stone-200 pt-3">
                  <span className="font-handwritten text-xs text-stone-450">
                    {isOpen ? "close notebook" : "click to open"}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* CTA Action button */}
        <div className="pt-4">
          <button
            onClick={onCtaClick}
            className="px-8 py-4 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-950 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 mx-auto"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <span>Start Your Learning Journey</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
