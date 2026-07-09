import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FiArrowRight, 
  FiAward, 
  FiBookOpen, 
  FiClock, 
  FiCpu, 
  FiFileText, 
  FiLayers, 
  FiMessageSquare, 
  FiZap 
} from 'react-icons/fi';

export default function HeroSection() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-[#050508] text-white flex flex-col justify-center overflow-x-hidden pt-24 pb-16">
      
      {/* 1. Futuristic Background Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Glowing Backlight Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
        
        {/* Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          {/* AI Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-purple-300">
            <FiCpu className="animate-spin text-purple-400 w-3.5 h-3.5" style={{ animationDuration: '4s' }} />
            The Future of Learning is AI-Powered
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] text-white">
            Learn <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-white">Smarter.</span>
            <br />
            Achieve <span className="font-serif italic font-normal text-indigo-200">Faster.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Upload study files to instantly generate practice exams, draft rich formatted summaries, 
            chat with your PDFs in real time, and monitor study streaks on your learning dashboard.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/home"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-white/5 group"
                >
                  Go to Dashboard
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/quiz"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Take Practice Quiz
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-extrabold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-white/5 group"
                >
                  Start Studying Free
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/15 text-white font-extrabold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Sign In to Account
                </Link>
              </>
            )}
          </div>

          {/* Trust statistics banner */}
          <div className="flex justify-center items-center gap-8 pt-8 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-extrabold">★ 4.9/5</span> Rating
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-extrabold">10K+</span> Active Students
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-extrabold">100%</span> Free Plan
            </div>
          </div>
        </div>

        {/* 3. Feature Showcase Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          
          {/* Card 1: Practice Quizzes */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col justify-between h-56">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Practice Quizzes
              </h3>
              <p className="text-sm text-gray-400 leading-normal">
                Convert notes and course readings into instant, customized multiple-choice practice exams.
              </p>
            </div>
          </div>

          {/* Card 2: PDF Chat Companion */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col justify-between h-56">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white mb-2 group-hover:text-blue-300 transition-colors">
                PDF Chat Companion
              </h3>
              <p className="text-sm text-gray-400 leading-normal">
                Query source textbooks directly and discuss complex core chapters in an active chat sidebar.
              </p>
            </div>
          </div>

          {/* Card 3: Rich Notes Canvas */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col justify-between h-56">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl w-fit">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white mb-2 group-hover:text-green-300 transition-colors">
                Rich Study Notes
              </h3>
              <p className="text-sm text-gray-400 leading-normal">
                Draft beautiful notes with H1 headings, custom list points, highlights, colors, and debounced auto-saving.
              </p>
            </div>
          </div>

          {/* Card 4: Study Dashboard */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col justify-between h-56">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl w-fit">
              <FiZap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                Streak & Study Metrics
              </h3>
              <p className="text-sm text-gray-400 leading-normal">
                Track study time (⏱), current active streak count, weekly objectives, and pending task checklists.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
