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
      <div className="min-h-screen bg-[#FAF9F6] text-stone-850 flex items-center justify-center pt-16 select-none font-sans">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="animate-spin text-stone-850 w-8 h-8" />
          <span className="text-stone-500 text-sm font-handwritten">loading study preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-850 pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none">
      
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
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 text-left">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg]">
            [ system configurations ]
          </span>
          <h1 className="text-4xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none flex items-center">
            <FiSettings className="mr-3 w-8 h-8 text-stone-800" />
            Study Preferences
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 mt-1">
            Manage your account credentials, AI companion model selection, and daily learning parameters.
          </p>
        </div>

        {/* Settings Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* Column 1: Profile & Password */}
          <div 
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-stone-900 border-b border-stone-150 pb-4">
                <FiUser className="w-5 h-5 text-stone-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Profile Credentials</h3>
              </div>

              {/* Message */}
              {profileMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  profileMessage.type === 'success' 
                    ? 'bg-stone-50 border border-stone-200 text-stone-850' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {profileMessage.text}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block font-mono">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant font-bold"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-550 uppercase tracking-widest block font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-stone-100/50 border border-stone-200 text-stone-450 rounded-xl px-4 py-2.5 text-xs cursor-not-allowed font-serif-cormorant"
                />
                <span className="text-[8px] text-stone-450 block font-mono mt-1">
                  LINKED VIA {authProvider === 'google' ? 'GOOGLE AUTHENTICATION' : 'LOCAL EMAIL SIGN-IN'}.
                </span>
              </div>

              {/* Password Section (Only if local user) */}
              {authProvider === 'local' && (
                <div className="space-y-4 pt-4 border-t border-stone-150">
                  <div className="flex items-center space-x-2 text-stone-900 mb-2">
                    <FiLock className="w-4 h-4 text-stone-500" />
                    <h4 className="text-[9px] font-extrabold uppercase tracking-widest font-mono">Change Password</h4>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-605 block font-serif-cormorant">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors"
                      required={!!newPassword}
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-605 block font-serif-cormorant">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-605 block font-serif-cormorant">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3.5 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-colors flex items-center justify-center"
              >
                {profileSaving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  <span>Update Credentials</span>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Preferences */}
          <div 
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-stone-900 border-b border-stone-150 pb-4">
                <FiSliders className="w-5 h-5 text-stone-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Study Parameters</h3>
              </div>

              {/* Message */}
              {prefMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold ${
                  prefMessage.type === 'success' 
                    ? 'bg-stone-50 border border-stone-200 text-stone-850' 
                    : 'bg-red-55 border border-red-200 text-red-700'
                }`}>
                  {prefMessage.text}
                </div>
              )}

              {/* Preferred AI Companion Model */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <FiCpu className="w-3.5 h-3.5 text-stone-450" />
                  Default AI Model
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant font-bold"
                >
                  <option value="gemini-2.5-flash" className="bg-[#FDFBF6]">Gemini 2.5 Flash (Recommended - Fast Outline RAG)</option>
                  <option value="gemini-2.5-pro" className="bg-[#FDFBF6]">Gemini 2.5 Pro (Deep reasoning quiz generation)</option>
                  <option value="gemini-3.5-flash" className="bg-[#FDFBF6]">Gemini 3.5 Flash (Experimental RAG)</option>
                </select>
              </div>

              {/* Preferred Study Mode */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block font-mono">
                  Study Pace / Mode
                </label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value)}
                  className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant font-bold"
                >
                  <option value="pomodoro" className="bg-[#FDFBF6]">Pomodoro (25m study / 5m break log)</option>
                  <option value="intensive" className="bg-[#FDFBF6]">Intensive (50m study / 10m break log)</option>
                  <option value="custom" className="bg-[#FDFBF6]">Self-Paced / Open objectives</option>
                </select>
              </div>

              {/* Default Quiz Questions count */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block font-mono">
                  Default Quiz Questions Count
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={defaultQuizQuestions}
                  onChange={(e) => setDefaultQuizQuestions(e.target.value)}
                  className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant font-bold"
                />
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50/20 border border-stone-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FiBell className="text-stone-450 w-4 h-4" />
                  <div>
                    <label className="text-xs font-bold text-stone-900 block font-serif-cormorant">
                      Email Notifications
                    </label>
                    <span className="text-[8px] text-stone-500 block font-mono">
                      RECEIVE TIMETABLE OUTLINE REMINDERS
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-stone-900 bg-white border-stone-300 rounded focus:ring-stone-800"
                />
              </div>

              {/* UI Theme Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <FiMonitor className="w-3.5 h-3.5 text-stone-450" />
                  Appearance Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs text-stone-805 focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant font-bold"
                >
                  <option value="light" className="bg-[#FDFBF6]">Stationery Light (Recommended)</option>
                  <option value="dark" className="bg-[#FDFBF6]">Midnight Journal (Experimental)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={prefSaving}
                className="w-full py-3.5 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-colors flex items-center justify-center"
              >
                {prefSaving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Saving Preferences...</span>
                  </div>
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
