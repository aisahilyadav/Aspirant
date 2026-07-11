import React, { useState } from 'react';
import { FiMail, FiSend, FiLoader } from 'react-icons/fi';

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

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="border-b-2 border-stone-900 pb-8 mb-8 text-left">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-600 uppercase inline-flex items-center gap-1.5 bg-[#FEF5D1] border-2 border-stone-900 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
            <FiMail className="w-3 h-3" />
            Contact & Support
          </span>
          <h1 className="text-3xl md:text-5xl font-sans font-black text-stone-950 leading-tight mb-4">
            Get in Touch with our{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Study Team</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#F8C537] -z-0 -rotate-1" />
            </span>.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed font-medium">
            Have questions about RAG integrations? Found a bug? Or just want to suggest a feature? Send us a message and we will respond shortly.
          </p>
        </div>

        {/* Contact Split Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 text-left">
          
          {/* Left: Info details (2 cols) */}
          <div className="md:col-span-2 space-y-6 pt-4">
            {[
              { label: 'General Inquiries', value: 'support@aspirant.io' },
              { label: 'Developer Relations', value: 'dev@aspirant.io' },
            ].map((info, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1">
                  {info.label}
                </h4>
                <p className="text-sm text-stone-950 font-bold">{info.value}</p>
              </div>
            ))}
            
            <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1">
                Location
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-mono font-bold">
                GLOBAL DISTRIBUTED TEAM<br />
                SILICON VALLEY, CALIFORNIA
              </p>
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
                <p className="text-xs text-stone-600 max-w-xs leading-relaxed font-medium">
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
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all font-medium text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all font-medium text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your study journey today?"
                    className="w-full bg-stone-50 border-2 border-stone-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8C537] transition-all resize-none font-medium text-stone-800 placeholder:text-stone-400"
                    required
                  />
                </div>

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
