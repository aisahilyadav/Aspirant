import React, { useState, useEffect } from 'react';
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
  FiLock
} from 'react-icons/fi';
import { motion } from 'framer-motion';

function Profile() {
  const { user, isLoggedIn } = useAuth();
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

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate loading profile stats
    setProfileStats({
      quizzesCompleted: 24,
      totalQuestions: 480,
      averageScore: 87,
      studyStreak: 12,
      todosCompleted: 156,
      totalStudyTime: 2840, // minutes
      level: 3,
      xp: 2450
    });
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
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
      color: 'blue'
    },
    {
      type: 'todo',
      title: 'Finished React Components Study Session',
      time: '5 hours ago',
      icon: FiCheckCircle,
      color: 'green'
    },
    {
      type: 'achievement',
      title: 'Unlocked "Quiz Master" badge',
      time: '1 day ago',
      icon: FiAward,
      color: 'yellow'
    },
    {
      type: 'streak',
      title: 'Maintained 12-day study streak',
      time: '2 days ago',
      icon: FiZap, // Changed from FiFire to FiZap
      color: 'red'
    }
  ];

  const achievements = [
    { id: 1, name: 'First Quiz', description: 'Complete your first quiz', unlocked: true, icon: FiBook },
    { id: 2, name: 'Quick Learner', description: 'Complete 5 quizzes', unlocked: true, icon: FiZap },
    { id: 3, name: 'Dedicated Student', description: '7-day study streak', unlocked: true, icon: FiZap }, // Changed from FiFire to FiZap
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
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{profileStats.quizzesCompleted}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Quizzes Completed</h3>
          <p className="text-xs text-gray-500 mt-1">+3 this week</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{profileStats.averageScore}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
          <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiZap className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{profileStats.studyStreak}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Study Streak</h3>
          <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{formatStudyTime(profileStats.totalStudyTime)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Study Time</h3>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{profileStats.level}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Level {profileStats.level}</h3>
              <p className="text-sm text-gray-600">{getXpToNextLevel()} XP to next level</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{profileStats.xp}</p>
            <p className="text-sm text-gray-600">Total XP</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${getXpProgress()}%` }}
          ></div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activity.color === 'blue' ? 'bg-blue-100' :
                activity.color === 'green' ? 'bg-green-100' :
                activity.color === 'yellow' ? 'bg-yellow-100' :
                activity.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <activity.icon className={`w-5 h-5 ${
                  activity.color === 'blue' ? 'text-blue-600' :
                  activity.color === 'green' ? 'text-green-600' :
                  activity.color === 'yellow' ? 'text-yellow-600' :
                  activity.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.score && (
                <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                  {activity.score}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Questions Answered</span>
              <span className="font-semibold text-gray-900">{profileStats.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-semibold text-gray-900">{Math.round(profileStats.totalQuestions * (profileStats.averageScore / 100))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accuracy Rate</span>
              <span className="font-semibold text-green-600">{profileStats.averageScore}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Habits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasks Completed</span>
              <span className="font-semibold text-gray-900">{profileStats.todosCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold text-red-600">{profileStats.studyStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Daily Study</span>
              <span className="font-semibold text-gray-900">2.5 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <FiTrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Progress chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: achievement.id * 0.1 }}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              achievement.unlocked 
                ? 'border-green-200 bg-green-50 hover:shadow-md' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                achievement.unlocked 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <achievement.icon className="w-8 h-8" />
              </div>
              <h3 className={`font-semibold mb-2 ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.name}
              </h3>
              <p className={`text-sm ${
                achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <FiCheckCircle className="w-3 h-3 mr-1" />
                    Unlocked
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FiEdit3 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Edit Profile</p>
                <p className="text-sm text-gray-500">Update your personal information</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FiCamera className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Profile Picture</p>
                <p className="text-sm text-gray-500">Change your avatar</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FiBell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FiLock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark theme</p>
            </div>
            <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-colors duration-200">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors duration-200">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform duration-200"></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Study Reminders</p>
              <p className="text-sm text-gray-500">Daily learning reminders</p>
            </div>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors duration-200">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform duration-200"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-8 py-12">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 text-4xl font-bold"
                >
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </motion.div>
                <div className="text-center md:text-left flex-1">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                  >
                    {user?.username || "User"}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-blue-100 text-lg mb-3"
                  >
                    {user?.email || "user@example.com"}
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6"
                  >
                    <div className="flex items-center text-white">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                      <span className="text-sm text-green-200">Active</span>
                    </div>
                  </motion.div>
                </div>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'achievements' && renderAchievements()}
            {activeTab === 'settings' && renderSettings()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;