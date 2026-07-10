import React from 'react';
import { FiArrowUp, FiGithub } from 'react-icons/fi';

export default function FooterScene({ onReset }) {
  
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 px-6 bg-[#18181b] text-stone-300 transition-colors duration-1000">
      
      {/* Background Subtle Grid Pattern (faint, dark opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] paper-grid" />

      {/* Spacer / Content Block */}
      <div className="max-w-4xl w-full text-center space-y-12 mx-auto relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
            [ study session completed ]
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif-cormorant font-bold text-stone-100 tracking-tight leading-tight">
            Rest Well. Start Fresh Tomorrow.
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto font-sans-inter leading-relaxed">
            Close the study tabs. Let your brain compile what you learned today. Aspirant tracks your daily objectives and waits silently for your next session.
          </p>
        </div>

        {/* Cozy Lofi Night Postcard Mockup */}
        <div 
          className="w-full max-w-md mx-auto bg-[#232326] border border-stone-800 rounded-3xl p-3 shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-850">
            <img 
              src="/lofi_study_night.png" 
              alt="Cozy Study Room at Night" 
              className="w-full h-full object-cover"
            />
            {/* Soft night lamp glow overlay simulation */}
            <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay pointer-events-none" />
          </div>
          
          <div className="pt-3 pb-1 flex justify-between items-center px-2">
            <span className="font-handwritten text-xs text-stone-500 italic">"consistency leads to mastery"</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-stone-600">[ log closed ]</span>
          </div>
        </div>

        {/* Reset / Scroll to top Button */}
        <div className="pt-4">
          <button
            onClick={onReset}
            className="px-6 py-3.5 bg-stone-100 text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-200 transition-transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 mx-auto"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <span>Flipped back to Morning</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Cozy Sitemap & Copyright Footer Block */}
      <footer className="w-full max-w-5xl mx-auto border-t border-stone-900 pt-10 mt-12 text-stone-500 font-sans-inter">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-serif-cormorant font-bold text-stone-200">
                Aspirant
              </span>
              <span className="font-handwritten text-[10px] text-stone-500 rotate-[-1deg]">[ study journal ]</span>
            </div>
            <p className="font-handwritten text-stone-500 text-xs italic block max-w-sm">
              "Live as if you were to die tomorrow. Learn as if you were to live forever."
            </p>
          </div>

          {/* Footer menu links (Scrolls to section ID) */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <button onClick={() => handleScrollTo('morning')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => handleScrollTo('contact')} className="hover:text-white transition-colors">Contact Us</button>
            <button onClick={() => handleScrollTo('contribute')} className="hover:text-white transition-colors">Contribute</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-600 border-t border-stone-900/60 pt-6">
          <p>© {new Date().getFullYear()} Aspirant Study Operating System. Open source software.</p>
          
          {/* Lofi text indicator & GitHub */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/aisahilyadav/Aspirant" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-stone-400 transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest">[ code repository ]</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
