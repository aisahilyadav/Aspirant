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
    <div className="min-h-screen bg-[#050408] text-[#FAF9F6] pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none">
      
      {/* Background Subtle Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Bento Grid Header */}
        <div className="border-b-2 border-stone-850 pb-6 text-left space-y-2">
          <span className="text-[10px] font-mono font-black tracking-widest text-[#F8C537] uppercase bg-stone-900 border-2 border-stone-800 px-3.5 py-1.5 rounded-lg inline-block">
            [ System Status ]
          </span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black text-white tracking-tight leading-none uppercase">
            Learning <span className="text-[#60a5fa]">Progress</span>
          </h1>
        </div>

        {/* Bento Grid Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Welcome & Core metrics (2 cols) */}
          <div className="md:col-span-2 bg-[#FFE066] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-left relative">
            
            {/* Corner streak badge */}
            <div className="absolute top-4 right-4 bg-stone-900 border-2 border-stone-950 text-white text-[9px] font-mono font-black uppercase tracking-widest px-3.5 py-1.5 rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
              {stats.studyStreak} day streak 🔥
            </div>

            <div className="space-y-3 pr-24">
              <h2 className="text-2xl sm:text-3xl font-sans font-black text-stone-950 uppercase leading-tight">
                Welcome back, {user?.username || 'Student'}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-900 font-bold max-w-md leading-relaxed">
                You are currently studying <span className="underline decoration-stone-900 decoration-3">{currentTopic}</span>. Here are your core recall metrics for today:
              </p>
            </div>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-stone-900 mt-6 font-mono font-bold">
              <div>
                <span className="text-[9px] font-black text-stone-700 uppercase tracking-wider block">PDFs Studied</span>
                <span className="text-xl sm:text-2xl font-black text-stone-950 uppercase">{stats.pdfsStudied} files</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-stone-700 uppercase tracking-wider block">Quizzes Done</span>
                <span className="text-xl sm:text-2xl font-black text-stone-950 uppercase">{stats.quizzesCompleted} tests</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-stone-700 tracking-wider block">Accuracy Rate</span>
                <span className="text-xl sm:text-2xl font-black text-[#F26430] uppercase">{stats.accuracyPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Module 2: Weekly Study Graph (1 col) */}
          <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#F26430] flex flex-col justify-between text-left">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-black text-stone-950 uppercase tracking-wider flex items-center gap-1.5">
                <FiClock className="text-stone-950 stroke-[3]" />
                Weekly Hours
              </h3>
              <p className="text-[9px] text-stone-500 font-black uppercase tracking-wider font-mono">Study consistency log</p>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-32 flex items-end justify-between gap-2 pt-6 pb-2">
              {weeklyStudyHours.map((hours, idx) => {
                const pct = (hours / 6.0) * 100;
                const isMax = hours === 5.0; // Highlight Thursday peak
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full relative group flex justify-end flex-col items-center h-full">
                      <span className="absolute bottom-full mb-1 text-[8px] font-black bg-stone-900 text-stone-100 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {hours}h
                      </span>
                      <div 
                        className={`w-full rounded-t-md border-2 border-stone-900 transition-all duration-350 ${
                          isMax ? 'bg-[#F26430]' : 'bg-[#22c55e]'
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
          <div className="md:col-span-2 bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#22c55e] text-left">
            <div className="flex items-center justify-between mb-6 border-b-2 border-stone-200 pb-4">
              <h3 className="text-sm font-mono font-black text-stone-950 uppercase tracking-wider flex items-center">
                <FiCheckSquare className="mr-2 text-stone-950 w-5 h-5 stroke-[2.5]" />
                Daily Checklist
              </h3>
              <Link 
                to="/todos" 
                className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-950 hover:underline flex items-center"
              >
                Open Planner
                <FiArrowRight className="ml-1 w-3.5 h-3.5 stroke-[3]" />
              </Link>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-8 bg-white border-2 border-dashed border-stone-300 rounded-2xl text-stone-500 text-xs font-mono font-black uppercase tracking-wide">
                * All caught up for today! No objectives.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <div 
                    key={task._id}
                    className="p-4 bg-white hover:bg-stone-50 border-2 border-stone-900 rounded-2xl transition-all flex justify-between items-center group cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none"
                    onClick={() => navigate('/todos')}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-4">
                      <div className="w-4 h-4 rounded border-2 border-stone-900 bg-[#FAF9F6] flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[10px] text-stone-500 truncate mt-0.5 font-bold font-sans">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[8px] font-mono font-black px-2.5 py-1 bg-[#dbe4ff] text-[#F26430] border border-stone-900 rounded-md uppercase flex-shrink-0 tracking-wider">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module 4: Resume Study Material (1 col) */}
          <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#60a5fa] flex flex-col justify-between text-left">
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-black text-stone-950 uppercase tracking-wider flex items-center gap-1.5 border-b-2 border-stone-200 pb-3">
                <FiBookOpen className="text-stone-950 stroke-[2.5]" />
                Active Study
              </h3>
              
              {continueLastPdf ? (
                <div className="space-y-2 pt-2">
                  <span className="text-[8px] bg-stone-900 text-stone-100 font-mono font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Study Material
                  </span>
                  <h4 className="text-sm font-sans font-black truncate text-stone-950 uppercase mt-2">
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
                className="w-full mt-4 bg-[#F26430] text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <span>Resume Study</span>
                <FiArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Module 5: AI Study Recommendation (3 cols) */}
          <div className="md:col-span-3 bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#c084fc] text-left relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Recommendation Block */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center space-x-2 text-stone-950 mb-2 border-b-2 border-stone-200 pb-3">
                  <div className="p-1.5 bg-[#FFE066] border-2 border-stone-900 text-stone-900 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <FiCpu className="w-5 h-5 animate-pulse stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest">AI Recommendation</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-900 font-bold leading-relaxed bg-[#d3ffd0] p-4 rounded-2xl border-2 border-stone-900 shadow-[3.5px_3.5px_0px_0px_rgba(28,25,23,1)]">
                  "{aiRecommendation}"
                </p>
              </div>

              {/* Right Topic Info block */}
              <div className="md:col-span-4 text-left md:text-right space-y-2 pl-0 md:pl-6 border-l-0 md:border-l-2 md:border-stone-200">
                <span className="text-[8px] bg-[#dbe4ff] text-[#F26430] border border-stone-900 font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
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