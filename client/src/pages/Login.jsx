import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import GoogleLoginComponent from '../components/GoogleLogin';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-5xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Form Container (6 cols) */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          <div className="space-y-3">
            <span className="font-handwritten text-lg text-stone-500 block rotate-[-1deg]">
              [ log inside session ]
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif-cormorant font-bold text-stone-900 tracking-tight leading-none">
              Welcome Back.
            </h1>
            <p className="text-xs sm:text-sm text-stone-605 leading-relaxed font-sans-inter">
              Access your learning dashboard, quizzes, calendar timetable, and notes canvas.
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
                    placeholder="Enter password"
                    id="password"
                    required
                    autoComplete="current-password"
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
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

            </form>

            <div className="text-center pt-4 border-t border-stone-150">
              <p className="text-xs text-stone-605">
                Don't have an account?{' '}
                <NavLink 
                  to="/signup" 
                  className="text-stone-900 font-extrabold uppercase tracking-wider hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </div>

          </div>

        </div>

        {/* Right Side: Daytime Study Desk illustration (6 cols) */}
        <div className="lg:col-span-6 hidden lg:flex justify-center">
          <div 
            className="relative w-full max-w-sm aspect-square bg-white border border-stone-200 rounded-3xl p-3 shadow-md hover:scale-[1.01] transition-transform duration-500"
            style={{ filter: 'url(#handdrawn)' }}
          >
            <img 
              src="/about_philosophy.png" 
              alt="Daytime Study Desk" 
              className="w-full h-full object-cover rounded-2xl border border-stone-150"
            />
            {/* Overlay tag */}
            <div className="absolute -bottom-4 -right-2 bg-[#A9C5A0] text-stone-900 border border-stone-400 font-handwritten text-xs py-1.5 px-3 rounded-xl rotate-[3deg] shadow-sm">
              [ start study day ]
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;