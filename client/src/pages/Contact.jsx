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
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-16 font-sans overflow-x-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-650/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-3 flex items-center gap-1.5">
            <FiMail />
            Contact & Support
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">
            Get in Touch with our <span className="font-serif italic font-normal text-purple-200">Study</span> Team.
          </h1>
          <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
            Have questions about vector PDF parsing? Found a bug? Or just want to say hi? 
            Send us a message below and we will get back to you shortly.
          </p>
        </div>

        {/* Contact Split */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Info Side (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-1">
                General Inquiries
              </h4>
              <p className="text-sm text-white font-bold">support@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-1">
                Developer Relations
              </h4>
              <p className="text-sm text-white font-bold">dev@aspirant.io</p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-500 mb-1">
                Location
              </h4>
              <p className="text-sm text-gray-450 leading-relaxed">
                Global Distributed Team<br />
                Silicon Valley, California
              </p>
            </div>
          </div>

          {/* Form Side (3 cols) */}
          <div className="md:col-span-3 bg-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                <FiCheckCircle className="text-green-400 w-12 h-12" />
                <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Thank you for reaching out. A study assistant has queued your ticket and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help your learning process today?"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-150 transition-colors flex items-center justify-center"
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
