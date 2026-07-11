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
    <div className="relative min-h-screen flex flex-col justify-between pt-24 pb-16 px-6 bg-stone-900 text-stone-300">

      {/* Content Block */}
      <div className="max-w-4xl w-full text-center space-y-12 mx-auto relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Header Block */}
        <div className="space-y-5 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase inline-block bg-stone-800 border-2 border-stone-600 px-3 py-1 rounded-lg">
            Study Session Completed
          </span>
          <h2 className="text-4xl sm:text-6xl font-sans font-black text-stone-100 tracking-tight leading-tight">
            Rest Well.{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Start Fresh</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F8C537] -z-0 -rotate-1" />
            </span>
            {' '}Tomorrow.
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed font-medium">
            Close the study tabs. Let your brain compile what you learned today. Aspirant tracks your daily objectives and waits silently for your next session.
          </p>
        </div>

        {/* Night Study Illustration */}
        <div className="w-full max-w-md mx-auto bg-stone-800 border-2 border-stone-600 rounded-3xl p-3 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300 hover:translate-y-[-2px]">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-700">
            <img 
              src="/footer_night_study.png" 
              alt="Cozy Study Room at Night" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="pt-3 pb-1 flex justify-between items-center px-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">"consistency leads to mastery"</span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-stone-600">[ log closed ]</span>
          </div>
        </div>

        {/* Reset / Scroll to top Button */}
        <div className="pt-4">
          <button
            onClick={onReset}
            className="px-7 py-3.5 bg-white text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 mx-auto"
          >
            <span>Back to Morning</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Footer Block */}
      <footer className="w-full max-w-5xl mx-auto border-t border-stone-800 pt-10 mt-12 text-stone-500 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-sans font-black text-stone-200">
                Aspirant
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest bg-stone-800 border border-stone-700 px-2 py-0.5 rounded">study os</span>
            </div>
            <p className="text-stone-500 text-xs font-medium max-w-sm">
              "Live as if you were to die tomorrow. Learn as if you were to live forever."
            </p>
          </div>

          {/* Footer menu links */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
            <button onClick={() => handleScrollTo('morning')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => handleScrollTo('contact')} className="hover:text-white transition-colors">Contact Us</button>
            <button onClick={() => handleScrollTo('contribute')} className="hover:text-white transition-colors">Contribute</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-600 border-t border-stone-800 pt-6">
          <p className="font-medium">© {new Date().getFullYear()} Aspirant Study Operating System. Open source software.</p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/aisahilyadav/Aspirant" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 hover:text-stone-400 transition-colors"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Code Repository</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
