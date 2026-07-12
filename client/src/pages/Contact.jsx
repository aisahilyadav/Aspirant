import React, { useState } from 'react';
import { FiMail, FiSend, FiLoader, FiMapPin, FiMessageCircle } from 'react-icons/fi';

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
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAF9F6] text-stone-900 px-6 py-24 overflow-hidden select-none">
      
      {/* Background Grid Pattern (matching landing page styling) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)]" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        
        {/* Header Block */}
        <div className="border-b-2 border-stone-900 pb-8 mb-8 text-left space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#FAF9F6] uppercase inline-flex items-center gap-1.5 bg-[#F26430] border-2 border-stone-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FiMail className="w-3.5 h-3.5 text-white" />
            Contact & Support
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-black text-stone-950 leading-tight uppercase">
            Get in Touch with our{' '}
            <span className="relative inline-block mt-1">
              <span className="relative z-10 text-stone-950">Study Team.</span>
              <span className="absolute inset-0 bg-[#F8C537] -rotate-1 border-2 border-stone-900 rounded-lg -z-0" />
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed font-bold">
            Have questions about RAG integrations? Found a bug? Or just want to suggest a feature? Send us a message and we will respond shortly.
          </p>
        </div>

        {/* Contact Split Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-left items-start">
          
          {/* Left: Interactive Doodles & Contact Info (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* 1. Large Poppy Sofa Study Illustration Card */}
            <div className="bg-[#dbe4ff] border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden h-52 sm:h-56 transition-transform hover:scale-[1.01]">
              <div className="absolute inset-0 opacity-10 [background-size:15px_15px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)]" />
              
              <svg className="w-full h-full text-stone-900 stroke-[2.2] relative z-10" viewBox="0 0 160 100" fill="none" stroke="currentColor">
                <path d="M 20 65 L 140 65 L 140 80 L 20 80 Z" fill="#FFE066" stroke="currentColor" strokeWidth="2" /> {/* Yellow sofa cushion */}
                <path d="M 15 50 Q 15 80, 20 80 M 145 50 Q 145 80, 140 80" /> {/* Armrests */}
                <path d="M 15 50 C 15 45, 30 40, 45 42 L 115 42 C 130 40, 145 45, 145 50" /> {/* Backrest */}
                <path d="M 20 80 L 25 90 M 140 80 L 135 90" strokeWidth="3" /> {/* Legs */}
                <path d="M 25 55 C 22 55, 22 65, 35 63 C 38 63, 38 57, 25 55 Z" fill="#A9C5A0" strokeWidth="2" /> {/* Green Pillow */}
                <circle cx="38" cy="52" r="6" fill="white" /> {/* Boy Head */}
                <path d="M 38 52 C 34 50, 34 45, 42 46" />
                <path d="M 44 54 C 50 50, 80 50, 95 62" strokeWidth="3" fill="none" /> {/* Body */}
                <path d="M 95 62 L 110 58 L 125 65" strokeWidth="2.5" /> {/* Legs */}
                <path d="M 46 58 L 60 52 L 64 56" />
                <path d="M 58 50 L 70 50 C 72 45, 66 45, 58 50" fill="white" strokeWidth="1.5" /> {/* Book */}
                <path d="M 112 65 C 108 55, 128 55, 132 65 Z" fill="#F26430" /> {/* Dog curled up */}
                <circle cx="128" cy="62" r="1.2" fill="black" />
                <path d="M 130 58 C 127 54, 123 54, 125 58" fill="#FAF9F6" />
              </svg>
            </div>

            {/* 2. Horizontal split for Email detail boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF9F6] border-2 border-stone-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_0px_#F26430] flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 bg-[#d3ffd0] border border-stone-900 rounded px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider">
                    Inquiries
                  </span>
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-500">
                    General support
                  </h4>
                </div>
                <p className="text-xs text-stone-950 font-black mt-2 select-text">support@aspirant.io</p>
              </div>

              <div className="bg-[#FAF9F6] border-2 border-stone-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_0px_#F8C537] flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 bg-[#dbe4ff] border border-stone-900 rounded px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase tracking-wider">
                    Relations
                  </span>
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-500">
                    Developer team
                  </h4>
                </div>
                <p className="text-xs text-stone-950 font-black mt-2 select-text">dev@aspirant.io</p>
              </div>
            </div>
            
            {/* 3. Location Box */}
            <div className="bg-[#FAF9F6] border-2 border-stone-900 rounded-2xl p-4 shadow-[3.5px_3.5px_0px_0px_#A9C5A0] flex items-center gap-3">
              <div className="p-2 bg-white border-2 border-stone-900 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] text-stone-900">
                <FiMapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-500">
                  Team Location
                </h4>
                <p className="text-[10px] text-stone-750 font-mono font-bold leading-normal uppercase">
                  Global Distributed · Silicon Valley, CA
                </p>
              </div>
            </div>

          </div>

          {/* Right: Form Container (3 cols) */}
          <div className="md:col-span-3 bg-white border-2 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative min-h-[340px] flex flex-col justify-center">
            
            {success ? (
              <div className="flex flex-col items-center justify-center text-center space-y-5 py-6">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-[#A9C5A0] border-2 border-stone-900 rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <FiSend className="w-7 h-7 text-stone-900" />
                </div>

                <h3 className="text-base font-black text-stone-950 uppercase tracking-wider">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-stone-600 max-w-xs leading-relaxed font-bold">
                  Thank you for reaching out. A developer has queued your ticket and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-950 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block text-left">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all font-semibold text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block text-left">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all font-semibold text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block text-left">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your study journey today?"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all resize-none font-semibold text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Dispatch Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#F26430] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center disabled:opacity-70"
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
