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
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center pt-16">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-white w-8 h-8" />
          <span className="text-gray-500 text-sm">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-20 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
            <FiSettings className="mr-3 w-8 h-8 text-white" />
            Account Settings
          </h1>
          <p className="text-gray-450 mt-1 text-sm">
            Manage your account credentials, AI companion model, and study dashboard preferences.
          </p>
        </div>

        {/* Settings Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Profile & Password */}
          <div className="bg-white/[0.01] rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-white border-b border-white/10 pb-4">
                <FiUser className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider">Profile Credentials</h3>
              </div>

              {/* Message */}
              {profileMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  profileMessage.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-300'
                }`}>
                  {profileMessage.text}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-550 uppercase tracking-widest block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-black/50 border border-white/5 text-gray-500 rounded-xl px-4 py-2.5 text-xs cursor-not-allowed"
                />
                <span className="text-[9px] text-gray-550 block font-mono">
                  LINKED VIA {authProvider === 'google' ? 'GOOGLE AUTHENTICATION' : 'LOCAL EMAIL SIGN-IN'}.
                </span>
              </div>

              {/* Password Section (Only if local user) */}
              {authProvider === 'local' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-white mb-2">
                    <FiLock className="w-4 h-4 text-gray-500" />
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest">Change Password</h4>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                      required={!!newPassword}
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3.5 bg-white hover:bg-gray-150 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center"
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
          <div className="bg-white/[0.01] rounded-3xl border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-white border-b border-white/10 pb-4">
                <FiSliders className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider">Study Preferences</h3>
              </div>

              {/* Message */}
              {prefMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  prefMessage.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-300'
                }`}>
                  {prefMessage.text}
                </div>
              )}

              {/* Preferred AI Companion Model */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FiCpu className="w-3.5 h-3.5 text-gray-550" />
                  Default AI Model
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="gemini-2.5-flash" className="bg-[#0c0c0e]">Gemini 2.5 Flash (Recommended - Faster responses)</option>
                  <option value="gemini-2.5-pro" className="bg-[#0c0c0e]">Gemini 2.5 Pro (Deep logical parsing)</option>
                  <option value="gemini-3.5-flash" className="bg-[#0c0c0e]">Gemini 3.5 Flash (Experimental)</option>
                </select>
              </div>

              {/* Preferred Study Mode */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block">
                  Study Pace / Mode
                </label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="pomodoro" className="bg-[#0c0c0e]">Pomodoro (25m study / 5m break cycles)</option>
                  <option value="intensive" className="bg-[#0c0c0e]">Intensive (50m study / 10m break cycles)</option>
                  <option value="custom" className="bg-[#0c0c0e]">Self-Paced / Open time limits</option>
                </select>
              </div>

              {/* Default Quiz Questions count */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block">
                  Default Quiz Questions Count
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={defaultQuizQuestions}
                  onChange={(e) => setDefaultQuizQuestions(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.005] border border-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FiBell className="text-gray-400 w-4 h-4" />
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Email Notifications
                    </label>
                    <span className="text-[9px] text-gray-550 block font-mono">
                      RECEIVE REMINDERS FOR DEADLINES AND TODOS
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-black bg-white border-white/25 rounded focus:ring-white"
                />
              </div>

              {/* UI Theme Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FiMonitor className="w-3.5 h-3.5 text-gray-550" />
                  Appearance Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                >
                  <option value="light" className="bg-[#0c0c0e]">Dark Contrast Mode (Default)</option>
                  <option value="dark" className="bg-[#0c0c0e]">Midnight Classic (Experimental)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={prefSaving}
                className="w-full py-3.5 bg-white hover:bg-gray-150 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center"
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
