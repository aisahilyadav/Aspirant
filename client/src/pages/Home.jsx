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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-black w-8 h-8" />
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, {user?.username || 'Student'}! 🎓
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Here is your learning progress and AI study insights for today.
            </p>
          </div>
          <div className="flex items-center bg-yellow-50 border border-yellow-200 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <FiZap className="text-yellow-600 w-5 h-5 mr-2 animate-pulse fill-yellow-500" />
            <div>
              <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">Current Streak</p>
              <p className="text-sm font-extrabold text-yellow-900">{stats.studyStreak} Days Active</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          {/* Card 1: PDFs Studied */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">PDFs Studied</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <FiFileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.pdfsStudied}</p>
              <p className="text-[10px] text-blue-600 font-bold mt-1">Uploaded & Indexed</p>
            </div>
          </div>

          {/* Card 2: Quizzes Completed */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Quizzes Done</span>
              <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                <FiAward className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.quizzesCompleted}</p>
              <p className="text-[10px] text-green-600 font-bold mt-1">AI Generated</p>
            </div>
          </div>

          {/* Card 3: Study Streak */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Streak</span>
              <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
                <FiZap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.studyStreak}d</p>
              <p className="text-[10px] text-yellow-600 font-bold mt-1">Keep it burning!</p>
            </div>
          </div>

          {/* Card 4: Time Studied Today */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Time Today</span>
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <FiClock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">⏱ {stats.timeStudiedToday}m</p>
              <p className="text-[10px] text-purple-600 font-bold mt-1">Active studying</p>
            </div>
          </div>

          {/* Card 5: Weekly Goal */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Weekly Goal</span>
              <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                <FiTarget className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-2xl font-black text-gray-900 mb-1">
                <span>{stats.weeklyGoal}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-black h-1.5 rounded-full" 
                  style={{ width: `${stats.weeklyGoal}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 6: Accuracy Percentage */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Quiz Accuracy</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <FiCheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.accuracyPercentage}%</p>
              <p className="text-[10px] text-indigo-600 font-bold mt-1">Correct rate</p>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tasks and Continue Reading (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Today's Tasks */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiCheckSquare className="mr-2 text-black w-5 h-5" />
                  Today's Tasks
                </h3>
                <Link 
                  to="/todos" 
                  className="text-xs font-bold text-black hover:underline flex items-center"
                >
                  View Todo list
                  <FiArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>

              {todaysTasks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 rounded-2xl text-gray-500 text-sm">
                  🎉 All caught up for today! No pending tasks.
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map(task => (
                    <div 
                      key={task._id}
                      className="p-4 bg-gray-55/30 hover:bg-gray-50 border border-gray-150 rounded-2xl transition-colors flex justify-between items-center group cursor-pointer"
                      onClick={() => navigate('/todos')}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600 uppercase flex-shrink-0">
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Last PDF */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center mb-6">
                <FiBookOpen className="mr-2 text-black w-5 h-5" />
                Continue Last PDF
              </h3>

              {continueLastPdf ? (
                <div className="p-5 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      Study Material
                    </span>
                    <h4 className="text-base font-extrabold mt-2 truncate">
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
                    className="self-start md:self-auto bg-white text-black font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center whitespace-nowrap shadow-sm"
                  >
                    Resume Study
                    <FiArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50/50 rounded-2xl text-gray-500 text-sm">
                  No PDFs uploaded yet. Upload a PDF in the Quiz or Notes tab to begin!
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-purple-50 to-indigo-50 border border-indigo-150 rounded-3xl p-6 h-full flex flex-col">
              <div className="flex items-center space-x-2 text-indigo-900 mb-6">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl">
                  <FiCpu className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold">AI Recommendation</h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="text-[10px] bg-indigo-200/60 text-indigo-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Current Topic: {currentTopic}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-950 font-medium leading-relaxed italic bg-white/60 p-4 rounded-2xl border border-indigo-100 shadow-sm">
                    "{aiRecommendation}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-indigo-200/50">
                  <p className="text-xs text-indigo-700 leading-normal">
                    This tip is dynamically generated based on your latest note topic or quiz parameters to keep your recall sharp.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}