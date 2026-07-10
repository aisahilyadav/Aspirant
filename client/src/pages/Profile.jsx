import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiAward, 
  FiBook, 
  FiTrendingUp, 
  FiTarget, 
  FiClock, 
  FiEdit3, 
  FiSettings, 
  FiShield,
  FiBookOpen,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiActivity,
  FiPieChart,
  FiChevronRight,
  FiCamera,
  FiBell,
  FiLock,
  FiLogOut
} from 'react-icons/fi';
import { motion } from 'framer-motion';

function Profile() {
  const { user, isLoggedIn, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileStats, setProfileStats] = useState({
    quizzesCompleted: 0,
    totalQuestions: 0,
    averageScore: 0,
    studyStreak: 1,
    todosCompleted: 0,
    totalStudyTime: 0,
    level: 1,
    xp: 0
  });

  // Fetch stats simulation
  useEffect(() => {
    setProfileStats({
      quizzesCompleted: 24,
      totalQuestions: 480,
      averageScore: 87,
      studyStreak: 12,
      todosCompleted: 156,
      totalStudyTime: 2840,
      level: 3,
      xp: 2450
    });
  }, []);

  const handleLogoutClick = () => {
    LogoutUser();
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center pt-16 select-none font-sans">
        <div className="bg-white p-8 rounded-3xl border-2 border-stone-900 text-center max-w-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ filter: 'url(#handdrawn)' }}>
          <div className="w-16 h-16 bg-stone-50 border-2 border-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-8 h-8 text-stone-900" />
          </div>
          <h2 className="text-2xl font-sans font-black text-stone-950 uppercase mb-2">Access Denied</h2>
          <p className="text-xs text-stone-600 font-bold uppercase tracking-wider font-mono">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getXpToNextLevel = () => {
    const baseXp = 1000;
    const nextLevelXp = baseXp * profileStats.level;
    return nextLevelXp - profileStats.xp;
  };

  const getXpProgress = () => {
    const baseXp = 1000;
    const currentLevelXp = baseXp * (profileStats.level - 1);
    const nextLevelXp = baseXp * profileStats.level;
    const progress = ((profileStats.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const recentActivities = [
    {
      type: 'quiz',
      title: 'Completed JavaScript Fundamentals Quiz',
      score: '9/10',
      time: '2 hours ago',
      icon: FiBook,
      color: 'bg-white border-2 border-stone-900'
    },
    {
      type: 'todo',
      title: 'Finished React Components Study Session',
      time: '5 hours ago',
      icon: FiCheckCircle,
      color: 'bg-white border-2 border-stone-900'
    },
    {
      type: 'achievement',
      title: 'Unlocked "Quiz Master" badge',
      time: '1 day ago',
      icon: FiAward,
      color: 'bg-white border-2 border-stone-900'
    },
    {
      type: 'streak',
      title: 'Maintained 12-day study streak',
      time: '2 days ago',
      icon: FiZap,
      color: 'bg-white border-2 border-stone-900'
    }
  ];

  const achievements = [
    { id: 1, name: 'First Quiz', description: 'Complete your first quiz', unlocked: true, icon: FiBook },
    { id: 2, name: 'Quick Learner', description: 'Complete 5 quizzes', unlocked: true, icon: FiZap },
    { id: 3, name: 'Dedicated Student', description: '7-day study streak', unlocked: true, icon: FiZap },
    { id: 4, name: 'Quiz Master', description: 'Complete 25 quizzes', unlocked: false, icon: FiAward },
    { id: 5, name: 'Knowledge Seeker', description: 'Answer 500 questions', unlocked: false, icon: FiBookOpen },
    { id: 6, name: 'Perfectionist', description: 'Get 100% on 5 quizzes', unlocked: false, icon: FiStar }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'stats', label: 'Statistics', icon: FiPieChart },
    { id: 'achievements', label: 'Achievements', icon: FiAward },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const renderOverview = () => (
    <div className="space-y-6 font-sans">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform flex flex-col justify-between"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-stone-50 border-2 border-stone-900 rounded-xl flex items-center justify-center">
              <FiBook className="w-6 h-6 text-stone-900 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black text-stone-950 uppercase">{profileStats.quizzesCompleted}</span>
          </div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 font-mono">Quizzes Completed</h3>
          <p className="text-[9px] text-stone-450 font-extrabold uppercase tracking-wider font-mono mt-1">* 3 completed this week</p>
        </div>

        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform flex flex-col justify-between"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-stone-50 border-2 border-stone-900 rounded-xl flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-stone-900 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black text-stone-950 uppercase">{profileStats.averageScore}%</span>
          </div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 font-mono">Average Score</h3>
          <p className="text-[9px] text-stone-450 font-extrabold uppercase tracking-wider font-mono mt-1">* +5% from last month</p>
        </div>

        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform flex flex-col justify-between"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-stone-50 border-2 border-stone-900 rounded-xl flex items-center justify-center">
              <FiZap className="w-6 h-6 text-stone-900 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black text-stone-955 uppercase">{profileStats.studyStreak}</span>
          </div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 font-mono">Study Streak</h3>
          <p className="text-[9px] text-stone-450 font-extrabold uppercase tracking-wider font-mono mt-1">* consecutive logs</p>
        </div>

        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-transform flex flex-col justify-between"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-stone-50 border-2 border-stone-900 rounded-xl flex items-center justify-center">
              <FiClock className="w-6 h-6 text-stone-900 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black text-stone-950 uppercase">{formatStudyTime(profileStats.totalStudyTime)}</span>
          </div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 font-mono">Study Time</h3>
          <p className="text-[9px] text-stone-450 font-extrabold uppercase tracking-wider font-mono mt-1">* total logged minutes</p>
        </div>

      </div>

      {/* Level Progress */}
      <div 
        className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
        style={{ filter: 'url(#handdrawn)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#2C5EFA] text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-sm border-2 border-stone-900">
              {profileStats.level}
            </div>
            <div>
              <h3 className="text-sm font-sans font-black text-stone-900 uppercase tracking-wider">Level {profileStats.level}</h3>
              <p className="text-xs text-stone-550 font-semibold uppercase tracking-wider font-mono mt-0.5">{getXpToNextLevel()} XP remaining to level up</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-stone-900 uppercase">{profileStats.xp}</p>
            <p className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">Total XP</p>
          </div>
        </div>
        <div className="w-full bg-[#FAF9F6] border-2 border-stone-900 rounded-full h-3">
          <div 
            className="bg-[#2ECC71] h-full rounded-full transition-all duration-300" 
            style={{ width: `${getXpProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
        style={{ filter: 'url(#handdrawn)' }}
      >
        <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider mb-4 flex items-center border-b-2 border-stone-900 pb-3 font-mono">
          <FiActivity className="w-5 h-5 mr-2 stroke-[2.5]" />
          Recent Session Logs
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-stone-50/40 rounded-xl transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-stone-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${activity.color}`}>
                <activity.icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-black text-stone-850 uppercase">{activity.title}</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">{activity.time}</p>
              </div>
              {activity.score && (
                <span className="text-[9px] font-extrabold px-2.5 py-1 bg-[#FEF5D1] border-2 border-stone-900 rounded-md text-stone-700 uppercase flex-shrink-0 tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {activity.score}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6 font-sans">
      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider mb-4 border-b-2 border-stone-900 pb-2 font-mono">Quiz Performance</h3>
          <div className="space-y-4 text-xs font-semibold text-stone-700 uppercase tracking-wider font-mono">
            <div className="flex justify-between items-center">
              <span>Total Questions Answered</span>
              <span className="font-black text-stone-900">{profileStats.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Correct Answers</span>
              <span className="font-black text-stone-900">{Math.round(profileStats.totalQuestions * (profileStats.averageScore / 100))}</span>
            </div>
            <div className="flex justify-between items-center border-t border-stone-200 pt-3">
              <span className="font-sans font-extrabold text-stone-900">Accuracy Rate</span>
              <span className="font-sans font-black text-stone-950 text-lg">{profileStats.averageScore}%</span>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider mb-4 border-b-2 border-stone-900 pb-2 font-mono">Study Habits</h3>
          <div className="space-y-4 text-xs font-semibold text-stone-700 uppercase tracking-wider font-mono">
            <div className="flex justify-between items-center">
              <span>Tasks Completed</span>
              <span className="font-black text-stone-900">{profileStats.todosCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Streak</span>
              <span className="font-black text-stone-905">{profileStats.studyStreak} days</span>
            </div>
            <div className="flex justify-between items-center border-t border-stone-200 pt-3">
              <span className="font-sans font-extrabold text-stone-900">Average Daily Study</span>
              <span className="font-sans font-black text-stone-950 text-lg">2.5 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div 
        className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left"
        style={{ filter: 'url(#handdrawn)' }}
      >
        <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider mb-4 font-mono">Progress Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-stone-50 border-2 border-stone-300 border-dashed rounded-2xl">
          <div className="text-center font-mono">
            <FiTrendingUp className="w-12 h-12 text-stone-400 mx-auto mb-2 stroke-[2.5]" />
            <p className="text-xs text-stone-500 font-extrabold uppercase tracking-wider">* Progress charts compiling...</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-3xl border-2 transition-all duration-300 text-center ${
              achievement.unlocked 
                ? 'border-stone-900 bg-white hover:scale-[1.01] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'border-stone-200 bg-stone-50/40 opacity-70'
            }`}
            style={{ filter: 'url(#handdrawn)' }}
          >
            <div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                achievement.unlocked 
                  ? 'bg-stone-50 border-stone-900 text-stone-900 shadow-sm' 
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}>
                <achievement.icon className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className={`font-black mb-2 uppercase tracking-wider text-xs ${
                achievement.unlocked ? 'text-stone-900' : 'text-stone-450'
              }`}>
                {achievement.name}
              </h3>
              <p className={`text-xs font-bold text-stone-600 leading-relaxed uppercase tracking-wide font-mono ${
                achievement.unlocked ? 'text-stone-850' : 'text-stone-400'
              }`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-1 bg-stone-50 border-2 border-stone-900 text-[9px] font-extrabold uppercase tracking-widest rounded-md text-stone-850 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <FiCheckCircle className="w-3 h-3 mr-1 text-stone-900 stroke-[3]" />
                    Unlocked
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 text-left font-sans">
      <div 
        className="bg-white rounded-3xl border-2 border-stone-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        style={{ filter: 'url(#handdrawn)' }}
      >
        <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider mb-6 border-b-2 border-stone-900 pb-3 font-mono">Account Settings</h3>
        <div className="space-y-3 font-sans">
          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-3.5 hover:bg-stone-50/40 rounded-2xl transition-colors cursor-pointer border border-stone-200"
          >
            <div className="flex items-center space-x-3">
              <FiEdit3 className="w-5 h-5 text-stone-750 stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-stone-900">Edit Profile</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Update username credentials</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-stone-450 stroke-[2.5]" />
          </div>

          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-3.5 hover:bg-stone-50/40 rounded-2xl transition-colors cursor-pointer border border-stone-200"
          >
            <div className="flex items-center space-x-3">
              <FiCamera className="w-5 h-5 text-stone-750 stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-stone-900">Profile Picture</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Change your avatar</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-stone-450 stroke-[2.5]" />
          </div>

          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-3.5 hover:bg-stone-50/40 rounded-2xl transition-colors cursor-pointer border border-stone-200"
          >
            <div className="flex items-center space-x-3">
              <FiBell className="w-5 h-5 text-stone-750 stroke-[2.5]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-stone-900">Notifications</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">Manage device notification preferences</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-stone-450 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-850 pt-24 pb-12 px-6 relative overflow-x-hidden select-none font-sans">
      
      {/* Background Grid */}
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
        
        {/* Profile Header */}
        <div 
          className="bg-[#FEF5D1] border-2 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ filter: 'url(#handdrawn)' }}
        >
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-20 h-20 bg-stone-900 text-stone-100 rounded-full flex items-center justify-center shadow-md text-3xl font-extrabold border-2 border-stone-950">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-center md:text-left space-y-1.5">
              <h1 className="text-3xl font-sans font-black text-stone-950 uppercase leading-none">
                {user?.username || "User"}
              </h1>
              <p className="text-xs text-stone-700 font-extrabold uppercase tracking-wider font-mono">
                {user?.email || "user@example.com"}
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-1.5 sm:space-y-0 sm:space-x-4 pt-1.5">
                <div className="flex items-center text-[10px] text-stone-600 font-mono uppercase tracking-wider font-bold">
                  <FiCalendar className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
                  <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-[10px] text-stone-600 font-mono uppercase tracking-wider font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 border border-stone-900"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/settings')}
              className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-950 border-2 border-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              Edit Account
            </button>
            <button 
              onClick={handleLogoutClick}
              className="flex-1 md:flex-none px-5 py-2.5 bg-[#FF6B6B] hover:bg-red-650 text-stone-950 border-2 border-stone-900 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              <FiLogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b-2 border-stone-900">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 text-xs font-bold uppercase tracking-wider border-b-4 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-stone-900 text-stone-950 font-extrabold'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                <tab.icon className="w-4 h-4 stroke-[2.5]" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'settings' && renderSettings()}
        </div>

      </div>
    </div>
  );
}

export default Profile;