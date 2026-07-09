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
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center pt-16">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-white w-8 h-8" />
          <span className="text-gray-500 text-sm">Loading your dashboard...</span>
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
    <div className="min-h-screen bg-[#030303] text-white pt-20 pb-12 font-sans relative overflow-x-hidden">
      
      {/* Background Accent Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-650/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.username || 'Student'}! 🎓
            </h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Here is your learning progress and AI study insights for today.
            </p>
          </div>
          <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <FiZap className="text-yellow-400 w-5 h-5 mr-2 animate-pulse fill-yellow-400/20" />
            <div>
              <p className="text-[9px] text-yellow-500 font-extrabold uppercase tracking-wider">Current Streak</p>
              <p className="text-sm font-extrabold text-white">{stats.studyStreak} Days Active</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          {/* Card 1: PDFs Studied */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">PDFs Studied</span>
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                <FiFileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.pdfsStudied}</p>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mt-1">Uploaded & Indexed</p>
            </div>
          </div>

          {/* Card 2: Quizzes Completed */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Quizzes Done</span>
              <div className="p-1.5 bg-green-500/10 text-green-400 rounded-lg">
                <FiAward className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.quizzesCompleted}</p>
              <p className="text-[9px] text-green-400 font-bold uppercase tracking-wider mt-1">AI Generated</p>
            </div>
          </div>

          {/* Card 3: Study Streak */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Streak</span>
              <div className="p-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg">
                <FiZap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.studyStreak}d</p>
              <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-wider mt-1">Keep it burning!</p>
            </div>
          </div>

          {/* Card 4: Time Studied Today */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Time Today</span>
              <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                <FiClock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white">⏱ {stats.timeStudiedToday}m</p>
              <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mt-1">Active studying</p>
            </div>
          </div>

          {/* Card 5: Weekly Goal */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Weekly Goal</span>
              <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                <FiTarget className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-2xl font-black text-white mb-1">
                <span>{stats.weeklyGoal}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-white h-1.5 rounded-full" 
                  style={{ width: `${stats.weeklyGoal}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 6: Accuracy Percentage */}
          <div className="bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Quiz Accuracy</span>
              <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <FiCheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats.accuracyPercentage}%</p>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mt-1">Correct rate</p>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tasks and Continue Reading */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Today's Tasks */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-base font-bold text-white flex items-center">
                  <FiCheckSquare className="mr-2 text-white w-5 h-5" />
                  Today's Tasks
                </h3>
                <Link 
                  to="/todos" 
                  className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 hover:text-purple-300 flex items-center"
                >
                  View Todo list
                  <FiArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>

              {todaysTasks.length === 0 ? (
                <div className="text-center py-8 bg-white/[0.005] border border-white/5 rounded-2xl text-gray-500 text-xs">
                  🎉 All caught up for today! No pending tasks.
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map(task => (
                    <div 
                      key={task._id}
                      className="p-4 bg-white/[0.005] hover:bg-white/[0.015] border border-white/5 rounded-2xl transition-colors flex justify-between items-center group cursor-pointer"
                      onClick={() => navigate('/todos')}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-4">
                        <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-white truncate">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300 uppercase flex-shrink-0 tracking-wider">
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Last PDF */}
            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white flex items-center mb-6 border-b border-white/5 pb-4">
                <FiBookOpen className="mr-2 text-white w-5 h-5" />
                Continue Last PDF
              </h3>

              {continueLastPdf ? (
                <div className="p-5 bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="min-w-0">
                    <span className="text-[9px] bg-white/10 text-white font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">
                      Study Material
                    </span>
                    <h4 className="text-base font-extrabold mt-2 truncate text-white">
                      {continueLastPdf.filename}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Ready to resume summary analysis and RAG chat.
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
                    className="self-start md:self-auto bg-white text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-gray-150 transition-colors flex items-center whitespace-nowrap shadow-md"
                  >
                    Resume Study
                    <FiArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-white/[0.005] border border-white/5 rounded-2xl text-gray-500 text-xs">
                  No PDFs uploaded yet. Upload a PDF in the Quiz or Notes tab to begin!
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-purple-950/20 to-indigo-950/20 border border-purple-500/10 rounded-3xl p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-purple-300 mb-6 border-b border-purple-500/10 pb-4">
                  <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-xl">
                    <FiCpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider">AI Recommendation</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Topic: {currentTopic}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium leading-relaxed italic bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                    "{aiRecommendation}"
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-500/10 text-[10px] text-gray-500 font-mono">
                Generated dynamically based on your latest study outlines.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}