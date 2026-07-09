import React, { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiUser, 
  FiSliders, 
  FiLock, 
  FiBell, 
  FiMonitor, 
  FiCpu, 
  FiLoader, 
  FiCheck 
} from 'react-icons/fi';
import { getSettings, updateSettings, updateProfile } from '../api/settingsApi';
import { useAuth } from '../store/auth';

export default function Settings() {
  const { user, storeTokenInLS } = useAuth();
  
  // Settings state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authProvider, setAuthProvider] = useState('local');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences states
  const [defaultModel, setDefaultModel] = useState('gemini-2.5-flash');
  const [studyMode, setStudyMode] = useState('pomodoro');
  const [defaultQuizQuestions, setDefaultQuizQuestions] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  
  // Loading & UI States
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [prefMessage, setPrefMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      setUsername(res.username);
      setEmail(res.email);
      setAuthProvider(res.authProvider);
      
      if (res.studySettings) {
        setDefaultModel(res.studySettings.defaultModel || 'gemini-2.5-flash');
        setStudyMode(res.studySettings.studyMode || 'pomodoro');
        setDefaultQuizQuestions(res.studySettings.defaultQuizQuestions || 10);
        setEmailNotifications(res.studySettings.emailNotifications !== undefined ? res.studySettings.emailNotifications : true);
        setTheme(res.studySettings.theme || 'light');
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);

    // Password validations
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setProfileMessage({ type: 'error', text: 'New passwords do not match!' });
        return;
      }
      if (newPassword.length < 6) {
        setProfileMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
      }
    }

    setProfileSaving(true);
    try {
      const payload = { username };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateProfile(payload);
      
      // Update local states
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setProfileMessage({ type: 'success', text: res.message || 'Profile updated successfully!' });
      
      // Trigger a light reload of auth context user data if name changed
      if (res.username && user) {
        user.username = res.username;
      }
    } catch (err) {
      console.error(err);
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update credentials.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    setPrefMessage(null);
    setPrefSaving(true);

    try {
      const res = await updateSettings({
        defaultModel,
        studyMode,
        defaultQuizQuestions,
        emailNotifications,
        theme
      });
      setPrefMessage({ type: 'success', text: res.message || 'Study preferences saved!' });
    } catch (err) {
      console.error(err);
      setPrefMessage({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setPrefSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-black w-8 h-8" />
          <span className="text-gray-500 text-sm">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <FiSettings className="mr-3 w-8 h-8 text-black" />
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Manage your account credentials, AI companion model, and study dashboard preferences.
          </p>
        </div>

        {/* Settings Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Profile & Password */}
          <div className="bg-white rounded-3xl border border-gray-250/70 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-gray-900 border-b border-gray-100 pb-4">
                <FiUser className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-extrabold">Profile Credentials</h3>
              </div>

              {/* Message */}
              {profileMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  profileMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {profileMessage.text}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider block">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 text-gray-450 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-450 block">
                  Linked via {authProvider === 'google' ? 'Google authentication' : 'Local email sign-in'}.
                </span>
              </div>

              {/* Password Section (Only if local user) */}
              {authProvider === 'local' && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-900 mb-2">
                    <FiLock className="w-4 h-4 text-gray-500" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wide">Change Password</h4>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      required={!!newPassword}
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3 bg-black hover:bg-gray-850 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center"
              >
                {profileSaving ? (
                  <>
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>Update Credentials</span>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Preferences */}
          <div className="bg-white rounded-3xl border border-gray-250/70 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-gray-900 border-b border-gray-100 pb-4">
                <FiSliders className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-extrabold">Study Preferences</h3>
              </div>

              {/* Message */}
              {prefMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  prefMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {prefMessage.text}
                </div>
              )}

              {/* Preferred AI Companion Model */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider flex items-center gap-1.5">
                  <FiCpu className="w-3.5 h-3.5 text-gray-500" />
                  Default AI Model
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Faster responses)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep logical parsing)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (Experimental)</option>
                </select>
              </div>

              {/* Preferred Study Mode */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider block">
                  Study Pace / Mode
                </label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="pomodoro">Pomodoro (25m study / 5m break cycles)</option>
                  <option value="intensive">Intensive (50m study / 10m break cycles)</option>
                  <option value="custom">Self-Paced / Open time limits</option>
                </select>
              </div>

              {/* Default Quiz Questions count */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider block">
                  Default Quiz Questions Count
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={defaultQuizQuestions}
                  onChange={(e) => setDefaultQuizQuestions(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FiBell className="text-gray-500 w-4 h-4" />
                  <div>
                    <label className="text-xs font-bold text-gray-800 block">
                      Email Notifications
                    </label>
                    <span className="text-[10px] text-gray-450 block">
                      Receive reminders for study deadlines and calendar todos
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
              </div>

              {/* UI Theme Selection */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-550 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMonitor className="w-3.5 h-3.5 text-gray-500" />
                  Appearance Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="light">Classic Light (Curated white & slates)</option>
                  <option value="dark">Dark Theme (Coming soon)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={prefSaving}
                className="w-full py-3 bg-black hover:bg-gray-850 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center"
              >
                {prefSaving ? (
                  <>
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
                    <span>Saving Preferences...</span>
                  </>
                ) : (
                  <span>Save Preferences</span>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
