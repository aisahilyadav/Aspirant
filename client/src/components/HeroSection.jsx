import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const HeroSection = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="relative h-screen bg-gray-50 flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[90vw] mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 lg:p-16 h-[90%] flex items-center">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Side - Content */}
          <div className="text-left animate-fade-in-up">
            {isLoggedIn && (
              <div className="mb-6">
                <p className="text-lg text-gray-500 font-light tracking-wide uppercase  mb-2">
                  Welcome back,
                </p>
                <h2 className="text-3xl font-bold text-black tracking-tight">
                  {user?.username}
                </h2>
              </div>
            )}

            <div className="mb-8">
              <span className="inline-block  font-headingpx-4 py-2 bg-black text-white text-sm font-medium tracking-wider uppercase rounded-full mb-6">
                AI-Powered Learning
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-6 leading-[0.9] tracking-tighter">
                Learn
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                  Smarter.
                </span>
                <br />
                <span className="font-heading italic">Achieve Faster.</span>
              </h1>
              
              <p className="text-xl text-gray-600 font- max-w-2xl leading-relaxed mb-8 tracking-wide">
                Transform your study materials into personalized learning paths with AI-generated quizzes, 
                smart scheduling, and real-time progress tracking.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8 animate-fade-in-up animation-delay-200">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-10 py-5 bg-black text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-center tracking-wide uppercase"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/quiz"
                    className="px-10 py-5 border-3 border-black text-black font-bold text-lg rounded-2xl hover:bg-black hover:text-white transition-all duration-300 text-center tracking-wide uppercase"
                  >
                    Take Quiz
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-10 py-5 bg-black text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-center tracking-wide uppercase"
                  >
                    Start Learning
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-5 border-3 border-black text-black font-bold text-lg rounded-2xl hover:bg-black hover:text-white transition-all duration-300 text-center tracking-wide uppercase"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 animate-fade-in-up animation-delay-400">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-yellow-400 rounded-sm transform rotate-45"></div>
                  ))}
                </div>
                <span className="font-bold text-black text-lg">4.9/5</span>
              </div>
              
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="flex flex-col">
                <span className="font-black text-2xl text-black tracking-tight">10,000+</span>
                <span className="text-sm font-medium tracking-wider uppercase text-gray-500">
                  Active Students
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative flex justify-center lg:justify-end animate-slide-up animation-delay-300">
            <div className="relative w-full max-w-lg">
              <svg
                viewBox="0 0 400 500"
                className="w-full h-auto drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="200" cy="250" r="200" fill="url(#gradient1)" opacity="0.05" />
                <path
                  d="M80 120 Q140 40 220 70 Q300 100 340 180 Q370 260 320 340 Q270 420 190 380 Q110 340 70 260 Q50 180 80 120 Z"
                  fill="url(#gradient2)"
                  className="drop-shadow-2xl"
                />
                <circle cx="200" cy="220" r="50" fill="rgba(255,255,255,0.15)" />
                <circle cx="180" cy="200" r="25" fill="rgba(255,255,255,0.25)" />
                <rect x="160" y="180" width="80" height="50" rx="6" fill="rgba(255,255,255,0.9)" />
                <line x1="175" y1="195" x2="225" y2="195" stroke="#000" strokeWidth="2" opacity="0.4" />
                <line x1="175" y1="205" x2="220" y2="205" stroke="#000" strokeWidth="2" opacity="0.4" />
                <line x1="175" y1="215" x2="215" y2="215" stroke="#000" strokeWidth="2" opacity="0.4" />
                
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#000" />
                    <stop offset="100%" stopColor="#666" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2a2a2a" />
                    <stop offset="50%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#000" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Floating Achievement Cards */}
              <div className="absolute top-16 -left-6 bg-white rounded-2xl shadow-2xl p-6 animate-float border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-base font-bold tracking-wide">Quiz Generated</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 font-medium">From your PDF</p>
              </div>
              
              <div className="absolute bottom-24 -right-6 bg-white rounded-2xl shadow-2xl p-6 animate-float border border-gray-100" style={{animationDelay: '1s'}}>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-base font-bold tracking-wide">85% Improved</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 font-medium">Learning efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
