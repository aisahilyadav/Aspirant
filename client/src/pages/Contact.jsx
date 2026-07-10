import React, { useState } from 'react';
import { FiMail, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate contact form post
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAF9F6] text-stone-850 px-6 py-24 overflow-hidden select-none">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      {/* Decorative Pencil Smudge */}
      <div className="absolute top-1/3 left-1/4 w-32 h-16 pencil-smudge pointer-events-none opacity-40" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="border-b border-stone-200 pb-12 mb-16 text-left">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg] flex items-center gap-1.5">
            <FiMail />
            [ contact & support ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-cormorant font-bold text-stone-900 leading-tight mb-4">
            Get in Touch with our <span className="underline decoration-stone-400 decoration-wavy decoration-2">Study Team</span>.
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 max-w-xl leading-relaxed font-serif-cormorant">
            Have questions about RAG integrations? Found a bug? Or just want to suggest a feature? Send us a message and we will respond shortly.
          </p>
        </div>

        {/* Contact Split Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-left">
          
          {/* Left: Info details (2 cols) */}
          <div className="md:col-span-2 space-y-8 pt-4 font-serif-cormorant">
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1 font-sans-inter">
                General Inquiries
              </h4>
              <p className="text-sm text-stone-850 font-bold">support@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1 font-sans-inter">
                Developer Relations
              </h4>
              <p className="text-sm text-stone-850 font-bold">dev@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1 font-sans-inter">
                Location
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed font-mono">
                GLOBAL DISTRIBUTED TEAM<br />
                SILICON VALLEY, CALIFORNIA
              </p>
            </div>
          </div>

          {/* Right: Form Container with animated elements (3 cols) */}
          <div className="md:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-md relative min-h-[340px] flex flex-col justify-center">
            
            {success ? (
              <div className="flex flex-col items-center justify-center text-center space-y-5 py-6">
                
                {/* Gliding Paper Airplane Animation */}
                <div className="relative w-24 h-16 flex items-center justify-center select-none overflow-visible">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-12 h-12 text-stone-600 animate-bounce"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    style={{
                      animationDuration: '3s'
                    }}
                  >
                    {/* Paper Airplane Path */}
                    <path d="M22 2 L2 10 L10 14 L22 2 Z" />
                    <path d="M10 14 L14 22 L22 2 Z" />
                    <path d="M10 14 L14 18 L14 22" />
                  </svg>
                  {/* Smoke trails */}
                  <span className="absolute left-[-20px] top-6 font-handwritten text-[10px] text-stone-400 opacity-80 animate-pulse">dispatched...</span>
                </div>

                <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider font-serif-cormorant mt-2">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-stone-505 max-w-xs leading-relaxed font-serif-cormorant">
                  Thank you for reaching out. A developer has queued your ticket and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 bg-stone-850 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
                  style={{ filter: 'url(#handdrawn)' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block font-sans-inter">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant text-stone-800"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block font-sans-inter">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-cormorant text-stone-800"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block font-sans-inter">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your study journey today?"
                    className="w-full bg-stone-50/40 border border-stone-250 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors resize-none font-serif-cormorant text-stone-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-stone-950 transition-colors flex items-center justify-center shadow-sm"
                  style={{ filter: 'url(#handdrawn)' }}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2 w-4 h-4" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2 w-3.5 h-3.5" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
