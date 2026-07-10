import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FiFileText, 
  FiAward, 
  FiZap, 
  FiClock, 
  FiTarget, 
  FiCheckCircle, 
  FiBookOpen, 
  FiCheckSquare,
  FiArrowRight,
  FiCpu,
  FiLoader
} from 'react-icons/fi';
import { getDashboardData } from '../api/dashboardApi';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    } finally {
      setData(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-stone-850 flex items-center justify-center pt-16 select-none">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-stone-850 w-8 h-8" />
          <span className="text-stone-500 text-sm font-handwritten">opening study journal...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    pdfsStudied: 0,
    quizzesCompleted: 0,
    studyStreak: 0,
    timeStudiedToday: 0,
    weeklyGoal: 0,
    accuracyPercentage: 0
  };

  const todaysTasks = data?.todaysTasks || [];
  const continueLastPdf = data?.continueLastPdf;
  const aiRecommendation = data?.aiRecommendation || "Focus on building your active recall habit today. Make sure to complete a quiz for any new concepts you read.";
  const currentTopic = data?.currentTopic || "General Studies";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-850 pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      {/* Handdrawn filter SVG */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-1.5">
            <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
              [ learning log dashboard ]
            </span>
            <h1 className="text-4xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none">
              Welcome back, {user?.username || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-605">
              Track active recall milestones, study streaking logs, and RAG outlines.
            </p>
          </div>
          
          <div 
            className="flex items-center bg-[#F8D66D]/20 border border-stone-300 px-4 py-2 rounded-xl self-start md:self-auto shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <FiZap className="text-stone-800 w-5 h-5 mr-2 animate-bounce fill-stone-800/10" />
            <div>
              <p className="text-[8px] text-stone-500 font-mono font-extrabold uppercase tracking-wider">Current Streak</p>
              <p className="text-xs font-extrabold text-stone-900 uppercase font-sans-inter">{stats.studyStreak} Days Active</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* PDFs Studied */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">PDFs Studied</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiFileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-serif-cormorant font-bold text-stone-900">{stats.pdfsStudied}</p>
              <p className="text-[8px] text-stone-500 font-handwritten mt-0.5">* materials cached</p>
            </div>
          </div>

          {/* Quizzes Completed */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">Quizzes Done</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiAward className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-serif-cormorant font-bold text-stone-900">{stats.quizzesCompleted}</p>
              <p className="text-[8px] text-stone-500 font-handwritten mt-0.5">* recall practice</p>
            </div>
          </div>

          {/* Study Streak */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">Active Streak</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiZap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-serif-cormorant font-bold text-stone-900">{stats.studyStreak}d</p>
              <p className="text-[8px] text-stone-500 font-handwritten mt-0.5">* logs continuous</p>
            </div>
          </div>

          {/* Time Studied Today */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">Time Today</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiClock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-serif-cormorant font-bold text-stone-900">{stats.timeStudiedToday}m</p>
              <p className="text-[8px] text-stone-500 font-handwritten mt-0.5">* focus minutes</p>
            </div>
          </div>

          {/* Weekly Goal */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">Weekly Goal</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiTarget className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-2xl font-serif-cormorant font-bold text-stone-900 mb-1">
                <span>{stats.weeklyGoal}%</span>
              </div>
              <div className="w-full bg-stone-100 border border-stone-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-stone-850 h-full rounded-full" 
                  style={{ width: `${stats.weeklyGoal}%` }}
                />
              </div>
            </div>
          </div>

          {/* Accuracy Percentage */}
          <div 
            className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-extrabold text-stone-450 uppercase tracking-widest font-mono">Accuracy</span>
              <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-750 rounded-lg">
                <FiCheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-serif-cormorant font-bold text-stone-900">{stats.accuracyPercentage}%</p>
              <p className="text-[8px] text-stone-500 font-handwritten mt-0.5">* test questions</p>
            </div>
          </div>

        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tasks and Continue Reading */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Today's Tasks */}
            <div 
              className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex items-center justify-between mb-6 border-b border-stone-150 pb-4">
                <h3 className="text-base font-bold text-stone-950 uppercase tracking-wider flex items-center">
                  <FiCheckSquare className="mr-2 text-stone-800 w-5 h-5" />
                  Today's Study List
                </h3>
                <Link 
                  to="/todos" 
                  className="text-[10px] font-extrabold uppercase tracking-widest text-stone-600 hover:text-stone-900 flex items-center"
                >
                  Open Planner
                  <FiArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>

              {todaysTasks.length === 0 ? (
                <div className="text-center py-8 bg-stone-50/20 border border-stone-150 border-dashed rounded-2xl text-stone-500 text-xs font-handwritten">
                  * All caught up for today! No pending objectives.
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map(task => (
                    <div 
                      key={task._id}
                      className="p-4 bg-stone-50/20 hover:bg-stone-50/50 border border-stone-200 rounded-2xl transition-colors flex justify-between items-center group cursor-pointer"
                      onClick={() => navigate('/todos')}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-4">
                        <div className="w-2 h-2 rounded-full bg-stone-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-stone-850 truncate font-serif-cormorant">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-stone-500 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[8px] font-extrabold px-2.5 py-1 bg-white border border-stone-200 rounded-md text-stone-605 uppercase flex-shrink-0 tracking-wider">
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Last PDF */}
            <div 
              className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <h3 className="text-base font-bold text-stone-950 uppercase tracking-wider flex items-center mb-6 border-b border-stone-150 pb-4">
                <FiBookOpen className="mr-2 text-stone-800 w-5 h-5" />
                Continue Last Material
              </h3>

              {continueLastPdf ? (
                <div className="p-5 bg-stone-50/40 border border-stone-200 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="min-w-0 text-left">
                    <span className="text-[8px] bg-stone-200 text-stone-700 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
                      Study Outline
                    </span>
                    <h4 className="text-base font-serif-cormorant font-bold mt-2.5 truncate text-stone-900">
                      {continueLastPdf.filename}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Ready to resume summary analysis and vector queries.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (continueLastPdf.noteId) {
                        navigate('/notes');
                      } else {
                        navigate('/chat');
                      }
                    }}
                    className="self-start md:self-auto bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-5 rounded-xl transition-colors flex items-center whitespace-nowrap shadow-sm"
                  >
                    Resume Study
                    <FiArrowRight className="ml-2 w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-50/20 border border-stone-150 border-dashed rounded-2xl text-stone-500 text-xs font-handwritten">
                  * No PDFs uploaded yet. Index a PDF in the Quiz or Notes tab to begin.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Recommendations */}
          <div className="lg:col-span-1">
            <div 
              className="bg-white border border-stone-200 rounded-3xl p-6 h-full flex flex-col justify-between shadow-sm relative overflow-hidden"
              style={{ filter: 'url(#handdrawn)' }}
            >
              
              {/* Coffee Stain bottom right detail */}
              <div className="absolute bottom-[-16px] right-[-16px] w-20 h-20 border-2 border-stone-150 rounded-full opacity-20 pointer-events-none" />

              <div>
                <div className="flex items-center space-x-2 text-stone-900 mb-6 border-b border-stone-150 pb-4">
                  <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl">
                    <FiCpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest font-mono">AI Recommendation</h3>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-[8px] bg-stone-100 border border-stone-200 text-stone-600 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Topic: {currentTopic}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-handwritten leading-relaxed italic bg-stone-50/40 p-4 rounded-2xl border border-stone-200/60 shadow-inner">
                    "{aiRecommendation}"
                  </p>
                </div>
              </div>

              {/* Sleeping cat small doodle tail wiggle beside cat */}
              <div className="mt-8 pt-4 border-t border-stone-150 flex items-center justify-between text-[8px] text-stone-400 font-mono">
                <span>[ COMPILED BY AI ]</span>
                <span className="font-handwritten text-[9px] text-stone-400">* cat tail wiggles lazily</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}