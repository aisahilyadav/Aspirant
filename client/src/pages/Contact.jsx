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
    
    // Simulate API contact post
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-850 pt-24 pb-16 font-sans overflow-x-hidden relative">
      
      {/* SVG Handdrawn Rough Line Filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="handdrawn" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background paper grid pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 paper-grid" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-stone-200 pb-12 mb-16">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg] flex items-center gap-1.5">
            <FiMail />
            [ contact & support ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
            Get in Touch with our <span className="underline decoration-stone-400 decoration-wavy decoration-2">Study Team</span>.
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 max-w-2xl leading-relaxed font-serif-book">
            Have questions about vector PDF parsing? Found a bug? Or just want to say hi? Send us a message below and we will get back to you shortly.
          </p>
        </div>

        {/* Contact Split */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Info Side (2 cols) */}
          <div className="md:col-span-2 space-y-6 pt-4 font-serif-book">
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1">
                General Inquiries
              </h4>
              <p className="text-sm text-stone-850 font-bold">support@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1">
                Developer Relations
              </h4>
              <p className="text-sm text-stone-850 font-bold">dev@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-450 mb-1">
                Location
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed font-mono">
                GLOBAL DISTRIBUTED TEAM<br />
                SILICON VALLEY, CALIFORNIA
              </p>
            </div>
          </div>

          {/* Form Side (3 cols) */}
          <div className="md:col-span-3 bg-white border border-stone-300 rounded-3xl p-6 sm:p-8 shadow-sm" style={{ filter: 'url(#handdrawn)' }}>
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 font-serif-book">
                <FiCheckCircle className="text-stone-700 w-12 h-12" />
                <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wide">Message Dispatched!</h3>
                <p className="text-xs text-stone-505 max-w-xs leading-relaxed">
                  Thank you for reaching out. A study assistant has queued your ticket and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-900 transition-colors shadow-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-book"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors font-serif-book"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your learning process today?"
                    className="w-full bg-stone-50/50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-stone-800 transition-colors resize-none font-serif-book"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-stone-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-950 transition-colors flex items-center justify-center shadow-sm"
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
