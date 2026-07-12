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
  const { user } = useAuth();
  
  // Settings state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [authProvider, setAuthProvider] = useState('local');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Preferences states
  const [defaultModel, setDefaultModel] = useState('gemini-2.0-flash');
  const [studyMode, setStudyMode] = useState('pomodoro');
  const [defaultQuizQuestions, setDefaultQuizQuestions] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  
  // Loading & UI States
  const [profileSaving, setProfileSaving] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [prefMessage, setPrefMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setUsername(res.username || '');
      setEmail(res.email || '');
      setAuthProvider(res.authProvider || 'local');
      
      if (res.studySettings) {
        setDefaultModel(res.studySettings.defaultModel || 'gemini-2.0-flash');
        setStudyMode(res.studySettings.studyMode || 'pomodoro');
        setDefaultQuizQuestions(res.studySettings.defaultQuizQuestions || 10);
        setEmailNotifications(res.studySettings.emailNotifications !== undefined ? res.studySettings.emailNotifications : true);
        setTheme(res.studySettings.theme || 'light');
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
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
        defaultQuizQuestions: parseInt(defaultQuizQuestions),
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

  return (
    <div className="min-h-screen bg-[#050408] text-stone-200 pt-24 pb-12 px-6 font-sans relative overflow-x-hidden select-none">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#F26430]/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#60a5fa]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="border-b-2 border-stone-850 pb-6 text-left space-y-2">
          <span className="text-[10px] font-mono font-black tracking-widest text-[#D9866B] uppercase bg-stone-900 border-2 border-stone-800 px-3.5 py-1.5 rounded-lg inline-block">
            [ System Configurations ]
          </span>
          <h1 className="text-4xl font-sans font-black text-white tracking-tight leading-none uppercase flex items-center">
            <FiSettings className="mr-3 w-8 h-8 text-[#FAF9F6] stroke-[2.5]" />
            Study <span className="text-[#F26430] pl-2">Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-bold leading-relaxed max-w-xl">
            Manage your account credentials, AI companion model selection, and daily learning parameters.
          </p>
        </div>

        {/* Settings Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* Column 1: Profile & Password (Orange Accent) */}
          <div className="bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_0px_#F26430]">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-stone-950 border-b-2 border-stone-200 pb-4 font-mono">
                <FiUser className="w-5 h-5 text-stone-950 stroke-[2.5]" />
                <h3 className="text-xs font-black uppercase tracking-wider">Profile Credentials</h3>
              </div>

              {/* Message */}
              {profileMessage && (
                <div className={`p-4 rounded-xl text-xs font-mono font-black uppercase border-2 border-stone-900 ${
                  profileMessage.type === 'success' 
                    ? 'bg-[#d3ffd0] text-stone-950' 
                    : 'bg-[#FFD2D2] text-red-950'
                }`}>
                  {profileMessage.text}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest block font-mono">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#F26430] transition-all"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest block font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-stone-100 border-2 border-stone-900 text-stone-500 rounded-xl px-4 py-2.5 text-xs cursor-not-allowed font-bold"
                />
                <span className="text-[8px] text-stone-500 block font-mono mt-1.5 font-black uppercase">
                  LINKED VIA {authProvider === 'google' ? 'GOOGLE AUTHENTICATION' : 'LOCAL EMAIL SIGN-IN'}.
                </span>
              </div>

              {/* Password Section (Only if local user) */}
              {authProvider === 'local' && (
                <div className="space-y-4 pt-4 border-t-2 border-stone-200">
                  <div className="flex items-center space-x-2 text-stone-950 mb-2 font-mono">
                    <FiLock className="w-4 h-4 text-stone-950 stroke-[2.5]" />
                    <h4 className="text-[9px] font-black uppercase tracking-widest">Change Password</h4>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-stone-650 block font-mono uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#F26430] transition-all"
                      required={!!newPassword}
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-stone-650 block font-mono uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#F26430] transition-all"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-stone-655 block font-mono uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#F26430] transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full py-3.5 bg-[#F26430] text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                {profileSaving ? (
                  <div className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  <span>Update Credentials</span>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Preferences (Blue Accent) */}
          <div className="bg-[#FAF9F6] text-stone-950 rounded-3xl border-3 border-stone-900 p-6 sm:p-8 flex flex-col justify-between shadow-[6px_6px_0px_0px_#60a5fa]">
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div className="flex items-center space-x-2.5 text-stone-950 border-b-2 border-stone-200 pb-4 font-mono">
                <FiSliders className="w-5 h-5 text-stone-955 stroke-[2.5]" />
                <h3 className="text-xs font-black uppercase tracking-wider">Study Parameters</h3>
              </div>

              {/* Message */}
              {prefMessage && (
                <div className={`p-4 rounded-xl text-xs font-mono font-black uppercase border-2 border-stone-900 ${
                  prefMessage.type === 'success' 
                    ? 'bg-[#d3ffd0] text-stone-955' 
                    : 'bg-[#FFD2D2] text-red-955'
                }`}>
                  {prefMessage.text}
                </div>
              )}

              {/* Preferred AI Companion Model */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <FiCpu className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                  Default AI Model
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended - Fast RAG)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard - Reliable)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning)</option>
                </select>
              </div>

              {/* Preferred Study Mode */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest block font-mono">
                  Study Pace / Mode
                </label>
                <select
                  value={studyMode}
                  onChange={(e) => setStudyMode(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                >
                  <option value="pomodoro">Pomodoro (25m study / 5m break log)</option>
                  <option value="intensive">Intensive (50m study / 10m break log)</option>
                  <option value="custom">Self-Paced / Open objectives</option>
                </select>
              </div>

              {/* Default Quiz Questions count */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest block font-mono">
                  Default Quiz Questions Count
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={defaultQuizQuestions}
                  onChange={(e) => setDefaultQuizQuestions(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                />
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#FFE066] border-2 border-stone-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center space-x-3">
                  <FiBell className="text-stone-950 w-4 h-4 stroke-[3]" />
                  <div>
                    <label className="text-xs font-black text-stone-950 block uppercase tracking-wider font-mono">
                      Email Notifications
                    </label>
                    <span className="text-[8px] text-stone-600 block font-mono font-black uppercase tracking-wider mt-0.5">
                      Receive timetable outline reminders
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4.5 w-4.5 text-stone-900 bg-white border-2 border-stone-900 rounded focus:ring-0 cursor-pointer"
                />
              </div>

              {/* UI Theme Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <FiMonitor className="w-3.5 h-3.5 text-stone-955 stroke-[3]" />
                  Appearance Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-4 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                >
                  <option value="light">Stationery Light (Recommended)</option>
                  <option value="dark">Midnight Journal (Experimental)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={prefSaving}
                className="w-full py-3.5 bg-[#60a5fa] text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                {prefSaving ? (
                  <div className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
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
