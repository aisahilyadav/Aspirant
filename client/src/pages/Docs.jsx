import React from 'react';
import { FiBookOpen, FiTerminal, FiPlay, FiCpu, FiMessageSquare } from 'react-icons/fi';

export default function Docs() {
  const sections = [
    {
      icon: <FiBookOpen className="w-5 h-5 text-purple-400" />,
      title: "1. Vectorized PDF Chat & RAG",
      content: "Aspirant uses Retrieval-Augmented Generation (RAG) to scan your textbook files without exceeding token limits. When you upload a document: \n\n• The file is uploaded securely to Cloudinary. \n• Our FastAPI backend processes the document, extracting the raw text. \n• The text is split into semantic paragraphs and indexed in a FAISS vector database. \n• When you chat, we search the FAISS index for relevant segments and merge them into the LLM context query window."
    },
    {
      icon: <FiAward className="w-5 h-5 text-indigo-400" />,
      title: "2. Practice Quizzes",
      content: "Practice Quizzes can be generated from either an indexed PDF or custom topic descriptions: \n\n• Enter a topic or pick an uploaded PDF. \n• Choose the desired question count (between 5 and 20). \n• The AI constructs multiple-choice sheets with structured answers. \n• Once submitted, our engine grades your answers and displays detailed correction reviews."
    },
    {
      icon: <FiFileText className="w-5 h-5 text-green-400" />,
      title: "3. WYSIWYG Notes Editor",
      content: "Draft comprehensive study outlines directly inside your browser: \n\n• Select or create a note. \n• Use the rich formatting toolbar to structure headings (H1/H2), bullet lists, indentation levels, highlights, and font colors. \n• Key entries are auto-saved in the background using debounced triggers back to MongoDB. \n• Open the AI Study Assistant panel on the side to generate markdown summaries or converse with your note's PDF."
    },
    {
      icon: <FiZap className="w-5 h-5 text-yellow-400" />,
      title: "4. Dashboard Stats & Streak Rules",
      content: "Stay accountable to your daily learning objectives: \n\n• Completing your study Todos automatically updates 'Time Studied Today'. \n• Your active streak counts the consecutive calendar days you log in and complete study activities. \n• The dashboard features a personalized AI recommendation card that provides context-aware study tips based on your latest study topics."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-16 font-sans overflow-x-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-650/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-3 flex items-center gap-1.5">
            <FiTerminal />
            Documentation Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-6">
            Aspirant <span className="font-serif italic font-normal text-purple-200">System</span> Architecture & Usage.
          </h1>
          <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
            Welcome to the Aspirant technical manuals. Learn how to ingest PDFs, generate practice 
            quizzes, utilize vector databases, and customize settings.
          </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-12">
          {sections.map((sec, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.015] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                  {sec.icon}
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  {sec.title}
                </h3>
              </div>
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line space-y-4">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* Console Box */}
        <div className="mt-16 bg-black border border-white/10 rounded-2xl p-6 font-mono text-xs text-gray-400 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2 text-gray-500">
            <span>aspirant-system-logs</span>
            <span className="text-green-500 font-bold">● SYSTEM ACTIVE</span>
          </div>
          <p><span className="text-purple-400">[info]</span> Initializing Gemini rate-limit-compliant client...</p>
          <p><span className="text-purple-400">[info]</span> Loaded model: gemini-2.5-flash</p>
          <p><span className="text-purple-400">[info]</span> Vector service URL: http://localhost:8000</p>
          <p><span className="text-green-400">[success]</span> MongoDB client successfully connected to Cluster0.</p>
        </div>

      </div>
    </div>
  );
}

// Inline imports helpers
import { FiAward, FiFileText, FiZap } from 'react-icons/fi';
