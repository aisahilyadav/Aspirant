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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex items-center justify-center pt-16 select-none font-sans">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-stone-900 w-8 h-8" />
          <span className="text-stone-850 text-sm font-handwritten font-bold">opening study journal...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    pdfsStudied: 3,
    quizzesCompleted: 12,
    studyStreak: 5,
    timeStudiedToday: 45,
    weeklyGoal: 65,
    accuracyPercentage: 88
  };

  const todaysTasks = data?.todaysTasks || [];
  const continueLastPdf = data?.continueLastPdf;
  const aiRecommendation = data?.aiRecommendation || "Focus on building your active recall habit today. Make sure to complete a quiz for any new concepts you read.";
  const currentTopic = data?.currentTopic || "General Studies";

  // Mock study hours for the chart
  const weeklyStudyHours = [2.5, 4.0, 1.5, 5.0, 3.0, 2.0, 4.5];
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none">
      
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

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Bento Grid Header */}
        <div className="border-b border-stone-300 pb-6 text-left space-y-1">
          <span className="font-handwritten text-lg text-stone-550 block rotate-[-1deg]">
            [ study operating system ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-950 tracking-tight leading-none">
            Learning Progress
          </h1>
        </div>

        {/* Bento Grid Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Welcome & Core metrics (2 cols) */}
          <div 
            className="md:col-span-2 bg-[#F5EFE6] border border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left relative"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Corner sticker detail */}
            <div className="absolute top-4 right-4 bg-stone-900 text-stone-100 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">
              {stats.studyStreak} day streak 🔥
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-serif-cormorant font-bold text-stone-950">
                Welcome back, {user?.username || 'Student'}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-800 font-medium max-w-md">
                You are currently studying <span className="font-bold underline decoration-stone-500">{currentTopic}</span>. Here are your core recall metrics for today:
              </p>
            </div>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-250 mt-6">
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">PDFs Studied</span>
                <span className="text-2xl font-serif-cormorant font-bold text-stone-950">{stats.pdfsStudied} Materials</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">Quizzes Done</span>
                <span className="text-2xl font-serif-cormorant font-bold text-stone-950">{stats.quizzesCompleted} Tests</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">Accuracy Rate</span>
                <span className="text-2xl font-serif-cormorant font-bold text-[#D9866B]">{stats.accuracyPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Weekly Study Graph (1 col) */}
          <div 
            className="bg-white border border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-1.5">
                <FiClock className="text-stone-850" />
                Weekly Hours
              </h3>
              <p className="text-[10px] text-stone-500 font-handwritten">study consistency log</p>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-32 flex items-end justify-between gap-2 pt-6 pb-2">
              {weeklyStudyHours.map((hours, idx) => {
                // Calculate height percentage relative to max 6 hours
                const pct = (hours / 6.0) * 100;
                const isMax = hours === 5.0; // Highlight Thursday peak
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full relative group flex justify-end flex-col items-center h-full">
                      {/* Hours label on hover */}
                      <span className="absolute bottom-full mb-1 text-[8px] font-bold bg-stone-900 text-stone-100 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {hours}h
                      </span>
                      {/* The Bar */}
                      <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isMax ? 'bg-[#D9866B] border border-stone-850' : 'bg-[#A9C5A0] border border-stone-300'
                        }`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-stone-700 font-mono">{weekdays[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module 3: Daily Study List (2 cols) */}
          <div 
            className="md:col-span-2 bg-white border border-stone-300 rounded-3xl p-6 shadow-sm text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex items-center justify-between mb-6 border-b border-stone-150 pb-4">
              <h3 className="text-sm font-bold text-stone-950 uppercase tracking-wider flex items-center">
                <FiCheckSquare className="mr-2 text-stone-900 w-5 h-5" />
                Daily Checklist
              </h3>
              <Link 
                to="/todos" 
                className="text-[10px] font-bold uppercase tracking-wider text-stone-800 hover:text-stone-950 underline underline-offset-4 flex items-center"
              >
                Open Planner
                <FiArrowRight className="ml-1 w-3.5 h-3.5" />
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-8 bg-stone-50/20 border border-stone-150 border-dashed rounded-2xl text-stone-550 text-xs font-handwritten font-bold">
                * All caught up for today! No pending objectives.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <div 
                    key={task._id}
                    className="p-4 bg-stone-50/30 hover:bg-stone-50/70 border border-stone-200 rounded-2xl transition-colors flex justify-between items-center group cursor-pointer"
                    onClick={() => navigate('/todos')}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-4">
                      {/* Custom Checkbox */}
                      <div className="w-4 h-4 rounded border border-stone-400 bg-white flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-stone-900 font-serif-cormorant leading-tight">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[10px] text-stone-550 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[8px] font-mono font-bold px-2.5 py-1 bg-white border border-stone-200 rounded-md text-stone-700 uppercase flex-shrink-0 tracking-wider">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module 4: Resume Study Material (1 col) */}
          <div 
            className="bg-white border border-stone-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-150 pb-3">
                <FiBookOpen className="text-stone-850" />
                Active Study
              </h3>
              
              {continueLastPdf ? (
                <div className="space-y-2 pt-2">
                  <span className="text-[8px] bg-stone-900 text-stone-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                    Study Material
                  </span>
                  <h4 className="text-sm font-serif-cormorant font-bold truncate text-stone-950">
                    {continueLastPdf.filename}
                  </h4>
                  <p className="text-[10px] text-stone-605 leading-relaxed font-medium">
                    Resume summary parsing and RAG queries.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-555 font-handwritten pt-2">
                  * No materials indexed. Upload a PDF in the Notes or Quiz tabs to begin.
                </p>
              )}
            </div>

            {continueLastPdf && (
              <button
                onClick={() => {
                  if (continueLastPdf.noteId) {
                    navigate('/notes');
                  } else {
                    navigate('/chat');
                  }
                }}
                className="w-full mt-4 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl transition-colors flex items-center justify-center shadow-sm"
              >
                <span>Resume Study</span>
                <FiArrowRight className="ml-2 w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Module 5: AI Study Recommendation (3 cols) */}
          <div 
            className="md:col-span-3 bg-white border border-stone-300 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Coffee smudge decoration */}
            <div className="absolute bottom-[-16px] right-[-16px] w-20 h-20 border-2 border-stone-150 rounded-full opacity-25 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Recommendation Block */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center space-x-2 text-stone-950 mb-2 border-b border-stone-150 pb-3">
                  <div className="p-1.5 bg-stone-50 border border-stone-200 text-stone-900 rounded-xl">
                    <FiCpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono">AI Recommendation</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-850 font-handwritten leading-relaxed italic bg-stone-50/40 p-4 rounded-2xl border border-stone-200/60 shadow-inner">
                  "{aiRecommendation}"
                </p>
              </div>

              {/* Right Topic Info block */}
              <div className="md:col-span-4 text-left md:text-right space-y-2 pl-0 md:pl-6 border-l-0 md:border-l border-stone-150">
                <span className="text-[8px] bg-[#D9866B]/25 text-[#D9866B] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Topic: {currentTopic}
                </span>
                <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                  Generated dynamically by scanning your latest outline objectives.
                </p>
                <div className="font-handwritten text-[10px] text-stone-400 italic pt-2">
                  * cat tail wiggles lazily
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}