import React from 'react';
import { useAuth } from '../store/auth';

function Profile() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-500 text-3xl font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user?.username || "User"}</h1>
                <p className="text-blue-100 text-lg">{user?.email || "user@example.com"}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-green-400 w-3 h-3 rounded-full mr-2"></span>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-gray-800 font-medium">{user?.username || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-800 font-medium">{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-gray-800 font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Learning Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quizzes Completed</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Notes Created</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Study Streak</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">1 day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                <span className="mr-2">✏️</span>
                Edit Profile
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                <span className="mr-2">📚</span>
                Start Learning
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                <span className="mr-2">🏆</span>
                View Achievements
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Recent Activity
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to show.</p>
            <p className="text-sm mt-2">Start learning to see your progress here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;