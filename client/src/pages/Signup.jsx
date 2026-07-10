import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import GoogleLoginComponent from '../components/GoogleLogin';
import { FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';

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
      const response = await fetch(`http://localhost:8001/api/auth/signup`, {
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
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Evening Study Room illustration (6 cols) */}
        <div className="lg:col-span-6 hidden lg:flex justify-center">
          <div 
            className="relative w-full max-w-sm aspect-square bg-white border border-stone-200 rounded-3xl p-3 shadow-md hover:scale-[1.01] transition-transform duration-500"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <img 
              src="/lofi_study_night.png" 
              alt="Evening Study Room" 
              className="w-full h-full object-cover rounded-2xl border border-stone-150"
            />
            {/* Overlay tag */}
            <div className="absolute -bottom-4 -left-2 bg-[#D9866B] text-stone-900 border border-stone-400 font-handwritten text-xs py-1.5 px-3 rounded-xl rotate-[-3deg] shadow-sm">
              [ setup study desk ]
            </div>
          </div>
        </div>

        {/* Right Side: Form Container (6 cols) */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          <div className="space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block rotate-[1deg]">
              [ register your journal ]
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none">
              Join Aspirant.
            </h1>
            <p className="text-xs sm:text-sm text-stone-605 leading-relaxed font-sans-inter">
              Create an account to start cataloging study roadmaps, custom RAG indexes, and flashcard recall scores.
            </p>
          </div>

          {/* Form Card */}
          <div 
            className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6"
            style={{ filter: 'url(#handdrawn)' }}
          >
            {/* Google Authentication */}
            <div className="space-y-4">
              <GoogleLoginComponent />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-stone-450 font-sans-inter">Or use email</span>
                </div>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans-inter">
              
              {/* Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
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
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant text-stone-805"
                  />
                  <FiUser className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
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
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant text-stone-805"
                  />
                  <FiMail className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
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
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant text-stone-850"
                  />
                  <FiLock className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-950 transition-colors flex items-center justify-center shadow-sm"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

            </form>

            <div className="text-center pt-4 border-t border-stone-150">
              <p className="text-xs text-stone-605">
                Already have an account?{' '}
                <NavLink 
                  to="/login" 
                  className="text-stone-900 font-extrabold uppercase tracking-wider hover:underline"
                >
                  Sign in
                </NavLink>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;