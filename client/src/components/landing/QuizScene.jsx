import React, { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

export default function QuizScene() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 transition-colors duration-1000">
      
      {/* Pencil Smudge detail */}
      <div className="absolute bottom-12 left-12 w-32 h-16 pencil-smudge pointer-events-none opacity-40" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[1.5deg]">
            [ retrieval practice tests ]
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-tight">
            Stop Forgetting with Active Quizzes
          </h2>
          <p className="text-xs sm:text-sm text-stone-605 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Test your memory instantly with AI-generated multiple-choice questions. Pick the correct option to light up the student's brain doodle.
          </p>
        </div>

        {/* Layout Split: Brain Doodle on Left, Quiz Box on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-3xl mx-auto">
          
          {/* Left: Confused/Happy Brain Doodle (5 cols) */}
          <div 
            className="md:col-span-5 bg-white border border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px]"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <svg viewBox="0 0 160 160" className="w-32 h-32 text-stone-850" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              
              {/* Brain outline paths */}
              <path d="M50 80 C40 80 35 70 40 60 C35 50 45 40 55 45 C60 35 75 35 80 45 C85 35 100 35 105 45 C115 40 125 50 120 60 C125 70 120 80 110 80 C120 80 125 90 120 100 C125 110 115 120 105 115 C100 125 85 125 80 115 C75 125 60 125 55 115 C45 120 35 110 40 100 C35 90 40 80 50 80 Z" 
                fill={selectedOption === 0 ? "rgba(248, 214, 109, 0.2)" : "rgba(239, 230, 216, 0.2)"}
              />
              <path d="M80 45 L80 115" strokeWidth="1" strokeDasharray="3 3" /> {/* Left/Right split */}

              {/* Reactive annotations depending on state */}
              {selectedOption === 0 ? (
                /* Happy/Celebrating Lights Up */
                <>
                  {/* Eye smile */}
                  <path d="M58 75 Q63 70 68 75" />
                  <path d="M92 75 Q97 70 102 75" />
                  {/* Big smile */}
                  <path d="M72 90 Q80 100 88 90" />
                  {/* Glowing sparks light bulb above brain */}
                  <path d="M80 20 L80 10 M65 24 L58 18 M95 24 L102 18" stroke="rgba(248, 214, 109, 0.8)" strokeWidth="3" />
                  <circle cx="80" cy="30" r="4" fill="rgba(248, 214, 109, 0.5)" />
                </>
              ) : selectedOption === 1 || selectedOption === 2 ? (
                /* Confused/Sad eyes */
                <>
                  <path d="M58 75 L68 71" />
                  <path d="M92 71 L102 75" />
                  <circle cx="63" cy="80" r="1.5" fill="currentColor" />
                  <circle cx="97" cy="80" r="1.5" fill="currentColor" />
                  <path d="M75 92 Q80 88 85 92" /> {/* Sad mouth */}
                  {/* Question marks */}
                  <text x="60" y="32" className="font-handwritten text-lg text-stone-400" stroke="none" fill="currentColor">?</text>
                  <text x="90" y="32" className="font-handwritten text-lg text-stone-400" stroke="none" fill="currentColor">?</text>
                </>
              ) : (
                /* Idle/Confused state */
                <>
                  <circle cx="63" cy="76" r="1.5" fill="currentColor" />
                  <circle cx="97" cy="76" r="1.5" fill="currentColor" />
                  <path d="M74 90 L86 90" /> {/* Idle flat line */}
                  <text x="75" y="30" className="font-handwritten text-xl text-stone-400" stroke="none" fill="currentColor">?</text>
                </>
              )}

            </svg>
            <span className="font-handwritten text-xs text-stone-500 mt-2 rotate-[-1deg]">
              {selectedOption === 0 ? "Brain remembers!" : selectedOption !== null ? "Try again..." : "Test your memory."}
            </span>
          </div>

          {/* Right: The Quiz Question Box (7 cols) */}
          <div 
            className="md:col-span-7 bg-white border border-stone-300 rounded-3xl p-6 sm:p-8 shadow-sm text-left flex flex-col justify-between min-h-[220px]"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="space-y-4">
              <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-stone-450 block">
                Practice MCQ
              </span>
              <h4 className="text-sm font-bold text-stone-900 leading-snug">
                Where does the primary chemical process of photosynthesis occur?
              </h4>
              
              <div className="space-y-2">
                {[
                  { text: "Chloroplasts containing pigments", idx: 0 },
                  { text: "Mitochondria cellular walls", idx: 1 },
                  { text: "Ribosome organelles", idx: 2 }
                ].map((opt) => (
                  <button
                    key={opt.idx}
                    onClick={() => setSelectedOption(opt.idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedOption === opt.idx 
                        ? opt.idx === 0 
                          ? 'bg-[#A9C5A0]/20 border-stone-800 text-stone-950 font-bold' 
                          : 'bg-[#D9866B]/15 border-stone-800 text-stone-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {selectedOption === opt.idx && (
                      opt.idx === 0 ? <FiCheck className="text-stone-850" /> : <FiX className="text-stone-850" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
