import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import GoogleLoginComponent from '../components/GoogleLogin';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const res_data = await response.json();
        console.log("Signup successful:", res_data);
        
        storeTokenInLS(res_data.token);
        setUser({ username: "", email: "", password: "" });
        alert("🎉 Signup successful! Welcome to ASPIRANT!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.msg || errorData.message || "Signup failed");
      }
    } catch (error) {
      console.log("signup error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050408] text-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Background Subtle Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
        
        {/* Left Side: Big Stacked Books & Dog Doodle (6 cols) */}
        <div className="lg:col-span-6 hidden lg:flex justify-center pt-10">
          <div className="relative w-full max-w-md aspect-square bg-[#FAF9F6] border-3 border-stone-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#F8C537] flex items-center justify-center">
            
            {/* Massive stacked research books and sleeping dog vector illustration */}
            <svg className="w-full max-w-[340px] aspect-square text-stone-950 stroke-[2.2]" viewBox="0 0 120 120" fill="none" stroke="currentColor">
              {/* Ground shelf line */}
              <line x1="10" y1="105" x2="110" y2="105" strokeWidth="3" />
              
              {/* Stacked books */}
              <path d="M 30 105 L 75 105 L 75 90 L 30 90 Z" fill="#60a5fa" /> {/* Blue book */}
              <path d="M 32 90 L 73 90 L 73 78 L 32 78 Z" fill="#F26430" /> {/* Orange book */}
              <path d="M 35 78 L 70 78 L 70 68 L 35 68 Z" fill="#22c55e" /> {/* Green book */}
              <path d="M 28 68 L 77 68 L 77 56 L 28 56 Z" fill="#F8C537" /> {/* Yellow book */}
              
              {/* Giant open journal resting vertically next to the stack */}
              <path d="M 75 105 L 105 105 L 98 45 L 78 45 Z" fill="#FAF9F6" />
              <path d="M 78 45 Q 88 43, 98 45" />
              <path d="M 88 45 L 88 75" stroke="#c084fc" strokeWidth="2" />
              
              {/* Cute sleeping dog curled up at the bottom */}
              <path d="M 15 105 C 10 95, 30 95, 30 105 Z" fill="#FAF9F6" />
              <circle cx="23" cy="101" r="0.8" fill="black" stroke="none" />
              <path d="M 26 98 C 24 95, 22 95, 23 98" fill="#F26430" />
              
              {/* Stars/Sparkles around */}
              <path d="M 20 30 L 20 25 M 17 28 L 23 28 M 95 30 L 95 25 M 92 28 L 98 28" stroke="#F8C537" />
            </svg>

            {/* Overlay tag */}
            <div className="absolute -bottom-4 -left-2 bg-[#F26430] text-white border-2 border-stone-900 font-mono font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-xl rotate-[-3deg] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
              [ setup study journal ]
            </div>
          </div>
        </div>

        {/* Right Side: Form Container & Onboarding checklist (6 cols) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="space-y-3">
            <span className="font-mono text-[10px] font-black tracking-widest text-[#F8C537] uppercase bg-stone-900 border-2 border-stone-800 px-3.5 py-1.5 rounded-lg inline-block">
              [ Onboarding Journal ]
            </span>
            <h1 className="text-4xl sm:text-5xl font-sans font-black text-white tracking-tight leading-none uppercase">
              Join <span className="text-[#60a5fa]">Aspirant.</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-bold">
              Create an account to start cataloging study roadmaps, custom RAG indexes, and flashcard recall scores.
            </p>
          </div>

          {/* Form Card styled in Bold Neo-Brutalism */}
          <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#60a5fa] space-y-6">
            
            {/* Google Authentication */}
            <div className="space-y-4">
              <GoogleLoginComponent />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t-2 border-stone-900" />
                </div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black">
                  <span className="bg-[#FAF9F6] px-4 text-stone-500 font-mono">Or use email</span>
                </div>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              
              {/* Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="text-[9px] font-black text-stone-600 uppercase tracking-widest block">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    id="username"
                    required
                    autoComplete="username"
                    value={user.username}
                    onChange={handleInput}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                  />
                  <FiUser className="absolute left-3.5 top-3.5 text-stone-500 w-4 h-4" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-[9px] font-black text-stone-600 uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="student@university.edu"
                    id="email"
                    required
                    autoComplete="email"
                    value={user.email}
                    onChange={handleInput}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                  />
                  <FiMail className="absolute left-3.5 top-3.5 text-stone-500 w-4 h-4" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-[9px] font-black text-stone-600 uppercase tracking-widest block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    id="password"
                    required
                    autoComplete="new-password"
                    value={user.password}
                    onChange={handleInput}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:shadow-[2px_2px_0px_0px_#60a5fa] transition-all"
                  />
                  <FiLock className="absolute left-3.5 top-3.5 text-stone-500 w-4 h-4" />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#F8C537] text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-950 mr-2"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

            </form>

            <div className="text-center pt-4 border-t border-stone-200">
              <p className="text-xs text-stone-600 font-bold">
                Already have an account?{' '}
                <NavLink 
                  to="/login" 
                  className="text-stone-950 font-black uppercase tracking-wider hover:underline"
                >
                  Sign in
                </NavLink>
              </p>
            </div>

          </div>

          {/* Setup / Onboarding checklist in Neo-Brutalism */}
          <div className="bg-[#FAF9F6] text-stone-950 border-2 border-stone-900 rounded-3xl p-5 flex flex-col gap-3 shadow-[4px_4px_0px_0px_#c084fc]">
            <h4 className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 border-b border-stone-200 pb-2">
              Setup Milestones
            </h4>
            <div className="space-y-2.5 font-mono text-[10px] text-stone-800 font-black">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900" />
                <span>Choose daily timetable objectives</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900" />
                <span>Upload first study PDF document</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900" />
                <span>Verify recall score calibration</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;