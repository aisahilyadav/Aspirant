import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FiArrowRight, 
  FiAward, 
  FiMessageSquare, 
  FiFileText, 
  FiZap, 
  FiCpu, 
  FiCompass 
} from 'react-icons/fi';

export default function HeroSection() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#030303] text-white flex flex-col justify-center overflow-x-hidden pt-24 pb-16 font-sans">
      
      {/* Background Accent Grids */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-650/5 rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Brutalist Frame */}
        <div className="border-t border-l border-white/10 grid grid-cols-1 lg:grid-cols-12 mb-16">
          
          {/* Left Column: Heading & Introduction (Spans 7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-12 border-r border-b border-white/10 flex flex-col justify-between space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">
                [ AI STUDY PLATFORM / VERSION 2.5 ]
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-white">
                Learn <span className="font-serif italic font-normal text-purple-200">Smarter</span>.
                <br />
                Achieve <span className="font-mono uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-white">Faster</span>.
              </h1>
              <p className="text-base text-gray-400 max-w-xl leading-relaxed">
                Transform syllabus guides, research papers, and textbook PDFs into active study courses 
                equipped with automatic quiz generation, semantic chats, and calendar analytics.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/home"
                    className="px-8 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Go to Dashboard
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/quiz"
                    className="px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors text-center"
                  >
                    Generate Quiz
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Start Studying Free
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors text-center"
                  >
                    Account Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Platform Summary Logs (Spans 5 cols) */}
          <div className="lg:col-span-5 p-8 md:p-12 border-r border-b border-white/10 bg-white/[0.005] flex flex-col justify-between space-y-8 font-mono text-xs text-gray-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-bold text-gray-400">
                <span>SYSTEM STATUS</span>
                <span className="text-green-500 font-extrabold">● READY</span>
              </div>
              <p className="flex items-start">
                <span className="text-purple-400 mr-2">&gt;</span>
                <span>Active recall parsing algorithms loaded successfully.</span>
              </p>
              <p className="flex items-start">
                <span className="text-purple-400 mr-2">&gt;</span>
                <span>FastAPI RAG indexing pipeline: FAISS DB linked.</span>
              </p>
              <p className="flex items-start">
                <span className="text-purple-400 mr-2">&gt;</span>
                <span>Model reference: gemini-2.5-flash online.</span>
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] font-bold tracking-wider">
              <div>
                <p className="text-white text-lg font-black font-sans leading-none">4.9/5</p>
                <p className="text-gray-550 uppercase tracking-widest mt-1">Rating</p>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div>
                <p className="text-white text-lg font-black font-sans leading-none">10K+</p>
                <p className="text-gray-550 uppercase tracking-widest mt-1">Students</p>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div>
                <p className="text-white text-lg font-black font-sans leading-none">100%</p>
                <p className="text-gray-550 uppercase tracking-widest mt-1">Open</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Feature Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
          
          {/* Card 1: Quiz */}
          <div 
            onClick={() => navigate('/quiz')}
            className="p-8 border-r border-b border-white/10 bg-white/[0.005] hover:bg-white/[0.015] transition-colors group cursor-pointer space-y-8 flex flex-col justify-between h-64"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/15 w-fit">
              <FiAward className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                AI Quizzes
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate practice exams from text or PDF paragraphs to test your retention with score grading.
              </p>
            </div>
          </div>

          {/* Card 2: Chat */}
          <div 
            onClick={() => navigate('/notes')}
            className="p-8 border-r border-b border-white/10 bg-white/[0.005] hover:bg-white/[0.015] transition-colors group cursor-pointer space-y-8 flex flex-col justify-between h-64"
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/15 w-fit">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                PDF Chat
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Discuss textbook chapters in real-time inside your study note workspace with RAG matching.
              </p>
            </div>
          </div>

          {/* Card 3: Notes */}
          <div 
            onClick={() => navigate('/notes')}
            className="p-8 border-r border-b border-white/10 bg-white/[0.005] hover:bg-white/[0.015] transition-colors group cursor-pointer space-y-8 flex flex-col justify-between h-64"
          >
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/15 w-fit">
              <FiFileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                Rich Notes
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Write study files with headings, bullet lists, highlight colors, and background auto-save.
              </p>
            </div>
          </div>

          {/* Card 4: Stats */}
          <div 
            onClick={() => navigate('/todos')}
            className="p-8 border-r border-b border-white/10 bg-white/[0.005] hover:bg-white/[0.015] transition-colors group cursor-pointer space-y-8 flex flex-col justify-between h-64"
          >
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/15 w-fit">
              <FiZap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                Study Dash
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Monitor consecutive streak numbers, total daily study durations (⏱), and task lists.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
