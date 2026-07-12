import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import GoogleLoginComponent from '../components/GoogleLogin';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [user, setUser] = useState({
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
      const response = await fetch(`http://localhost:8001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const res_data = await response.json();
        console.log("Login successful:", res_data);
        
        storeTokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        alert("🎉 Login successful! Welcome back!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.log("login error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050408] text-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Background Subtle Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />

      <div className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8">
        
        {/* Left Side: Form Container & Space Filler (6 cols) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="space-y-3">
            <span className="font-mono text-[10px] font-black tracking-widest text-[#22c55e] uppercase bg-stone-900 border-2 border-stone-800 px-3.5 py-1.5 rounded-lg inline-block">
              [ Session Portal ]
            </span>
            <h1 className="text-4xl sm:text-5xl font-sans font-black text-white tracking-tight leading-none uppercase">
              Welcome <span className="text-[#c084fc]">Back.</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-bold">
              Access your learning dashboard, quizzes, calendar timetable, and notes canvas.
            </p>
          </div>

          {/* Form Card styled in Bold Neo-Brutalism */}
          <div className="bg-[#FAF9F6] text-stone-950 border-3 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#c084fc] space-y-6">
            
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
                    className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:shadow-[2px_2px_0px_0px_#c084fc] transition-all"
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
                    placeholder="Enter password"
                    id="password"
                    required
                    autoComplete="current-password"
                    value={user.password}
                    onChange={handleInput}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 focus:outline-none focus:shadow-[2px_2px_0px_0px_#c084fc] transition-all"
                  />
                  <FiLock className="absolute left-3.5 top-3.5 text-stone-500 w-4 h-4" />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#c084fc] text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-950 mr-2"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

            </form>

            <div className="text-center pt-4 border-t border-stone-200">
              <p className="text-xs text-stone-600 font-bold">
                Don't have an account?{' '}
                <NavLink 
                  to="/signup" 
                  className="text-stone-950 font-black uppercase tracking-wider hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </div>

          </div>

          {/* Daily study checklist to fill space in Neo-Brutalism */}
          <div className="bg-[#FAF9F6] text-stone-950 border-2 border-stone-900 rounded-3xl p-5 flex flex-col gap-3 shadow-[4px_4px_0px_0px_#22c55e]">
            <h4 className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 border-b border-stone-200 pb-2">
              Daily Checklist Log
            </h4>
            <div className="space-y-2.5 font-mono text-[10px] text-stone-800 font-black">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900 flex items-center justify-center bg-[#22c55e]/20 text-stone-950 text-[10px]">✓</div>
                <span className="line-through text-stone-400 decoration-stone-400">Brew coffee & prepare study desk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900 flex items-center justify-center bg-[#22c55e]/20 text-stone-950 text-[10px]">✓</div>
                <span className="line-through text-stone-400 decoration-stone-400">Review RAG vector textbook outline</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded border-2 border-stone-900" />
                <span>Generate active recall practice quiz</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Big Study Desk & Cat Doodle (6 cols) */}
        <div className="lg:col-span-6 hidden lg:flex justify-center pt-10">
          <div className="relative w-full max-w-md aspect-square bg-[#FAF9F6] border-3 border-stone-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#22c55e] flex items-center justify-center">
            
            {/* Massive Study Desk SVG Illustration */}
            <svg className="w-full max-w-[340px] aspect-square text-stone-950 stroke-[2.2]" viewBox="0 0 120 120" fill="none" stroke="currentColor">
              {/* Desk surface */}
              <line x1="10" y1="100" x2="110" y2="100" strokeWidth="3" />
              
              {/* Stack of books */}
              <path d="M 20 100 L 50 100 L 50 88 L 20 88 Z" fill="#c084fc" /> {/* Purple book */}
              <path d="M 22 88 L 48 88 L 48 78 L 22 78 Z" fill="#60a5fa" /> {/* Blue book */}
              <path d="M 18 78 L 52 78 L 48 68 L 24 68 Z" fill="#F8C537" /> {/* Yellow tilted book */}
              
              {/* Coffee mug with rising steam */}
              <path d="M 85 100 L 98 100 L 98 84 L 85 84 Z" fill="#F26430" /> {/* Orange mug */}
              <path d="M 98 88 Q 106 88, 98 94" />
              <path d="M 88 78 Q 90 70, 88 64 M 93 78 Q 95 70, 93 64" />
              
              {/* Laptop open */}
              <path d="M 52 100 L 82 100 L 80 82 L 54 82 Z" fill="#FAF9F6" /> {/* Laptop screen */}
              <path d="M 48 100 L 86 100 L 86 102 L 48 102 Z" fill="currentColor" />
              <path d="M 62 88 L 72 88 M 58 92 L 76 92" stroke="#22c55e" />
              
              {/* Sleeping cat curled on the book stack */}
              <path d="M 24 68 C 20 58, 46 58, 44 68 Z" fill="#FAF9F6" />
              <circle cx="34" cy="64" r="0.8" fill="black" stroke="none" />
              <path d="M 42 63 C 44 60, 46 60, 44 63" fill="#F26430" />
            </svg>

            {/* Overlay tag */}
            <div className="absolute -bottom-4 -right-2 bg-[#A9C5A0] text-stone-950 border-2 border-stone-900 font-mono font-black text-[9px] uppercase tracking-wider py-1.5 px-3 rounded-xl rotate-[3deg] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
              [ study desk active ]
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;