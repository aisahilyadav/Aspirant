import React from 'react';
import { 
  FiBookOpen, 
  FiTerminal, 
  FiAward, 
  FiFileText, 
  FiZap 
} from 'react-icons/fi';

export default function Docs() {
  const sections = [
    {
      icon: <FiBookOpen className="w-5 h-5 text-stone-600" />,
      title: "1. Vectorized PDF Chat & RAG",
      content: "Aspirant uses Retrieval-Augmented Generation (RAG) to scan your textbook files without exceeding token limits. When you upload a document: \n\n• The file is uploaded securely to Cloudinary. \n• Our FastAPI backend processes the document, extracting the raw text. \n• The text is split into semantic paragraphs and indexed in a FAISS vector database. \n• When you chat, we search the FAISS index for relevant segments and merge them into the LLM context query window."
    },
    {
      icon: <FiAward className="w-5 h-5 text-stone-600" />,
      title: "2. Practice Quizzes",
      content: "Practice Quizzes can be generated from either an indexed PDF or custom topic descriptions: \n\n• Enter a topic or pick an uploaded PDF. \n• Choose the desired question count (between 5 and 20). \n• The AI constructs multiple-choice sheets with structured answers. \n• Once submitted, our engine grades your answers and displays detailed correction reviews."
    },
    {
      icon: <FiFileText className="w-5 h-5 text-stone-600" />,
      title: "3. WYSIWYG Notes Editor",
      content: "Draft comprehensive study outlines directly inside your browser: \n\n• Select or create a note. \n• Use the rich formatting toolbar to structure headings (H1/H2), bullet lists, indentation levels, highlights, and font colors. \n• Key entries are auto-saved in the background using debounced triggers back to MongoDB. \n• Open the AI Study Assistant panel on the side to generate markdown summaries or converse with your note's PDF."
    },
    {
      icon: <FiZap className="w-5 h-5 text-stone-600" />,
      title: "4. Dashboard Stats & Streak Rules",
      content: "Stay accountable to your daily learning objectives: \n\n• Completing your study Todos automatically updates 'Time Studied Today'. \n• Your active streak counts the consecutive calendar days you log in and complete study activities. \n• The dashboard features a personalized AI recommendation card that provides context-aware study tips based on your latest study topics."
    }
  ];

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
        
        {/* Header Section */}
        <div className="border-b border-stone-200 pb-12 mb-16">
          <span className="font-handwritten text-lg text-stone-500 block mb-2 rotate-[-1deg] flex items-center gap-1.5">
            <FiTerminal />
            [ documentation portal ]
          </span>
          <h1 className="text-4xl md:text-5xl font-serif-book font-extrabold tracking-tight text-stone-900 leading-tight mb-4">
            Aspirant <span className="underline decoration-stone-400 decoration-wavy decoration-2">System Architecture</span> & Usage.
          </h1>
          <p className="text-xs sm:text-sm text-stone-605 max-w-2xl leading-relaxed">
            Welcome to the Aspirant technical manuals. Learn how to ingest PDFs, generate practice quizzes, utilize vector databases, and customize settings.
          </p>
        </div>

        {/* Content Modules */}
        <div className="space-y-12">
          {sections.map((sec, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-stone-300 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              style={{ filter: 'url(#handdrawn)' }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-stone-50 border border-stone-200 rounded-xl">
                  {sec.icon}
                </div>
                <h3 className="text-base font-extrabold text-stone-900 uppercase tracking-wider">
                  {sec.title}
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line font-serif-book">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* Console Box */}
        <div className="mt-16 bg-stone-50 border border-stone-300 rounded-2xl p-6 font-mono text-[11px] text-stone-600 space-y-3 relative" style={{ filter: 'url(#handdrawn)' }}>
          {/* Ruled lines inside log card */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-2xl" 
            style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
              backgroundSize: '100% 20px',
              backgroundPosition: '0 8px'
            }}
          />
          <div className="relative z-10 flex items-center justify-between border-b border-stone-200 pb-3 mb-2 text-stone-450 font-bold">
            <span>aspirant-system-logs</span>
            <span className="text-stone-700">● SYSTEM ACTIVE</span>
          </div>
          <p className="relative z-10"><span className="text-stone-450 font-bold">[info]</span> Initializing Gemini rate-limit-compliant client...</p>
          <p className="relative z-10"><span className="text-stone-450 font-bold">[info]</span> Loaded model: gemini-2.5-flash</p>
          <p className="relative z-10"><span className="text-stone-450 font-bold">[info]</span> Vector service URL: http://localhost:8000</p>
          <p className="relative z-10"><span className="text-stone-600 font-bold">[success]</span> MongoDB client successfully connected to Cluster0.</p>
        </div>

      </div>
    </div>
  );
}
