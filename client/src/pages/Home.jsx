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
  FiCpu
} from 'react-icons/fi';
import { getDashboardData } from '../api/dashboardApi';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    }
  };

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
        <div className="border-b-2 border-stone-900 pb-6 text-left space-y-1">
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#D9866B] block">
            [ System Status ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black text-stone-950 tracking-tight leading-none uppercase">
            Learning Progress
          </h1>
        </div>

        {/* Bento Grid Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Welcome & Core metrics (2 cols) */}
          <div 
            className="md:col-span-2 bg-[#FEF5D1] border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-left relative"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Corner sticker detail */}
            <div className="absolute top-4 right-4 bg-stone-900 border border-stone-950 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              {stats.studyStreak} day streak 🔥
            </div>

            <div className="space-y-3 pr-24">
              <h2 className="text-2xl sm:text-3xl font-sans font-black text-stone-950 uppercase leading-tight">
                Welcome back, {user?.username || 'Student'}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-850 font-bold max-w-md">
                You are currently studying <span className="underline decoration-stone-900 decoration-2">{currentTopic}</span>. Here are your core recall metrics for today:
              </p>
            </div>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-stone-900 mt-6 font-sans font-bold">
              <div>
                <span className="text-[9px] font-extrabold text-stone-600 uppercase tracking-wider block font-mono">PDFs Studied</span>
                <span className="text-xl sm:text-2xl font-black text-stone-950 uppercase">{stats.pdfsStudied} files</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-stone-600 uppercase tracking-wider block font-mono">Quizzes Done</span>
                <span className="text-xl sm:text-2xl font-black text-stone-950 uppercase">{stats.quizzesCompleted} tests</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-stone-600 uppercase tracking-wider block font-mono">Accuracy Rate</span>
                <span className="text-xl sm:text-2xl font-black text-[#D9866B]">{stats.accuracyPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Weekly Study Graph (1 col) */}
          <div 
            className="bg-white border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="space-y-1">
              <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <FiClock className="text-stone-950 stroke-[2.5]" />
                Weekly Hours
              </h3>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Study consistency log</p>
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
                        className={`w-full rounded-t-md border-2 border-stone-900 transition-all duration-350 ${
                          isMax ? 'bg-[#F26430]' : 'bg-[#2ECC71]'
                        }`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-stone-700 font-mono">{weekdays[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module 3: Daily Study List (2 cols) */}
          <div 
            className="md:col-span-2 bg-white border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="flex items-center justify-between mb-6 border-b-2 border-stone-900 pb-4">
              <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider flex items-center font-mono">
                <FiCheckSquare className="mr-2 text-stone-900 w-5 h-5 stroke-[2.5]" />
                Daily Checklist
              </h3>
              <Link 
                to="/todos" 
                className="text-[10px] font-extrabold uppercase tracking-wider text-stone-850 hover:text-stone-950 underline underline-offset-4 flex items-center"
              >
                Open Planner
                <FiArrowRight className="ml-1 w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 border border-stone-300 border-dashed rounded-2xl text-stone-500 text-xs font-sans font-bold">
                * All caught up for today! No pending objectives.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <div 
                    key={task._id}
                    className="p-4 bg-stone-50/50 hover:bg-stone-50 border-2 border-stone-900 rounded-2xl transition-all flex justify-between items-center group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    onClick={() => navigate('/todos')}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-4">
                      {/* Custom Checkbox */}
                      <div className="w-4 h-4 rounded border-2 border-stone-900 bg-white flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[10px] text-stone-550 truncate mt-0.5 font-bold font-sans">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[8px] font-mono font-extrabold px-2.5 py-1 bg-white border border-stone-300 rounded-md text-stone-700 uppercase flex-shrink-0 tracking-wider">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module 4: Resume Study Material (1 col) */}
          <div 
            className="bg-white border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-left"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div className="space-y-2">
              <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider flex items-center gap-1.5 border-b-2 border-stone-900 pb-3 font-mono">
                <FiBookOpen className="text-stone-850 stroke-[2.5]" />
                Active Study
              </h3>
              
              {continueLastPdf ? (
                <div className="space-y-2 pt-2">
                  <span className="text-[8px] bg-stone-900 text-stone-100 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                    Study Material
                  </span>
                  <h4 className="text-sm font-sans font-black truncate text-stone-950 uppercase">
                    {continueLastPdf.filename}
                  </h4>
                  <p className="text-[10px] text-stone-600 leading-relaxed font-bold">
                    Resume summary parsing and RAG queries.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-500 font-bold pt-2">
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
                className="w-full mt-4 bg-[#F26430] hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center"
              >
                <span>Resume Study</span>
                <FiArrowRight className="ml-2 w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Module 5: AI Study Recommendation (3 cols) */}
          <div 
            className="md:col-span-3 bg-white border-2 border-stone-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left relative overflow-hidden"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Coffee smudge decoration */}
            <div className="absolute bottom-[-16px] right-[-16px] w-20 h-20 border-2 border-stone-200 rounded-full opacity-25 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Recommendation Block */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center space-x-2 text-stone-950 mb-2 border-b-2 border-stone-900 pb-3">
                  <div className="p-1.5 bg-[#FEF5D1] border border-stone-900 text-stone-900 rounded-xl">
                    <FiCpu className="w-5 h-5 animate-pulse stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest font-mono">AI Recommendation</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-900 font-bold leading-relaxed bg-[#E3F2FD] p-4 rounded-2xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  "{aiRecommendation}"
                </p>
              </div>

              {/* Right Topic Info block */}
              <div className="md:col-span-4 text-left md:text-right space-y-2 pl-0 md:pl-6 border-l-0 md:border-l-2 md:border-stone-900">
                <span className="text-[8px] bg-[#D9866B]/25 text-[#D9866B] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Topic: {currentTopic}
                </span>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono leading-relaxed mt-2">
                  Generated dynamically by scanning your latest outline objectives.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}