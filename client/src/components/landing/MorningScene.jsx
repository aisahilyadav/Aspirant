import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiBookOpen, FiUsers } from 'react-icons/fi';
import { cn } from '../../lib/utils';
import { InteractiveGridPattern } from '../ui/interactive-grid-pattern';
import Interactive3DModel from './Interactive3DModel';

export default function MorningScene({ onCtaClick }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-[#FAF9F6] text-stone-900 overflow-hidden select-none">
      
      {/* Full-coverage Interactive Grid Pattern background */}
      <InteractiveGridPattern
        className="absolute inset-0 h-full w-full opacity-80"
      />

      <div className="max-w-6xl w-full mx-auto relative z-10">
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Text Content (7 columns) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Label Tag */}
            <div className="inline-block">
              <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase bg-[#FEF5D1] border-2 border-stone-900 px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                AI Study Operating System
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight text-stone-950 leading-[1.08]">
                A notebook that 
                <br />
                studies{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">with you.</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F8C537] -z-0 -rotate-1" />
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-stone-605 leading-relaxed max-w-xl font-medium">
                Plan your learning roadmap, organize personal knowledge, generate practice exams with AI, and stay consistent — all within a clean, minimal study workspace.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/signup"
                className="px-7 py-3.5 bg-stone-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onCtaClick}
                className="px-7 py-3.5 bg-white text-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Explore Features
              </button>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {[
                { icon: <FiUsers className="w-3.5 h-3.5" />, text: '10,000+ Journals Created' },
                { icon: <FiZap className="w-3.5 h-3.5" />, text: 'AI-Powered Quizzes' },
                { icon: <FiBookOpen className="w-3.5 h-3.5" />, text: '100% Free & Open Source' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-stone-700 uppercase tracking-wider bg-white border border-stone-200 px-3 py-1.5 rounded-full">
                  {stat.icon}
                  <span>{stat.text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Side: Hero 3D Interactive Model (5 columns) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border-2 border-stone-900 rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
              <Interactive3DModel />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
